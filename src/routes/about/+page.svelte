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
	<div class="container mx-auto px-4 py-16 max-w-4xl">
		<h1 class="text-5xl md:text-6xl font-bold text-black mb-16 text-center">
			About <span class="text-primary">ChristFocus</span>
		</h1>

		<div class="space-y-8">
			<!-- Our Mission Card -->
			<section>
				<button
					on:click={toggleMission}
					class="w-full flex items-start gap-6 bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-xl cursor-pointer group text-left"
				>
					<Book class="w-10 h-10 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
					<div class="flex-1">
						<div class="flex items-center justify-between mb-2">
							<h2 class="text-3xl font-bold text-black group-hover:text-primary transition-colors">
								Our Mission
							</h2>
							<ChevronDown 
								class="w-6 h-6 text-gray-600 group-hover:text-primary transition-all duration-300 {missionExpanded ? 'rotate-180' : ''}"
							/>
						</div>
						<p class="text-gray-600 text-lg">Click to learn about our mission and calling</p>
					</div>
				</button>

				{#if missionExpanded}
					<div 
						transition:slide={{ duration: 400, easing: quintOut }}
						class="mt-4 bg-white border-2 border-primary rounded-lg p-8 shadow-lg"
					>
						<p class="text-gray-700 leading-relaxed mb-6 text-lg">
							At ChristFocus, our mission is to proclaim the freedom and victory found in Jesus Christ and to deliver all captives in His name. We aim to share the Gospel of Love and Truth, bringing hope, healing, and transformation to every heart that seeks Him.
						</p>
						<div class="bg-gradient-to-br from-black to-gray-900 text-white p-6 rounded-lg italic mb-6 shadow-md">
							<p class="text-primary font-semibold mb-2 text-xl">Luke 4:18</p>
							<p class="leading-relaxed text-lg">
								"The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the captives and recovery of sight for the blind, to set the oppressed free"
							</p>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg font-medium">
							Through Christ, every soul can find restoration, peace, and eternal triumph.
						</p>
					</div>
				{/if}
			</section>

			<!-- About the Author Card -->
			<section>
				<button
					on:click={toggleAuthor}
					class="w-full flex items-start gap-6 bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-lg border-2 border-gray-800 hover:border-primary transition-all duration-300 hover:shadow-2xl cursor-pointer group text-left"
				>
					<Heart class="w-10 h-10 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
					<div class="flex-1">
						<div class="flex items-center justify-between mb-2">
							<h2 class="text-3xl font-bold text-primary">
								About the Author
							</h2>
							<ChevronDown 
								class="w-6 h-6 text-gray-400 group-hover:text-primary transition-all duration-300 {authorExpanded ? 'rotate-180' : ''}"
							/>
						</div>
						<p class="text-gray-400 text-lg">Click to discover the heart behind ChristFocus</p>
					</div>
				</button>

				{#if authorExpanded}
					<div 
						transition:slide={{ duration: 400, easing: quintOut }}
						class="mt-4 bg-gradient-to-br from-gray-100 to-white border-2 border-primary rounded-lg p-8 shadow-lg"
					>
						<p class="text-gray-700 leading-relaxed text-lg mb-6">
							The author of ChristFocus is a devoted follower of Jesus Christ, passionate about seeing lives transformed by His love. Driven by the calling to share the Gospel and deliver captives in His name, the author writes to inspire, teach, and encourage believers and seekers alike.
						</p>
						<div class="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-6">
							<p class="text-gray-800 leading-relaxed text-lg font-medium italic">
								Every article, reflection, and devotion is rooted in Scripture and prayer, aiming to guide readers into a deeper relationship with Christ and a life anchored in His truth.
							</p>
						</div>
						<p class="text-gray-700 leading-relaxed text-lg">
							Through the power of the Holy Spirit, this ministry seeks to bring light to the nations and freedom to all who are bound.
						</p>
					</div>
				{/if}
			</section>

			<!-- Bible Verse Section -->
			<section class="text-center py-12 mt-12 border-t-2 border-b-2 border-primary bg-gradient-to-r from-transparent via-primary/5 to-transparent">
				<blockquote class="text-2xl md:text-3xl font-light text-black italic mb-4 px-4">
					"Jesus came to bring freedom to those who are bound, healing to the brokenhearted, and hope to all who are lost. In His name, every chain is broken, every fear is cast out, and every soul finds true peace and eternal life."
				</blockquote>
				<p class="text-gray-600 mt-4 text-lg font-semibold">— Inspired by Luke 4:18-19</p>
			</section>
		</div>
	</div>
</div>
