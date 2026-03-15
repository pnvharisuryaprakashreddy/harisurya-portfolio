// theme toggle
const btn = document.getElementById("theme-toggle");
const body = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(isDark) {
  body.classList.toggle("dark", isDark);
  if (btn) {
    btn.textContent = isDark ? "☀️" : "🌙";
  }
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme") === "dark";
setTheme(savedTheme);

if (btn) {
  btn.onclick = () => setTheme(!body.classList.contains("dark"));
}

// highlight active section
const navLinks = document.querySelectorAll(".nav a");
const sections = [...document.querySelectorAll("section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// load projects with images
async function loadProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const res = await fetch("projects.json");
  const projects = await res.json();

  grid.innerHTML = projects.map(p => `
    <article class="card project-card">
      <img src="${p.image}" class="project-image" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="project-period">${p.period} • ${p.role}</p>
      <ul class="project-points">
        ${p.points.map(pt => `<li>${pt}</li>`).join("")}
      </ul>
      <div class="tags">
        ${p.tech.map(t => `<span>${t}</span>`).join("")}
      </div>
      <div class="project-actions">
        <a class="btn ghost" target="_blank" href="${p.github}">View Code →</a>
      </div>
    </article>
  `).join("");
}

loadProjects();

// subtle scroll reveal
const revealTargets = document.querySelectorAll(".section, .hero-section, .page-hero, .card, .skill-card");
revealTargets.forEach((el, index) => {
  el.classList.add("reveal");
  const delayClass = `delay-${(index % 4) + 1}`;
  el.classList.add(delayClass);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => observer.observe(el));

// count up numbers
const countUps = document.querySelectorAll(".count-up");
if (!prefersReducedMotion && countUps.length) {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count || "0", 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const tick = () => {
          current += step;
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = current;
            requestAnimationFrame(tick);
          }
        };
        tick();
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  countUps.forEach((el) => countObserver.observe(el));
}

// page load entrance animations + premium loader
const initLoader = () => {
  const loader = document.getElementById("pageLoader");
  if (!loader) {
    document.body.classList.add("loaded");
    return;
  }

  loader.classList.remove("hidden", "is-exiting");
  document.body.classList.remove("loaded");

  const nameEl = document.getElementById("loaderName");
  if (nameEl && !nameEl.dataset.split) {
    const text = nameEl.textContent.trim();
    nameEl.textContent = "";
    [...text].forEach((ch, index) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.animationDelay = `${0.6 + index * 0.03}s`;
      nameEl.appendChild(span);
    });
    nameEl.dataset.split = "true";
  }

  const percentEl = document.getElementById("loaderPercent");
  const barEl = document.getElementById("loaderBar");
  const duration = 2800;
  const start = performance.now();
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const tick = (now) => {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / duration);
    const eased = easeInOut(t);
    const value = Math.max(1, Math.round(eased * 100));
    if (percentEl) percentEl.textContent = `${value}%`;
    if (barEl) barEl.style.transform = `scaleX(${value / 100})`;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      loader.classList.add("is-exiting");
      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.classList.add("loaded");
      }, 520);
    }
  };

  requestAnimationFrame(tick);

};

window.addEventListener("load", initLoader);

// cursor spotlight (smooth follow)
const spotlight = document.querySelector(".cursor-spotlight");
if (spotlight && !prefersReducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const animateSpotlight = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0)`;
    requestAnimationFrame(animateSpotlight);
  };

  animateSpotlight();
}

// card glow follows cursor
const glowCards = document.querySelectorAll(".card, .contact-card, .skill-card");
glowCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

// parallax hero card
const parallaxCard = document.querySelector("[data-parallax]");
if (parallaxCard && !prefersReducedMotion) {
  window.addEventListener("mousemove", (event) => {
    const { innerWidth, innerHeight } = window;
    const moveX = (event.clientX / innerWidth - 0.5) * 12;
    const moveY = (event.clientY / innerHeight - 0.5) * 12;
    parallaxCard.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget && !event.toElement) {
      parallaxCard.style.transform = "translate3d(0, 0, 0)";
    }
  });
}

// scroll progress + back to top
const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  if (backToTop) {
    backToTop.classList.toggle("show", scrollTop > 600);
  }
};

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("load", updateScrollUI);

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
