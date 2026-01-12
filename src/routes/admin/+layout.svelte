<script lang="ts">
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let user = $authStore.user;
	let loading = $authStore.loading;

	$: if (browser && !loading && !user) {
		goto('/login');
	}
</script>

{#if loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
	</div>
{:else if user}
	<slot />
{/if}
