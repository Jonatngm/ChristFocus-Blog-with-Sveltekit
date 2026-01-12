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

<header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
	<nav class="container mx-auto px-6 h-20 flex items-center justify-between">
		<a href="/" class="flex items-center gap-3 font-bold text-2xl group interactive">
			<div class="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-gold-dark/10 group-hover:from-primary/20 group-hover:to-gold-dark/20 transition-all">
				<Cross class="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
			</div>
			<span class="bg-gradient-to-r from-foreground via-primary to-gold-dark bg-clip-text text-transparent font-extrabold tracking-tight">ChristFocus</span>
		</a>

		<div class="flex items-center gap-8">
			<a
				href="/"
				class="text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/') ? 'text-primary' : 'text-foreground'}"
			>
				Home
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/') ? 'w-full' : ''}"></span>
			</a>
			<a
				href="/about"
				class="text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/about') ? 'text-primary' : 'text-foreground'}"
			>
				About
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/about') ? 'w-full' : ''}"></span>
			</a>
			<a
				href="/contact"
				class="text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/contact') ? 'text-primary' : 'text-foreground'}"
			>
				Contact
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/contact') ? 'w-full' : ''}"></span>
			</a>
			
			{#if user}
				<a
					href="/admin"
					class="text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/admin') ? 'text-primary' : 'text-foreground'}"
				>
					Admin
					<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/admin') ? 'w-full' : ''}"></span>
				</a>
				<Button
					variant="ghost"
					size="sm"
					on:click={handleLogout}
					class="text-base font-semibold text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
				>
					Logout
				</Button>
			{:else}
				<a href="/login">
					<Button class="bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold text-base px-6 py-2.5 rounded-lg transition-all duration-300 interactive elevated">
						Login
					</Button>
				</a>
			{/if}
		</div>
	</nav>
</header>
