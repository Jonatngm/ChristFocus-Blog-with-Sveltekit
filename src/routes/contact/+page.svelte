<script lang="ts">
	import { Mail, User, MapPin } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Contact - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 py-16 max-w-2xl">
		<h1 class="text-5xl md:text-6xl font-bold text-black mb-12 text-center">
			Contact <span class="text-primary">Us</span>
		</h1>

		<div class="bg-gradient-to-br from-gray-900 to-black text-white p-10 rounded-lg shadow-2xl border-t-4 border-primary">
			<div class="flex items-center gap-4 mb-8">
				<Mail class="w-8 h-8 text-primary" />
				<h2 class="text-2xl font-bold">Get in Touch</h2>
			</div>
			
			<p class="text-gray-300 leading-relaxed mb-8 text-lg">
				Have questions or want to connect? Feel free to reach out to us.
			</p>
			
			<div class="space-y-6">
				<div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
					<p class="text-sm text-primary font-semibold mb-2">Name</p>
					<p class="text-white text-lg">Robert Ngemanyi Kabangu</p>
				</div>

				<div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
					<p class="text-sm text-primary font-semibold mb-2">Email</p>
					<a href="mailto:ngemanyir@gmail.com" class="text-white text-lg hover:text-primary transition-colors">
						ngemanyir@gmail.com
					</a>
				</div>

				<div class="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
					<p class="text-sm text-primary font-semibold mb-2">Location</p>
					<p class="text-white text-lg">Kigali, Rwanda</p>
				</div>
			</div>
		</div>

		<!-- Bible Verse -->
		<div class="mt-12 text-center">
			<div class="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-primary shadow-lg">
				<p class="text-lg md:text-xl text-gray-900 leading-relaxed italic mb-4">
					"For God did not send His Son into the world to condemn the world, but to save it. In Him, the captives are set free, the broken are healed, and all who come to Him find eternal life and peace."
				</p>
				<p class="text-gray-600 font-semibold">— Adapted from John 3:17 & Luke 4:18</p>
			</div>
		</div>
	</div>
</div>
