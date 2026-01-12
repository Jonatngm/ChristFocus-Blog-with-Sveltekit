import { h as head, a as attr } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/authStore.js";
import "../../../chunks/supabase.js";
import { B as Button } from "../../../chunks/Button.js";
import { C as Cross } from "../../../chunks/cross.js";
import { X as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loading = false;
    let email = "";
    let password = "";
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Login - The Truth Hub</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4 py-12"><div class="w-full max-w-md border border-border/60 rounded-lg bg-card"><div class="text-center space-y-4 p-6"><div class="flex justify-center"><div class="bg-primary/10 p-3 rounded-full">`);
    Cross($$renderer2, { class: "w-8 h-8 text-primary" });
    $$renderer2.push(`<!----></div></div> <h1 class="text-2xl font-bold">Admin Access</h1> <p class="text-sm text-muted-foreground">${escape_html(
      "Sign in to manage content"
    )}</p></div> <div class="p-6">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<form class="space-y-4"><div class="space-y-2"><label for="email" class="text-sm font-medium">Email</label> <input id="email" type="email"${attr("value", email)} required class="w-full px-3 py-2 border rounded-md" placeholder="your@email.com"${attr("disabled", loading, true)}/></div> <div class="space-y-2"><label for="password" class="text-sm font-medium">Password</label> <input id="password" type="password"${attr("value", password)} required class="w-full px-3 py-2 border rounded-md" placeholder="••••••••"${attr("disabled", loading, true)}/></div> `);
      Button($$renderer2, {
        type: "submit",
        class: "w-full",
        disabled: loading,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html("Sign In")}`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="text-center text-sm"><button type="button" class="text-primary hover:underline">Need an account? Register</button></div></form>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
