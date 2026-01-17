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

<!-- Full-screen hero slider with iOS-inspired liquid design -->
<section class="relative w-full h-screen overflow-hidden bg-black">
	<!-- Image slider with responsive blur -->
	{#each heroImages as image, index (image)}
		{#if index === currentIndex}
			<div
				class="absolute inset-0 w-full h-full hero-image-container"
				in:fade={{ duration: 1200, easing: (t) => t * (2 - t) }}
				out:fade={{ duration: 1200, easing: (t) => t * (2 - t) }}
			>
				<img
					src={image}
					alt="Christ Focus Hero"
					class="w-full h-full object-cover hero-image"
					loading={index === 0 ? 'eager' : 'lazy'}
				/>
			</div>
		{/if}
	{/each}

	<!-- Welcome text and description overlay with fluid animations -->
	<div class="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
		<div class="text-center max-w-6xl mx-auto w-full hero-content">
			<!-- Main Title - Crisp and fluid -->
			<h1 
				class="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-2"
			>
				Welcome to <span 
					class="hero-brand inline-block bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-black"
				>ChristFocus</span>
			</h1>

			<!-- Description text with fade-in and glassmorphism -->
			{#if showDescription}
				<div 
					class="hero-description-wrapper max-w-4xl mx-auto px-2"
					in:fade={{ duration: 1800, delay: 0, easing: (t) => t * (2 - t) }}
				>
					<div class="hero-glass-card">
						<p class="hero-description text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed font-light tracking-wide">
							ChristFocus is a Christ-centered space created to reveal the glory and presence of Jesus in every part of life. Here we proclaim the Gospel of Love, words that restore your soul, bring lasting peace, and give life a whole new depth and meaning. Through the wisdom and truth of Christ, you will find unwavering hope, victory over life's struggles, and the assurance of eternal triumph. Come, be encouraged, and let your heart be anchored in His love and light.
						</p>
					</div>
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
with iOS-style animation -->
	<div class="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-30 hero-indicators">
		{#each heroImages as _, index}
			<button
				on:click={() => currentIndex = index}
				class="indicator-dot w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500 ease-out {index === currentIndex ? 'bg-white w-6 sm:w-8 scale-110 shadow-lg shadow-white/50' : 'bg-white/50 hover:bg-white/80 hover:scale-110'}"
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</section>

<style>
	/* iOS-inspired liquid design system */
	
	/* Responsive blur effect - less on mobile, more on desktop */
	.hero-image {
		filter: blur(1px);
		transform: scale(1.02);
		transition: filter 0.6s ease, transform 0.6s ease;
		will-change: filter, transform;
	}

	@media (min-width: 640px) {
		.hero-image {
			filter: blur(1.5px);
		}
	}

	@media (min-width: 1024px) {
		.hero-image {
			filter: blur(2px);
		}
	}

	@media (min-width: 1536px) {
		.hero-image {
			filter: blur(2.5px);
		}
	}

	/* Smooth image container animation */
	.hero-image-container {
		animation: subtle-float 20s ease-in-out infinite;
	}

	@keyframes subtle-float {
		0%, 100% { transform: scale(1.02); }
		50% { transform: scale(1.04); }
	}

	/* Fluid content animations */
	.hero-content {
		animation: content-entrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}

	@keyframes content-entrance {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Title styling with enhanced shadows */
	.hero-title {
		text-shadow: 
			0 0 25px rgba(0, 0, 0, 0.95),
			0 0 45px rgba(0, 0, 0, 0.85),
			0 0 65px rgba(0, 0, 0, 0.65),
			0 5px 18px rgba(0, 0, 0, 0.95),
			0 2px 8px rgba(0, 0, 0, 0.85),
			0 1px 4px rgba(0, 0, 0, 0.75);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		animation: title-glow 3s ease-in-out infinite;
	}

	@keyframes title-glow {
		0%, 100% {
			text-shadow: 
				0 0 25px rgba(0, 0, 0, 0.95),
				0 0 45px rgba(0, 0, 0, 0.85),
				0 0 65px rgba(0, 0, 0, 0.65),
				0 5px 18px rgba(0, 0, 0, 0.95);
		}
		50% {
			text-shadow: 
				0 0 30px rgba(0, 0, 0, 1),
				0 0 55px rgba(0, 0, 0, 0.9),
				0 0 75px rgba(0, 0, 0, 0.7),
				0 6px 22px rgba(0, 0, 0, 1);
		}
	}

	/* Brand text with enhanced visibility */
	.hero-brand {
		filter: 
			drop-shadow(0 0 28px rgba(0, 0, 0, 0.95)) 
			drop-shadow(0 0 48px rgba(0, 0, 0, 0.85)) 
			drop-shadow(0 5px 18px rgba(0, 0, 0, 0.95));
		-webkit-text-stroke: 1px rgba(255, 255, 255, 0.35);
		animation: brand-shimmer 4s ease-in-out infinite;
	}

	@keyframes brand-shimmer {
		0%, 100% {
			filter: 
				drop-shadow(0 0 28px rgba(0, 0, 0, 0.95)) 
				drop-shadow(0 0 48px rgba(0, 0, 0, 0.85)) 
				drop-shadow(0 5px 18px rgba(0, 0, 0, 0.95));
		}
		50% {
			filter: 
				drop-shadow(0 0 35px rgba(0, 0, 0, 1)) 
				drop-shadow(0 0 58px rgba(0, 0, 0, 0.9)) 
				drop-shadow(0 6px 22px rgba(0, 0, 0, 1));
		}
	}

	/* iOS-style glassmorphism card */
	.hero-glass-card {
		background: radial-gradient(
			ellipse at center, 
			rgba(0, 0, 0, 0.35) 0%, 
			rgba(0, 0, 0, 0.25) 50%,
			transparent 75%
		);
		backdrop-filter: blur(10px) saturate(180%);
		-webkit-backdrop-filter: blur(10px) saturate(180%);
		padding: 1.25rem 1.5rem;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		animation: glass-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@media (min-width: 640px) {
		.hero-glass-card {
			padding: 1.75rem 2rem;
			border-radius: 2rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-glass-card {
			padding: 2rem 2.5rem;
			border-radius: 2.5rem;
		}
	}

	@keyframes glass-entrance {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.95);
			backdrop-filter: blur(0px) saturate(100%);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
			backdrop-filter: blur(10px) saturate(180%);
		}
	}

	.hero-glass-card:hover {
		background: radial-gradient(
			ellipse at center, 
			rgba(0, 0, 0, 0.4) 0%, 
			rgba(0, 0, 0, 0.3) 50%,
			transparent 75%
		);
		border-color: rgba(255, 255, 255, 0.12);
		box-shadow: 
			0 12px 40px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	/* Description text styling */
	.hero-description {
		text-shadow: 
			0 0 22px rgba(0, 0, 0, 0.95),
			0 0 38px rgba(0, 0, 0, 0.85),
			0 0 55px rgba(0, 0, 0, 0.65),
			0 4px 14px rgba(0, 0, 0, 0.95),
			0 2px 7px rgba(0, 0, 0, 0.85),
			0 1px 3px rgba(0, 0, 0, 0.75);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-weight: 300;
	}

	@media (min-width: 640px) {
		.hero-description {
			font-weight: 400;
		}
	}

	/* iOS-style indicators */
	.hero-indicators {
		animation: indicators-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards;
	}

	@keyframes indicators-entrance {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.indicator-dot {
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	/* Smooth scrolling for entire page */
	:global(html) {
		scroll-behavior: smooth;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Fluid transitions for all interactive elements */
	:global(button), :global(a) {
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Mobile-specific optimizations */
	@media (max-width: 639px) {
		.hero-title {
			line-height: 1.1;
			letter-spacing: -0.02em;
		}

		.hero-description {
			line-height: 1.6;
		}

		.hero-glass-card {
			backdrop-filter: blur(8px) saturate(150%);
			-webkit-backdrop-filter: blur(8px) saturate(150%);
		}
	}

	/* Reduce motion for users who prefer it */
	@media (prefers-reduced-motion: reduce) {
		.hero-image-container,
		.hero-content,
		.hero-title,
		.hero-brand,
		.hero-glass-card,
		.hero-indicators {
			animation: none;
		}

		.hero-image,
		.hero-glass-card,
		.indicator-dot,
		:global(button),
		:global(a) {
			transition: none;
		}
	}
</style