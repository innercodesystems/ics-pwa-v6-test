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
  let requestedViewAfterLogin = '';

  async function logout() {
    const confirmed = window.confirm(
      'Möchtest du dich wirklich aus deiner ICS Welt abmelden?'
    );

    if (!confirmed) return;

    const logoutButton = document.getElementById('icsAccountLogout');

    if (logoutButton) {
      logoutButton.disabled = true;
      logoutButton.textContent = 'Abmeldung läuft …';
    }

    const { error } = await client.auth.signOut();

    if (error) {
      console.error('ICS Abmeldung fehlgeschlagen:', error);

      if (logoutButton) {
        logoutButton.disabled = false;
        logoutButton.textContent = 'Abmelden';
      }

      window.alert('Abmeldung war nicht möglich. Bitte versuche es erneut.');
      return;
    }

    window.location.reload();
  }

  window.icsLogout = logout;

  function installAccountControls(user) {
    const accountButton = document.getElementById('icsAccountButton');
    const accountEmail = document.getElementById('icsAccountEmail');
    const accountLogout = document.getElementById('icsAccountLogout');
    const backFromAccount = document.getElementById('backFromAccount');

    if (accountEmail) {
      accountEmail.textContent = user?.email || '–';
    }

    accountButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (typeof window.openView === 'function') {
        window.openView('account');
        return;
      }

      document.querySelectorAll('.app-view').forEach((view) => {
        view.classList.toggle('active', view.id === 'view-account');
      });

      document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.remove('active');
      });

      window.scrollTo(0, 0);
    });

    backFromAccount?.addEventListener('click', () => {
      if (typeof window.openView === 'function') {
        window.openView('mehr');
        return;
      }

      document.querySelectorAll('.app-view').forEach((view) => {
        view.classList.toggle('active', view.id === 'view-mehr');
      });

      document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.view === 'mehr');
      });

      window.scrollTo(0, 0);
    });

    accountLogout?.addEventListener('click', logout);
  }

  function openRequestedViewAfterLogin(viewName) {
    if (!viewName) return;
    const tryOpen = () => {
      if (typeof window.openView === 'function') {
        window.openView(viewName);
        requestedViewAfterLogin = '';
        return true;
      }
      return false;
    };
    if (tryOpen()) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryOpen() || attempts >= 30) window.clearInterval(timer);
    }, 100);
  }

  function loadCoreApp(user, targetView = '') {
    if (coreLoaded) {
      openRequestedViewAfterLogin(targetView);
      return;
    }
    coreLoaded = true;

    document.getElementById('ics-auth-gate')?.remove();
    installAccountControls(user);

    const script = document.createElement('script');
    script.src = 'app-core.js';
    script.defer = false;
    script.addEventListener('load', () => openRequestedViewAfterLogin(targetView));
    document.body.appendChild(script);
  }

  async function ensureProfile(user) {
    if (!user?.id) return;

    const { error } = await client
      .from('profiles')
      .upsert({ id: user.id }, { onConflict: 'id' });

    if (error) {
      console.warn(
        'ICS Profil konnte noch nicht synchronisiert werden:',
        error.message
      );
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

<div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(184,146,79,.22);text-align:center;">
  <div style="font-size:14px;opacity:.78;margin-bottom:10px;">
    Noch kein ICS Konto?
  </div>

  <button id="ics-register-button" type="button" style="width:100%;padding:14px;border:1px solid #b8924f;border-radius:12px;background:transparent;color:#e8c982;font-weight:700;font-size:15px;cursor:pointer;">
    Kostenlos registrieren
  </button>
</div>

<p id="ics-login-message" role="status" style="min-height:22px;margin:14px 0 0;text-align:center;font-size:14px;color:#e8c982;"></p>
          </form>
        </div>
      </div>`;

    document.body.prepend(gate);

    const form = document.getElementById('ics-login-form');
    const email = document.getElementById('ics-login-email');
    const password = document.getElementById('ics-login-password');
const button = document.getElementById('ics-login-button');
const registerButton = document.getElementById('ics-register-button');
const message = document.getElementById('ics-login-message');

    document.querySelectorAll('.bottom-nav .nav-item').forEach((navItem) => {
      navItem.addEventListener('click', (event) => {
        if (!document.getElementById('ics-auth-gate')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        requestedViewAfterLogin = navItem.dataset.view || '';
        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
        navItem.classList.add('active');
        gate.scrollIntoView({ behavior:'smooth', block:'start' });
        window.setTimeout(() => email?.focus(), 250);
      }, true);
    });

registerButton.addEventListener('click', async () => {
  const userEmail = email.value.trim();
  const userPassword = password.value;

  message.textContent = '';

  if (!userEmail || !userPassword) {
    message.textContent =
      'Bitte zuerst E-Mail-Adresse und Passwort eingeben.';
    return;
  }

  if (userPassword.length < 6) {
    message.textContent =
      'Das Passwort muss mindestens 6 Zeichen haben.';
    return;
  }

  registerButton.disabled = true;
  registerButton.textContent = 'Registrierung läuft …';

  const { data, error } = await client.auth.signUp({
    email: userEmail,
    password: userPassword
  });

  if (error) {
    console.error('ICS Registrierung fehlgeschlagen:', error);

    message.textContent =
      error.message || 'Registrierung momentan nicht möglich.';

    registerButton.disabled = false;
    registerButton.textContent = 'Kostenlos registrieren';
    return;
  }

  if (data?.session?.user) {
    await ensureProfile(data.session.user);
    loadCoreApp(data.session.user, requestedViewAfterLogin);
    return;
  }

  message.textContent =
    'Fast geschafft. Bitte prüfe dein E-Mail-Postfach und bestätige deine Registrierung. Danach kannst du dich hier anmelden.';

  registerButton.disabled = false;
  registerButton.textContent = 'Kostenlos registrieren';
});
    
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
        message.textContent =
          'Anmeldung nicht möglich. Bitte E-Mail und Passwort prüfen.';
        button.disabled = false;
        button.textContent = 'Meine ICS Welt öffnen';
        return;
      }

      await ensureProfile(data.user);
      loadCoreApp(data.user, requestedViewAfterLogin);
    });
  }

  async function start() {
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.warn(
        'ICS Sitzung konnte nicht gelesen werden:',
        error.message
      );
    }

    if (data?.session?.user) {
      await ensureProfile(data.session.user);
      loadCoreApp(data.session.user);
      return;
    }

    createAuthGate();
  }

  start();
})();
