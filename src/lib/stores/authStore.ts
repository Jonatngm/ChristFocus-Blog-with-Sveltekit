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

	// Initialize auth state
	supabase.auth.getSession().then(({ data: { session } }) => {
		update((state) => ({
			user: session?.user ? mapSupabaseUser(session.user) : null,
			loading: false
		}));
	});

	// Listen for auth state changes
	supabase.auth.onAuthStateChange((event, session) => {
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
