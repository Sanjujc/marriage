class RsvpForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .rsvp-section { padding: 8rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .rsvp-title { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 400; color: var(--text-color); margin-bottom: 0.5rem; letter-spacing: 2px; text-transform: uppercase;}
                .rsvp-subtitle { margin-bottom: 4rem; color: var(--accent-color); letter-spacing: 4px; text-transform: uppercase; font-size: 0.75rem; }
                
                .rsvp-strip {
                    display: flex; flex-direction: row; align-items: flex-end; gap: 3rem; width: 100%; max-width: 1200px;
                    padding: 3rem 4rem; background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--glass-border); border-radius: 80px; box-shadow: var(--glass-shadow);
                }
                
                .input-group { display: flex; flex-direction: column; flex: 1; }
                .input-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 3px; color: var(--text-muted); margin-bottom: 0.5rem; }
                
                .rsvp-input {
                    width: 100%; padding: 0.5rem 0; border: 0; border-bottom: 1px solid var(--glass-border);
                    background: transparent; color: var(--text-color); font-family: var(--font-body); font-size: 1.1rem;
                    outline: none; transition: border-color 0.4s; border-radius: 0;
                }
                .rsvp-input:focus { border-color: var(--accent-color); }
                .rsvp-input::placeholder { color: var(--text-muted); opacity: 0.3; }
                
                select.rsvp-input { cursor: pointer; appearance: none; -webkit-appearance: none; }
                select.rsvp-input option { background: var(--bg-color); color: var(--text-color); }

                .rsvp-btn {
                    padding: 1.2rem 3.5rem; border-radius: 40px; background: transparent; color: var(--text-color);
                    border: 1px solid var(--glass-border); font-family: var(--font-body); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 3px;
                    cursor: pointer; transition: all 0.4s ease; white-space: nowrap; height: fit-content; margin-bottom: 0.2rem;
                }
                .rsvp-btn:hover { background: var(--accent-color); color: var(--bg-color); border-color: var(--accent-color); }
                
                @media (max-width: 992px) {
                    .rsvp-strip { flex-direction: column; gap: 2rem; border-radius: 16px; padding: 2.5rem 1.5rem; align-items: stretch; }
                    .rsvp-input { font-size: 1rem; }
                    .input-label { font-size: 0.8rem; font-weight: 600; color: var(--accent-color); }
                    .rsvp-btn { width: 100%; text-align: center; margin-top: 1rem; padding: 1rem; font-size: 1rem; font-weight: 600; color: #fff;}
                }
            </style>
            <section id="rsvp" class="rsvp-section fade-up">
                <h2 class="rsvp-title">Your Presence</h2>
                <p class="rsvp-subtitle">Kindly Reply By July 1st</p>
                <form class="rsvp-strip">
                    
                    <div class="input-group">
                        <label class="input-label">Name</label>
                        <input type="text" id="wa-name" class="rsvp-input magnetic-item" placeholder="First & Last" required>
                    </div>
                    


                    <div class="input-group">
                        <label class="input-label">Attendance</label>
                        <select id="wa-guests" class="rsvp-input magnetic-item" required>
                            <option value="1">Attending Solo</option>
                            <option value="2">Bringing a Guest</option>
                            <option value="0">Will Celebrate from Afar</option>
                        </select>
                    </div>

                    <button type="submit" class="rsvp-btn magnetic-item">Confirm</button>
                    
                </form>
            </section>
        `;

        const form = this.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = this.querySelector('#wa-name').value.trim();
            const guestsEl = this.querySelector('#wa-guests');
            const attendance = guestsEl.options[guestsEl.selectedIndex].text;

            // Your WhatsApp Phone Number (include country code without + or spaces)
            const phoneNumber = "7012227850";

            // Constructing an elegant WhatsApp template message
            const rawMessage = `✨ *Wedding RSVP* ✨\n\n*Name:* ${name}\n*Status:* ${attendance}\n\nCan't wait to celebrate!`;

            // URL encode to safely pass through web
            const encodedMessage = encodeURIComponent(rawMessage);

            // Open native WhatsApp API window
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        });
    }
}
customElements.define('rsvp-form', RsvpForm);
