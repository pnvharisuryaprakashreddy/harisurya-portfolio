/* ===== THEME TOGGLE ===== */

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeToggle();
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

function updateThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;
    toggleBtn.setAttribute(
        'aria-label',
        document.body.classList.contains('light-mode') ? 'Switch to night mode' : 'Switch to day mode'
    );
}

updateThemeToggle();

// Make toggleTheme available globally
window.toggleTheme = toggleTheme;
