<script lang="ts">
	import { page } from '$app/stores';
	import { postService } from '$lib/services/postService';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import { ArrowLeft, Calendar, Eye } from 'lucide-svelte';

	let post: Post | null = null;
	let loading = true;

	$: postId = $page.params.id;

	onMount(async () => {
		try {
			post = await postService.getPostById(postId);
			// Increment views
			await postService.incrementViews(postId);
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

<div class="min-h-screen bg-[#EBE3DB]">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
		</div>
	{:else if post}
		<article class="container mx-auto px-4 py-12 max-w-4xl">
			<a href="/" class="inline-flex items-center gap-2 text-primary hover:underline mb-8">
				<ArrowLeft class="w-4 h-4" />
				Back to home
			</a>

			<header class="mb-8">
				{#if post.cover_image}
					<img
						src={post.cover_image}
						alt={post.title}
						class="w-full h-96 object-cover rounded-lg mb-8"
					/>
				{/if}

				<h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
					{post.title}
				</h1>

				<div class="flex items-center gap-4 text-sm text-muted-foreground">
					<div class="flex items-center gap-2">
						<Calendar class="w-4 h-4" />
						<span>{new Date(post.created_at).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}</span>
					</div>
					{#if typeof post.views !== 'undefined'}
						<div class="flex items-center gap-2">
							<Eye class="w-4 h-4" />
							<span>{formatCount(post.views)} views</span>
						</div>
					{/if}
				</div>

				{#if post.categories && post.categories.length > 0}
					<div class="flex flex-wrap gap-2 mt-4">
						{#each post.categories as category}
							<span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
								{category.name}
							</span>
						{/each}
					</div>
				{/if}
			</header>

			<div class="prose prose-lg max-w-none">
				{@html post.content}
			</div>

			{#if post.tags && post.tags.length > 0}
				<footer class="mt-12 pt-8 border-t">
					<h3 class="text-lg font-semibold mb-3">Tags</h3>
					<div class="flex flex-wrap gap-2">
						{#each post.tags as tag}
							<span class="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm">
								{tag.name}
							</span>
						{/each}
					</div>
				</footer>
			{/if}
		</article>
	{:else}
		<div class="container mx-auto px-4 py-12 text-center">
			<h1 class="text-2xl font-bold mb-4">Post not found</h1>
			<a href="/" class="text-primary hover:underline">Return to home</a>
		</div>
	{/if}
</div>
