'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Custom SplitText (replaces paid GSAP Club plugin) ───────────────────────

export function splitTextIntoSpans(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || '';
  element.textContent = '';
  const spans: HTMLSpanElement[] = [];

  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    element.appendChild(span);
    spans.push(span);
  });

  return spans;
}

// ─── Hero Title Reveal ────────────────────────────────────────────────────────

export function createHeroTimeline(container: HTMLElement) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set(container.querySelectorAll('.hero-animate'), { opacity: 1, y: 0 });
    return null;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 } });

  tl.from(container.querySelectorAll('.hero-title-char'), {
    y: 80,
    opacity: 0,
    rotateX: -40,
    stagger: 0.03,
    duration: 1.2,
    ease: 'expo.out',
  })
  .from(container.querySelectorAll('.hero-subtitle'), {
    y: 30,
    opacity: 0,
    duration: 0.8,
  }, '-=0.6')
  .from(container.querySelectorAll('.hero-cta'), {
    y: 20,
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
  }, '-=0.4')
  .from(container.querySelectorAll('.hero-badge'), {
    y: 15,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
  }, '-=0.3');

  return tl;
}

// ─── Section Reveal on Scroll ─────────────────────────────────────────────────

export function createScrollReveal(element: HTMLElement, options?: { delay?: number }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      end: 'top 50%',
      toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay: options?.delay || 0,
    ease: 'expo.out',
  });
}

// ─── Parallax Layer ───────────────────────────────────────────────────────────

export function createParallax(element: HTMLElement, speed: number = 0.5) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: () => speed * 100,
    ease: 'none',
  });
}

// ─── Stagger Cards Reveal ─────────────────────────────────────────────────────

export function createStaggerReveal(container: HTMLElement, selector: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(container.querySelectorAll(selector), { opacity: 1, y: 0 });
    return;
  }

  gsap.from(container.querySelectorAll(selector), {
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'expo.out',
  });
}

// ─── Cleanup helper ───────────────────────────────────────────────────────────

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
