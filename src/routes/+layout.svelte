<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<ModeWatcher />
<Toaster />

<div class="flex flex-col min-h-screen">
	<Header />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
