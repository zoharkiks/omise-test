import Lenis from "lenis";
import confetti from "canvas-confetti";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger,SplitText);

// Export to window for inline components
window.gsap = gsap;
window.confetti = confetti;

initScripts();
function initSmoothScroll() {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function initScripts() {
  initSmoothScroll();
}
