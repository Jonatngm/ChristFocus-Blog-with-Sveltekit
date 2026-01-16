<script lang="ts">
	import { Heart, Send, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Comment } from '$lib/services/commentService';
	import { commentService } from '$lib/services/commentService';
	import { authStore } from '$lib/stores/authStore';
	
	export let comments: Comment[] = [];
	export let onSubmitComment: (content: string, name: string, email: string, parentId?: string) => Promise<void>;
	export let onDeleteComment: (id: string) => Promise<void>;
	export let canDelete: (comment: Comment) => boolean;
	export let currentUserEmail: string | null = null;
	export let commentSessionId: string = '';
	
	let newComment = '';
	let replyTo: string | null = null;
	let replyContent = '';
	let likedComments: Set<string> = new Set();
	let submitting = false;
	let authorName = '';
	
	// Track expanded replies per comment (show all when true)
	let showAllReplies: Record<string, boolean> = {};
	const MAX_INITIAL_REPLIES = 2;
	
	$: user = $authStore.user;
	$: if (user?.email) {
		authorName = user.email.split('@')[0];
	}
	
	// Load liked status when comments change
	$: if (comments.length > 0) {
		loadLikedStatus();
	}
	
	async function loadLikedStatus() {
		try {
			const commentIds = comments.map(c => c.id);
			const userId = user?.id || null;
			const sessionId = commentSessionId || null;
			
			const likedStatus = await commentService.getCommentLikesStatus(commentIds, userId, sessionId);
			
			// Update likedComments Set
			likedComments = new Set(
				Object.keys(likedStatus).filter(id => likedStatus[id])
			);
		} catch (error) {
			console.error('Error loading liked status:', error);
		}
	}
	
	// Group comments by parent
	$: topLevelComments = comments.filter(c => !c.parent_id);
	$: commentReplies = comments.reduce((acc, comment) => {
		if (comment.parent_id) {
			if (!acc[comment.parent_id]) acc[comment.parent_id] = [];
			acc[comment.parent_id].push(comment);
		}
		return acc;
	}, {} as Record<string, Comment[]>);
	
	// Debug logging
	$: if (comments.length > 0) {
		console.log('Total comments:', comments.length);
		console.log('Top-level comments:', topLevelComments.length);
		console.log('Comment replies structure:', commentReplies);
		console.log('All comments:', comments.map(c => ({ id: c.id, parent_id: c.parent_id, content: c.content.substring(0, 30) })));
	}
	
	function getVisibleReplies(commentId: string): Comment[] {
		const replies = commentReplies[commentId] || [];
		if (showAllReplies[commentId]) {
			return replies;
		}
		return replies.slice(0, MAX_INITIAL_REPLIES);
	}
	
	function getRemainingRepliesCount(commentId: string): number {
		const replies = commentReplies[commentId] || [];
		return replies.length - MAX_INITIAL_REPLIES;
	}
	
	function toggleShowAllReplies(commentId: string) {
		showAllReplies[commentId] = !showAllReplies[commentId];
		showAllReplies = showAllReplies; // Trigger reactivity
	}
	
	function getRelativeTime(dateString: string): string {
		const now = new Date();
		const past = new Date(dateString);
		const diffMs = now.getTime() - past.getTime();
		const diffSecs = Math.floor(diffMs / 1000);
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		const diffWeeks = Math.floor(diffDays / 7);
		
		if (diffSecs < 60) return 'just now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		if (diffWeeks < 4) return `${diffWeeks}w`;
		return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
	
	function getInitials(name: string): string {
		return name?.charAt(0)?.toUpperCase() || '?';
	}
	
	async function toggleLike(commentId: string) {
		try {
			const userId = user?.id || null;
			const sessionId = commentSessionId || null;
			
			const result = await commentService.toggleCommentLike(commentId, userId, sessionId);
			
			// Update the liked state
			if (result.action === 'liked') {
				likedComments.add(commentId);
			} else {
				likedComments.delete(commentId);
			}
			likedComments = likedComments; // Trigger reactivity
			
			// Update the likes_count in the comments array
			comments = comments.map(c => 
				c.id === commentId ? { ...c, likes_count: result.likes_count } : c
			);
		} catch (error) {
			console.error('Error toggling like:', error);
		}
	}
	
	async function handleSubmit() {
		if (!newComment.trim() || !authorName.trim() || submitting) return;
		submitting = true;
		try {
			await onSubmitComment(newComment, authorName, '', null);
			newComment = '';
		} finally {
			submitting = false;
		}
	}
	
	async function handleReply(parentId: string) {
		if (!replyContent.trim() || !authorName.trim() || submitting) return;
		submitting = true;
		try {
			await onSubmitComment(replyContent, authorName, '', parentId);
			replyContent = '';
			replyTo = null;
		} finally {
			submitting = false;
		}
	}
	
	function startReply(commentId: string, authorName: string) {
		replyTo = commentId;
		replyContent = `@${authorName} `;
		// Focus the reply input
		setTimeout(() => {
			document.getElementById(`reply-${commentId}`)?.focus();
		}, 50);
	}
</script>

<div class="instagram-comments bg-white border-t border-gray-200">
	<!-- Comments List -->
	<div class="comments-container max-h-[600px] overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
		{#if topLevelComments.length === 0}
			<div class="text-center py-8 sm:py-12 text-gray-400">
				<p class="text-sm">No comments yet.</p>
				<p class="text-xs mt-1">Be the first to share your thoughts!</p>
			</div>
		{:else}
			<div class="space-y-3 sm:space-y-4">
				{#each topLevelComments as comment}
					<div class="comment-item">
						<!-- Main Comment -->
						<div class="flex gap-2 sm:gap-3">
							<!-- Avatar -->
							<div class="flex-shrink-0 pt-0.5">
								<div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-white font-bold text-sm">
									{getInitials(comment.author_name || 'Anonymous')}
								</div>
							</div>
							
							<!-- Comment Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-start gap-2">
									<div class="flex-1 min-w-0">
										<!-- Username and Content -->
										<div class="leading-snug mb-1.5">
											<span class="font-semibold text-[13px] sm:text-sm text-black mr-2">
												{comment.author_name || 'Anonymous'}
											</span>
											<span class="text-[13px] sm:text-sm text-gray-900 break-words whitespace-pre-wrap">
												{comment.content}
											</span>
										</div>
										
										<!-- Comment Actions -->
										<div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500 font-medium">
											<span>{getRelativeTime(comment.created_at)}</span>
											{#if (comment.likes_count || 0) > 0}
												<button
													on:click={() => toggleLike(comment.id)}
													class="font-semibold hover:text-gray-700 transition-colors"
												>
													{comment.likes_count} {comment.likes_count === 1 ? 'like' : 'likes'}
												</button>
											{/if}
											<button
												on:click={() => toggleLike(comment.id)}
												class="font-semibold hover:text-gray-700 transition-colors"
											>
												{likedComments.has(comment.id) ? 'Unlike' : 'Like'}
											</button>
											<button
												on:click={() => startReply(comment.id, comment.author_name || 'Anonymous')}
												class="font-semibold hover:text-gray-700 transition-colors"
											>
												Reply
											</button>
											{#if canDelete(comment)}
												<button
													on:click={() => onDeleteComment(comment.id)}
													class="font-semibold text-red-500 hover:text-red-600 transition-colors"
												>
													Delete
												</button>
											{/if}
										</div>
									</div>
									
									<!-- Like Icon -->
									<button
										on:click={() => toggleLike(comment.id)}
										class="flex-shrink-0 p-0.5 sm:p-1 hover:opacity-70 transition-opacity touch-manipulation"
										aria-label="Like comment"
									>
										<Heart
											class="w-3 h-3 sm:w-3.5 sm:h-3.5 {likedComments.has(comment.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}"
										/>
									</button>
								</div>
								
								<!-- Replies Section - Always visible, styled like Instagram -->
								{#if commentReplies[comment.id] && commentReplies[comment.id].length > 0}
									<div class="mt-3 space-y-3">
										{#each getVisibleReplies(comment.id) as reply}
											<div class="flex gap-2">
												<!-- Reply Avatar - Smaller -->
												<div class="flex-shrink-0 pt-0.5">
													<div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs">
														{getInitials(reply.author_name || 'Anonymous')}
													</div>
												</div>
												
												<!-- Reply Content -->
												<div class="flex-1 min-w-0">
													<div class="flex items-start gap-2">
														<div class="flex-1 min-w-0">
															<!-- Username and Content -->
															<div class="leading-snug mb-1">
																<span class="font-semibold text-[12px] sm:text-[13px] text-black mr-1.5">
																	{reply.author_name || 'Anonymous'}
																</span>
																<span class="text-[12px] sm:text-[13px] text-gray-900 break-words whitespace-pre-wrap">
																	{reply.content}
																</span>
															</div>
															
															<!-- Reply Actions - Smaller -->
															<div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-gray-500 font-medium">
																<span>{getRelativeTime(reply.created_at)}</span>
																{#if (reply.likes_count || 0) > 0}
																	<button
																		on:click={() => toggleLike(reply.id)}
																		class="font-semibold hover:text-gray-700 transition-colors"
																	>
																		{reply.likes_count} {reply.likes_count === 1 ? 'like' : 'likes'}
																	</button>
																{/if}
																<button
																	on:click={() => toggleLike(reply.id)}
																	class="font-semibold hover:text-gray-700 transition-colors"
																>
																	{likedComments.has(reply.id) ? 'Unlike' : 'Like'}
																</button>
																{#if canDelete(reply)}
																	<button
																		on:click={() => onDeleteComment(reply.id)}
																		class="font-semibold text-red-500 hover:text-red-600 transition-colors"
																	>
																		Delete
																	</button>
																{/if}
															</div>
														</div>
														
														<!-- Reply Like Icon - Smaller -->
														<button
															on:click={() => toggleLike(reply.id)}
															class="flex-shrink-0 p-0.5 hover:opacity-70 transition-opacity touch-manipulation"
															aria-label="Like reply"
														>
															<Heart
																class="w-2.5 h-2.5 sm:w-3 sm:h-3 {likedComments.has(reply.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}"
															/>
														</button>
													</div>
												</div>
											</div>
										{/each}
										
										<!-- View More Replies Link (Instagram style) -->
										{#if !showAllReplies[comment.id] && getRemainingRepliesCount(comment.id) > 0}
											<button
												on:click={() => toggleShowAllReplies(comment.id)}
												class="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
											>
												<span class="w-6 h-px bg-gray-300"></span>
												View {getRemainingRepliesCount(comment.id)} more {getRemainingRepliesCount(comment.id) === 1 ? 'reply' : 'replies'}
											</button>
										{/if}
									</div>
								{/if}
								
								<!-- Reply Input -->
								{#if replyTo === comment.id}
									<div class="mt-3 space-y-2">
										<!-- Name for anonymous users -->
										{#if !user}
											<div>
												<label for="reply-author-name-{comment.id}" class="block text-[11px] sm:text-xs font-medium text-gray-600 mb-1">
													Your Name <span class="text-red-500">*</span>
												</label>
												<input
													id="reply-author-name-{comment.id}"
													type="text"
													bind:value={authorName}
													placeholder="Enter your name"
													class="w-full px-3 py-1.5 sm:py-2 text-[13px] sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
													required
												/>
											</div>
										{/if}
										
										<div class="flex gap-2">
											<input
												id="reply-{comment.id}"
												type="text"
												bind:value={replyContent}
												placeholder="Add a reply..."
												class="flex-1 px-3 py-1.5 sm:py-2 text-[13px] sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
												on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && handleReply(comment.id)}
											/>
											<button
												on:click={() => handleReply(comment.id)}
												disabled={!replyContent.trim() || !authorName.trim() || submitting}
												class="px-3 py-1.5 sm:py-2 text-[13px] sm:text-sm font-semibold text-primary hover:text-primary/80 disabled:text-gray-300 transition-colors touch-manipulation"
											>
												Post
											</button>
											<button
												on:click={() => { replyTo = null; replyContent = ''; }}
												class="px-3 py-1.5 sm:py-2 text-[13px] sm:text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors touch-manipulation"
											>
												Cancel
											</button>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	
	<!-- Fixed Comment Input -->
	<div class="comment-input-container border-t border-gray-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3">
		<!-- Name input for anonymous users -->
		{#if !user}
			<div class="mb-2.5 sm:mb-3">
				<label for="comment-author-name" class="block text-[11px] sm:text-xs font-medium text-gray-600 mb-1 sm:mb-1.5">
					Your Name <span class="text-red-500">*</span>
				</label>
				<input
					id="comment-author-name"
					type="text"
					bind:value={authorName}
					placeholder="Enter your name"
					class="w-full px-3 py-2 text-[13px] sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
					required
				/>
			</div>
		{/if}
		
		<div class="flex items-center gap-2 sm:gap-3">
			<!-- Avatar -->
			<div class="flex-shrink-0">
				<div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-white font-bold text-xs sm:text-sm">
					{getInitials(authorName || 'You')}
				</div>
			</div>
			
			<!-- Input -->
			<div class="flex-1 relative">
				<input
					type="text"
					bind:value={newComment}
					placeholder="Add a comment..."
					class="w-full pl-3 sm:pl-4 pr-9 sm:pr-12 py-2 text-[13px] sm:text-sm border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors bg-gray-50"
					on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
					disabled={submitting}
				/>
				<button
					on:click={handleSubmit}
					disabled={!newComment.trim() || !authorName.trim() || submitting}
					class="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-primary hover:text-primary/80 disabled:text-gray-300 transition-colors touch-manipulation"
					aria-label="Post comment"
				>
					<Send class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.instagram-comments {
		max-width: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	}
	
	.comments-container::-webkit-scrollbar {
		width: 6px;
	}
	
	.comments-container::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.comments-container::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 3px;
	}
	
	.comments-container::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}
	
	/* Mobile touch optimization */
	@media (max-width: 640px) {
		.touch-manipulation {
			min-width: 44px;
			min-height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
