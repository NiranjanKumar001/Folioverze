"use client";

import { useEffect, useState, type FormEvent } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    globalLenis: any;
  }
}

// Custom SplitText implementation to avoid requiring GSAP Club membership
class CustomSplitText {
  elements: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  chars: HTMLElement[] = [];

  constructor(target: any, options: { type?: string; linesClass?: string; charsClass?: string } = {}) {
    if (typeof target === 'string') {
      this.elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof HTMLElement) {
      this.elements = [target];
    } else if (target && target.length) {
      this.elements = Array.from(target);
    }

    const types = options.type || "lines";
    const doLines = types.includes("lines");
    const doChars = types.includes("chars");

    this.elements.forEach(el => {
      const originalText = el.textContent || "";
      if (!originalText.trim()) return; // nothing to split (e.g. image-only logo) — don't wipe children
      el.innerHTML = ""; // Clear

      if (doLines) {
        const wordsArr = originalText.split(/\s+/);
        const tempContainer = document.createElement("div");
        tempContainer.style.display = "inline";
        tempContainer.style.whiteSpace = "normal";

        const wordSpans = wordsArr.map(w => {
          const s = document.createElement("span");
          s.textContent = w + " ";
          s.style.display = "inline-block";
          tempContainer.appendChild(s);
          return s;
        });

        el.appendChild(tempContainer);

        const linesMap = new Map<number, HTMLElement[]>();
        wordSpans.forEach(span => {
          const top = span.offsetTop;
          if (!linesMap.has(top)) {
            linesMap.set(top, []);
          }
          linesMap.get(top)!.push(span);
        });

        el.removeChild(tempContainer);

        linesMap.forEach((spans) => {
          const lineDiv = document.createElement("div");
          lineDiv.className = options.linesClass || "line";

          if (doChars) {
            spans.forEach(wordSpan => {
              const wordText = wordSpan.textContent || "";
              wordText.split("").forEach(c => {
                const charSpan = document.createElement("span");
                charSpan.className = options.charsClass || "char";
                if (c === " ") {
                  charSpan.innerHTML = "&nbsp;";
                } else {
                  charSpan.textContent = c;
                }
                lineDiv.appendChild(charSpan);
                this.chars.push(charSpan);
              });
            });
          } else {
            const lineText = spans.map(s => s.textContent).join("").trim();
            const innerSpan = document.createElement("span");
            innerSpan.textContent = lineText;
            lineDiv.appendChild(innerSpan);
          }

          el.appendChild(lineDiv);
          this.lines.push(lineDiv);
        });

      } else if (doChars) {
        originalText.split("").forEach(c => {
          const charSpan = document.createElement("span");
          charSpan.className = options.charsClass || "char";
          if (c === " ") {
            charSpan.innerHTML = "&nbsp;";
          } else {
            charSpan.textContent = c;
          }
          el.appendChild(charSpan);
          this.chars.push(charSpan);
        });
      }
    });
  }

  revert() {
    // Revert logic
  }
}

export default function Home() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const openQuote = () => {
    setFormStatus("idle");
    setQuoteOpen(true);
  };

  // Web3Forms — no backend needed. Key is public by design (fine to hardcode).
  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "5d25a5e3-bef3-408d-a6f7-eaae062f5583");
    setFormStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  // Modal open/close side-effects: lock scroll (Lenis + body) and close on Escape.
  useEffect(() => {
    if (!quoteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuoteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.globalLenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.globalLenis?.start();
      document.body.style.overflow = "";
    };
  }, [quoteOpen]);

  useEffect(() => {
    // Register plugins
    gsap.registerPlugin(Flip, Draggable, ScrollTrigger);

    window.scrollTo(0, 0);

    const setupTextSplitting = () => {
      const textElements = document.querySelectorAll(
        ".hero h1, .hero h2, .hero p, .hero a:not(.cta a):not(.logo), .header h1, .site-info p"
      );

      textElements.forEach((element) => {
        new CustomSplitText(element, {
          type: "lines",
          linesClass: "line",
        });

        const lines = element.querySelectorAll(".line");

        lines.forEach((line) => {
          const textContent = line.textContent;
          line.innerHTML = `<span>${textContent}</span>`;
        });

        gsap.set(element, { opacity: 1 });
      });
    };

    const createCounterDigits = () => {
      // Idempotent: clear first so hot-reload / StrictMode re-runs don't stack duplicate digits
      // (duplicates break the counter's travel distance and freeze the intro loader).
      document.querySelectorAll(".counter-1, .counter-2, .counter-3").forEach((c) => {
        c.innerHTML = "";
      });

      const counter1 = document.querySelector(".counter-1");
      if (counter1) {
        const num0 = document.createElement("div");
        num0.className = "num";
        num0.textContent = "0";
        counter1.appendChild(num0);

        const num1 = document.createElement("div");
        num1.className = "num num1offset1";
        num1.textContent = "1";
        counter1.appendChild(num1);
      }

      const counter2 = document.querySelector(".counter-2");
      if (counter2) {
        for (let i = 0; i <= 10; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = i === 1 ? "num num1offset2" : "num";
          numDiv.textContent = i === 10 ? "0" : String(i);
          counter2.appendChild(numDiv);
        }
      }

      const counter3 = document.querySelector(".counter-3");
      if (counter3) {
        for (let i = 0; i < 30; i++) {
          const numDiv = document.createElement("div");
          numDiv.className = "num";
          numDiv.textContent = String(i % 10);
          counter3.appendChild(numDiv);
        }
        const finalNum = document.createElement("div");
        finalNum.className = "num";
        finalNum.textContent = "0";
        counter3.appendChild(finalNum);
      }
    };

    const animateCounter = (counter: HTMLElement | null, duration: number, delay = 0) => {
      if (!counter) return;
      const firstNum = counter.querySelector(".num");
      if (!firstNum) return;
      const numHeight = firstNum.clientHeight;
      const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;

      gsap.to(counter, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
      });
    };

    function animateImages() {
      const images = document.querySelectorAll(".img");
      images.forEach((img) => {
        img.classList.remove("animate-out");
      });

      const state = Flip.getState(images);
      images.forEach((img) => img.classList.add("animate-out"));

      const mainTimeline = gsap.timeline();
      mainTimeline.add(
        Flip.from(state, {
          duration: 1,
          stagger: 0.1,
          ease: "power3.inOut",
        })
      );

      images.forEach((img, index) => {
        const scaleTimeline = gsap.timeline();
        scaleTimeline
          .to(
            img,
            {
              scale: 2.5,
              duration: 0.45,
              ease: "power3.in",
            },
            0.025
          )
          .to(
            img,
            {
              scale: 1,
              duration: 0.45,
              ease: "power3.out",
            },
            0.5
          );

        mainTimeline.add(scaleTimeline, index * 0.1);
      });

      return mainTimeline;
    }

    // Run setup immediately
    setupTextSplitting();
    createCounterDigits();

    animateCounter(document.querySelector(".counter-3"), 2.5);
    animateCounter(document.querySelector(".counter-2"), 3);
    animateCounter(document.querySelector(".counter-1"), 2, 1.5);

    const tl = gsap.timeline();
    gsap.set(".img", { scale: 0 });

    tl.to(".hero-bg", {
      scaleY: "100%",
      duration: 3,
      ease: "power2.inOut",
      delay: 0.25,
    });

    tl.to(
      ".img",
      {
        scale: 1,
        duration: 1,
        stagger: 0.125,
        ease: "power3.out",
      },
      "<"
    );

    tl.to(".counter", {
      opacity: 0,
      duration: 0.3,
      ease: "power3.out",
      delay: 0.3,
      onStart: () => {
        animateImages();
      },
    });

    tl.to(
      ".logo",
      {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      },
      "+=1.8"
    );

    tl.to(
      [".links a span", ".links p span", ".cta a"],
      {
        y: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      },
      "<+=0.2"
    );

    tl.to(
      ".links",
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onStart: () => {
          initNavPill();
        }
      },
      "<"
    );

    tl.to(
      ".video-bg",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      [".header span", ".site-info span"],
      {
        y: "0%",
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      },
      "<+=0.2"
    );

    tl.eventCallback("onComplete", () => {
      initInteractiveFeatures();
      initScrollAnimations();
    });

    // ----------------------------------------------------
    // Interactive & Scroll Animations
    // ----------------------------------------------------
    let mouseMoveHandler: any = null;
    let clockInterval: any = null;
    let lenisInstance: any = null;
    let tickerFollowerFn: any = null;
    let tickerSliderFn: any = null;
    let tickerLenisFn: any = null;
    let tickerMarqueeFn: any = null;

    const initInteractiveFeatures = () => {
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const cursor = document.querySelector(".custom-cursor");
      const follower = document.querySelector(".custom-cursor-follower");
      const followerText = follower ? follower.querySelector(".follower-text") : null;

      if (!isTouchDevice) {
        document.body.classList.add("custom-cursor-active");

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        mouseMoveHandler = (e: MouseEvent) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          gsap.set(cursor, { x: mouseX, y: mouseY });
        };
        window.addEventListener("mousemove", mouseMoveHandler);

        tickerFollowerFn = () => {
          const dt = 1.0 - Math.exp(-gsap.ticker.deltaRatio() * 0.12);
          const currentX = (gsap.getProperty(follower, "x") as number) || mouseX;
          const currentY = (gsap.getProperty(follower, "y") as number) || mouseY;

          const nextX = currentX + (mouseX - currentX) * dt;
          const nextY = currentY + (mouseY - currentY) * dt;

          const dx = nextX - currentX;
          const dy = nextY - currentY;
          const speed = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;

          const scaleX = 1 + Math.min(speed * 0.04, 0.4);
          const scaleY = 1 - Math.min(speed * 0.04, 0.25);

          gsap.set(follower, {
            x: nextX,
            y: nextY,
            rotation: angle,
            scaleX: scaleX,
            scaleY: scaleY
          });

          gsap.set(followerText, {
            rotation: -angle
          });
        };

        gsap.ticker.add(tickerFollowerFn);

        const setupHover = (selectors: string, bodyClass: string, text?: string) => {
          document.querySelectorAll(selectors).forEach((el) => {
            el.addEventListener("mouseenter", () => {
              document.body.classList.add(bodyClass);
              if (text && followerText) followerText.textContent = text;
            });
            el.addEventListener("mouseleave", () => {
              document.body.classList.remove(bodyClass);
              if (text && followerText) followerText.textContent = "drag";
            });
          });
        };

        setupHover("a, button, .magnetic", "hovering-link");
        setupHover(".img", "hovering-image", "zoom");

        document.querySelectorAll(".magnetic").forEach((el) => {
          el.addEventListener("mousemove", magneticMove);
          el.addEventListener("mouseleave", magneticLeave);

          function magneticMove(e: Event) {
            const mouseEvent = e as MouseEvent;
            const rect = el.getBoundingClientRect();
            const x = mouseEvent.clientX - (rect.left + rect.width / 2);
            const y = mouseEvent.clientY - (rect.top + rect.height / 2);
            gsap.to(el, {
              x: x * 0.35,
              y: y * 0.35,
              duration: 0.3,
              ease: "power2.out"
            });
          }

          function magneticLeave() {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)"
            });
          }
        });

        const tiltMove = (e: MouseEvent) => {
          const normX = (e.clientX / window.innerWidth) - 0.5;
          const normY = (e.clientY / window.innerHeight) - 0.5;
          gsap.to(".header, .site-info", {
            x: normX * 25,
            y: normY * 25,
            duration: 1,
            ease: "power2.out"
          });
        };
        window.addEventListener("mousemove", tiltMove);
      }

      let isZoomed = false;
      const viewer = document.querySelector(".fullscreen-viewer");
      const viewerContent = viewer?.querySelector(".viewer-content");
      const viewerTitle = viewer?.querySelector(".viewer-title");
      const viewerHelp = viewer?.querySelector(".viewer-help");
      const imagesContainer = document.querySelector(".images-container");
      const allImages = Array.from(document.querySelectorAll(".img")) as HTMLElement[];

      const IMAGE_TITLES = [
        "Clear Gaze", "Wild Essence", "Silent Canopy", "Ethereal Shadow", "Urban Oasis",
        "Serene Drift", "Crimson Peak", "Velvet Rhythm", "Rust Decadence", "Solar Wind",
        "Sublime Aura", "Golden Horizon", "Neon Dream", "Mystic Crest", "Arctic Silence"
      ];

      let sliderTargetProgress = 0;
      let sliderCurrentProgress = 0;

      const updateSliderPosition = (progress: number) => {
        if (!viewerTitle) return;
        const N = allImages.length;
        const halfN = N / 2;
        const R = Math.max(window.innerHeight * 0.9, 700);
        const angleStep = 24;

        allImages.forEach((img, idx) => {
          const diff = idx - progress;
          const offset = ((diff + halfN) % N + N) % N - halfN;
          const angle = offset * angleStep;
          const angleRad = angle * Math.PI / 180;
          const x = Math.sin(angleRad) * R;
          const y = (1 - Math.cos(angleRad)) * R;

          gsap.set(img, {
            x: x,
            y: y,
            rotation: angle,
            scale: 1 - Math.min(Math.abs(offset) * 0.08, 0.35),
            opacity: Math.max(1 - Math.abs(offset) * 0.35, 0),
            zIndex: Math.round(100 - Math.abs(offset)),
            pointerEvents: Math.abs(offset) < 0.5 ? "all" : "none"
          });
        });

        const roundedIndex = Math.round(progress);
        const wrappedIndex = (roundedIndex % N + N) % N;
        const targetTitle = IMAGE_TITLES[wrappedIndex] || "Creative Design";

        if (viewerTitle.textContent !== targetTitle) {
          gsap.killTweensOf(viewerTitle);
          gsap.set(viewerTitle, { y: 0, skewY: 0, opacity: 1 });

          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_#X?/*[]";
          const targetLength = targetTitle.length;
          const state = { progress: 0 };

          gsap.to(state, {
            progress: 1,
            duration: 0.3,
            ease: "power2.out",
            onUpdate: () => {
              let output = "";
              const decryptedCount = Math.floor(state.progress * targetLength);
              for (let i = 0; i < targetLength; i++) {
                if (i < decryptedCount) {
                  output += targetTitle[i];
                } else {
                  if (targetTitle[i] === " ") {
                    output += " ";
                  } else {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    output += randomChar;
                  }
                }
              }
              viewerTitle.textContent = output;
            },
            onComplete: () => {
              viewerTitle.textContent = targetTitle;
            }
          });
        }
      };

      tickerSliderFn = () => {
        if (!isZoomed) return;
        const diff = sliderTargetProgress - sliderCurrentProgress;
        if (Math.abs(diff) > 0.001) {
          sliderCurrentProgress += diff * 0.12;
          updateSliderPosition(sliderCurrentProgress);
        } else if (sliderCurrentProgress !== sliderTargetProgress) {
          sliderCurrentProgress = sliderTargetProgress;
          updateSliderPosition(sliderCurrentProgress);
        }
      };

      gsap.ticker.add(tickerSliderFn);

      const handleWheel = (e: WheelEvent) => {
        if (!isZoomed) return;
        e.preventDefault();
        const delta = Math.max(-0.5, Math.min(0.5, e.deltaY * 0.003));
        sliderTargetProgress += delta;
      };

      viewer?.addEventListener("wheel", handleWheel as any, { passive: false });

      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartProgress = 0;

      const handleDragStart = (e: any) => {
        if (!isZoomed) return;
        isDragging = true;
        const isTouch = e.touches && e.touches.length > 0;
        if (isTouch) {
          e.preventDefault();
          dragStartY = e.touches[0].clientY;
        } else {
          dragStartX = e.clientX;
        }
        dragStartProgress = sliderTargetProgress;
        document.body.classList.add("hovering-image");
        if (followerText) followerText.textContent = "spin";
      };

      const handleDragMove = (e: any) => {
        if (!isDragging || !isZoomed) return;
        const isTouch = e.touches && e.touches.length > 0;
        let deltaProgress = 0;
        if (isTouch) {
          e.preventDefault();
          const currentY = e.touches[0].clientY;
          const dy = currentY - dragStartY;
          deltaProgress = -dy / 200;
        } else {
          const currentX = e.clientX;
          const dx = currentX - dragStartX;
          deltaProgress = -dx / 250;
        }
        sliderTargetProgress = dragStartProgress + deltaProgress;
      };

      const handleDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove("hovering-image");
        if (followerText) followerText.textContent = "drag";
        sliderTargetProgress = Math.round(sliderTargetProgress);
      };

      viewerContent?.addEventListener("mousedown", handleDragStart);
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);

      viewerContent?.addEventListener("touchstart", handleDragStart, { passive: false });
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);

      allImages.forEach((img, idx) => {
        let lastTap = 0;
        const openSlider = (e?: any) => {
          if (e) e.preventDefault();
          if (isZoomed) return;
          isZoomed = true;

          const state = Flip.getState(allImages);
          allImages.forEach(image => {
            viewerContent?.appendChild(image);
          });

          if (window.globalLenis) window.globalLenis.stop();
          document.body.style.overflow = "hidden";
          viewer?.classList.add("active");

          sliderTargetProgress = idx;
          sliderCurrentProgress = idx;
          updateSliderPosition(idx);

          Flip.from(state, {
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.015,
            absolute: true,
            onComplete: () => {
              gsap.to([viewerTitle, viewerHelp], {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.5,
                ease: "power3.out"
              });
            }
          });

          document.body.classList.remove("hovering-image");
          document.body.classList.add("hovering-link");
          if (followerText) followerText.textContent = "close";
        };

        img.addEventListener("dblclick", openSlider);
        img.addEventListener("touchend", (e) => {
          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;
          if (tapLength > 0 && tapLength < 400) {
            openSlider(e);
          }
          lastTap = currentTime;
        });
      });

      const closeViewer = () => {
        if (!isZoomed) return;
        gsap.killTweensOf([viewerTitle, viewerHelp]);
        gsap.to([viewerTitle, viewerHelp], {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });

        const state = Flip.getState(allImages);
        allImages.forEach(img => {
          imagesContainer?.appendChild(img);
        });

        gsap.set(allImages, { clearProps: "all" });
        isZoomed = false;
        viewer?.classList.remove("active");

        Flip.from(state, {
          duration: 0.85,
          ease: "power3.inOut",
          absolute: true
        });

        document.body.classList.remove("hovering-link");
        if (followerText) followerText.textContent = "drag";

        if (window.globalLenis) window.globalLenis.start();
        document.body.style.overflow = "";
      };

      viewer?.querySelector(".viewer-bg")?.addEventListener("click", closeViewer);
      viewer?.querySelector(".viewer-close")?.addEventListener("click", closeViewer);
    };

    const initNavPill = () => {
      const linksContainer = document.querySelector(".links");
      if (!linksContainer) return;
      const activePill = linksContainer.querySelector(".nav-active-pill");
      const links = linksContainer.querySelectorAll("a");
      let isScrollingNav = false;

      const updatePill = (targetEl: HTMLElement) => {
        if (!targetEl || !activePill) return;
        const left = targetEl.offsetLeft;
        const width = targetEl.offsetWidth;
        gsap.to(activePill, {
          x: left,
          width: width,
          duration: 0.45,
          ease: "power3.out"
        });
      };

      const activeLink = (linksContainer.querySelector("a.active") || links[0]) as HTMLElement;
      if (activeLink) {
        gsap.set(activePill, {
          x: activeLink.offsetLeft,
          width: activeLink.offsetWidth
        });
      }

      links.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          isScrollingNav = true;
          links.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
          updatePill(link as HTMLElement);

          const targetId = link.getAttribute("href");
          if (targetId && targetId !== "#") {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              if (window.globalLenis) {
                window.globalLenis.scrollTo(targetEl, {
                  duration: 1.5,
                  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  onComplete: () => {
                    isScrollingNav = false;
                  }
                });
              } else {
                targetEl.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                  isScrollingNav = false;
                }, 1000);
              }
            } else {
              isScrollingNav = false;
            }
          } else {
            isScrollingNav = false;
          }
        });

        const targetId = link.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            ScrollTrigger.create({
              trigger: targetSection,
              start: "top 50%",
              end: "bottom 50%",
              onToggle: (self) => {
                if (isScrollingNav) return;
                if (self.isActive) {
                  links.forEach(l => l.classList.remove("active"));
                  link.classList.add("active");
                  updatePill(link as HTMLElement);
                }
              }
            });
          }
        }
      });

      window.addEventListener("resize", () => {
        const currentActive = (linksContainer.querySelector("a.active") || links[0]) as HTMLElement;
        updatePill(currentActive);
      });
    };

    const initScrollAnimations = () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";

      const lenis = new Lenis();
      lenisInstance = lenis;
      window.globalLenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      // Frosted bar behind the nav once scrolled, so the brand stays legible over dark sections
      const navEl = document.querySelector("nav");
      lenis.on("scroll", ({ scroll }: { scroll: number }) => {
        if (navEl) navEl.classList.toggle("scrolled", scroll > 80);
      });

      tickerLenisFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerLenisFn);
      gsap.ticker.lagSmoothing(0);

      const marqueeContent = document.querySelector(".marquee-content");
      if (marqueeContent) {
        let marqueeProgress = 0;
        tickerMarqueeFn = () => {
          marqueeProgress -= 0.05;
          if (marqueeProgress <= -25) {
            marqueeProgress = 0;
          }
          gsap.set(marqueeContent, { xPercent: marqueeProgress });
        };
        gsap.ticker.add(tickerMarqueeFn);
      }

      document.querySelectorAll(".section-heading").forEach((sectionHeading) => {
        const headingText = sectionHeading.querySelector(".reveal-text") as HTMLElement;
        const headingFade = sectionHeading.querySelector(".reveal-fade") as HTMLElement;
        if (!headingText) return;

        const splitHeading = new CustomSplitText(headingText, { type: "lines,chars", linesClass: "overflow-hidden" });
        gsap.set(splitHeading.chars, { y: "110%", rotationZ: 5 });
        if (headingFade) gsap.set(headingFade, { opacity: 0, y: 20 });

        const tlHeading = gsap.timeline({ paused: true });
        tlHeading.to(splitHeading.chars, {
          y: "0%",
          rotationZ: 0,
          duration: 1,
          stagger: 0.02,
          ease: "power4.out"
        });
        if (headingFade) {
          tlHeading.to(headingFade, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
        }

        ScrollTrigger.create({
          trigger: sectionHeading,
          start: "top 80%",
          animation: tlHeading,
          toggleActions: "play none none reverse"
        });
      });

      gsap.utils.toArray(".work-item").forEach((item: any) => {
        const img = item.querySelector(".work-item-img");
        const nameH1 = item.querySelector(".work-item-name h1");
        if (!nameH1 || !img) return;

        const split = new CustomSplitText(nameH1, { type: "chars" });
        gsap.set(nameH1, { overflow: "hidden" });
        gsap.set(split.chars, { y: "150%" });

        const tlText = gsap.timeline({ paused: true });
        tlText.to(nameH1, {
          "--bg-scale": 1,
          duration: 0.7,
          ease: "power4.inOut"
        });
        tlText.to(split.chars, {
          y: "0%",
          duration: 0.8,
          stagger: 0.04,
          ease: "power4.out",
        }, "-=0.3");

        ScrollTrigger.create({
          trigger: nameH1,
          start: "top 85%",
          animation: tlText,
          toggleActions: "play none none reverse"
        });

        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "center center",
          scrub: true,
          animation: gsap.fromTo(img,
            { clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" }
          ),
        });

        ScrollTrigger.create({
          trigger: item,
          start: "center center",
          end: "bottom top",
          scrub: true,
          animation: gsap.fromTo(img,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
          ),
        });
      });

      const cards = document.querySelectorAll(".sticky-cards .card");
      if (cards.length > 0) {
        const totalCards = cards.length;
        const cardYOffset = 15;
        const cardScaleStep = 0.08;

        cards.forEach((card, i) => {
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50 + i * cardYOffset,
            scale: 1 - i * cardScaleStep,
            zIndex: totalCards - i,
          });
        });

        const tlCards = gsap.timeline({
          scrollTrigger: {
            trigger: ".sticky-cards",
            start: "top top",
            end: `+=${window.innerHeight * 3}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(".services-timeline .timeline-progress", { height: `${progress * 100}%` });
              let activeIndex = 0;
              if (progress < 0.25) activeIndex = 0;
              else if (progress < 0.58) activeIndex = 1;
              else if (progress < 0.90) activeIndex = 2;
              else activeIndex = 3;

              document.querySelectorAll(".services-sidebar .sidebar-pill").forEach((pill, i) => {
                pill.classList.toggle("active", i === activeIndex);
              });
              document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
                dot.classList.toggle("active", i === activeIndex);
              });
            }
          }
        });

        for (let i = 0; i < totalCards - 1; i++) {
          const stepLabel = `step-${i}`;
          tlCards.add(stepLabel);

          tlCards.to(cards[i], {
            yPercent: -220,
            rotationX: 35,
            scale: 0.9,
            ease: "power1.inOut",
            duration: 1
          }, stepLabel);

          for (let j = i + 1; j < totalCards; j++) {
            const behindIndex = j - i;
            const targetY = -50 + (behindIndex - 1) * cardYOffset;
            const targetScale = 1 - (behindIndex - 1) * cardScaleStep;
            tlCards.to(cards[j], {
              yPercent: targetY,
              scale: targetScale,
              ease: "power1.inOut",
              duration: 1
            }, stepLabel);
          }
        }

        const handleIndicatorClick = (index: number) => {
          const trigger = tlCards.scrollTrigger;
          if (trigger) {
            const scrollStart = trigger.start;
            const targetScroll = scrollStart + index * window.innerHeight;
            if (window.globalLenis) {
              window.globalLenis.scrollTo(targetScroll, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetScroll, behavior: "smooth" });
            }
          }
        };

        document.querySelectorAll(".services-sidebar .sidebar-pill").forEach((pill, i) => {
          pill.setAttribute("style", "cursor: pointer");
          pill.addEventListener("click", () => handleIndicatorClick(i));
        });

        document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
          dot.setAttribute("style", "cursor: pointer");
          dot.addEventListener("click", () => handleIndicatorClick(i));
        });
      }

      const backToTopBtn = document.getElementById("back-to-top-btn");
      if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
          if (window.globalLenis) {
            window.globalLenis.scrollTo(0, {
              duration: 2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }

      // Footer "Explore" links → smooth-scroll to the section (like the nav pill).
      document.querySelectorAll<HTMLAnchorElement>('.footer-nav a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
          const targetId = link.getAttribute("href");
          if (!targetId || targetId === "#") return;
          const targetEl = document.querySelector(targetId);
          if (!targetEl) return;
          e.preventDefault();
          if (window.globalLenis) {
            window.globalLenis.scrollTo(targetEl, {
              duration: 1.5,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        });
      });

      const tokyoTimeEl = document.getElementById("tokyo-time");
      const londonTimeEl = document.getElementById("london-time");
      if (tokyoTimeEl && londonTimeEl) {
        const updateTimes = () => {
          const now = new Date();
          tokyoTimeEl.textContent = now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
          londonTimeEl.textContent = now.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
        };
        updateTimes();
        clockInterval = setInterval(updateTimes, 1000);
      }

      const dividerDots = document.querySelector(".section-intersection-divider .divider-dots");
      if (dividerDots) {
        gsap.to(dividerDots, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".section-intersection-divider",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // The nav active-tab triggers (initNavPill) were created during the intro,
      // before the pinned Services section existed — so their positions are stale.
      // Recompute all ScrollTrigger positions now that pinning/layout is finalized.
      ScrollTrigger.refresh();
    };

    return () => {
      if (mouseMoveHandler) window.removeEventListener("mousemove", mouseMoveHandler);
      if (clockInterval) clearInterval(clockInterval);
      if (tickerFollowerFn) gsap.ticker.remove(tickerFollowerFn);
      if (tickerSliderFn) gsap.ticker.remove(tickerSliderFn);
      if (tickerLenisFn) gsap.ticker.remove(tickerLenisFn);
      if (tickerMarqueeFn) gsap.ticker.remove(tickerMarqueeFn);
      if (lenisInstance) lenisInstance.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      // Kill the intro timeline so hot-reload / StrictMode re-mounts don't run
      // overlapping timelines that fight over the same elements.
      tl.kill();
    };
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="custom-cursor-follower"><span className="follower-text">drag</span></div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="counter">
          <div className="counter-1 digit"></div>
          <div className="counter-2 digit"></div>
          <div className="counter-3 digit"></div>
        </div>

        <div className="images-container">
          <div className="img"><img src="/img1.webp" alt="" /></div>
          <div className="img"><img src="/img2.webp" alt="" /></div>
          <div className="img"><img src="/img3.webp" alt="" /></div>
          <div className="img"><img src="/img4.webp" alt="" /></div>
          <div className="img"><img src="/img5.webp" alt="" /></div>
          <div className="img"><img src="/img6.webp" alt="" /></div>
          <div className="img"><img src="/img7.webp" alt="" /></div>
          <div className="img"><img src="/img8.webp" alt="" /></div>
          <div className="img"><img src="/img9.webp" alt="" /></div>
          <div className="img"><img src="/img10.webp" alt="" /></div>
          <div className="img"><img src="/img11.webp" alt="" /></div>
          <div className="img"><img src="/img12.webp" alt="" /></div>
          <div className="img"><img src="/img13.webp" alt="" /></div>
          <div className="img"><img src="/img14.webp" alt="" /></div>
          <div className="img"><img src="/img15.webp" alt="" /></div>
        </div>

        <nav>
          <div className="logo-group">
            <a href="https://www.folioverze.com/" className="logo magnetic" aria-label="Folioverze — home">
              <img src="/logo-mark.svg" alt="" className="logo-mark" />
              <span className="logo-word">olioverze</span>
            </a>
          </div>

          <div className="links">
            <div className="nav-active-pill"></div>
            <a href="#home" className="active">Home</a>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
          </div>

          <div className="cta magnetic">
            <a href="#" onClick={(e) => { e.preventDefault(); openQuote(); }}>
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
              <span>Contact us</span>
            </a>
          </div>
        </nav>

        <div className="hero-main-content">
          <div className="header">
            <h1>We build premium software, automations &amp; AI for growing businesses</h1>
          </div>

          <div className="site-info">
            <h2>A freelance software &amp; tech agency partnering with founders and teams to ship premium products — fast.</h2>
            <div className="site-info-copy">
              <p>Software &amp; AI Engineering</p>
              <p>EST. 2026 / ASSAM, INDIA</p>
            </div>
          </div>
        </div>

      </section>

      {/* Selected Works Section */}
      <div className="scroll-sections" id="work">
        <div className="marquee-strip">
          <div className="marquee-content">
            <span>FOLIOVERZE • SOFTWARE • AUTOMATION • AI • ASSAM • INDIA • </span>
            <span>FOLIOVERZE • SOFTWARE • AUTOMATION • AI • ASSAM • INDIA • </span>
            <span>FOLIOVERZE • SOFTWARE • AUTOMATION • AI • ASSAM • INDIA • </span>
            <span>FOLIOVERZE • SOFTWARE • AUTOMATION • AI • ASSAM • INDIA • </span>
          </div>
        </div>

        <div className="section-heading">
          <h2 className="reveal-text">SELECTED <br /> WORKS</h2>
          <p className="reveal-fade">(01) FEATURED PROJECT</p>
        </div>

        <section className="work-item">
          <a
            href="https://www.drokpa.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="work-item-link"
            aria-label="Drokpa — visit the live site (opens in a new tab)"
          >
            <div className="work-item-img">
              <img
                src="/work-drokpa.webp"
                alt="Drokpa travel platform homepage — snow-capped mountains in Arunachal Pradesh framed by prayer flags, with trek booking and itinerary tools"
              />
            </div>
            <div className="work-item-name">
              <h1>Drokpa</h1>
              <span className="work-item-meta">Travel &amp; Trek Platform ↗</span>
            </div>
          </a>
        </section>
      </div>

      {/* Section Divider */}
      <div className="section-intersection-divider" id="services">
        <div className="divider-dots"></div>
        <div className="section-heading">
          <h2 className="reveal-text">SERVICES &amp; <br /> EXPERTISE</h2>
          <p className="reveal-fade">(02) WHAT WE DO</p>
        </div>
      </div>

      {/* Services Section */}
      <section className="sticky-cards">
        <div className="services-bg-pattern"></div>

        {/* Left Floating Index */}
        <div className="services-sidebar">
          <div className="sidebar-pill active">01</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">02</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">03</div>
          <div className="sidebar-line"></div>
          <div className="sidebar-pill">04</div>
        </div>

        {/* Right Floating Progress Timeline */}
        <div className="services-timeline">
          <div className="timeline-track">
            <div className="timeline-progress"></div>
            <div className="timeline-dots-container">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        {/* Card 1 */}
        <div className="card" id="card-1">
          <div className="card-header">
            <h1>Premium Websites</h1>
            <div className="card-index">(01)</div>
          </div>

          <p className="card-desc">
            Your website is your first impression — and a slow, generic one quietly costs you customers. We design and build fast, high-end sites and web apps that load instantly, rank on Google, and turn visitors into paying customers.
          </p>
          <ul className="card-tags">
            <li>Next.js</li>
            <li>React</li>
            <li>SEO-ready</li>
            <li>Headless CMS</li>
            <li>Blazing fast</li>
            <li>Responsive</li>
          </ul>
          <div className="card-usecases">
            <span className="card-usecases-label">Where it helps</span>
            <ul>
              <li>Marketing sites &amp; landing pages that convert</li>
              <li>Web apps, dashboards &amp; customer portals</li>
              <li>Redesigns &amp; performance rescues for slow sites</li>
            </ul>
          </div>

          <div className="card-visual">
            <svg viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="6" width="202" height="138" rx="10" strokeWidth="2.5" />
              <path d="M4 32 H206" strokeWidth="2.5" />
              <circle cx="16" cy="19" r="2.5" fill="currentColor" stroke="none" />
              <circle cx="26" cy="19" r="2.5" fill="currentColor" stroke="none" />
              <circle cx="36" cy="19" r="2.5" fill="currentColor" stroke="none" />
              <rect x="74" y="15" width="116" height="8" rx="4" fill="currentColor" stroke="none" opacity="0.25" />
              <rect x="18" y="46" width="86" height="11" rx="3" fill="currentColor" stroke="none" opacity="0.9" />
              <rect x="18" y="63" width="128" height="9" rx="3" fill="currentColor" stroke="none" opacity="0.45" />
              <rect x="18" y="82" width="52" height="17" rx="8.5" fill="currentColor" stroke="none" />
              <rect x="18" y="110" width="54" height="26" rx="5" strokeWidth="2" />
              <rect x="79" y="110" width="54" height="26" rx="5" strokeWidth="2" />
              <rect x="140" y="110" width="54" height="26" rx="5" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" id="card-2">
          <div className="card-header">
            <h1>Automations &amp; Workflows</h1>
            <div className="card-index">(02)</div>
          </div>

          <p className="card-desc">
            Repetitive manual work quietly drains your team&apos;s hours and invites costly mistakes. We connect your tools and automate the busywork — from data entry to onboarding — so your people spend their time on what actually grows the business.
          </p>
          <ul className="card-tags">
            <li>n8n</li>
            <li>Zapier</li>
            <li>Make</li>
            <li>API integrations</li>
            <li>Data sync</li>
            <li>Webhooks</li>
          </ul>
          <div className="card-usecases">
            <span className="card-usecases-label">Where it helps</span>
            <ul>
              <li>Onboarding, offboarding &amp; approval flows</li>
              <li>Syncing CRM, spreadsheets &amp; databases</li>
              <li>Automated reports, invoices &amp; alerts</li>
            </ul>
          </div>

          <div className="card-visual">
            <svg viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="10" y="22" width="66" height="34" rx="9" strokeWidth="2.5" />
              <circle cx="27" cy="39" r="6" strokeWidth="2" />
              <rect x="40" y="36" width="28" height="6" rx="3" fill="currentColor" stroke="none" opacity="0.6" />
              <path d="M76 39 H104" strokeWidth="2.5" />
              <path d="M98 34 L104 39 L98 44" strokeWidth="2.5" />
              <rect x="104" y="22" width="66" height="34" rx="9" strokeWidth="2.5" />
              <circle cx="137" cy="39" r="8" strokeWidth="2" />
              <path d="M137 29 V33 M137 45 V49 M127 39 H131 M143 39 H147" strokeWidth="2" />
              <path d="M137 56 V78 H55 V90" strokeWidth="2.5" />
              <path d="M50 84 L55 90 L60 84" strokeWidth="2.5" />
              <rect x="22" y="90" width="66" height="34" rx="9" strokeWidth="2.5" />
              <path d="M35 107 H75" strokeWidth="2" opacity="0.55" />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" id="card-3">
          <div className="card-header">
            <h1>AI Integrations</h1>
            <div className="card-index">(03)</div>
          </div>

          <p className="card-desc">
            Everyone wants AI — but bolted on carelessly it hallucinates and erodes trust. We embed LLMs, chatbots, and AI features into your product and workflows, with the guardrails and testing to run them reliably in production.
          </p>
          <ul className="card-tags">
            <li>OpenAI</li>
            <li>LangChain</li>
            <li>RAG</li>
            <li>Chatbots</li>
            <li>Vector DBs</li>
            <li>Guardrails</li>
          </ul>
          <div className="card-usecases">
            <span className="card-usecases-label">Where it helps</span>
            <ul>
              <li>Support &amp; sales chatbots that actually help</li>
              <li>Search &amp; answers over your own documents</li>
              <li>AI copilots &amp; assistants inside your product</li>
            </ul>
          </div>

          <div className="card-visual">
            <svg viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="6" y="6" width="198" height="138" rx="10" strokeWidth="2.5" />
              <rect x="18" y="22" width="96" height="26" rx="13" strokeWidth="2" />
              <rect x="28" y="32" width="64" height="6" rx="3" fill="currentColor" stroke="none" opacity="0.55" />
              <rect x="96" y="58" width="96" height="26" rx="13" fill="currentColor" stroke="none" opacity="0.9" />
              <rect x="18" y="94" width="76" height="22" rx="11" strokeWidth="2" />
              <rect x="18" y="122" width="150" height="16" rx="8" strokeWidth="2" />
              <circle cx="184" cy="130" r="9" fill="currentColor" stroke="none" />
              <path d="M176 17 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 z" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" id="card-4">
          <div className="card-header">
            <h1>Internal Tools &amp; Platforms</h1>
            <div className="card-index">(04)</div>
          </div>

          <p className="card-desc">
            When your team runs the business on spreadsheets and manual steps, work breaks and nothing scales. We build custom dashboards, admin panels, and internal tools that replace the busywork with software your team actually enjoys using.
          </p>
          <ul className="card-tags">
            <li>Dashboards</li>
            <li>Admin panels</li>
            <li>Auth &amp; roles</li>
            <li>Reporting</li>
            <li>Integrations</li>
            <li>Real-time</li>
          </ul>
          <div className="card-usecases">
            <span className="card-usecases-label">Where it helps</span>
            <ul>
              <li>Operations, sales &amp; analytics dashboards</li>
              <li>Customer, order &amp; inventory management</li>
              <li>Role-based internal portals for your team</li>
            </ul>
          </div>

          <div className="card-visual">
            <svg viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="6" y="6" width="198" height="138" rx="10" strokeWidth="2.5" />
              <path d="M52 6 V144" strokeWidth="2.5" />
              <rect x="16" y="26" width="22" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.6" />
              <rect x="16" y="42" width="22" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.6" />
              <rect x="16" y="58" width="22" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.6" />
              <rect x="66" y="20" width="60" height="30" rx="5" strokeWidth="2" />
              <rect x="134" y="20" width="58" height="30" rx="5" strokeWidth="2" />
              <rect x="66" y="62" width="126" height="72" rx="5" strokeWidth="2" />
              <path d="M82 122 V104 M98 122 V90 M114 122 V110 M130 122 V82 M146 122 V98 M162 122 V86 M178 122 V106" strokeWidth="4" opacity="0.85" />
            </svg>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="info-section tech" id="tech">
        <div className="section-heading">
          <h2 className="reveal-text">TECH WE <br /> BUILD WITH</h2>
          <p className="reveal-fade">(03) STACK</p>
        </div>
        <div className="tech-groups">
          <div className="tech-group">
            <span className="tech-cat">Frontend</span>
            <ul className="tech-list">
              <li>React</li>
              <li>Next.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>GSAP</li>
            </ul>
          </div>
          <div className="tech-group">
            <span className="tech-cat">Backend &amp; Data</span>
            <ul className="tech-list">
              <li>Node.js</li>
              <li>Python</li>
              <li>PostgreSQL</li>
              <li>Supabase</li>
              <li>Prisma</li>
            </ul>
          </div>
          <div className="tech-group">
            <span className="tech-cat">AI &amp; Automation</span>
            <ul className="tech-list">
              <li>OpenAI</li>
              <li>LangChain</li>
              <li>n8n</li>
              <li>Zapier</li>
              <li>Vector DBs</li>
            </ul>
          </div>
          <div className="tech-group">
            <span className="tech-cat">Cloud &amp; Tools</span>
            <ul className="tech-list">
              <li>Vercel</li>
              <li>AWS</li>
              <li>Docker</li>
              <li>GitHub</li>
              <li>Figma</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="info-section process" id="process">
        <div className="section-heading">
          <h2 className="reveal-text">HOW WE <br /> WORK</h2>
          <p className="reveal-fade">(04) PROCESS</p>
        </div>
        <div className="process-grid">
          <div className="process-step">
            <span className="process-num">01</span>
            <h3>Discovery</h3>
            <p>We map your goals, users, and constraints, then scope the smallest thing that delivers real value.</p>
          </div>
          <div className="process-step">
            <span className="process-num">02</span>
            <h3>Design</h3>
            <p>From flows to polished UI — we design the experience before a line of production code is written.</p>
          </div>
          <div className="process-step">
            <span className="process-num">03</span>
            <h3>Build</h3>
            <p>We ship in tight iterations with clean, documented code you fully own — no black boxes.</p>
          </div>
          <div className="process-step">
            <span className="process-num">04</span>
            <h3>Launch &amp; Support</h3>
            <p>We deploy, monitor, and stay on to iterate and improve. No hand-off cliff.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="info-section about" id="about">
        <div className="section-heading">
          <h2 className="reveal-text">WHO WE <br /> ARE</h2>
          <p className="reveal-fade">(05) STUDIO</p>
        </div>
        <div className="about-body">
          <p className="about-lead">
            Folioverze is a lean software &amp; tech studio based in Assam, India. We partner with founders and teams to turn ideas into fast, reliable products — websites, automations, AI features, and the internal tools that keep a business running.
          </p>
          <p className="about-sub">
            We keep the team small on purpose: senior hands on every project, direct communication, and no unnecessary layers between you and the people building your product.
          </p>
          <div className="about-stats">
            <div className="about-stat"><span className="stat-num">24h</span><span className="stat-label">Response time</span></div>
            <div className="about-stat"><span className="stat-num">100%</span><span className="stat-label">Code ownership</span></div>
            <div className="about-stat"><span className="stat-num">Global</span><span className="stat-label">Clients served</span></div>
            <div className="about-stat"><span className="stat-num">2026</span><span className="stat-label">Established</span></div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="info-section pricing" id="pricing">
        <div className="section-heading">
          <h2 className="reveal-text">HOW TO <br /> WORK WITH US</h2>
          <p className="reveal-fade">(06) ENGAGEMENT</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Project</h3>
            <p className="pricing-desc">Fixed-scope builds with a clear timeline and price. Best for a defined website, tool, or feature.</p>
            <ul className="pricing-list">
              <li>Scoped deliverables</li>
              <li>Fixed timeline &amp; quote</li>
              <li>Design + build + launch</li>
            </ul>
            <span className="pricing-note">Fixed scope &amp; timeline</span>
          </div>
          <div className="pricing-card featured">
            <span className="pricing-tag">Most popular</span>
            <h3>Retainer</h3>
            <p className="pricing-desc">A set block of hours each month for ongoing development, automation, and improvements.</p>
            <ul className="pricing-list">
              <li>Monthly hours</li>
              <li>Priority turnaround</li>
              <li>Ongoing iteration</li>
            </ul>
            <span className="pricing-note">Rolling monthly partnership</span>
          </div>
          <div className="pricing-card">
            <h3>Sprint</h3>
            <p className="pricing-desc">A focused 1–2 week sprint to prototype, fix, or ship one thing fast.</p>
            <ul className="pricing-list">
              <li>1–2 weeks</li>
              <li>One clear goal</li>
              <li>Ship-ready output</li>
            </ul>
            <span className="pricing-note">Focused 1–2 week sprint</span>
          </div>
        </div>
        <div className="pricing-cta-wrap">
          <button type="button" onClick={openQuote} className="pricing-cta magnetic">
            <span>Get a quote</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="info-section faq" id="faq">
        <div className="section-heading">
          <h2 className="reveal-text">FAQ</h2>
          <p className="reveal-fade">(07) QUESTIONS</p>
        </div>
        <div className="faq-list">
          <details className="faq-item">
            <summary>What kind of projects do you take on?</summary>
            <p>Marketing sites and web apps, workflow automations, AI/LLM features, and internal tools like dashboards and admin panels. If it&apos;s software or tech that moves your business forward, it&apos;s in scope.</p>
          </details>
          <details className="faq-item">
            <summary>How long does a typical project take?</summary>
            <p>A focused sprint runs 1–2 weeks; a full website or tool typically 3–8 weeks depending on scope. We&apos;ll give you a realistic timeline before we start.</p>
          </details>
          <details className="faq-item">
            <summary>Do I own the code and design?</summary>
            <p>Yes — 100%. You get the full source, documentation, and design files. No lock-in, no black boxes.</p>
          </details>
          <details className="faq-item">
            <summary>Which technologies do you use?</summary>
            <p>Modern, boring-in-a-good-way stacks: React/Next.js, TypeScript, Node, Python, and the AI/automation tools that fit the job. We pick what&apos;s right for your product, not what&apos;s trendy.</p>
          </details>
          <details className="faq-item">
            <summary>Do you offer ongoing support?</summary>
            <p>Yes. We can stay on via a monthly retainer for maintenance, iteration, and new features — or hand off cleanly if you have your own team.</p>
          </details>
          <details className="faq-item">
            <summary>How do we get started?</summary>
            <p>Email us at hello@folioverze.com with a few lines about what you&apos;re building. We&apos;ll reply within 24 hours to set up a quick call.</p>
          </details>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-grid"></div>
        <div className="contact-mesh"></div>

        <div className="section-heading">
          <h2 className="reveal-text">GET IN <br /> TOUCH</h2>
          <p className="reveal-fade">(03) CONTACT</p>
        </div>

        <div className="contact-body">
          <div className="contact-left">
            <p className="contact-lead">
              Have a project in mind — a premium website, an automation, an AI feature, or an internal tool? Tell us what you&apos;re building and we&apos;ll get back within 24 hours.
            </p>

            <div className="contact-details">
              <a href="mailto:hello@folioverze.com" className="contact-detail">
                <span className="contact-detail-label">General</span>
                <span className="contact-detail-value">hello@folioverze.com</span>
              </a>
              <a href="mailto:contact@folioverze.com" className="contact-detail">
                <span className="contact-detail-label">New Projects</span>
                <span className="contact-detail-value">contact@folioverze.com</span>
              </a>
              <div className="contact-detail">
                <span className="contact-detail-label">Based in</span>
                <span className="contact-detail-value">Assam, India — IST</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-field">
              <label htmlFor="cf-name">Your name</label>
              <input id="cf-name" type="text" name="name" required placeholder="Jane Doe" />
            </div>
            <div className="form-field">
              <label htmlFor="cf-email">Email</label>
              <input id="cf-email" type="email" name="email" required placeholder="jane@company.com" />
            </div>
            <div className="form-field">
              <label htmlFor="cf-message">What can we build for you?</label>
              <textarea id="cf-message" name="message" rows={4} required placeholder="Tell us about your project, timeline, and budget..."></textarea>
            </div>
            <button type="submit" className="contact-submit magnetic">
              <span>Send message</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Outro Section */}
      <section className="outro" id="studio">
        <div className="outro-grid"></div>
        <div className="outro-mesh"></div>

        <div className="outro-content">
          <p className="outro-tagline">READY TO COLLABORATE?</p>
          <div className="outro-cta-wrapper">
            <a href="#" onClick={(e) => { e.preventDefault(); openQuote(); }} className="outro-cta magnetic">
              <span>Let&apos;s Build</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>

          <div className="outro-scroll-top magnetic" id="back-to-top-btn">
            <span className="arrow-up">↑</span>
            <span className="text">Back to base</span>
          </div>
        </div>

        <div className="outro-footer">
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <div className="footer-nav">
              <a href="#work" className="hover-underline">Work</a>
              <a href="#services" className="hover-underline">Services</a>
              <a href="#tech" className="hover-underline">Technologies</a>
              <a href="#process" className="hover-underline">Process</a>
              <a href="#about" className="hover-underline">About</a>
              <a href="#pricing" className="hover-underline">Engagement</a>
              <a href="#faq" className="hover-underline">FAQ</a>
              <a href="/privacy" className="hover-underline">Privacy Policy</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>HOURS</h4>
            <div className="time-item">
              <span>ASSAM, IN</span>
              <span className="time-val" id="tokyo-time">00:00 AM</span>
            </div>
            <div className="time-item">
              <span>UTC</span>
              <span className="time-val" id="london-time">00:00 AM</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>EMAIL</h4>
            <div className="social-links">
              <a href="mailto:hello@folioverze.com" className="hover-underline">hello@folioverze.com</a>
              <a href="mailto:contact@folioverze.com" className="hover-underline">contact@folioverze.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>AGENCY</h4>
            <p className="est-text">EST. 2026 / ASSAM, INDIA</p>
            <p className="copy-text">© 2026 FOLIOVERZE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </section>

      {/* Fullscreen Slider Viewer */}
      <div className="fullscreen-viewer">
        <div className="viewer-bg"></div>
        <div className="viewer-content"></div>
        <div className="viewer-info">
          <div className="viewer-title">Clear Gaze</div>
          <div className="viewer-help">Scroll or drag to explore</div>
        </div>
        <button className="viewer-close magnetic">
          <span>Close</span>
        </button>
      </div>

      {/* Quote / Contact Modal */}
      <div
        className={`quote-modal${quoteOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Get a quote"
      >
        <div className="quote-backdrop" onClick={() => setQuoteOpen(false)}></div>
        <div className="quote-panel">
          <button className="quote-close" onClick={() => setQuoteOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <p className="quote-eyebrow">GET A QUOTE</p>
          <h2 className="quote-title">Let&apos;s build something.</h2>
          <p className="quote-sub">Tell us what you&apos;re working on and we&apos;ll reply within 24 hours.</p>
          <form className="quote-form" onSubmit={handleContactSubmit}>
            <input type="hidden" name="subject" value="New inquiry from folioverze.com" />
            <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
            <div className="form-field">
              <label htmlFor="q-name">Your name</label>
              <input id="q-name" type="text" name="name" required placeholder="Jane Doe" />
            </div>
            <div className="form-field">
              <label htmlFor="q-email">Email</label>
              <input id="q-email" type="email" name="email" required placeholder="jane@company.com" />
            </div>
            <div className="form-field">
              <label htmlFor="q-message">What can we build for you?</label>
              <textarea id="q-message" name="message" rows={4} required placeholder="Tell us about your project, timeline, and budget..."></textarea>
            </div>
            <button type="submit" className="contact-submit" disabled={formStatus === "sending"}>
              <span>{formStatus === "sending" ? "Sending…" : "Send message"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
            {formStatus === "success" && (
              <p className="form-status form-status--ok">Thanks — we&apos;ll get back to you within 24 hours.</p>
            )}
            {formStatus === "error" && (
              <p className="form-status form-status--err">Something went wrong. Please email us at hello@folioverze.com.</p>
            )}
          </form>
          <p className="quote-alt">Prefer email? <a href="mailto:hello@folioverze.com">hello@folioverze.com</a></p>
        </div>
      </div>
    </>
  );
}
