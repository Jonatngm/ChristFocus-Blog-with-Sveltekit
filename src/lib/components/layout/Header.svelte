<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { Cross } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	$: user = $authStore.user;
	$: currentPath = $page.url.pathname;

	function isActive(path: string) {
		return currentPath === path;
	}

	async function handleLogout() {
		try {
			authStore.logout();
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<header class="sticky top-0 z-50 w-full border-b-2 border-gray-300 bg-gray-50 shadow-md">
	<nav class="container mx-auto px-6 h-20 flex items-center justify-between">
		<a href="/" class="flex items-center gap-3 font-bold text-2xl group">
			<Cross class="w-7 h-7 text-primary group-hover:text-gold-dark transition-colors" />
			<span class="bg-gradient-to-r from-black via-primary to-gold-dark bg-clip-text text-transparent">ChristFocus</span>
		</a>

		<div class="flex items-center gap-10">
			<a
				href="/"
				class="text-base font-semibold transition-all hover:text-primary hover:scale-105 {isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : 'text-black'}"
			>
				Home
			</a>
			<a
				href="/about"
				class="text-base font-semibold transition-all hover:text-primary hover:scale-105 {isActive('/about') ? 'text-primary border-b-2 border-primary pb-1' : 'text-black'}"
			>
				About
			</a>
			<a
				href="/contact"
				class="text-base font-semibold transition-all hover:text-primary hover:scale-105 {isActive('/contact') ? 'text-primary border-b-2 border-primary pb-1' : 'text-black'}"
			>
				Contact
			</a>
			
			{#if user}
				<a
					href="/admin"
					class="text-base font-semibold transition-all hover:text-primary hover:scale-105 {isActive('/admin') ? 'text-primary border-b-2 border-primary pb-1' : 'text-black'}"
				>
					Admin
				</a>
				<Button
					variant="ghost"
					size="sm"
					on:click={handleLogout}
					class="text-base font-semibold text-black hover:text-primary"
				>
					Logout
				</Button>
			{:else}
				<a href="/login">
					<Button class="bg-primary hover:bg-gold-dark text-black font-bold text-base px-6 py-2 shadow-lg hover:shadow-xl transition-all">
						Login
					</Button>
				</a>
			{/if}
		</div>
	</nav>
</header>
