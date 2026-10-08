/**
 * Landing Page Interactive Scripts
 * - Evergreen 15-Minute Urgency Countdown Timer
 * - Interactive FAQ Accordion
 * - URL Parameter Forwarding (UTMs)
 * - Mobile Sticky CTA Scroll Trigger
 * - Cheerful Confetti Celebration on CTA Click
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('active');
      const icon = header.querySelector('.accordion-icon');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherHeader = otherItem.querySelector('.accordion-header');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.innerHTML = '&#43;';
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.innerHTML = '&minus;';
      }
    });
  });

  // 2. Evergreen 15-Minute Countdown Timer
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');

  const STORAGE_KEY = 'p4u_timer_deadline';
  let targetTime;

  const savedTime = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (savedTime && parseInt(savedTime, 10) > now) {
    targetTime = parseInt(savedTime, 10);
  } else {
    // 15 minutes from now
    targetTime = now + 15 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, targetTime);
  }

  function updateTimer() {
    const currentTime = Date.now();
    let diff = targetTime - currentTime;

    if (diff <= 0) {
      // Reset for continuous urgency loop
      targetTime = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, targetTime);
      diff = targetTime - Date.now();
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // 3. Forward UTM params to checkout buttons
  const searchParams = window.location.search;
  if (searchParams) {
    const checkoutLinks = document.querySelectorAll('a[href*="checkout"]');
    checkoutLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('href', href + (href.includes('?') ? '&' : '?') + searchParams.substring(1));
      }
    });
  }

  // 4. Sticky CTA reveal on mobile
  const stickyBar = document.querySelector('.sticky-mobile-cta');
  const heroBtn = document.getElementById('hero-register-btn');

  if (stickyBar && heroBtn) {
    window.addEventListener('scroll', () => {
      const rect = heroBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.style.display = 'block';
      } else {
        stickyBar.style.display = 'none';
      }
    });
  }

  // 5. Zero-Dependency Cheerful Confetti Burst on CTA Clicks
  function launchConfetti(originX, originY) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF5733', '#FFB800', '#2EC4B6', '#7C5CFC', '#FF6584', '#00B4D8'];
    const particles = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: originX || canvas.width / 2,
        y: originY || canvas.height / 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        gravity: 0.35,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    animate();
  }

  // Attach celebration confetti to all CTA buttons
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-white-gold');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      launchConfetti(x, y);
    });
  });
});
