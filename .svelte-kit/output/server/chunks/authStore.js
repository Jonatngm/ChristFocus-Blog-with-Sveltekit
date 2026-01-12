import { d as derived, w as writable } from "./index.js";
import { s as supabase } from "./supabase.js";
function mapSupabaseUser(user2) {
  return {
    id: user2.id,
    email: user2.email,
    username: user2.user_metadata?.username || user2.email.split("@")[0]
  };
}
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    loading: true
  });
  supabase.auth.getSession().then(({ data: { session } }) => {
    update((state) => ({
      user: session?.user ? mapSupabaseUser(session.user) : null,
      loading: false
    }));
  });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      update((state) => ({
        user: mapSupabaseUser(session.user),
        loading: false
      }));
    } else if (event === "SIGNED_OUT") {
      update((state) => ({
        user: null,
        loading: false
      }));
    } else if (event === "TOKEN_REFRESHED" && session?.user) {
      update((state) => ({
        user: mapSupabaseUser(session.user),
        loading: state.loading
      }));
    }
  });
  return {
    subscribe,
    login: (user2) => update((state) => ({ ...state, user: user2 })),
    logout: () => {
      supabase.auth.signOut();
      update((state) => ({ ...state, user: null }));
    },
    setLoading: (loading2) => update((state) => ({ ...state, loading: loading2 }))
  };
}
const authStore = createAuthStore();
derived(authStore, ($auth) => $auth.user);
derived(authStore, ($auth) => $auth.loading);
export {
  authStore as a
};
