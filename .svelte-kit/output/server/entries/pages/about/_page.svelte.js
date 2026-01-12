import { s as sanitize_props, j as spread_props, k as slot, h as head } from "../../../chunks/index2.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Book($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "book" },
    $$sanitized_props,
    {
      /**
       * @component @name Book
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDE5YTEgMSAwIDAgMSAxIDF2MThhMSAxIDAgMCAxLTEgMUg2LjVhMSAxIDAgMCAxIDAtNUgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/book
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
function Heart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "heart" },
    $$sanitized_props,
    {
      /**
       * @component @name Heart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/heart
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
  head("cwls5q", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>About - The Truth Hub</title>`);
    });
  });
  $$renderer.push(`<div class="min-h-screen bg-[#EBE3DB]"><div class="container mx-auto px-4 py-16 max-w-3xl"><h1 class="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">About The Truth Hub</h1> <div class="space-y-12"><section><div class="flex items-start gap-4 mb-4">`);
  Book($$renderer, { class: "w-8 h-8 text-primary flex-shrink-0 mt-1" });
  $$renderer.push(`<!----> <div><h2 class="text-2xl font-semibold text-foreground mb-4">Mission Statement</h2> <p class="text-foreground/90 leading-relaxed mb-4">We seek to establish a foundation of reality that is in agreement with the ultimate truth of
							God revealed to us through His Unconditional Love. A foundation that eliminates the
							dualistic illusion of the sacred and secular from our world-views, but presents all things
							reconciled "In Christ" and "As Christ."</p> <p class="text-foreground/90 leading-relaxed italic">"Now all things are of God, who has reconciled us to Himself through Jesus Christ, and has
							given us the ministry of reconciliation, that is, that God was in Christ reconciling the world to
							Himself, not imputing their trespasses to them, and has committed to us the word of
							reconciliation." 2 Corinthians 5:18-19</p></div></div></section> <section class="bg-[#DCCFC3] p-8 rounded-lg border border-border/60"><div class="flex items-start gap-4 mb-4">`);
  Heart($$renderer, { class: "w-8 h-8 text-primary flex-shrink-0 mt-1" });
  $$renderer.push(`<!----> <div><h2 class="text-2xl font-semibold text-foreground mb-4">About the Author</h2> <p class="text-foreground/90 leading-relaxed mb-4">Emmanuel Victor Mucyo, is a student of Christ that has a singular desire, "To know the truth,
							and make the truth known." Through a couple of years of study and prayer, he has been
							inspired by the Holy-Spirit to create this hub, a hub of truth, that fellow brethren might benefit
							from the knowledge of Christ given to him.</p> <p class="text-foreground/90 leading-relaxed italic">"The words you read here are beyond just written letters, they are spirit and substance.
							Every teaching comes as a piece of meal, thoughtfully woven from the corridors of eternity to
							bring enlightenment to any man that is willing to learn and accept change." - Emmanuel
							Mucyo</p></div></div></section> <section class="text-center py-8"><blockquote class="text-xl md:text-2xl font-light text-primary italic">"To them God willed to make known what are the riches of the glory of this mystery among the Gentiles: which is Christ in you, the hope of glory."</blockquote> <p class="text-muted-foreground mt-2">- Colossians 1:27 NKJV</p></section></div></div></div>`);
}
export {
  _page as default
};
