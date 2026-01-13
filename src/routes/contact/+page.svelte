<script lang="ts">
	import { Mail, User, MapPin } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Contact - ChristFocus</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-3xl">
		<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-black mb-6 sm:mb-8 text-center tracking-tight leading-tight">
			Contact <span class="text-primary text-shadow-soft">Us</span>
		</h1>
		<div class="h-1 sm:h-1.5 w-24 sm:w-28 md:w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10 sm:mb-12 md:mb-16"></div>

		<div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-2xl border-t-4 border-primary interactive elevated">
			<div class="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
				<div class="p-3 sm:p-4 rounded-xl bg-primary/20 flex-shrink-0">
					<Mail class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-primary" />
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Get in Touch</h2>
			</div>
			
			<p class="text-gray-300 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg">
				Have questions or want to connect? Feel free to reach out to us. We'd love to hear from you.
			</p>
			
			<div class="space-y-5 sm:space-y-6">
				<div class="bg-white/10 backdrop-blur-sm p-5 sm:p-6 md:p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
						<User class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
						<p class="text-xs sm:text-sm text-primary font-bold uppercase tracking-wide">Name</p>
					</div>
					<p class="text-white text-lg sm:text-xl font-semibold break-words">Robert Ngemanyi Kabangu</p>
				</div>

				<div class="bg-white/10 backdrop-blur-sm p-5 sm:p-6 md:p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
						<Mail class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
						<p class="text-xs sm:text-sm text-primary font-bold uppercase tracking-wide">Email</p>
					</div>
					<a href="mailto:ngemanyir@gmail.com" class="text-white text-lg sm:text-xl font-semibold hover:text-primary transition-colors inline-flex items-center gap-2 group break-all">
						ngemanyir@gmail.com
						<span class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
					</a>
				</div>

				<div class="bg-white/10 backdrop-blur-sm p-5 sm:p-6 md:p-7 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
					<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
						<MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
						<p class="text-xs sm:text-sm text-primary font-bold uppercase tracking-wide">Location</p>
					</div>
					<p class="text-white text-lg sm:text-xl font-semibold">Kigali, Rwanda</p>
				</div>
			</div>
		</div>

		<!-- Bible Verse -->
		<div class="mt-10 sm:mt-12 md:mt-16 text-center">
			<div class="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 sm:p-8 md:p-10 rounded-2xl border-2 border-primary shadow-xl">
				<p class="text-lg sm:text-xl md:text-2xl text-gray-900 leading-relaxed italic mb-4 sm:mb-5 md:mb-6 px-2">
					"For God did not send His Son into the world to condemn the world, but to save it. In Him, the captives are set free, the broken are healed, and all who come to Him find eternal life and peace."
				</p>
				<div class="h-1 w-20 sm:w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-3 sm:mb-4"></div>
				<p class="text-gray-600 font-bold text-sm sm:text-base">— Adapted from John 3:17 & Luke 4:18</p>
			</div>
		</div>
	</div>
</div>
