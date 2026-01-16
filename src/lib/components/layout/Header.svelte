<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { Cross, Menu, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let mobileMenuOpen = false;

	$: user = $authStore.user;
	$: currentPath = $page.url.pathname;

	function isActive(path: string) {
		return currentPath === path;
	}

	async function handleLogout() {
		try {
			authStore.logout();
			mobileMenuOpen = false;
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
	<nav class="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
		<a href="/" on:click={closeMenu} class="flex items-center gap-2 sm:gap-3 font-bold text-xl sm:text-2xl group interactive">
			<div class="relative p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary via-gold-dark to-primary/80 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
				<!-- Decorative outer glow -->
				<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/40 via-gold-dark/40 to-primary/40 blur-sm group-hover:blur-md transition-all"></div>
				<!-- Cross icon with shine effect -->
				<div class="relative">
					<Cross class="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" strokeWidth={3} />
					<!-- Shine overlay -->
					<div class="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
				</div>
			</div>
			<span class="bg-gradient-to-r from-foreground via-primary to-gold-dark bg-clip-text text-transparent font-extrabold tracking-tight">ChristFocus</span>
		</a>

		<!-- Mobile Menu Button -->
		<button
			on:click={toggleMenu}
			class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
			aria-label="Toggle menu"
		>
			{#if mobileMenuOpen}
				<X class="w-6 h-6 text-foreground" />
			{:else}
				<Menu class="w-6 h-6 text-foreground" />
			{/if}
		</button>

		<!-- Desktop Navigation -->
		<div class="hidden lg:flex items-center gap-6 xl:gap-8">
			<a
				href="/"
				class="text-sm xl:text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/') ? 'text-primary' : 'text-foreground'}"
			>
				Home
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/') ? 'w-full' : ''}"></span>
			</a>
			<a
				href="/about"
				class="text-sm xl:text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/about') ? 'text-primary' : 'text-foreground'}"
			>
				About
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/about') ? 'w-full' : ''}"></span>
			</a>
			<a
				href="/contact"
				class="text-sm xl:text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/contact') ? 'text-primary' : 'text-foreground'}"
			>
				Contact
				<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/contact') ? 'w-full' : ''}"></span>
			</a>
			
			{#if user}
				<a
					href="/admin"
					class="text-sm xl:text-base font-semibold transition-all duration-300 hover:text-primary relative group {isActive('/admin') ? 'text-primary' : 'text-foreground'}"
				>
					Admin
					<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full {isActive('/admin') ? 'w-full' : ''}"></span>
				</a>
				<Button
					variant="ghost"
					size="sm"
					on:click={handleLogout}
					class="text-sm xl:text-base font-semibold text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
				>
					Logout
				</Button>
			{:else}
				<a href="/login">
					<Button class="bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold text-sm xl:text-base px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg transition-all duration-300 interactive elevated">
						Login
					</Button>
				</a>
			{/if}
		</div>
	</nav>

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div class="lg:hidden border-t border-gray-200 bg-white/98 backdrop-blur-md">
			<div class="container mx-auto px-4 py-4 space-y-1">
				<a
					href="/"
					on:click={closeMenu}
					class="block px-4 py-3 text-base font-semibold rounded-lg transition-all {isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-gray-100'}"
				>
					Home
				</a>
				<a
					href="/about"
					on:click={closeMenu}
					class="block px-4 py-3 text-base font-semibold rounded-lg transition-all {isActive('/about') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-gray-100'}"
				>
					About
				</a>
				<a
					href="/contact"
					on:click={closeMenu}
					class="block px-4 py-3 text-base font-semibold rounded-lg transition-all {isActive('/contact') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-gray-100'}"
				>
					Contact
				</a>
				
				{#if user}
					<a
						href="/admin"
						on:click={closeMenu}
						class="block px-4 py-3 text-base font-semibold rounded-lg transition-all {isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-gray-100'}"
					>
						Admin
					</a>
					<button
						on:click={handleLogout}
						class="w-full text-left px-4 py-3 text-base font-semibold rounded-lg text-foreground hover:bg-gray-100 transition-all"
					>
						Logout
					</button>
				{:else}
					<a href="/login" on:click={closeMenu} class="block">
						<Button class="w-full bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold text-base px-4 py-3 rounded-lg transition-all duration-300">
							Login
						</Button>
					</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
