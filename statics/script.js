// ── Point 1: Full-page Network Canvas Background ───────────────────────────
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const ACCENT = '78,205,196';
    const NODE_COUNT = 100;
    const MAX_DIST = 150;
    const MOUSE_RADIUS = 200;

    let W, H, nodes, mouse = { x: -9999, y: -9999 };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function makeNode() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            r: Math.random() * 2 + 1.5,
        };
    }

    function init() { resize(); nodes = Array.from({ length: NODE_COUNT }, makeNode); }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        nodes.forEach(n => {
            const dx = mouse.x - n.x, dy = mouse.y - n.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < MOUSE_RADIUS) { n.vx += (dx/dist)*0.03; n.vy += (dy/dist)*0.03; }
            const speed = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
            if (speed > 1.2) { n.vx *= 0.95; n.vy *= 0.95; }
            n.x += n.vx; n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i+1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x-b.x, dy = a.y-b.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba('+ACCENT+','+(1-dist/MAX_DIST)*0.25+')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            const dx = mouse.x-n.x, dy = mouse.y-n.y;
            const near = Math.sqrt(dx*dx+dy*dy) < MOUSE_RADIUS;
            ctx.beginPath();
            ctx.arc(n.x, n.y, near ? n.r*1.8 : n.r, 0, Math.PI*2);
            ctx.fillStyle = near ? 'rgba('+ACCENT+',0.9)' : 'rgba('+ACCENT+',0.35)';
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', resize);
    init(); draw();
})();

// ── Hamburger ─────────────────────────────────────────────────────────────────
const hamburgerCheck = document.getElementById('hamburger-check');
const navLinks = document.querySelector('.nav-links');

if (hamburgerCheck) {
    hamburgerCheck.addEventListener('change', () => {
        navLinks.classList.toggle('active', hamburgerCheck.checked);
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerCheck.checked = false;
            navLinks.classList.remove('active');
        });
    });
}

// ── Navbar scroll effect ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('scrolled', window.scrollY > 100);
});

// ── Scroll animations ─────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.project-card, .tech-category, .skill-item, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ── Smooth scroll ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});