<script lang="ts">
	import { Cross } from 'lucide-svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t-2 border-gray-200 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white mt-auto">
	<div class="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
		<div class="flex flex-col items-center gap-5 sm:gap-6 text-center">
			<div class="flex items-center gap-2.5 sm:gap-3 text-primary group">
				<div class="p-2 sm:p-2.5 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-all">
					<Cross class="w-5 h-5 sm:w-6 sm:h-6" />
				</div>
				<span class="font-bold text-xl sm:text-2xl tracking-tight">ChristFocus</span>
			</div>
			<div class="max-w-xl px-4">
				<p class="text-base sm:text-lg text-gray-300 italic leading-relaxed mb-2">
					"The Lord sets the captives free."
				</p>
				<p class="text-xs sm:text-sm text-primary font-semibold">
					— Psalm 146:7
				</p>
			</div>
			<div class="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
			<p class="text-xs sm:text-sm text-gray-400 px-4">
				© {currentYear} Robert Ngemanyi Kabangu. All rights reserved.
			</p>
		</div>
	</div>
</footer>
