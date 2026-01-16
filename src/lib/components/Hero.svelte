<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	// Array of hero images - easily add more here
	const heroImages = [
		'https://noble-chocolate-c2gugprqhh.edgeone.app/photo_2026-01-12_10-57-21.jpg',
		// Add more image URLs here to include them in the rotation
		// 'https://example.com/image2.jpg',
		// 'https://example.com/image3.jpg',
	];

	let currentIndex = 0;
	let intervalId: ReturnType<typeof setInterval>;
	const transitionDuration = 5000; // 5 seconds per image

	onMount(() => {
		// Only start rotation if there are multiple images
		if (heroImages.length > 1) {
			intervalId = setInterval(() => {
				currentIndex = (currentIndex + 1) % heroImages.length;
			}, transitionDuration);
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	// Preload next image for smooth transition
	$: if (typeof window !== 'undefined' && heroImages.length > 1) {
		const nextIndex = (currentIndex + 1) % heroImages.length;
		const img = new Image();
		img.src = heroImages[nextIndex];
	}
</script>

<div class="relative w-full">
	<!-- Hero Image with seamless blend - Responsive height -->
	<div class="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-screen overflow-hidden">
		{#each heroImages as image, index (image)}
			{#if index === currentIndex}
				<img
					src={image}
					alt="ChristFocus - Christ-centered teachings"
					class="absolute inset-0 w-full h-full object-cover object-center brightness-[1.02] contrast-[1.01]"
					loading={index === 0 ? 'eager' : 'lazy'}
					in:fade={{ duration: 1000 }}
					out:fade={{ duration: 1000 }}
				/>
			{/if}
		{/each}
		
		<!-- Subtle bottom fade for seamless transition -->
		<div class="absolute inset-x-0 bottom-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white/80 via-white/40 to-transparent z-10"></div>
		
		<!-- Image indicators (dots) -->
		{#if heroImages.length > 1}
			<div class="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
				{#each heroImages as _, index}
					<button
						on:click={() => currentIndex = index}
						class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 {index === currentIndex ? 'bg-primary w-6 sm:w-8' : 'bg-white/50 hover:bg-white/70'}"
						aria-label="Go to slide {index + 1}"
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
