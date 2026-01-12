import { c as store_get, k as slot, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { a as authStore } from "../../../chunks/authStore.js";
import { g as goto } from "../../../chunks/client.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let user = store_get($$store_subs ??= {}, "$authStore", authStore).user;
    let loading = store_get($$store_subs ??= {}, "$authStore", authStore).loading;
    if (!loading && !user) {
      goto();
    }
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="min-h-screen flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (user) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
