<script lang="ts">
	import { page } from '$app/stores';
	import { postService } from '$lib/services/postService';
	import { commentService, type Comment } from '$lib/services/commentService';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import { ArrowLeft, Calendar, Eye, Trash2 } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	let post: Post | null = null;
	let loading = true;
	let comments: Comment[] = [];
	let commentContent = '';
	let commentAuthorName = '';
	let commentAuthorEmail = '';
	let submittingComment = false;
	let loadingComments = false;
	let commentSessionId = '';
	let viewTimeout: ReturnType<typeof setTimeout> | null = null;

	$: postId = $page.params.id;
	$: user = $authStore.user;
	$: authLoading = $authStore.loading;

	// Generate or retrieve comment session ID for anonymous users
	function getCommentSessionId(): string {
		if (!browser) return '';
		
		let sessionId = localStorage.getItem('commentSessionId');
		if (!sessionId) {
			sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('commentSessionId', sessionId);
		}
		return sessionId;
	}

	// Check if current user can delete a comment
	function canDeleteComment(comment: Comment): boolean {
		// Authenticated users can delete their own comments
		if (user && comment.user_id === user.id) {
			return true;
		}
		// Anonymous users can delete comments with matching session_id
		if (comment.session_id && comment.session_id === commentSessionId) {
			return true;
		}
		return false;
	}

	// Auto-fill name and email if user is logged in
	$: if (user?.email) {
		commentAuthorName = user.email.split('@')[0];
		commentAuthorEmail = user.email;
	}

	// Extract display name from email
	function getDisplayName(name: string | undefined): string {
		if (!name) return 'Anonymous';
		// Capitalize first letter
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	// Generate or retrieve anonymous ID for view tracking
	function getAnonId(): string {
		if (!browser) return '';
		
		let anonId = localStorage.getItem('anonId');
		if (!anonId) {
			anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('anonId', anonId);
			console.log('Generated new anonymous ID:', anonId);
		} else {
			console.log('Retrieved existing anonymous ID:', anonId);
		}
		return anonId;
	}

	onMount(async () => {
		try {
			post = await postService.getPostById(postId);
			
			// Wait for auth to initialize before checking user state
			// This prevents incrementing views before we know if user is logged in
			if (authLoading) {
				console.log('Waiting for auth to load...');
				// Wait for auth to finish loading
				const unsubscribe = authStore.subscribe(state => {
					if (!state.loading) {
						unsubscribe();
						checkAndIncrementView();
					}
				});
			} else {
				checkAndIncrementView();
			}

			// Load comments
			await loadComments();
			
			// Get comment session ID for anonymous users
			if (browser) {
				commentSessionId = getCommentSessionId();
			}
		} catch (error) {
			console.error('Error loading post:', error);
		} finally {
			loading = false;
		}

		// Cleanup: Cancel view count if user leaves before 5 seconds
		// This must be a separate return statement, not inside the async function
	});

	// Cleanup when component unmounts
	$: if (browser) {
		return () => {
			if (viewTimeout) {
				clearTimeout(viewTimeout);
				console.log('View count cancelled - user left before 5 seconds');
			}
		};
	}

	function checkAndIncrementView() {
		// Get current user state
		const currentUser = $authStore.user;
		console.log('=== Auth loaded. Current user state:', currentUser ? `Logged in as ${currentUser.email}` : 'Anonymous visitor');
		
		// Only increment views for anonymous (non-logged-in) visitors
		// All logged-in users (admin, author, or any authenticated account) are completely excluded
		if (browser && !currentUser) {
			const anonId = getAnonId();
			console.log('✓ Anonymous visitor detected. Starting 5-second timer before counting view...');
			console.log('  Anonymous ID:', anonId);
			console.log('  Post ID:', postId);
			
			// Wait 5 seconds before counting the view
			// This ensures the user is actually reading the post, not just passing through
			viewTimeout = setTimeout(() => {
				console.log('✓ 5 seconds elapsed. Counting view now...');
				
				postService.incrementViews(postId, anonId).then(updatedPost => {
					// Update the displayed view count
					if (updatedPost && post) {
						console.log('✓ View counted successfully! Count:', post.views, '→', updatedPost.views);
						post.views = updatedPost.views;
					} else {
						console.log('⚠ View already counted for this device (duplicate prevented)');
					}
				}).catch(err => {
					console.error('✗ Error counting view:', err);
				});
				
				viewTimeout = null;
			}, 5000); // 5 seconds
		} else if (currentUser) {
			console.log('✗ Logged-in user detected - view will NOT be counted');
			console.log('  User email:', currentUser.email);
		}
	}

	async function loadComments() {
		try {
			loadingComments = true;
			comments = await commentService.getPostComments(postId);
			console.log('Loaded comments:', comments.length, comments);
		} catch (error) {
			console.error('Error loading comments:', error);
			comments = []; // Ensure we have an empty array on error
		} finally {
			loadingComments = false;
		}
	}

	async function handleCommentSubmit(e: Event) {
		e.preventDefault();

		if (!commentAuthorName.trim()) {
			toast.error('Please enter your name');
			return;
		}

		if (!commentContent.trim()) {
			toast.error('Comment cannot be empty');
			return;
		}

		try {
			submittingComment = true;
			await commentService.createComment({
				post_id: postId,
				author_name: commentAuthorName.trim(),
				author_email: commentAuthorEmail.trim() || undefined,
				content: commentContent.trim(),
				session_id: user ? undefined : commentSessionId
			}, user?.id);

			toast.success('Comment posted successfully!');
			commentContent = '';
			// Only clear name/email if user is not logged in
			if (!user) {
				commentAuthorName = '';
				commentAuthorEmail = '';
			}
			await loadComments();
		} catch (error: any) {
			console.error('Error posting comment:', error);
			toast.error(error.message || 'Failed to post comment');
		} finally {
			submittingComment = false;
		}
	}

	async function handleDeleteComment(commentId: string) {
		if (!confirm('Are you sure you want to delete this comment?')) {
			return;
		}

		try {
			await commentService.deleteComment(commentId);
			toast.success('Comment deleted successfully');
			await loadComments();
		} catch (error: any) {
			console.error('Error deleting comment:', error);
			toast.error(error.message || 'Failed to delete comment');
		}
	}

	function formatCount(count: number | null | undefined): string {
		if (!count) return '0';
		if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
		return count.toString();
	}
</script>

<svelte:head>
	<title>{post ? post.title : 'Loading...'} - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	{#if loading}
		<div class="flex items-center justify-center py-16 sm:py-20">
			<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
		</div>
	{:else if post}
		<article class="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 max-w-4xl">
			<a href="/" class="inline-flex items-center gap-2 text-primary hover:underline mb-6 sm:mb-8 font-semibold transition-colors">
				<ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
				Back to home
			</a>

			<header class="mb-6 sm:mb-8">
				{#if post.cover_image}
					<img
						src={post.cover_image}
						alt={post.title}
						class="w-full h-64 sm:h-80 md:h-96 object-contain rounded-xl mb-6 sm:mb-8 shadow-lg bg-gray-100"
					/>
				{/if}

				<h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4 sm:mb-6 leading-tight tracking-tight">
					{post.title}
				</h1>

				<div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
					<div class="flex items-center gap-2">
					<Calendar class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
					<span class="font-medium">{new Date(post.created_at).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</span>
				</div>
				{#if typeof post.views !== 'undefined'}
					<div class="flex items-center gap-2">
						<Eye class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
						<span class="font-medium">{formatCount(post.views)} views</span>
					</div>
				{/if}
			</div>

			{#if post.categories && post.categories.length > 0}
				<div class="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
					{#each post.categories as category}
						<span class="px-3 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-black rounded-full text-xs sm:text-sm font-bold shadow-sm">
							{category.name}
						</span>
					{/each}
				</div>
			{/if}
		</header>

		<div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-black prose-headings:font-extrabold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-black prose-img:rounded-xl prose-img:shadow-lg">
			{@html post.content}
		</div>

		{#if post.tags && post.tags.length > 0}
			<footer class="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-200">
				<h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Tags</h3>
				<div class="flex flex-wrap gap-1.5 sm:gap-2">
					{#each post.tags as tag}
						<span class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition-colors">
							{tag.name}
						</span>
					{/each}
				</div>
			</footer>
		{/if}

		<!-- Comments Section -->
		<section class="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-gray-200">
			<h2 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-black">Comments</h2>

			<!-- Comment Form -->
			<form on:submit={handleCommentSubmit} class="mb-8 sm:mb-10">
				<div class="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-lg">
					<label class="text-sm font-bold text-black uppercase tracking-wide mb-4 block">
						Leave a comment
					</label>
					
					<!-- Name and Email fields -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
						<div>
							<label for="authorName" class="text-xs font-semibold text-gray-700 mb-1 block">
								Name <span class="text-red-600">*</span>
							</label>
							<input
								id="authorName"
								type="text"
								bind:value={commentAuthorName}
								disabled={submittingComment}
								required
								class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label for="authorEmail" class="text-xs font-semibold text-gray-700 mb-1 block">
								Email (optional)
							</label>
							<input
								id="authorEmail"
								type="email"
								bind:value={commentAuthorEmail}
								disabled={submittingComment}
								class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
								placeholder="your@email.com"
							/>
						</div>
					</div>

					<!-- Comment textarea -->
					<textarea
						id="comment"
						bind:value={commentContent}
						disabled={submittingComment}
						required
						rows="4"
						class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-sm sm:text-base mb-4"
						placeholder="Share your thoughts..."
					></textarea>
					<div class="flex justify-end">
						<Button
							type="submit"
							disabled={submittingComment || !commentContent.trim() || !commentAuthorName.trim()}
							class="bg-gradient-to-r from-primary to-gold-dark hover:from-primary/90 hover:to-gold-dark/90"
						>
							{submittingComment ? 'Posting...' : 'Post Comment'}
						</Button>
					</div>
				</div>
			</form>

			<!-- Comments List -->
			{#if loadingComments}
				<div class="flex items-center justify-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			{:else if comments.length === 0}
				<div class="text-center py-8 text-gray-500">
					<p class="text-base sm:text-lg">No comments yet. Be the first to share your thoughts!</p>
				</div>
			{:else}
				<div class="space-y-6">
					{#each comments as comment}
						<div class="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<span class="font-bold text-black text-sm sm:text-base">
											{getDisplayName(comment.author_name)}
										</span>
										<span class="text-xs sm:text-sm text-gray-500">
											{new Date(comment.created_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
									</div>
								</div>
								{#if canDeleteComment(comment)}
									<button
										on:click={() => handleDeleteComment(comment.id)}
										class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
										title="Delete comment"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								{/if}
							</div>
							<p class="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
								{comment.content}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	</article>
	{:else}
		<div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
			<h1 class="text-2xl sm:text-3xl font-bold mb-4 text-black">Post not found</h1>
			<a href="/" class="text-primary hover:text-gold-dark font-semibold transition-colors">Return to home</a>
		</div>
	{/if}
</div>
