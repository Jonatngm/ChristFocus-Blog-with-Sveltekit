<script lang="ts">
	import { postService } from '$lib/services/postService';
	import Hero from '$lib/components/Hero.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { BookOpen, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	
	let featuredPosts: Post[] = [];
	let posts: Post[] = [];
	let filteredPosts: Post[] = [];
	let loading = true;
	let searchQuery = '';

	onMount(async () => {
		try {
			const [featured, allPosts] = await Promise.all([
				postService.getPublishedPosts({ featured: true }),
				postService.getPublishedPosts()
			]);
			featuredPosts = featured;
			posts = allPosts;
			filteredPosts = allPosts;
		} catch (error) {
			console.error('Error loading posts:', error);
		} finally {
			loading = false;
		}
	});

	function filterPosts() {
		if (!searchQuery.trim()) {
			filteredPosts = posts;
		} else {
			const query = searchQuery.toLowerCase();
			filteredPosts = posts.filter(post => 
				post.title.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query) ||
				(post.excerpt && post.excerpt.toLowerCase().includes(query))
			);
		}
	}

	$: searchQuery, filterPosts();
</script>

<svelte:head>
	<title>ChristFocus - Christ-centered Teachings</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<Hero />

	<div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
		<!-- Search Bar -->
		<div class="mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto px-2">
			<div class="relative group">
				<Search class="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 md:py-5 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none shadow-sm hover:shadow-md text-base sm:text-lg"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20 sm:py-24 md:py-32">
				<div class="relative">
					<div class="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary/20 border-t-primary"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20"></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Featured Posts -->
			{#if featuredPosts.length > 0 && !searchQuery}
				<section class="mb-20 sm:mb-24 md:mb-32">
					<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
						<div class="h-1.5 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-primary to-gold-dark rounded-full"></div>
						<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black flex items-center gap-3 sm:gap-4 tracking-tight">
							<div class="p-2 sm:p-2.5 md:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-gold-dark/10">
								<BookOpen class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
							</div>
							<span class="leading-tight">Featured Teachings</span>
						</h2>
					</div>
					<div class="grid gap-6 sm:gap-7 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{#each featuredPosts as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- All Posts -->
			<section>
				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
					<div class="h-1.5 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-primary to-gold-dark rounded-full"></div>
					<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
						{searchQuery ? 'Search Results' : 'Latest Posts'}
					</h2>
				</div>
				{#if filteredPosts.length > 0}
					<div class="grid gap-6 sm:gap-7 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{#each filteredPosts as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				{:else}
					<div class="text-center py-20 sm:py-24 md:py-32 px-4">
						<div class="inline-block p-6 sm:p-8 rounded-2xl bg-gray-50 border-2 border-gray-200">
							<Search class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
							<p class="text-gray-600 text-lg sm:text-xl font-medium">No teachings found matching your search.</p>
						</div>
					</div>
				{/if}
			</section>
		{/if}
	</div>
</div>