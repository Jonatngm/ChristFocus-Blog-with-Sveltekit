import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/services/supabase';
import type { AuthUser } from '$lib/types';
import type { User } from '@supabase/supabase-js';

function mapSupabaseUser(user: User): AuthUser {
	return {
		id: user.id,
		email: user.email!,
		username: user.user_metadata?.username || user.email!.split('@')[0]
	};
}

function createAuthStore() {
	const { subscribe, set, update } = writable<{
		user: AuthUser | null;
		loading: boolean;
	}>({
		user: null,
		loading: true
	});

	let initialized = false;

	// Initialize auth state
	const initAuth = async () => {
		try {
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Error getting session:', error);
			}

			update((state) => ({
				user: session?.user ? mapSupabaseUser(session.user) : null,
				loading: false
			}));

			initialized = true;
		} catch (error) {
			console.error('Error initializing auth:', error);
			update((state) => ({ ...state, loading: false }));
		}
	};

	// Initialize immediately
	initAuth();

	// Listen for auth state changes
	const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('Auth state changed:', event);
		
		if (event === 'SIGNED_IN' && session?.user) {
			update((state) => ({
				user: mapSupabaseUser(session.user),
				loading: false
			}));
		} else if (event === 'SIGNED_OUT') {
			update((state) => ({
				user: null,
				loading: false
			}));
		} else if (event === 'TOKEN_REFRESHED' && session?.user) {
			update((state) => ({
				user: mapSupabaseUser(session.user),
				loading: state.loading
			}));
		} else if (event === 'INITIAL_SESSION') {
			// Handle initial session on page load
			update((state) => ({
				user: session?.user ? mapSupabaseUser(session.user) : null,
				loading: false
			}));
		}
	});

	return {
		subscribe,
		login: (user: AuthUser) => update((state) => ({ ...state, user })),
		logout: () => {
			supabase.auth.signOut();
			update((state) => ({ ...state, user: null }));
		},
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading }))
	};
}

export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, ($auth) => $auth.user);
export const loading = derived(authStore, ($auth) => $auth.loading);
