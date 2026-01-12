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

	<div class="container mx-auto px-4 py-16 md:py-24">
		<!-- Welcome Text Section -->
		<div class="mb-16 text-center max-w-4xl mx-auto">
			<h2 class="text-4xl md:text-5xl font-bold text-black mb-8">
				Welcome to <span class="text-primary">ChristFocus</span>
			</h2>
			<p class="text-xl md:text-2xl text-gray-900 leading-relaxed font-medium">
				ChristFocus is a Christ-centered space created to reveal the glory and presence of Jesus in every part of life. Here we proclaim the Gospel of Love, words that restore your soul, bring lasting peace, and give life a whole new depth and meaning. Through the wisdom and truth of Christ, you will find unwavering hope, victory over life's struggles, and the assurance of eternal triumph. Come, be encouraged, and let your heart be anchored in His love and light.
			</p>
		</div>

		<!-- Search Bar -->
		<div class="mb-16 max-w-2xl mx-auto">
			<div class="relative">
				<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm hover:shadow-md"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		{:else}
			<!-- Featured Posts -->
			{#if featuredPosts.length > 0 && !searchQuery}
				<section class="mb-24">
					<div class="flex items-center gap-4 mb-12">
						<div class="h-1 w-16 bg-primary rounded-full"></div>
						<h2 class="text-4xl md:text-5xl font-bold text-black flex items-center gap-4">
							<BookOpen class="w-10 h-10 text-primary" />
							Featured Teachings
						</h2>
					</div>
					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each featuredPosts as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				</section>
			{/if}

			<!-- All Posts -->
			<section>
				<div class="flex items-center gap-4 mb-12">
					<div class="h-1 w-16 bg-primary rounded-full"></div>
					<h2 class="text-4xl md:text-5xl font-bold text-black">
						{searchQuery ? 'Search Results' : 'Latest Posts'}
					</h2>
				</div>
				{#if filteredPosts.length > 0}
					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each filteredPosts as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				{:else}
					<div class="text-center py-20">
						<p class="text-gray-600 text-lg">No teachings found matching your search.</p>
					</div>
				{/if}
			</section>
		{/if}
	</div>
</div>
