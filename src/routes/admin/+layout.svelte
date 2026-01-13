<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Properly subscribe to store changes
	$: user = $authStore.user;
	$: loading = $authStore.loading;

	// Only redirect after mounting to avoid SSR issues
	onMount(() => {
		// Check auth state once component is mounted
		const unsubscribe = authStore.subscribe(state => {
			if (!state.loading && !state.user && browser) {
				goto('/login', { replaceState: true });
			}
		});

		return unsubscribe;
	});
</script>

{#if loading}
	<div class="min-h-screen flex items-center justify-center bg-white">
		<div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
	</div>
{:else if user}
	<slot />
{/if}
