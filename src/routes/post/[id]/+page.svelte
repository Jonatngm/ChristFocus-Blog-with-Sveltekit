<script lang="ts">
	import { page } from '$app/stores';
	import { postService } from '$lib/services/postService';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import { ArrowLeft, Calendar, Eye } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let post: Post | null = null;
	let loading = true;

	$: postId = $page.params.id;

	// Generate or retrieve anonymous ID for view tracking
	function getAnonId(): string {
		if (!browser) return '';
		
		let anonId = localStorage.getItem('anonId');
		if (!anonId) {
			anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('anonId', anonId);
		}
		return anonId;
	}

	onMount(async () => {
		try {
			post = await postService.getPostById(postId);
			
			// Increment views with anonymous ID and update post with new count
			if (browser) {
				const anonId = getAnonId();
				const updatedPost = await postService.incrementViews(postId, { anonId });
				
				// Update the displayed view count
				if (updatedPost && post) {
					post.views = updatedPost.views;
				}
			}
		} catch (error) {
			console.error('Error loading post:', error);
		} finally {
			loading = false;
		}
	});

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
						class="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl mb-6 sm:mb-8 shadow-lg"
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
	</article>
	{:else}
		<div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
			<h1 class="text-2xl sm:text-3xl font-bold mb-4 text-black">Post not found</h1>
			<a href="/" class="text-primary hover:text-gold-dark font-semibold transition-colors">Return to home</a>
		</div>
	{/if}
</div>
