<script lang="ts">
	import { Cross } from 'lucide-svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-gray-200 bg-black text-white mt-auto">
	<div class="container mx-auto px-4 py-12">
		<div class="flex flex-col items-center gap-4 text-center">
			<div class="flex items-center gap-2 text-primary">
				<Cross class="w-5 h-5" />
				<span class="font-bold text-lg">ChristFocus</span>
			</div>
			<p class="text-sm text-gray-400 italic max-w-md">
				"The Lord sets the captives free." — Psalm 146:7
			</p>
			<p class="text-xs text-gray-500">
				© {currentYear} Robert Ngemanyi. All rights reserved.
			</p>
		</div>
	</div>
</footer>
