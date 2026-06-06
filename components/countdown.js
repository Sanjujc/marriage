class CountdownTimer extends HTMLElement {
    connectedCallback() {
        this.targetDate = new Date(this.getAttribute('target-date') || '2026-09-13T11:00:00').getTime();
        this.innerHTML = `
            <style>
                .countdown-wrapper { text-align: center; padding: 6rem 2rem; position: relative; z-index: 10; }
                .countdown-grid { display: flex; justify-content: center; gap: 3rem; margin-top: 2rem; }
                .countdown-item { text-align: center; }
                .countdown-number { font-family: var(--font-heading); font-size: 3rem; color: var(--text-color); margin-bottom: 0.5rem; font-weight: 400; text-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                .countdown-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 4px; color: var(--accent-color); }
                @media (max-width: 768px) { .countdown-wrapper { padding: 3rem 1rem; } .countdown-grid { gap: 1rem; flex-wrap: wrap; } .countdown-item { flex: 1 1 40%; } .countdown-number { font-size: 3rem; font-weight: 500; color: #fff; } }
            </style>
            <section class="countdown-wrapper fade-up">
                <h2 class="section-title" style="margin-bottom: 2rem; font-size: 2rem; font-style: italic;">Awaiting the Grand Celebration</h2>
                <div class="countdown-grid">
                    <div class="countdown-item"><div class="countdown-number" id="cd-days">00</div><div class="countdown-label">Days</div></div>
                    <div class="countdown-item"><div class="countdown-number" id="cd-hours">00</div><div class="countdown-label">Hours</div></div>
                    <div class="countdown-item"><div class="countdown-number" id="cd-mins">00</div><div class="countdown-label">Mins</div></div>
                    <div class="countdown-item"><div class="countdown-number" id="cd-secs">00</div><div class="countdown-label">Secs</div></div>
                </div>
            </section>
        `;
        this.updateInterval = setInterval(() => this.updateTimer(), 1000);
        this.updateTimer();
    }
    disconnectedCallback() { clearInterval(this.updateInterval); }
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        if (distance < 0) return clearInterval(this.updateInterval);
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const dEl = this.querySelector('#cd-days'); const hEl = this.querySelector('#cd-hours');
        const mEl = this.querySelector('#cd-mins'); const sEl = this.querySelector('#cd-secs');
        if(dEl) dEl.innerText = days < 10 ? '0'+days : days;
        if(hEl) hEl.innerText = hours < 10 ? '0'+hours : hours;
        if(mEl) mEl.innerText = minutes < 10 ? '0'+minutes : minutes;
        if(sEl) sEl.innerText = seconds < 10 ? '0'+seconds : seconds;
    }
}
customElements.define('countdown-timer', CountdownTimer);
