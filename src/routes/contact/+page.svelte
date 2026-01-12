<script lang="ts">
	import { Mail, User, MapPin } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Contact - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 py-20 max-w-3xl">
		<h1 class="text-5xl md:text-7xl font-extrabold text-foreground mb-8 text-center tracking-tight">
			Contact <span class="text-primary text-shadow-soft">Us</span>
		</h1>
		<div class="h-1.5 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>

		<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-12 rounded-2xl shadow-2xl border-t-4 border-primary reveal interactive elevated">
			<div class="flex items-center gap-5 mb-10">
				<div class="p-4 rounded-xl bg-primary/20">
					<Mail class="w-9 h-9 text-primary" />
				</div>
				<h2 class="text-3xl font-extrabold tracking-tight">Get in Touch</h2>
			</div>
			
			<p class="text-gray-300 leading-relaxed mb-10 text-lg">
				Have questions or want to connect? Feel free to reach out to us. We'd love to hear from you.
			</p>
			
			<div class="space-y-6">
				<div class="bg-white/10 backdrop-blur-sm p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-3 mb-3">
						<User class="w-5 h-5 text-primary" />
						<p class="text-sm text-primary font-bold uppercase tracking-wide">Name</p>
					</div>
					<p class="text-white text-xl font-semibold">Robert Ngemanyi Kabangu</p>
				</div>

				<div class="bg-white/10 backdrop-blur-sm p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-3 mb-3">
						<Mail class="w-5 h-5 text-primary" />
						<p class="text-sm text-primary font-bold uppercase tracking-wide">Email</p>
					</div>
					<a href="mailto:ngemanyir@gmail.com" class="text-white text-xl font-semibold hover:text-primary transition-colors inline-flex items-center gap-2 group">
						ngemanyir@gmail.com
						<span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
					</a>
				</div>

				<div class="bg-white/10 backdrop-blur-sm p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-3 mb-3">
						<MapPin class="w-5 h-5 text-primary" />
						<p class="text-sm text-primary font-bold uppercase tracking-wide">Location</p>
					</div>
					<p class="text-white text-xl font-semibold">Kigali, Rwanda</p>
				</div>
			</div>
		</div>

		<!-- Bible Verse -->
		<div class="mt-16 text-center reveal">
			<div class="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-10 rounded-2xl border-2 border-primary shadow-xl">
				<p class="text-xl md:text-2xl text-foreground leading-relaxed italic mb-6">
					"For God did not send His Son into the world to condemn the world, but to save it. In Him, the captives are set free, the broken are healed, and all who come to Him find eternal life and peace."
				</p>
				<div class="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
				<p class="text-gray-600 font-bold text-base">— Adapted from John 3:17 & Luke 4:18</p>
			</div>
		</div>
	</div>
</div>
