

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/write/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BtzMJp7q.js","_app/immutable/chunks/DBbh6i71.js","_app/immutable/chunks/Gv26lf99.js","_app/immutable/chunks/By_quqKy.js","_app/immutable/chunks/BgmTWRyC.js"];
export const stylesheets = [];
export const fonts = [];
