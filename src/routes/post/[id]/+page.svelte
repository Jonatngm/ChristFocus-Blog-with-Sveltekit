<script lang="ts">
	import { page } from '$app/stores';
	import { postService } from '$lib/services/postService';
	import { commentService, type Comment } from '$lib/services/commentService';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import { ArrowLeft, Calendar, Eye } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { toast } from 'svelte-sonner';
	import InstagramComments from '$lib/components/InstagramComments.svelte';

	let post: Post | null = null;
	let loading = true;
	let comments: Comment[] = [];
	let loadingComments = false;
	let commentSessionId = '';
	let viewTimeout: ReturnType<typeof setTimeout> | null = null;

	$: postId = $page.params.id;
	$: user = $authStore.user;
	$: authLoading = $authStore.loading;
	$: currentUserEmail = user?.email || null;

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

	async function handleSubmitComment(content: string, name: string, email: string, parentId?: string | null) {
		console.log('handleSubmitComment called with parentId:', parentId);
		try {
			const commentData = {
				post_id: postId,
				author_name: name,
				author_email: email || undefined,
				content,
				session_id: user ? undefined : commentSessionId,
				parent_id: parentId || null
			};
			
			console.log('Comment data being sent:', commentData);

			await commentService.createComment(commentData);
			await loadComments();
			toast.success('Comment posted successfully!');
		} catch (error) {
			console.error('Error posting comment:', error);
			toast.error('Failed to post comment. Please try again.');
		}
	}

	async function handleDeleteComment(commentId: string) {
		if (!confirm('Are you sure you want to delete this comment?')) return;
		
		try {
			await commentService.deleteComment(commentId);
			await loadComments();
			toast.success('Comment deleted successfully');
		} catch (error) {
			console.error('Error deleting comment:', error);
			toast.error('Failed to delete comment');
		}
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

	onMount(() => {
		const init = async () => {
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
		};
		
		init();
		
		// Cleanup: Cancel view count if user leaves before 5 seconds
		return () => {
			if (viewTimeout) {
				clearTimeout(viewTimeout);
				console.log('View count cancelled - user left before 5 seconds');
				viewTimeout = null;
			}
		};
	});

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

	function formatCount(count: number | null | undefined): string {
		if (!count) return '0';
		if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
		return count.toString();
	}
</script>

<svelte:head>
	<title>{post ? post.title : 'Loading...'} - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
	{#if loading}
		<div class="flex items-center justify-center py-20 sm:py-32">
			<div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-3 border-primary"></div>
		</div>
	{:else if post}
		<!-- Hero Section with Cover Image -->
		{#if post.cover_image}
			<div class="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden bg-black">
				<img
					src={post.cover_image}
					alt={post.title}
					class="w-full h-full object-cover opacity-90"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
				
				<!-- Back button overlay -->
				<div class="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
					<a href="/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-full font-semibold transition-all shadow-lg border border-white/20">
						<ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
						<span class="hidden sm:inline">Back to home</span>
					</a>
				</div>
			</div>
		{:else}
			<!-- Simple header for posts without cover -->
			<div class="bg-gradient-to-r from-primary/5 to-gold-dark/5 py-8 sm:py-12 md:py-16">
				<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
					<a href="/" class="inline-flex items-center gap-2 text-primary hover:text-gold-dark mb-6 font-semibold transition-colors">
						<ArrowLeft class="w-4 h-4 sm:w-5 sm:h-5" />
						Back to home
					</a>
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<article class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
			<!-- Article Header -->
			<header class="-mt-20 sm:-mt-24 md:-mt-32 lg:-mt-40 relative z-10 {post.cover_image ? 'mb-8 sm:mb-12 md:mb-16' : 'mb-6 sm:mb-8 md:mb-10'}">
				<div class="max-w-4xl mx-auto">
					{#if post.cover_image}
						<!-- Title over image -->
						<div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
							<!-- Categories -->
							{#if post.categories && post.categories.length > 0}
								<div class="flex flex-wrap gap-2 mb-4 sm:mb-5">
									{#each post.categories as category}
										<span class="px-3 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-white rounded-full text-xs sm:text-sm font-bold shadow-sm uppercase tracking-wide">
											{category.name}
										</span>
									{/each}
								</div>
							{/if}
							
							<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-5 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
								{post.title}
							</h1>
							
							<!-- Metadata -->
							<div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 border-t border-gray-200 pt-5 sm:pt-6">
								<div class="flex items-center gap-2">
									<Calendar class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
									<span class="font-medium">{new Date(post.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}</span>
								</div>
								{#if typeof post.views !== 'undefined'}
									<div class="flex items-center gap-2">
										<Eye class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
										<span class="font-medium">{formatCount(post.views)} views</span>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Title without cover image -->
						<div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
							{#if post.categories && post.categories.length > 0}
								<div class="flex flex-wrap gap-2 mb-4 sm:mb-5">
									{#each post.categories as category}
										<span class="px-3 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-white rounded-full text-xs sm:text-sm font-bold shadow-sm uppercase tracking-wide">
											{category.name}
										</span>
									{/each}
								</div>
							{/if}
							
							<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-5 sm:mb-6 leading-[1.1] tracking-tight">
								{post.title}
							</h1>
							
							<div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 border-t border-gray-200 pt-5">
								<div class="flex items-center gap-2">
									<Calendar class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
									<span class="font-medium">{new Date(post.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}</span>
								</div>
								{#if typeof post.views !== 'undefined'}
									<div class="flex items-center gap-2">
										<Eye class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-primary" />
										<span class="font-medium">{formatCount(post.views)} views</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</header>

			<!-- Article Body -->
			<div class="max-w-4xl mx-auto">
				<!-- Main Content -->
				<div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 mb-8 sm:mb-10 md:mb-12">
					<div class="prose prose-base sm:prose-lg lg:prose-xl max-w-none
						prose-headings:text-black prose-headings:font-bold prose-headings:tracking-tight
						prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-6
						prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-10 prose-h2:mb-5
						prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-4
						prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
						prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
						prose-strong:text-black prose-strong:font-bold
						prose-em:text-gray-800
						prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
						prose-code:text-primary prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
						prose-pre:bg-gray-900 prose-pre:text-gray-100
						prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
						prose-ul:my-6 prose-ol:my-6
						prose-li:my-2">
						{@html post.content}
					</div>
				</div>

				<!-- Tags Section -->
				{#if post.tags && post.tags.length > 0}
					<div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10 md:mb-12">
						<h3 class="text-lg sm:text-xl font-bold mb-4 text-black flex items-center gap-2">
							<span class="w-1 h-6 bg-gradient-to-b from-primary to-gold-dark rounded-full"></span>
							Topics
						</h3>
						<div class="flex flex-wrap gap-2 sm:gap-3">
							{#each post.tags as tag}
								<span class="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 rounded-lg text-sm sm:text-base font-semibold border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer">
									{tag.name}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Comments Section -->
				<div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
					<h2 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-black flex items-center gap-3">
						<span class="w-1.5 h-8 bg-gradient-to-b from-primary to-gold-dark rounded-full"></span>
						Comments
					</h2>
					
					<InstagramComments
						{comments}
						onSubmitComment={handleSubmitComment}
						onDeleteComment={handleDeleteComment}
						canDelete={canDeleteComment}
						{currentUserEmail}
						{commentSessionId}
					/>
				</div>
			</div>
		</article>

		<!-- Bottom Spacing -->
		<div class="h-12 sm:h-16 md:h-20"></div>
	{:else}
		<div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
			<h1 class="text-2xl sm:text-3xl font-bold mb-4 text-black">Post not found</h1>
			<a href="/" class="text-primary hover:text-gold-dark font-semibold transition-colors">Return to home</a>
		</div>
	{/if}
</div>
