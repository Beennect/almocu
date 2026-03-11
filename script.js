// Inicializa Lucide
lucide.createIcons();

/* ---- THEME TOGGLE ---- */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('nosherp-theme', theme);
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons();
}

// Carrega tema salvo
const savedTheme = localStorage.getItem('nosherp-theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

function closeMobile() {
    mobileMenu.classList.remove('open');
}

/* ---- EMAIL SUBMIT ---- */
function handleEmailSubmit(inputId) {
    const input = document.getElementById(inputId);
    const email = input.value.trim();

    if (!email) {
    showToast('Insira um email.', true);
    input.focus();
    input.style.borderColor = '#FF5F2F';
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    showToast('Por favor, insira um e-mail válido.', true);
    return;
    }

    input.value = '';
    showToast('Você entrou na lista! Em breve entraremos em contato.');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = message;
    toast.style.borderColor = isError ? '#FF5F5F' : '';
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

/* ---- SCROLL ANIMATIONS ---- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
    }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ---- STICKY HEADER SHADOW ---- */
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 20) {
    header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    } else {
    header.style.boxShadow = 'none';
    }
});

/* ---- ENTER KEY on email inputs ---- */
document.getElementById('heroEmail').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleEmailSubmit('heroEmail');
});
document.getElementById('earlyEmail').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleEmailSubmit('earlyEmail');
});