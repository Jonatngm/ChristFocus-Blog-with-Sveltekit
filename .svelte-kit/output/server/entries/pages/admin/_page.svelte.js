import { s as sanitize_props, j as spread_props, k as slot, h as head } from "../../../chunks/index2.js";
import "../../../chunks/supabase.js";
import { B as Button } from "../../../chunks/Button.js";
import "clsx";
import { I as Icon } from "../../../chunks/Icon.js";
function Circle_plus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M8 12h8" }],
    ["path", { "d": "M12 8v8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-plus" },
    $$sanitized_props,
    {
      /**
       * @component @name CirclePlus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNOCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik0xMiA4djgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-plus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {}, null);
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin Dashboard - The Truth Hub</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-background"><div class="container mx-auto px-4 py-8"><div class="flex items-center justify-between mb-8"><h1 class="text-3xl font-bold">Admin Dashboard</h1> <a href="/admin/write">`);
    Button($$renderer2, {
      children: ($$renderer3) => {
        Circle_plus($$renderer3, { class: "w-4 h-4 mr-2" });
        $$renderer3.push(`<!----> New Post`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></a></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
