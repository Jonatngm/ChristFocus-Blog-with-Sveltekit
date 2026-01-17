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
	let showDescription = false;
	const transitionDuration = 4000; // 4 seconds per image

	onMount(() => {
		// Auto-rotate images
		intervalId = setInterval(() => {
			currentIndex = (currentIndex + 1) % heroImages.length;
		}, transitionDuration);

		// Show description after 5 seconds
		setTimeout(() => {
			showDescription = true;
		}, 5000);
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
					style="filter: blur(3px);"
					loading={index === 0 ? 'eager' : 'lazy'}
				/>
			</div>
		{/if}
	{/each}

	<!-- Welcome text and description overlay -->
	<div class="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 md:px-8">
		<div class="text-center max-w-5xl mx-auto">
			<!-- Main Title - Clean floating text -->
			<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-tight mb-6 sm:mb-8 md:mb-10" style="text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);">
				Welcome to <span class="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent" style="text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">ChristFocus</span>
			</h1>

			<!-- Description text with fade-in animation -->
			{#if showDescription}
				<div 
					class="max-w-3xl mx-auto"
					in:fade={{ duration: 1500, delay: 0 }}
				>
					<p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed font-light tracking-wide" style="text-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4);">
						ChristFocus is a Christ-centered space created to reveal the glory and presence of Jesus in every part of life. Here we proclaim the Gospel of Love, words that restore your soul, bring lasting peace, and give life a whole new depth and meaning. Through the wisdom and truth of Christ, you will find unwavering hope, victory over life's struggles, and the assurance of eternal triumph. Come, be encouraged, and let your heart be anchored in His love and light.
					</p>
				</div>
			{/if}
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
