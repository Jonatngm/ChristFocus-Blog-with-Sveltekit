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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8 sm:py-12">
	<div class="w-full max-w-lg border-2 border-gray-200 rounded-2xl bg-white shadow-2xl interactive elevated">
		<div class="text-center space-y-4 sm:space-y-6 p-6 sm:p-8 md:p-10 border-b-2 border-primary bg-gradient-to-br from-primary/5 via-white to-primary/5">
			<div class="flex justify-center">
				<div class="bg-gradient-to-br from-primary to-gold-dark p-4 sm:p-5 rounded-2xl shadow-lg">
					<Cross class="w-10 h-10 sm:w-12 sm:h-12 text-black" />
				</div>
			</div>
			<h1 class="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">Admin Access</h1>
			<p class="text-sm sm:text-base text-gray-600 font-medium px-2">
				{step === 'login' ? 'Sign in to manage content' : step === 'register' ? 'Create your account' : 'Enter verification code'}
			</p>
		</div>
		
		<div class="p-6 sm:p-8 md:p-10">
			{#if step === 'login'}
				<form on:submit={handleLogin} class="space-y-5 sm:space-y-7">
					<div class="space-y-2 sm:space-y-3">
						<label for="email" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="your@email.com"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2 sm:space-y-3">
						<label for="password" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Password</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="••••••••"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 interactive elevated text-base sm:text-lg" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign In'}
					</Button>
					<div class="text-center text-sm">
						<button
							type="button"
							on:click={() => step = 'register'}
							class="text-primary hover:text-gold-dark font-bold transition-colors"
						>
							Need an account? Register
						</button>
					</div>
				</form>
			{:else if step === 'register'}
				<form on:submit={handleSendOtp} class="space-y-5 sm:space-y-7">
					<div class="space-y-2 sm:space-y-3">
						<label for="reg-email" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Email</label>
						<input
							id="reg-email"
							type="email"
							bind:value={email}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="your@email.com"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 interactive elevated text-base sm:text-lg" disabled={loading}>
						{loading ? 'Sending code...' : 'Send Verification Code'}
					</Button>
					<div class="text-center text-sm">
						<button
							type="button"
							on:click={() => step = 'login'}
							class="text-primary hover:text-gold-dark font-semibold transition-colors"
						>
							Back to login
						</button>
					</div>
				</form>
			{:else}
				<form on:submit={handleRegister} class="space-y-5 sm:space-y-6">
					<div class="space-y-2 sm:space-y-3">
						<label for="username" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Username</label>
						<input
							id="username"
							type="text"
							bind:value={username}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="username"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2 sm:space-y-3">
						<label for="otp-code" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Verification Code</label>
						<input
							id="otp-code"
							type="text"
							bind:value={otp}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="123456"
							disabled={loading}
						/>
					</div>
					<div class="space-y-2 sm:space-y-3">
						<label for="new-password" class="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">Password</label>
						<input
							id="new-password"
							type="password"
							bind:value={password}
							required
							class="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl bg-white text-black placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 text-base sm:text-lg"
							placeholder="••••••••"
							disabled={loading}
						/>
					</div>
					<Button type="submit" class="w-full bg-gradient-to-r from-primary to-gold-dark hover:from-gold-dark hover:to-primary text-black font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 interactive elevated text-base sm:text-lg" disabled={loading}>
						{loading ? 'Creating account...' : 'Complete Registration'}
					</Button>
				</form>
			{/if}
		</div>
	</div>
</div>
