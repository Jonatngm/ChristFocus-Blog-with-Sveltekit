import { c as store_get, h as head, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/supabase.js";
import { X as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    head("1sv6dbf", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Loading...")} - The Truth Hub</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-[#EBE3DB]">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
