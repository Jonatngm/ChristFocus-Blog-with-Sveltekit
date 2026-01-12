import { s as sanitize_props, j as spread_props, k as slot, h as head } from "../../../chunks/index2.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Mail($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "16", "x": "2", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "mail" },
    $$sanitized_props,
    {
      /**
       * @component @name Mail
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Im0yMiA3LTguOTcgNS43YTEuOTQgMS45NCAwIDAgMS0yLjA2IDBMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mail
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
function _page($$renderer) {
  head("1bv7ezn", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Contact - The Truth Hub</title>`);
    });
  });
  $$renderer.push(`<div class="min-h-screen bg-[#EBE3DB]"><div class="container mx-auto px-4 py-16 max-w-2xl"><h1 class="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">Contact Us</h1> <div class="bg-card p-8 rounded-lg border border-border/60"><div class="flex items-center gap-3 mb-6">`);
  Mail($$renderer, { class: "w-6 h-6 text-primary" });
  $$renderer.push(`<!----> <h2 class="text-xl font-semibold">Get in Touch</h2></div> <p class="text-foreground/90 leading-relaxed mb-4">Have questions or want to connect? Feel free to reach out to us.</p> <div class="space-y-4"><div><p class="text-sm text-muted-foreground mb-1">Email</p> <a href="mailto:victor@truthhub.blog" class="text-primary hover:underline">victor@truthhub.blog</a></div></div></div></div></div>`);
}
export {
  _page as default
};
