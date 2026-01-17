<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	// Full-screen hero slider images
	const heroImages = [
		'https://verbal-silver-paqu3x742x.edgeone.app/photo_2026-01-16_16-03-29.jpg',
		'https://afraid-lavender-x1jp9oxkk5.edgeone.app/386aa040-5977-4698-98ec-1641d0ece06d.png'
	];

	let currentIndex = 0;
	let intervalId: ReturnType<typeof setInterval>;
	const transitionDuration = 4000; // 4 seconds per image

	onMount(() => {
		// Auto-rotate images
		intervalId = setInterval(() => {
			currentIndex = (currentIndex + 1) % heroImages.length;
		}, transitionDuration);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	// Preload next image for smooth transition
	$: if (typeof window !== 'undefined') {
		const nextIndex = (currentIndex + 1) % heroImages.length;
		const img = new Image();
		img.src = heroImages[nextIndex];
	}
</script>

<!-- Full-screen hero slider -->
<section class="relative w-full h-screen overflow-hidden">
	<!-- Image slider -->
	{#each heroImages as image, index (image)}
		{#if index === currentIndex}
			<div
				class="absolute inset-0 w-full h-full"
				in:fade={{ duration: 1200 }}
				out:fade={{ duration: 1200 }}
			>
				<img
					src={image}
					alt="Christ Focus Hero"
					class="w-full h-full object-cover"
					loading={index === 0 ? 'eager' : 'lazy'}
				/>
			</div>
		{/if}
	{/each}

	<!-- Dark overlay for text readability -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>

	<!-- Welcome text overlay -->
	<div class="absolute inset-0 z-20 flex items-center justify-center">
		<div class="text-center px-6">
			<!-- Backdrop blur container -->
			<div class="backdrop-blur-sm bg-black/20 rounded-3xl px-8 py-6 sm:px-12 sm:py-8 md:px-16 md:py-10 border border-white/10 shadow-2xl">
				<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-tight">
					Welcome to <span class="text-primary">Christ Focus</span>
				</h1>
			</div>
		</div>
	</div>

	<!-- Slide indicators -->
	<div class="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
		{#each heroImages as _, index}
			<button
				on:click={() => currentIndex = index}
				class="w-2.5 h-2.5 rounded-full transition-all duration-300 {index === currentIndex ? 'bg-primary w-8 scale-110' : 'bg-white/60 hover:bg-white/80'}"
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</section>
