/* ================= PRELOADER ================= */
let count = 0;
const countElement = document.querySelector('.count');
const preloader = document.querySelector('.preloader');
const loaderDuration = 1000;
const startTime = Date.now();

if (countElement) {
    countElement.textContent = '0';
    const counter = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / loaderDuration) * 100, 100);
        countElement.textContent = Math.floor(progress);

        if (progress >= 100) {
            clearInterval(counter);
            setTimeout(() => preloader?.classList.add('hide'), 300);
        }
    }, 50);
}

/* ================= PARALLAX ================= */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document
        .querySelectorAll('.hero-image img, .about-image img')
        .forEach(img => {
            img.style.translate = `0 ${scrolled * 0.1}px`;
        });
});

/* ================= NAV INDICATOR ================= */
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.querySelector('.nav-indicator');

function updateNavIndicator(activeLink) {
    if (!activeLink || !navIndicator || window.innerWidth <= 768) return;
    navIndicator.style.width = `${activeLink.parentElement.offsetWidth}px`;
    navIndicator.style.transform = `translateX(${activeLink.parentElement.offsetLeft}px)`;
    navIndicator.classList.add('visible');
}

window.addEventListener('load', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) updateNavIndicator(active);
});

window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) updateNavIndicator(active);
});

/* ================= PROJECT MODAL ================= */
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');

document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', e => {
        const item = e.target.closest('.project-item');
        if (!item) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('modal-title').textContent = item.dataset.title;
        document.getElementById('modal-tagline').textContent = item.dataset.tagline;
        document.getElementById('modal-desc').textContent = item.dataset.description;
        document.getElementById('modal-img').src = item.dataset.image;
        document.getElementById('modal-github').href = item.dataset.github;
        document.getElementById('modal-more').href = item.dataset.live;
        
        const tech = document.getElementById('modal-tech');
        tech.innerHTML = '';
        item.dataset.tech?.split(',').forEach(t => {
            const span = document.createElement('span');
            span.className = 'tech-badge';
            span.textContent = t.trim();
            tech.appendChild(span);
        });

        const features = document.getElementById('modal-features');
        features.innerHTML = '';
        item.dataset.features?.split(',').forEach(f => {
            const li = document.createElement('li');
            li.textContent = f.trim();
            features.appendChild(li);
        });
    });
});

const closeModalFn = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

closeModal?.addEventListener('click', closeModalFn);
modal?.addEventListener('click', e => e.target === modal && closeModalFn());
window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeModalFn();
    }
});

/* ================= SMOOTH NAV ================= */
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        updateNavIndicator(link);
        history.pushState(null, null, link.getAttribute('href'));
    });
});

/* ================= SECTION OBSERVER ================= */
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavIndicator(link);
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });

document
    .querySelectorAll('header[id], section[id]')
    .forEach(sec => sectionObserver.observe(sec));

/* ================= REVEAL ================= */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document
    .querySelectorAll('.reveal-text, .reveal-img')
    .forEach(el => revealObserver.observe(el));

/* ================= COLOR PALETTE ================= */
const glowColors = [
    '#00d9ff',
    '#ff006e',
    '#8338ec',
    '#3a86ff',
    '#fb5607',
    '#06ffa5',
    '#ffbe0b',
    '#00f5ff'
];

/* ================= MARQUEE (HOLLOW → FILL ON HOVER) ================= */
const marqueeContent = document.querySelector('.marquee-content');

if (marqueeContent) {
    marqueeContent.innerHTML += marqueeContent.innerHTML;
    const items = marqueeContent.querySelectorAll('span');

    items.forEach((item, index) => {
        const color = glowColors[index % glowColors.length];

        // Normal (hollow)
        item.style.color = 'transparent';
        item.style.webkitTextStroke = `1px ${color}`;
        item.style.textShadow = 'none';
        item.style.filter = 'none';
        item.style.transition =
            'color 0.3s ease, -webkit-text-stroke 0.3s ease, transform 0.3s ease, letter-spacing 0.3s ease';

        // Hover
        item.addEventListener('mouseenter', () => {
            item.style.color = color;
            item.style.webkitTextStroke = '0';
            item.style.transform = 'scale(1.12)';
            item.style.letterSpacing = '0.15em';
        });

        item.addEventListener('mouseleave', () => {
            item.style.color = 'transparent';
            item.style.webkitTextStroke = `1px ${color}`;
            item.style.transform = 'scale(1)';
            item.style.letterSpacing = '0';
        });
    });
}

/* ================= SKILLS COLORS ================= */
document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.setProperty('--glow-color', glowColors[i % glowColors.length]);

    // Add touch event for mobile glow effect
    card.addEventListener('touchstart', () => {
        card.classList.add('skill-glow-active');
    });
    card.addEventListener('touchend', () => {
        card.classList.remove('skill-glow-active');
    });
});

/* ================= THEME TOGGLE ================= */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn?.querySelector('i');

if (themeToggleBtn && themeIcon) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    themeToggleBtn.addEventListener('click', () => {
        setTheme(
            document.documentElement.dataset.theme === 'light'
                ? 'dark'
                : 'light'
        );
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/* ================= TYPEWRITER ================= */
const roles = [
    'FrontEnd Developer',
    'Machine Learning Enthusiast',
    'Graphic Designer',
    'UI/UX Geek',
    'Observer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function initTypewriter() {
    const textEl = document.getElementById('typewriter-text');
    const cursor = document.querySelector('.typewriter-cursor');

    if (!textEl || !cursor) {
        setTimeout(initTypewriter, 100);
        return;
    }

    function type() {
        const current = roles[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        textEl.textContent = current.substring(0, charIndex);

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            setTimeout(type, 1800);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        type();
    } else {
        textEl.textContent = roles[0];
        cursor.style.display = 'none';
    }
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initTypewriter)
    : initTypewriter();

    /* ================= SKILLS FILTER (WORKING) ================= */
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        skillCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.classList.remove('hide');

                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // force reflow

                // Reapply animations
                card.style.animation =
                    'fadeIn 0.4s ease forwards, float-card 6s ease-in-out infinite';

                // Stagger animation
                card.style.animationDelay = `${index * 0.05}s, ${index % 3}s`;
            } else {
                card.classList.add('hide');
                card.style.animation = 'none';
            }
        });
    });
});

/* ================= VERCEL ANALYTICS ENGAGEMENT TRACKING ================= */
// Helper to safely fire Vercel Analytics events (no-op if script not loaded yet)
function trackEvent(name, props) {
    if (typeof window.va === 'function') {
        window.va('event', { name, ...props });
    }
}

// Track when user scrolls into each major section (fires once per session)
const trackedSections = new Set();
const analyticsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.id;
        if (trackedSections.has(sectionId)) return; // only fire once
        trackedSections.add(sectionId);
        trackEvent('section_view', { section: sectionId });
    });
}, { threshold: 0.3 });

document
    .querySelectorAll('header[id], section[id]')
    .forEach(sec => analyticsObserver.observe(sec));

// Track project modal opens
document.querySelectorAll('.btn-view-project').forEach(btn => {
    btn.addEventListener('click', e => {
        const item = e.target.closest('.project-item');
        if (!item) return;
        trackEvent('project_view', { project: item.dataset.title || 'unknown' });
    });
});

// Track resume download
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('resume_download', {});
    });
});

// Track contact form submission
document.querySelector('.contact-form')?.addEventListener('submit', () => {
    trackEvent('contact_form_submit', {});
});

/* ================= ACHIEVEMENTS FILTER ================= */
const achTabs = document.querySelectorAll('.ach-tab');
const achCards = document.querySelectorAll('.achievement-card');

achTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        achTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-ach-filter');
        achCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-ach-category') === filter) {
                card.classList.remove('ach-hide');
            } else {
                card.classList.add('ach-hide');
            }
        });
    });
});

/* ================= IMAGE LIGHTBOX MODAL ================= */
const imageModal = document.getElementById('image-modal');
const lightboxImg = document.getElementById('lightbox-img');
const imageClose = document.querySelector('.image-close');

const closeImageModal = () => {
    if (imageModal) imageModal.classList.remove('active');
};

document.querySelectorAll('.clickable-photo').forEach(photo => {
    photo.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lightboxImg && imageModal) {
            lightboxImg.src = photo.src;
            imageModal.classList.add('active');
        }
    });
});

if (imageClose) {
    imageClose.addEventListener('click', closeImageModal);
}

if (imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});
