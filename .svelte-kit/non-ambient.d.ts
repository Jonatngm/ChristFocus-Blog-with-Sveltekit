
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/admin/edit" | "/admin/edit/[id]" | "/admin/write" | "/contact" | "/login" | "/post" | "/post/[id]";
		RouteParams(): {
			"/admin/edit/[id]": { id: string };
			"/post/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/about": Record<string, never>;
			"/admin": { id?: string };
			"/admin/edit": { id?: string };
			"/admin/edit/[id]": { id: string };
			"/admin/write": Record<string, never>;
			"/contact": Record<string, never>;
			"/login": Record<string, never>;
			"/post": { id?: string };
			"/post/[id]": { id: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/edit" | "/admin/edit/" | `/admin/edit/${string}` & {} | `/admin/edit/${string}/` & {} | "/admin/write" | "/admin/write/" | "/contact" | "/contact/" | "/login" | "/login/" | "/post" | "/post/" | `/post/${string}` & {} | `/post/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/placeholder.svg" | "/robots.txt" | string & {};
	}
}