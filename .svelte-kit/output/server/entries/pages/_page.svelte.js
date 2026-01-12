import { h as head } from "../../chunks/index2.js";
import "../../chunks/supabase.js";
import "clsx";
function Hero($$renderer) {
  $$renderer.push(`<div class="relative w-full min-h-screen overflow-hidden"><div class="absolute inset-0 bg-gradient-to-b from-[#8B7355] via-[#6B563F] to-background opacity-90"></div> <div class="relative container mx-auto px-4 py-8 md:py-16 h-full flex flex-col items-center justify-center"><div class="max-w-8xl w-full flex flex-col items-center"><img src="https://delighted-peach-bnqknau0kr.edgeone.app/photo_2026-01-05_05-27-49.jpg" alt="Truth Hub - Revealing the Cosmic Christ" class="w-full h-auto max-h-[90vh] object-contain drop-shadow-3xl transform transition-transform duration-700 hover:scale-100"/> <p class="mt-8 text-center text-xl md:text-2xl text-[#3C1414] italic max-w-2xl leading-relaxed">Welcome to the Truth Hub Blog, a Christocentric platform aimed to reveal the Cosmic Christ to all and in all aspects. We present to you the Gospel of Love, that will not only mend your Soul unto eternal Peace, but will give you a new definition of Life; an everlasting assurance of triumph in all things; through the Knowledge of Christ revealed to us!</p></div></div> <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>The Truth Hub - Revealing the Cosmic Christ</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-[#EBE3DB]">`);
    Hero($$renderer2);
    $$renderer2.push(`<!----> <div class="container mx-auto px-4 py-12 md:py-20">`);
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
