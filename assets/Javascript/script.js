/* ═══════════════════════════════════════════════════════════════════
   JuriDev — Landing Page JavaScript
   Navbar scroll, mobile menu, smooth scroll, reveal animations
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll effect ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ─── Mobile Menu ──────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu && mobileClose) {
    const mobileLinks = mobileMenu.querySelectorAll('a');

    const openMobile = () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburger.classList.add('active');
    };
    const closeMobile = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.classList.remove('active');
    };

    hamburger.addEventListener('click', openMobile);
    mobileClose.addEventListener('click', closeMobile);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobile));
  }

  /* ─── Smooth Scroll for Anchor Links ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // Navbar height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Scroll Reveal Animations ─────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ─── Counter Animation ────────────────────────────────────────── */
  const counterEl = document.getElementById('projectCounter');
  if (counterEl) {
    let animated = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounter(counterEl, 0, 500, 2000);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(counterEl);
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = '+' + current;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ─── Staggered Card Reveal ────────────────────────────────────── */
  const cardGroups = document.querySelectorAll('[data-stagger]');
  cardGroups.forEach(group => {
    const cards = group.children;
    const groupObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(cards).forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 100);
          });
          groupObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    groupObserver.observe(group);

    // Set initial state
    Array.from(cards).forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
  });

  /* ─── Lazy Video Autoplay (IntersectionObserver) ─────────────────── */
  document.querySelectorAll('video[preload="none"]').forEach(vid => {
    if (vid.id === 'scrollVideo') return; // Managed by GSAP below
    const vidObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
          vidObserver.unobserve(vid);
        }
      });
    }, { threshold: 0.25 });
    vidObserver.observe(vid);
  });

  /* ─── Scroll Video & Mockup GSAP Timeline ───────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const video = document.getElementById('scrollVideo');
    if (video) {
      video.muted = true;
      video.playsInline = true;

      const mm = gsap.matchMedia();

      // Desktop: full GSAP scrub experience
      mm.add("(min-width: 768px)", () => {
        gsap.set(".content-block-2", { y: -50, opacity: 0, filter: "blur(10px)", visibility: "hidden" });

        const initScrollVideo = () => {
          const videoDuration = video.duration || 8;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#conexoes",
              start: "top top",
              end: "+=2500",
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          });

          tl.to(video, {
            currentTime: videoDuration,
            ease: "none",
            duration: videoDuration
          }, 0);

          tl.to(".content-block-1", {
            y: 50,
            opacity: 0,
            filter: "blur(10px)",
            ease: "power1.inOut",
            duration: videoDuration / 2
          }, videoDuration / 2);

          tl.to(".content-block-2", {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            visibility: "visible",
            ease: "power1.inOut",
            duration: videoDuration / 2
          }, videoDuration / 2);
        };

        video.addEventListener('loadedmetadata', initScrollVideo);
        if (video.readyState >= 1) {
          initScrollVideo();
        }
      });

      // Mobile: no pin/scrub, video autoplay + loop, stacked layout
      mm.add("(max-width: 767px)", () => {
        gsap.set(".content-block-2", { clearProps: "all" });
        gsap.set(".content-block-1", { clearProps: "all" });
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      });
    }
    
    // Animação de entrada do Banner de Consultoria
    const consultoriaBanner = document.querySelector('.consultoria-banner');
    if (consultoriaBanner) {
      gsap.from(consultoriaBanner, {
        scrollTrigger: {
          trigger: consultoriaBanner,
          start: "top 80%",
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  }

});
