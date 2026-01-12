export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["CNAME","favicon.ico","placeholder.svg","robots.txt"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.D9lbzO1k.js",app:"_app/immutable/entry/app.CACcRhFA.js",imports:["_app/immutable/entry/start.D9lbzO1k.js","_app/immutable/chunks/BwDTLcRc.js","_app/immutable/chunks/Gv26lf99.js","_app/immutable/chunks/Cf1ZQmKO.js","_app/immutable/chunks/9Wgh_Wd9.js","_app/immutable/entry/app.CACcRhFA.js","_app/immutable/chunks/Gv26lf99.js","_app/immutable/chunks/CGn5TYOr.js","_app/immutable/chunks/DXFmX2RM.js","_app/immutable/chunks/DBbh6i71.js","_app/immutable/chunks/9Wgh_Wd9.js","_app/immutable/chunks/L_eDHKqI.js","_app/immutable/chunks/YP0RaV8n.js","_app/immutable/chunks/Cf1ZQmKO.js","_app/immutable/chunks/CpS_KeO0.js","_app/immutable/chunks/uKDsRmDl.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/write",
				pattern: /^\/admin\/write\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/post/[id]",
				pattern: /^\/post\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
