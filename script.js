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
    
    // Fade out the side scroll indicator when scrolling down
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if(scrollIndicator) {
        if (window.scrollY > 150) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.8';
            scrollIndicator.style.pointerEvents = 'auto';
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
let isMuted = true;

const playIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

// Unmute and fade in on first user interaction
const unmuteOnInteraction = () => {
    if (!bgMusic) return;
    bgMusic.muted = false;
    bgMusic.volume = 0;
    isPlaying = true;
    isMuted = false;
    if (audioToggle) audioToggle.innerHTML = pauseIcon;
    let vol = 0;
    const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, 0.35);
        bgMusic.volume = vol;
        if (vol >= 0.35) clearInterval(fadeIn);
    }, 100);
    document.removeEventListener('click', unmuteOnInteraction);
    document.removeEventListener('touchstart', unmuteOnInteraction);
};
document.addEventListener('click', unmuteOnInteraction);
document.addEventListener('touchstart', unmuteOnInteraction);

// Manual toggle
if (audioToggle) {
    audioToggle.addEventListener('click', () => {
        if (isMuted) {
            // First click unmutes
            unmuteOnInteraction();
        } else if (isPlaying) {
            bgMusic.pause();
            audioToggle.innerHTML = playIcon;
            isPlaying = false;
        } else {
            bgMusic.play();
            audioToggle.innerHTML = pauseIcon;
            isPlaying = true;
        }
    });
}
// Force visibility on hero immediately as fallback
setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
}, 500);

// --- Cinematic Bokeh Engine ---
const canvas = document.getElementById('bokehCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Generate a 'Z-depth' to simulate a thick 3D space
            this.depth = Math.random(); 
            
            // Render massive blurry orbs in foreground, tiny sharp specks in background
            this.size = this.depth * 5 + 0.5; 
            this.speedY = (Math.random() * 0.6 + 0.2) + (this.depth * 0.8);
            this.speedX = (Math.random() - 0.5) * 0.4;
            
            this.baseOpacity = this.depth * 0.5 + 0.1;
            this.opacity = this.baseOpacity;
            this.pulseParams = Math.random() * 0.04;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            
            // Intense throbbing pulse 
            this.opacity = this.baseOpacity + Math.sin(Date.now() * this.pulseParams) * 0.2;
            
            // Mouse repulsion
            if (!isTouchDevice) {
                const dx = state.mouse.x - this.x;
                const dy = state.mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                // Closer particles react more violently
                if (dist < 150) {
                    this.x -= (dx/dist) * (this.depth * 3 + 1);
                    this.y -= (dy/dist) * (this.depth * 3 + 1);
                }
            }

            if (this.y < -30) {
                this.y = height + 30;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(216, 159, 122, ${Math.max(0, Math.min(this.opacity, 0.9))})`;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = 'rgba(216, 159, 122, 0.9)';
            ctx.fill();
        }
    }

    // Spawn 200 layered ambient embers
    for (let i = 0; i < 200; i++) particles.push(new Particle());

    const animateParticles = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    };
    animateParticles();
}

// --- Smart Calendar Integration ---
const saveDateBtn = document.getElementById('saveDateBtn');
if (saveDateBtn) {
    saveDateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const title = "Sanju & Surya - Reception";
        const location = "RDR Convention Centre, Kochar Road, Edapazhanji, Thiruvananthapuram";
        const details = "Evening celebration. We can't wait to see you!";
        
        // Detect Apple Devices (iOS/Mac) to provide native Calendar/Reminders integration
        const isAppleDevice = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
        
        if (isAppleDevice) {
            // Generate standard .ics file format
            const icsContent = 
"BEGIN:VCALENDAR\n" +
"VERSION:2.0\n" +
"BEGIN:VEVENT\n" +
"DTSTART:20260914T113000Z\n" +
"DTEND:20260914T153000Z\n" +
"SUMMARY:" + title + "\n" +
"DESCRIPTION:" + details + "\n" +
"LOCATION:" + location + "\n" +
"END:VEVENT\n" +
"END:VCALENDAR";

            const uri = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
            window.location.href = uri;
        } else {
            // Standard Google Calendar template for Android / Web
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=20260914T113000Z/20260914T153000Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
            window.open(googleUrl, '_blank');
        }
    });
}
