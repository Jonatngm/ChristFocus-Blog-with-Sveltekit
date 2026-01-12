<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import { Button } from '$lib/components/ui/button';
	import { Cross } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let loading = false;
	let step: 'login' | 'register' | 'otp' = 'login';
	
	let email = '';
	let password = '';
	let otp = '';
	let username = '';

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const user = await authService.signInWithPassword(email, password);
			authStore.login(authService.mapUser(user));
			goto('/admin');
		} catch (error: any) {
			if (error.message.includes('Invalid login credentials')) {
				toast.error('Invalid email or password');
			} else {
				toast.error(error.message || 'Login failed');
			}
			loading = false;
		}
	}

	async function handleSendOtp(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			await authService.sendOtp(email);
			toast.success('Verification code sent to your email');
			step = 'otp';
		} catch (error: any) {
			toast.error(error.message || 'Failed to send verification code');
		} finally {
			loading = false;
		}
	}

	async function handleRegister(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const user = await authService.verifyOtpAndSetPassword(email, otp, password, username);
			authStore.login(authService.mapUser(user));
			goto('/admin');
		} catch (error: any) {
			toast.error(error.message || 'Registration failed');
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - ChristFocus</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 py-12">
	<div class="w-full max-w-md border-2 border-gray-200 rounded-lg bg-white shadow-2xl">
		<div class="text-center space-y-4 p-8 border-b-2 border-primary">
			<div class="flex justify-center">
				<div class="bg-gradient-to-br from-primary to-gold-dark p-4 rounded-full shadow-lg">
					<Cross class="w-10 h-10 text-black" />
				</div>
			</div>
			<h1 class="text-3xl font-bold text-black">Admin Access</h1>
			<p class="text-sm text-gray-600">
				{step === 'login' ? 'Sign in to manage content' : step === 'register' ? 'Create your account' : 'Enter verification code'}
			</p>
		</div>
		
		<div class="p-8">
			{#if step === 'login'}
				<form on:submit={handleLogin} class="space-y-6">
					<div class="space-y-2">
						<label for="email" class="text-sm font-semibold text-black">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
							placeholder="your@email.com"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2">
						<label for="password" class="text-sm font-semibold text-black">Password</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
							placeholder="••••••••"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full bg-primary hover:bg-gold-dark text-black font-bold py-3 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign In'}
					</Button>
					<div class="text-center text-sm">
						<button
							type="button"
							on:click={() => step = 'register'}
							class="text-primary hover:text-gold-dark font-semibold"
						>
							Need an account? Register
						</button>
					</div>
				</form>
			{:else if step === 'register'}
				<form on:submit={handleSendOtp} class="space-y-6">
					<div class="space-y-2">
						<label for="reg-email" class="text-sm font-semibold text-black">Email</label>
						<input
							id="reg-email"
							type="email"
							bind:value={email}
							required
							class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
							placeholder="your@email.com"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full bg-primary hover:bg-gold-dark text-black font-bold py-3 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
						{loading ? 'Sending code...' : 'Send Verification Code'}
					</Button>
					<div class="text-center text-sm">
						<button
							type="button"
							on:click={() => step = 'login'}
							class="text-primary hover:underline"
						>
							Back to login
						</button>
					</div>
				</form>
			{:else}
				<form on:submit={handleRegister} class="space-y-4">
					<div class="space-y-2">
						<label for="username" class="text-sm font-medium text-foreground">Username</label>
						<input
							id="username"
							type="text"
							bind:value={username}
							required
							class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="username"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2">
						<label for="otp-code" class="text-sm font-medium text-foreground">Verification Code</label>
						<input
							id="otp-code"
							type="text"
							bind:value={otp}
							required
							class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="123456"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2">
						<label for="new-password" class="text-sm font-medium text-foreground">Password</label>
						<input
							id="new-password"
							type="password"
							bind:value={password}
							required
							class="w-full px-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="••••••••"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? 'Creating account...' : 'Complete Registration'}
					</Button>
				</form>
			{/if}
		</div>
	</div>
</div>
