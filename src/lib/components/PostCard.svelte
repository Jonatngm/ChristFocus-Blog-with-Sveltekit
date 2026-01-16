<script lang="ts">
	import type { Post } from '$lib/types';
	import { Calendar, BookOpen, Eye } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let post: Post;

	const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatCount(count: number | null | undefined): string {
		if (!count) return '0';
		if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
		return count.toString();
	}

	// Carousel state
	let currentImageIndex = 0;
	let carouselIntervalId: ReturnType<typeof setInterval> | null = null;
	const carouselTransitionDuration = 5000; // 5 seconds

	// Get cover images array (fallback to single cover_image if needed)
	$: coverImages = post?.cover_images && post.cover_images.length > 0 
		? post.cover_images 
		: post?.cover_image ? [post.cover_image] : [];

	// Start carousel if multiple images
	$: if (post?.cover_images && post.cover_images.length > 1 && !carouselIntervalId) {
		carouselIntervalId = setInterval(() => {
			currentImageIndex = (currentImageIndex + 1) % post!.cover_images!.length;
		}, carouselTransitionDuration);
	}

	// Preload next image for smooth transitions
	$: if (typeof window !== 'undefined' && post?.cover_images && post.cover_images.length > 1) {
		const nextIndex = (currentImageIndex + 1) % post.cover_images.length;
		const img = new Image();
		img.src = post.cover_images[nextIndex];
	}

	onDestroy(() => {
		if (carouselIntervalId) {
			clearInterval(carouselIntervalId);
			carouselIntervalId = null;
		}
	});
</script>

<a href="/post/{post.id}" class="block h-full group">
	<div class="h-full transition-all duration-500 border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-primary group-hover:shadow-2xl group-hover:-translate-y-2">
		{#if coverImages.length > 0}
			<div class="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
				{#each coverImages as image, index (image)}
					{#if index === currentImageIndex}
						<img
							src={image}
							alt="{post.title} - Image {index + 1}"
							class="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
							loading={index === 0 ? 'eager' : 'lazy'}
							in:fade={{ duration: 1000 }}
							out:fade={{ duration: 1000 }}
						/>
					{/if}
				{/each}
				
				<!-- Dot indicators for multiple images -->
				{#if coverImages.length > 1}
					<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
						{#each coverImages as _, index}
							<div
								class="w-1.5 h-1.5 rounded-full transition-all duration-300 {index === currentImageIndex ? 'bg-primary w-3' : 'bg-white/60'}"
							></div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
		
		<div class="p-5 sm:p-6 md:p-7">
			{#if post.series}
				<div class="flex items-center gap-2 text-xs sm:text-sm text-primary font-bold mb-3 bg-primary/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full inline-flex">
					<BookOpen class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
					<span class="truncate">{post.series.title}</span>
					{#if post.series_order}
						<span class="text-gray-600 whitespace-nowrap flex-shrink-0">• Part {post.series_order}</span>
					{/if}
				</div>
			{/if}

			<div class="flex items-start justify-between gap-3 mb-3 sm:mb-4">
				<h3 class="text-xl sm:text-2xl font-extrabold text-black leading-tight line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-300">
					{post.title}
				</h3>

				{#if typeof post.views !== 'undefined'}
					<div class="flex-shrink-0">
						<div class="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-primary/20 to-gold-dark/20 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-primary/30 shadow-sm">
							<Eye class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							<span class="text-xs sm:text-sm font-bold">{formatCount(post.views)}</span>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5">
				<Calendar class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
				<span class="font-medium">{formattedDate}</span>
			</div>

			<p class="text-gray-600 line-clamp-3 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
				{post.excerpt || post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
			</p>
			
			<div class="flex flex-wrap gap-1.5 sm:gap-2">
				{#if post.categories}
					{#each post.categories as category}
						<span class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-primary to-gold-dark text-black rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
							{category.name}
						</span>
					{/each}
				{/if}
				{#if post.tags}
					{#each post.tags as tag}
						<span class="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200 hover:bg-gray-200 transition-colors">
							{tag.name}
						</span>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</a>
