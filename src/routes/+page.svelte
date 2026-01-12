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

	<div class="container mx-auto px-4 py-20 md:py-32">
		<!-- Welcome Text Section -->
		<div class="mb-20 text-center max-w-4xl mx-auto reveal">
			<h2 class="text-4xl md:text-6xl font-extrabold text-black mb-10 tracking-tight">
				Welcome to <span class="text-primary text-shadow-soft">ChristFocus</span>
			</h2>
			<div class="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"></div>
			<p class="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
				ChristFocus is a Christ-centered space created to reveal the glory and presence of Jesus in every part of life. Here we proclaim the Gospel of Love, words that restore your soul, bring lasting peace, and give life a whole new depth and meaning. Through the wisdom and truth of Christ, you will find unwavering hope, victory over life's struggles, and the assurance of eternal triumph. Come, be encouraged, and let your heart be anchored in His love and light.
			</p>
		</div>

		<!-- Search Bar -->
		<div class="mb-20 max-w-2xl mx-auto reveal">
			<div class="relative group">
				<Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search teachings..."
					class="w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none shadow-sm hover:shadow-md text-lg"
				/>
			</div>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-32">
				<div class="relative">
					<div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-8 h-8 rounded-full bg-primary/20"></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Featured Posts -->
			{#if featuredPosts.length > 0 && !searchQuery}
				<section class="mb-32 reveal">
					<div class="flex items-center gap-6 mb-16">
						<div class="h-1.5 w-20 bg-gradient-to-r from-primary to-gold-dark rounded-full"></div>
						<h2 class="text-4xl md:text-5xl font-extrabold text-black flex items-center gap-4 tracking-tight">
							<div class="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-gold-dark/10">
								<BookOpen class="w-10 h-10 text-primary" />
							</div>
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
			<section class="reveal">
				<div class="flex items-center gap-6 mb-16">
					<div class="h-1.5 w-20 bg-gradient-to-r from-primary to-gold-dark rounded-full"></div>
					<h2 class="text-4xl md:text-5xl font-extrabold text-black tracking-tight">
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
					<div class="text-center py-32">
						<div class="inline-block p-6 rounded-2xl bg-gray-50 border-2 border-gray-200">
							<Search class="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p class="text-gray-600 text-xl font-medium">No teachings found matching your search.</p>
						</div>
					</div>
				{/if}
			</section>
		{/if}
	</div>
</div>
