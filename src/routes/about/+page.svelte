<script lang="ts">
	import { Book, Heart, ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let missionExpanded = false;
	let authorExpanded = false;

	function toggleMission() {
		missionExpanded = !missionExpanded;
	}

	function toggleAuthor() {
		authorExpanded = !authorExpanded;
	}
</script>

<svelte:head>
	<title>About - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 py-20 max-w-5xl">
		<h1 class="text-5xl md:text-7xl font-extrabold text-black mb-8 text-center tracking-tight">
			About <span class="text-primary text-shadow-soft">ChristFocus</span>
		</h1>
		<div class="h-1.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-20"></div>

		<div class="space-y-10">
			<!-- Our Mission Card -->
			<section>
				<button
					on:click={toggleMission}
					class="w-full flex items-start gap-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-10 rounded-2xl border-2 border-gray-200 hover:border-primary transition-all duration-500 hover:shadow-2xl cursor-pointer group text-left interactive"
				>
					<div class="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-gold-dark/10 flex-shrink-0 group-hover:from-primary/20 group-hover:to-gold-dark/20 transition-all">
						<Book class="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
					</div>
					<div class="flex-1">
						<div class="flex items-center justify-between mb-3">
							<h2 class="text-3xl md:text-4xl font-extrabold text-black group-hover:text-primary transition-colors duration-300 tracking-tight">
								Our Mission
							</h2>
							<ChevronDown 
								class="w-7 h-7 text-gray-400 group-hover:text-primary transition-all duration-500 {missionExpanded ? 'rotate-180' : ''}"
							/>
						</div>
						<p class="text-gray-600 text-lg font-medium">Click to learn about our mission and calling</p>
					</div>
				</button>

				{#if missionExpanded}
					<div 
						transition:slide={{ duration: 500, easing: quintOut }}
						class="mt-6 bg-white border-2 border-primary rounded-2xl p-10 shadow-2xl"
					>
						<p class="text-gray-700 leading-relaxed mb-8 text-lg">
							At ChristFocus, our mission is to proclaim the freedom and victory found in Jesus Christ and to deliver all captives in His name. We aim to share the Gospel of Love and Truth, bringing hope, healing, and transformation to every heart that seeks Him.
						</p>
						<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 rounded-2xl italic mb-8 shadow-lg border border-primary/20">
							<p class="text-primary font-bold mb-3 text-xl">Luke 4:18</p>
							<p class="leading-relaxed text-lg text-gray-100">
								"The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the captives and recovery of sight for the blind, to set the oppressed free"
							</p>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg font-semibold">
							Through Christ, every soul can find restoration, peace, and eternal triumph.
						</p>
					</div>
				{/if}
			</section>

			<!-- About the Author Card -->
			<section>
				<button
					on:click={toggleAuthor}
					class="w-full flex items-start gap-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-10 rounded-2xl border-2 border-gray-800 hover:border-primary transition-all duration-500 hover:shadow-2xl cursor-pointer group text-left interactive"
				>
					<div class="p-4 rounded-xl bg-primary/20 flex-shrink-0 group-hover:bg-primary/30 transition-all">
						<Heart class="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
					</div>
					<div class="flex-1">
						<div class="flex items-center justify-between mb-3">
							<h2 class="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
								About the Author
							</h2>
							<ChevronDown 
								class="w-7 h-7 text-gray-400 group-hover:text-primary transition-all duration-500 {authorExpanded ? 'rotate-180' : ''}"
							/>
						</div>
						<p class="text-gray-400 text-lg font-medium">Click to discover the heart behind ChristFocus</p>
					</div>
				</button>

				{#if authorExpanded}
					<div 
						transition:slide={{ duration: 500, easing: quintOut }}
						class="mt-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-2 border-primary rounded-2xl p-10 shadow-2xl"
					>
						<p class="text-gray-700 leading-relaxed text-lg mb-8">
							The author of ChristFocus is a devoted follower of Jesus Christ, passionate about seeing lives transformed by His love. Driven by the calling to share the Gospel and deliver captives in His name, the author writes to inspire, teach, and encourage believers and seekers alike.
						</p>
						<div class="bg-gradient-to-r from-primary/10 via-gold-dark/10 to-primary/10 border-l-4 border-primary p-8 rounded-r-2xl mb-8 shadow-sm">
							<p class="text-gray-800 leading-relaxed text-lg font-semibold italic">
								Every article, reflection, and devotion is rooted in Scripture and prayer, aiming to guide readers into a deeper relationship with Christ and a life anchored in His truth.
							</p>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg font-semibold">
							Through the power of the Holy Spirit, this ministry seeks to bring light to the nations and freedom to all who are bound.
						</p>
					</div>
				{/if}
			</section>

			<!-- Bible Verse Section -->
		<section class="text-center py-16 mt-16 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-lg">
			<blockquote class="text-2xl md:text-3xl font-light text-black italic mb-6 px-6 leading-relaxed">
					"Jesus came to bring freedom to those who are bound, healing to the brokenhearted, and hope to all who are lost. In His name, every chain is broken, every fear is cast out, and every soul finds true peace and eternal life."
				</blockquote>
				<div class="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
				<p class="text-gray-600 text-lg font-bold">— Inspired by Luke 4:18-19</p>
			</section>
		</div>
	</div>
</div>
