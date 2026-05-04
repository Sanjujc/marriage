// --- Soft Flow Cursor Physics ---
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const trail = document.querySelector('.cursor-trail');
const dot = document.querySelector('.cursor-dot');
const ambientBg = document.querySelector('.ambient-bg');

const state = {
    mouse: { x: window.innerWidth/2, y: window.innerHeight/2 },
    scroll: window.scrollY || 0
};

// Lerp config for incredibly soft tracking without sharp movements
const lerp = (start, end, factor) => start + (end - start) * factor;
let smoothMouse = { x: window.innerWidth/2, y: window.innerHeight/2 };

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        
        // Instant trail drop
        if(trail) {
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
        }
    });

    const render = () => {
        try {
            smoothMouse.x = lerp(smoothMouse.x, state.mouse.x, 0.1);
            smoothMouse.y = lerp(smoothMouse.y, state.mouse.y, 0.1);

            // Ambient dot follows softly
            if(dot) {
                dot.style.left = `${smoothMouse.x}px`;
                dot.style.top = `${smoothMouse.y}px`;
            }

            // Very subtle ambient background parallax 
            const xOffset = (smoothMouse.x / window.innerWidth) - 0.5;
            const yOffset = (smoothMouse.y / window.innerHeight) - 0.5;
            if (ambientBg) {
                ambientBg.style.transform = `translate(${xOffset * -25}px, calc(${state.scroll * 0.25}px + ${yOffset * -25}px))`;
            }
        } catch(e) {
            console.error("Render loop error", e);
        }

        requestAnimationFrame(render);
    };
    render();
}

// Magnetic Interactions (Subtle)
function bindInteractives() {
    const interactives = document.querySelectorAll('.magnetic-item, .event-card, .gallery-item, button, a');
    if (!isTouchDevice) {
        interactives.forEach(el => {
            if(el.dataset.bound) return;
            el.dataset.bound = "true";

            el.addEventListener('mouseenter', () => {
                if(dot) dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
            });
            
            el.addEventListener('mouseleave', () => {
                if(dot) dot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
}

// --- Cinematic Scroll Easing ---
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    state.scroll = window.scrollY;
    if(navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Staggered intersection observer
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.10 };
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initial binding
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
bindInteractives();

// Mutation Observer to bind Web Components effortlessly
const mutationObserver = new MutationObserver((mutations) => {
    let shouldBind = false;
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // ELEMENT_NODE
                if (node.classList && node.classList.contains('fade-up')) {
                    observer.observe(node);
                }
                const fadeUps = node.querySelectorAll('.fade-up');
                if(fadeUps) {
                    fadeUps.forEach(el => observer.observe(el));
                }
                shouldBind = true;
            }
        });
    });
    if(shouldBind) bindInteractives();
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// --- Audio Control ---
const audioToggle = document.getElementById('audioToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

const playIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

if (audioToggle) {
    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            audioToggle.innerHTML = playIcon;
        } else {
            bgMusic.play();
            audioToggle.innerHTML = pauseIcon;
        }
        isPlaying = !isPlaying;
    });
}
// Force visibility on hero immediately as fallback
setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
}, 500);
