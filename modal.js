(function () {
  'use strict';

  /* ── Inject modal HTML ──────────────────────────────────────────── */
  const MODAL_HTML = `
<div id="ttu-overlay" class="ttu-overlay" role="dialog" aria-modal="true" aria-labelledby="ttu-title">
  <div id="ttu-panel" class="ttu-panel">
    <!-- Close -->
    <button id="ttu-close" class="ttu-close" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <!-- Left accent -->
    <div class="ttu-accent"></div>

    <!-- Header -->
    <div class="ttu-header">
      <img src="logo.png" alt="Growwings" class="ttu-logo"/>
      <h2 id="ttu-title" class="ttu-title">Talk to Us!</h2>
      <p class="ttu-sub">Tell us about your team, students, or vision — we'll suggest the right program.</p>
    </div>

    <!-- Form -->
    <form id="ttu-form" class="ttu-form" novalidate>
      <div class="ttu-row">
        <div class="ttu-field">
          <label for="ttu-name">Name <span class="ttu-req">*</span></label>
          <input id="ttu-name" name="name" type="text" placeholder="Your full name" required autocomplete="name"/>
        </div>
        <div class="ttu-field">
          <label for="ttu-email">Email <span class="ttu-req">*</span></label>
          <input id="ttu-email" name="email" type="email" placeholder="you@company.com" required autocomplete="email"/>
        </div>
      </div>
      <div class="ttu-row">
        <div class="ttu-field">
          <label for="ttu-phone">Phone</label>
          <input id="ttu-phone" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel"/>
        </div>
        <div class="ttu-field">
          <label for="ttu-type">I'm enquiring for…</label>
          <select id="ttu-type" name="type">
            <option value="corporate">🏢 Corporate Offerings</option>
            <option value="campus">🎓 Future Ready Campus</option>
            <option value="general">💬 General Enquiry</option>
          </select>
        </div>
      </div>
      <div class="ttu-field ttu-field-full">
        <label for="ttu-msg">Message <span class="ttu-req">*</span></label>
        <textarea id="ttu-msg" name="message" rows="3" placeholder="Tell us about your team, students, or vision…" required></textarea>
      </div>
      <button type="submit" class="ttu-submit">
        <span class="ttu-submit-text">Drop Us a Message</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </form>

    <!-- Success state -->
    <div id="ttu-success" class="ttu-success ttu-hidden">
      <div class="ttu-success-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3>Ready to Send!</h3>
      <p>Your message is prepared. Tap below to open WhatsApp and hit Send.</p>
      <a id="ttu-wa-link" href="#" target="_blank" rel="noopener noreferrer" class="ttu-wa-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.508A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.732.888.933-3.64-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
        Send on WhatsApp
      </a>
      <button class="ttu-done" id="ttu-done">Close</button>
    </div>
  </div>
</div>`;

  const styles = `
<style id="ttu-styles">
/* Overlay */
.ttu-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(10, 37, 38, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  opacity: 0; pointer-events: none;
  transition: opacity .3s ease;
}
.ttu-overlay.ttu-open {
  opacity: 1; pointer-events: all;
}

/* Panel */
.ttu-panel {
  position: relative;
  background: #fff;
  border-radius: 28px;
  width: 100%; max-width: 600px;
  max-height: 92vh;
  overflow-y: auto;
  padding: 40px;
  box-shadow: 0 32px 80px rgba(10,37,38,0.25), 0 0 0 1px rgba(50,153,155,0.08);
  transform: translateY(32px) scale(0.97);
  transition: transform .35s cubic-bezier(0.16,1,0.3,1), opacity .3s ease;
  opacity: 0;
  scrollbar-width: thin;
}
.ttu-overlay.ttu-open .ttu-panel {
  transform: none;
  opacity: 1;
}

/* Accent bar */
.ttu-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  border-radius: 28px 28px 0 0;
  background: linear-gradient(90deg, #32999b, #fb7800);
}

/* Close button */
.ttu-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px;
  background: #f1f5f9; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #42474f;
  transition: background .2s, color .2s, transform .2s;
}
.ttu-close:hover { background: #e2e8f0; color: #0b1c30; transform: rotate(90deg); }

/* Logo + header */
.ttu-logo { height: 36px; width: auto; margin-bottom: 16px; }
.ttu-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 28px; font-weight: 800;
  color: #32999b; margin: 0 0 8px;
  line-height: 1.2;
}
.ttu-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px; color: #42474f;
  margin: 0 0 28px; line-height: 1.6;
}
.ttu-req { color: #fb7800; }

/* Form */
.ttu-form { display: flex; flex-direction: column; gap: 16px; }
.ttu-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 520px) { .ttu-row { grid-template-columns: 1fr; } }
.ttu-field { display: flex; flex-direction: column; gap: 6px; }
.ttu-field-full { grid-column: 1 / -1; }
.ttu-field label {
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 600;
  color: #42474f; letter-spacing: 0.01em;
}
.ttu-field input,
.ttu-field select,
.ttu-field textarea {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  background: #f8fafc;
  border: 1.5px solid #c2c7d1;
  border-radius: 12px;
  padding: 11px 16px;
  color: #0b1c30;
  outline: none;
  transition: border-color .2s, box-shadow .2s, background .2s;
  resize: none;
}
.ttu-field input:focus,
.ttu-field select:focus,
.ttu-field textarea:focus {
  border-color: #32999b;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(50,153,155,0.12);
}
.ttu-field input.ttu-error,
.ttu-field textarea.ttu-error {
  border-color: #ba1a1a;
  box-shadow: 0 0 0 3px rgba(186,26,26,0.08);
}

/* Submit */
.ttu-submit {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  background: #fb7800;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 15px; font-weight: 600;
  border: none; border-radius: 999px;
  padding: 14px 32px;
  cursor: pointer;
  margin-top: 4px;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 16px rgba(251,120,0,0.3);
}
.ttu-submit:hover {
  background: #e06500;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(251,120,0,0.4);
}
.ttu-submit:active { transform: none; }
.ttu-submit svg { transition: transform .2s; }
.ttu-submit:hover svg { transform: translateX(3px); }

/* Loading state */
.ttu-submit.ttu-loading { opacity: 0.7; pointer-events: none; }

/* Success */
.ttu-hidden { display: none !important; }
.ttu-success {
  text-align: center; padding: 32px 0 16px;
  animation: ttuSuccessIn .5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes ttuSuccessIn { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:none; } }
.ttu-success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(34,197,94,0.1);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  color: #22C55E;
  animation: ttuCheckPop .5s cubic-bezier(0.34,1.56,0.64,1) .1s both;
}
@keyframes ttuCheckPop { from { transform:scale(0); } to { transform:none; } }
.ttu-success h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 22px; font-weight: 700; color: #0b1c30; margin: 0 0 8px;
}
.ttu-success p {
  font-family: 'Inter', sans-serif;
  color: #42474f; margin: 0 0 24px;
}
.ttu-wa-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #25D366; color: #fff;
  font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700;
  text-decoration: none;
  border-radius: 999px;
  padding: 14px 32px;
  margin-bottom: 12px;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 20px rgba(37,211,102,0.35);
}
.ttu-wa-btn:hover { background: #1ebe5d; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.45); }
.ttu-done {
  background: transparent; color: #727780;
  font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
  border: 1.5px solid #c2c7d1; border-radius: 999px;
  padding: 10px 28px; cursor: pointer;
  transition: background .2s, color .2s;
}
.ttu-done:hover { background: #f1f5f9; color: #0b1c30; }
</style>`;

  document.head.insertAdjacentHTML('beforeend', styles);
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  /* ── Wire up all "Talk to Us!" trigger buttons ───────────────────── */
  const overlay = document.getElementById('ttu-overlay');
  const form    = document.getElementById('ttu-form');
  const success = document.getElementById('ttu-success');

  function openModal() {
    overlay.classList.add('ttu-open');
    document.body.style.overflow = 'hidden';
    // Focus first field after transition
    setTimeout(() => document.getElementById('ttu-name')?.focus(), 350);
  }

  function closeModal() {
    overlay.classList.remove('ttu-open');
    document.body.style.overflow = '';
  }

  // Hook all nav "Talk to Us!" buttons and any other triggers
  document.querySelectorAll('[data-modal="talk"], .ttu-trigger').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  // Also intercept links that point to contact.html with text "Talk to Us!"
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.trim() === 'Talk to Us!' || a.dataset.modal === 'talk') {
      a.addEventListener('click', e => { e.preventDefault(); openModal(); });
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Close on × button
  document.getElementById('ttu-close').addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('ttu-open')) closeModal();
  });

  // Done button
  document.getElementById('ttu-done').addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      form.reset();
      form.classList.remove('ttu-hidden');
      success.classList.add('ttu-hidden');
    }, 400);
  });

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Validate required fields
    ['ttu-name', 'ttu-email', 'ttu-msg'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('ttu-error');
      if (!el.value.trim()) { el.classList.add('ttu-error'); valid = false; }
    });

    const emailEl = document.getElementById('ttu-email');
    if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('ttu-error'); valid = false;
    }

    if (!valid) return;

    // Collect values
    const name  = document.getElementById('ttu-name').value.trim();
    const email = emailEl.value.trim();
    const phone = document.getElementById('ttu-phone').value.trim();
    const type  = document.getElementById('ttu-type').options[document.getElementById('ttu-type').selectedIndex].text;
    const msg   = document.getElementById('ttu-msg').value.trim();

    // Build WhatsApp message
    const text = [
      '👋 *New Enquiry from Growwings Website*',
      '',
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      phone ? `*Phone:* ${phone}` : null,
      `*Enquiry Type:* ${type}`,
      '',
      `*Message:*`,
      msg,
    ].filter(l => l !== null).join('\n');

    const waURL = `https://wa.me/919619941750?text=${encodeURIComponent(text)}`;

    // Set the real href on the WhatsApp button — user clicks it themselves
    // This is the only approach that works on every browser and device
    document.getElementById('ttu-wa-link').href = waURL;

    form.classList.add('ttu-hidden');
    success.classList.remove('ttu-hidden');
  });

})();
