import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(Flip, SplitText, Draggable, ScrollTrigger);

document.documentElement.style.overflow = "hidden";
document.documentElement.style.height = "100%";
document.body.style.overflow = "hidden";
document.body.style.height = "100%";

const setupTextSplitting = () => {
  const textElements = document.querySelectorAll(".hero h1, .hero h2, .hero p, .hero a:not(.cta a), .header h1, .site-info p, .hero-footer h2");

  textElements.forEach((element) => {
    SplitText.create(element, {
      type: "lines",
      linesClass: "line",
    });

    const lines = element.querySelectorAll(".line");

    lines.forEach((line) => {
      const textContent = line.textContent;
      line.innerHTML = `<span>${textContent}</span>`;
    });

    // Make element visible now that the text inside is split into translated spans
    gsap.set(element, { opacity: 1 });
  });
};

const createCounterDigits = () => {
  const counter1 = document.querySelector(".counter-1");

  const num0 = document.createElement("div");
  num0.className = "num";
  num0.textContent = "0";
  counter1.appendChild(num0);

  const num1 = document.createElement("div");
  num1.className = "num num1offset1";
  num1.textContent = "1";
  counter1.appendChild(num1);

  const counter2 = document.querySelector(".counter-2");

  for (let i = 0; i <= 10; i++) {
    const numDiv = document.createElement("div");

    numDiv.className = i === 1
      ? "num num1offset2"
      : "num";

    numDiv.textContent = i === 10
      ? "0"
      : i;

    counter2.appendChild(numDiv);
  }

  const counter3 = document.querySelector(".counter-3");

  for (let i = 0; i < 30; i++) {
    const numDiv = document.createElement("div");

    numDiv.className = "num";
    numDiv.textContent = i % 10;

    counter3.appendChild(numDiv);
  }

  const finalNum = document.createElement("div");
  finalNum.className = "num";
  finalNum.textContent = "0";

  counter3.appendChild(finalNum);
};


const animateCounter = (counter, duration, delay = 0) => {
  const numHeight = counter.querySelector(".num").clientHeight;

  const totalDistance =
    (counter.querySelectorAll(".num").length - 1) * numHeight;

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

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    setupTextSplitting()
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
    [".logo-name a span", ".links a span", ".links p span", ".cta a"],
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
    [".header span", ".site-info span", ".hero-footer span"],
    {
      y: "0%",
      duration: 1,
      stagger: 0.08,
      ease: "power4.out",
    },
    "<+=0.2"
  );

  tl.to(
    ".play-btn",
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    },
    "<"
  );

tl.eventCallback("onComplete", () => {
  initInteractiveFeatures();
  initScrollAnimations();
});

});

const initInteractiveFeatures = () => {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Initialize DOM elements for custom cursor (so they don't cause ReferenceErrors when referenced elsewhere)
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".custom-cursor-follower");
  const followerText = follower ? follower.querySelector(".follower-text") : null;

  if (!isTouchDevice) {
    // 1. Activate Custom Cursor
    document.body.classList.add("custom-cursor-active");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  // Smooth lagging follower with squash & stretch physics
  gsap.ticker.add(() => {
    const dt = 1.0 - Math.exp(-gsap.ticker.deltaRatio() * 0.12);
    
    const currentX = gsap.getProperty(follower, "x") || mouseX;
    const currentY = gsap.getProperty(follower, "y") || mouseY;
    
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
  });

  // 2. Hover states for cursor
  const setupHover = (selectors, bodyClass, text) => {
    document.querySelectorAll(selectors).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add(bodyClass);
        if (text) {
          followerText.textContent = text;
        }
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove(bodyClass);
        if (text) {
          followerText.textContent = "drag";
        }
      });
    });
  };

  setupHover("a, button, .magnetic", "hovering-link");
  setupHover(".img", "hovering-image", "zoom");

  // 3. Magnetic effect on elements
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });

  // 4. Parallax 3D Tilt based on mouse
  window.addEventListener("mousemove", (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    
    gsap.to(".header, .site-info", {
      x: normX * 25,
      y: normY * 25,
      duration: 1,
      ease: "power2.out"
    });
  });
  } // End of !isTouchDevice block

  // 5. Hero Images State Variables
  let isZoomed = false;


  // Curved Semi-Circular Image Slider
  const viewer = document.querySelector(".fullscreen-viewer");
  const viewerContent = viewer.querySelector(".viewer-content");
  const viewerTitle = viewer.querySelector(".viewer-title");
  const viewerHelp = viewer.querySelector(".viewer-help");
  const imagesContainer = document.querySelector(".images-container");
  const allImages = Array.from(document.querySelectorAll(".img"));

  const IMAGE_TITLES = [
    "Clear Gaze",
    "Wild Essence",
    "Silent Canopy",
    "Ethereal Shadow",
    "Urban Oasis",
    "Serene Drift",
    "Crimson Peak",
    "Velvet Rhythm",
    "Rust Decadence",
    "Solar Wind",
    "Sublime Aura",
    "Golden Horizon",
    "Neon Dream",
    "Mystic Crest",
    "Arctic Silence"
  ];

  let sliderTargetProgress = 0;
  let sliderCurrentProgress = 0;
  let sliderTween = null;
  let lastRoundedIndex = 0;

  const updateSliderPosition = (progress) => {
    const N = allImages.length;
    const halfN = N / 2;
    // Dynamically calculate responsive radius based on viewport height
    const R = Math.max(window.innerHeight * 0.9, 700);
    const angleStep = 24; // spacing in degrees

    allImages.forEach((img, idx) => {
      // Calculate wrapped difference for a perfect circular loop
      const diff = idx - progress;
      const offset = ((diff + halfN) % N + N) % N - halfN;

      const angle = offset * angleStep;
      const angleRad = angle * Math.PI / 180;

      // Curved rainbow arc formulas
      const x = Math.sin(angleRad) * R;
      const y = (1 - Math.cos(angleRad)) * R;

      // Apply coordinates, tilt angle, scale, opacity and stack index
      gsap.set(img, {
        x: x,
        y: y,
        rotation: angle,
        scale: 1 - Math.min(Math.abs(offset) * 0.08, 0.35),
        opacity: Math.max(1 - Math.abs(offset) * 0.35, 0),
        zIndex: Math.round(100 - Math.abs(offset)),
        pointerEvents: Math.abs(offset) < 0.5 ? "all" : "none" // only centered image handles clicks
      });
    });

    // Update description text dynamically
    const roundedIndex = Math.round(progress);
    const wrappedIndex = (roundedIndex % N + N) % N;
    const targetTitle = IMAGE_TITLES[wrappedIndex] || "Creative Design";

    if (viewerTitle.textContent !== targetTitle) {
      lastRoundedIndex = roundedIndex;

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

  // Continuous high-performance smooth slider loop
  gsap.ticker.add(() => {
    if (!isZoomed) return;
    const diff = sliderTargetProgress - sliderCurrentProgress;
    if (Math.abs(diff) > 0.001) {
      sliderCurrentProgress += diff * 0.12; // Decelerates smoothly to target progress
      updateSliderPosition(sliderCurrentProgress);
    } else if (sliderCurrentProgress !== sliderTargetProgress) {
      sliderCurrentProgress = sliderTargetProgress;
      updateSliderPosition(sliderCurrentProgress);
    }
  });

  const animateProgress = (targetVal) => {
    sliderTargetProgress = targetVal; // Ticker automatically handles the interpolation
  };

  // Event Listeners for Slider Manipulation
  const handleWheel = (e) => {
    if (!isZoomed) return;
    e.preventDefault();
    const delta = Math.max(-0.5, Math.min(0.5, e.deltaY * 0.003));
    sliderTargetProgress += delta;
  };

  viewer.addEventListener("wheel", handleWheel, { passive: false });

  // Custom Touch and Mouse drag control
  // Custom Touch and Mouse drag control
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartProgress = 0;

  const handleDragStart = (e) => {
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

  const handleDragMove = (e) => {
    if (!isDragging || !isZoomed) return;
    
    const isTouch = e.touches && e.touches.length > 0;
    let deltaProgress = 0;
    
    if (isTouch) {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const dy = currentY - dragStartY;
      deltaProgress = -dy / 200; // Responsive tracking of vertical swipes (200px = 1 step)
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
    
    // Snap smoothly to the nearest index on release
    sliderTargetProgress = Math.round(sliderTargetProgress);
  };

  viewerContent.addEventListener("mousedown", handleDragStart);
  window.addEventListener("mousemove", handleDragMove);
  window.addEventListener("mouseup", handleDragEnd);

  viewerContent.addEventListener("touchstart", handleDragStart, { passive: false });
  window.addEventListener("touchmove", handleDragMove, { passive: false });
  window.addEventListener("touchend", handleDragEnd);

  // Opening the Semi-Circular Viewer on Double Click / Double Tap
  allImages.forEach((img, idx) => {
    let lastTap = 0;

    const openSlider = (e) => {
      if (e) e.preventDefault();
      if (isZoomed) return;
      isZoomed = true;

      // Save starting layout state
      const state = Flip.getState(allImages);

      // Append all images to viewer
      allImages.forEach(image => {
        viewerContent.appendChild(image);
      });

      // Stop page scrolling while viewer is open
      if (window.globalLenis) window.globalLenis.stop();
      document.body.style.overflow = "hidden";

      // Show viewer modal overlay
      viewer.classList.add("active");

      // Instantly calculate curved slider layout
      sliderTargetProgress = idx;
      sliderCurrentProgress = idx;
      updateSliderPosition(idx);

      // Smoothly animate transition to curve
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

      // Update cursor
      document.body.classList.remove("hovering-image");
      document.body.classList.add("hovering-link");
      followerText.textContent = "close";
    };

    // Standard Desktop Double Click
    img.addEventListener("dblclick", openSlider);

    // Custom Mobile Double Tap
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

    // Kill any active text reveal tweens to prevent race conditions
    gsap.killTweensOf([viewerTitle, viewerHelp]);

    // Fade out text info
    gsap.to([viewerTitle, viewerHelp], {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });

    // Record curve state
    const state = Flip.getState(allImages);

    // Append back to landing page container
    allImages.forEach(img => {
      imagesContainer.appendChild(img);
    });

    // Reset styles back to stylesheet defaults
    gsap.set(allImages, { clearProps: "all" });

    isZoomed = false;

    // Hide viewer overlay
    viewer.classList.remove("active");

    // Smoothly animate return flight
    Flip.from(state, {
      duration: 0.85,
      ease: "power3.inOut",
      absolute: true
    });

    document.body.classList.remove("hovering-link");
    followerText.textContent = "drag";

    // Restore page scroll
    if (window.globalLenis) window.globalLenis.start();
    document.body.style.overflow = "";
  };

  viewer.querySelector(".viewer-bg").addEventListener("click", closeViewer);
  viewer.querySelector(".viewer-close").addEventListener("click", closeViewer);
};

const initNavPill = () => {
  const linksContainer = document.querySelector(".links");
  if (!linksContainer) return;
  const activePill = linksContainer.querySelector(".nav-active-pill");
  const links = linksContainer.querySelectorAll("a");
  
  let isScrollingNav = false;
  
  const updatePill = (targetEl) => {
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
  
  // Set initial position based on .active element
  const activeLink = linksContainer.querySelector("a.active") || links[0];
  if (activeLink) {
    const left = activeLink.offsetLeft;
    const width = activeLink.offsetWidth;
    gsap.set(activePill, {
      x: left,
      width: width
    });
  }
  
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      isScrollingNav = true;
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      updatePill(link);
      
      const targetId = link.getAttribute("href");
      if (targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (window.globalLenis) {
            window.globalLenis.scrollTo(targetEl, { 
              duration: 1.5, 
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

    // Create ScrollTrigger to update active state dynamically on scroll
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
              updatePill(link);
            }
          }
        });
      }
    }
  });

  window.addEventListener("resize", () => {
    const currentActive = linksContainer.querySelector("a.active") || links[0];
    updatePill(currentActive);
  });
};

const initScrollAnimations = () => {
  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
  document.body.style.overflow = "";
  document.body.style.height = "";

  const lenis = new Lenis();
  window.globalLenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Creative Marquee Animation (Sleek & Minimal)
  const marqueeContent = document.querySelector(".marquee-content");
  if (marqueeContent) {
    let marqueeProgress = 0;
    
    gsap.ticker.add(() => {
      marqueeProgress -= 0.05; // Constant slow scroll left
      if (marqueeProgress <= -25) { // 4 items means each is 25%
        marqueeProgress = 0;
      }
      gsap.set(marqueeContent, { xPercent: marqueeProgress });
    });
  }

  // Section Heading Reveal Animation
  const sectionHeading = document.querySelector(".section-heading");
  if (sectionHeading) {
    const headingText = sectionHeading.querySelector(".reveal-text");
    const headingFade = sectionHeading.querySelector(".reveal-fade");
    
    // Split the text by lines and characters
    const splitHeading = new SplitText(headingText, { type: "lines,chars", linesClass: "overflow-hidden" });
    
    // Initial states
    gsap.set(splitHeading.chars, { y: "110%", rotationZ: 5 });
    gsap.set(headingFade, { opacity: 0, y: 20 });
    
    // Construct timeline once
    const tlHeading = gsap.timeline({ paused: true });
    
    tlHeading.to(
      splitHeading.chars,
      {
        y: "0%",
        rotationZ: 0,
        duration: 1,
        stagger: 0.02,
        ease: "power4.out"
      }
    );

    tlHeading.to(
      headingFade,
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    ScrollTrigger.create({
      trigger: sectionHeading,
      start: "top 80%",
      animation: tlHeading,
      toggleActions: "play none none reverse"
    });
  }

  gsap.utils.toArray(".work-item").forEach((item) => {
    const img = item.querySelector(".work-item-img");
    const nameH1 = item.querySelector(".work-item-name h1");

    // Setup SplitText
    const split = new SplitText(nameH1, { type: "chars" });
    
    // Add overflow hidden to the h1 so chars can slide up cleanly
    gsap.set(nameH1, { overflow: "hidden" });
    
    // Hide chars immediately on load so they don't jump when the trigger fires
    gsap.set(split.chars, { y: "150%" });
    
    // Construct timeline once
    const tlText = gsap.timeline({ paused: true });
    
    tlText.to(nameH1, {
      "--bg-scale": 1,
      duration: 0.7,
      ease: "power4.inOut"
    });

    tlText.to(
      split.chars,
      {
        y: "0%",
        duration: 0.8,
        stagger: 0.04,
        ease: "power4.out",
      },
      "-=0.3" 
    );

    // Animate smoothly when the text comes into the viewport
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
      animation: gsap.fromTo(
        img,
        { clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" }
      ),
    });

    ScrollTrigger.create({
      trigger: item,
      start: "center center",
      end: "bottom top",
      scrub: true,
      animation: gsap.fromTo(
        img,
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)", ease: "none" }
      ),
    });
  });

  // --- Sticky Cards Animation (Services Section) ---
  const cards = document.querySelectorAll(".sticky-cards .card");
  if (cards.length > 0) {
    const totalCards = cards.length;
    const cardYOffset = 15;
    const cardScaleStep = 0.08;

    // Set initial states for stack
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * cardYOffset,
        scale: 1 - i * cardScaleStep,
        zIndex: totalCards - i,
      });
    });

    // Create GSAP ScrollTrigger timeline
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
          // Update vertical progress track height
          gsap.set(".services-timeline .timeline-progress", { height: `${progress * 100}%` });
          
          // Calculate which of the 4 cards is active based on 3 intervals
          let activeIndex = 0;
          if (progress < 0.25) {
            activeIndex = 0;
          } else if (progress < 0.58) {
            activeIndex = 1;
          } else if (progress < 0.90) {
            activeIndex = 2;
          } else {
            activeIndex = 3;
          }
          
          // Toggle active class on sidebar navigation numbers
          document.querySelectorAll(".services-sidebar .sidebar-pill").forEach((pill, i) => {
            pill.classList.toggle("active", i === activeIndex);
          });
          
          // Toggle active class on timeline track indicator dots
          document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
          });
        }
      }
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const stepLabel = `step-${i}`;
      tlCards.add(stepLabel);

      // 1. Animate current card out of the screen (up and away)
      tlCards.to(cards[i], {
        yPercent: -220,
        rotationX: 35,
        scale: 0.9,
        ease: "power1.inOut",
        duration: 1
      }, stepLabel);

      // 2. Pull all behind cards forward in scale and visual position
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

    // --- Services Sidebar & Timeline Clicking ---
    const handleIndicatorClick = (index) => {
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
      pill.style.cursor = "pointer";
      pill.addEventListener("click", () => handleIndicatorClick(i));
    });

    document.querySelectorAll(".services-timeline .dot").forEach((dot, i) => {
      dot.style.cursor = "pointer";
      dot.addEventListener("click", () => handleIndicatorClick(i));
    });
  }

  // --- Outro Clocks & Scroll to Top ---
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      if (window.globalLenis) {
        window.globalLenis.scrollTo(0, { 
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const tokyoTimeEl = document.getElementById("tokyo-time");
  const londonTimeEl = document.getElementById("london-time");
  if (tokyoTimeEl && londonTimeEl) {
    const updateTimes = () => {
      const now = new Date();
      tokyoTimeEl.textContent = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      londonTimeEl.textContent = now.toLocaleTimeString("en-US", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    };
    updateTimes();
    setInterval(updateTimes, 1000);
  }

  // --- Intersection Divider Parallax ---
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
};
