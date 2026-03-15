/* ===== UTILITIES ===== */

// Page loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (!loader) {
        document.body.classList.add('loaded');
        return;
    }

    loader.classList.remove('hidden', 'is-exiting');
    document.body.classList.remove('loaded');

    const nameEl = document.getElementById('loaderName');
    if (nameEl && !nameEl.dataset.split) {
        const text = nameEl.textContent.trim();
        nameEl.textContent = '';
        [...text].forEach((ch, index) => {
            const span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.animationDelay = `${0.4 + index * 0.03}s`;
            nameEl.appendChild(span);
        });
        nameEl.dataset.split = 'true';
    }

    const percentEl = document.getElementById('loaderPercent');
    const barEl = document.getElementById('loaderBar');
    const duration = 2800;
    const start = performance.now();
    const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(t);
        const value = Math.max(1, Math.round(eased * 100));
        if (percentEl) percentEl.textContent = `${value}%`;
        if (barEl) barEl.style.transform = `scaleX(${value / 100})`;
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            loader.classList.add('is-exiting');
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 520);
        }
    };

    requestAnimationFrame(tick);
});

// Dynamic greeting
function setGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    let greeting;
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning! ☀️';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon! 🌤️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Good Evening! 🌅';
    } else {
        greeting = 'Hello, Night Owl! 🌙';
    }
    
    if (greetingEl) {
        greetingEl.textContent = greeting;
    }
}
setGreeting();

// Dynamic copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// CV download function
function downloadCV(event) {
    return true;
}

// Make downloadCV available globally
window.downloadCV = downloadCV;
