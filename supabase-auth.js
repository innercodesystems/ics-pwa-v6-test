// =========================================================
// ICS SUPABASE AUTH
// Login + sichere Zuordnung zum persönlichen Datenspeicher
// =========================================================

(() => {
  const SUPABASE_URL = 'https://tyzbprjerultpxgyckcr.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lpCBC00liUwnrfUJ64IUyQ_as804XcN';

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  window.icsSupabase = client;

  let coreLoaded = false;

  function loadCoreApp() {
    if (coreLoaded) return;
    coreLoaded = true;

    document.getElementById('ics-auth-gate')?.remove();

    const script = document.createElement('script');
    script.src = 'app-core.js';
    script.defer = false;
    document.body.appendChild(script);
  }

  async function ensureProfile(user) {
    if (!user?.id) return;

    const { error } = await client
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id' });

    if (error) {
      console.warn('ICS Profil konnte noch nicht synchronisiert werden:', error.message);
    }
  }

  function createAuthGate() {
    const gate = document.createElement('div');
    gate.id = 'ics-auth-gate';
    gate.innerHTML = `
      <div style="min-height:100vh;background:#1a1815;color:#f6f1e7;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="width:min(100%,430px);background:#24211d;border:1px solid rgba(184,146,79,.35);border-radius:22px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,.28);">
          <div style="text-align:center;margin-bottom:26px;">
            <div style="font-size:12px;letter-spacing:.18em;color:#b8924f;margin-bottom:10px;">INNER CODE SYSTEMS</div>
            <h1 style="font-size:30px;margin:0 0 10px;">Dein persönlicher ICS Raum</h1>
            <p style="margin:0;opacity:.78;line-height:1.55;">Melde dich an, damit deine Entwicklung künftig sicher deinem persönlichen ICS Bereich zugeordnet werden kann.</p>
          </div>

          <form id="ics-login-form">
            <label style="display:block;margin-bottom:8px;font-size:14px;">E-Mail</label>
            <input id="ics-login-email" type="email" autocomplete="email" required style="width:100%;box-sizing:border-box;padding:14px 15px;margin-bottom:16px;border-radius:12px;border:1px solid rgba(184,146,79,.4);background:#1a1815;color:#f6f1e7;font-size:16px;">

            <label style="display:block;margin-bottom:8px;font-size:14px;">Passwort</label>
            <input id="ics-login-password" type="password" autocomplete="current-password" required style="width:100%;box-sizing:border-box;padding:14px 15px;margin-bottom:18px;border-radius:12px;border:1px solid rgba(184,146,79,.4);background:#1a1815;color:#f6f1e7;font-size:16px;">

            <button id="ics-login-button" type="submit" style="width:100%;padding:15px;border:0;border-radius:12px;background:#b8924f;color:#1a1815;font-weight:700;font-size:16px;cursor:pointer;">Meine ICS Welt öffnen</button>
            <p id="ics-login-message" role="status" style="min-height:22px;margin:14px 0 0;text-align:center;font-size:14px;color:#e8c982;"></p>
          </form>
        </div>
      </div>`;

    document.body.prepend(gate);

    const form = document.getElementById('ics-login-form');
    const email = document.getElementById('ics-login-email');
    const password = document.getElementById('ics-login-password');
    const button = document.getElementById('ics-login-button');
    const message = document.getElementById('ics-login-message');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      button.disabled = true;
      button.textContent = 'Anmeldung läuft …';
      message.textContent = '';

      const { data, error } = await client.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
      });

      if (error) {
        message.textContent = 'Anmeldung nicht möglich. Bitte E-Mail und Passwort prüfen.';
        button.disabled = false;
        button.textContent = 'Meine ICS Welt öffnen';
        return;
      }

      await ensureProfile(data.user);
      loadCoreApp();
    });
  }

  async function start() {
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.warn('ICS Sitzung konnte nicht gelesen werden:', error.message);
    }

    if (data?.session?.user) {
      await ensureProfile(data.session.user);
      loadCoreApp();
      return;
    }

    createAuthGate();
  }

  start();
})();
