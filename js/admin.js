(() => {
  const config = window.EUNITRA_CONFIG || {};
  const SUPABASE_URL = config.supabaseUrl || '';
  const SUPABASE_KEY = config.supabasePublishableKey || '';
  const ADMIN_EMAIL = 'ulku@eunitra.com';
  const ADMIN_REDIRECT = 'https://eunitra.com/admin.html';

  const loginPanel = document.getElementById('adminLoginPanel');
  const dashboard = document.getElementById('adminDashboard');
  const adminNav = document.getElementById('adminNav');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginButton = document.getElementById('loginButton');
  const loginMessage = document.getElementById('loginMessage');
  const logoutButton = document.getElementById('logoutButton');
  const adminIdentity = document.getElementById('adminIdentity');
  const statsForm = document.getElementById('statsForm');
  const projects = document.getElementById('adminProjects');
  const success = document.getElementById('adminSuccess');
  const markets = document.getElementById('adminMarkets');
  const publishButton = document.getElementById('publishButton');
  const reloadButton = document.getElementById('reloadStats');
  const saveMessage = document.getElementById('saveMessage');

  function isConfigured() {
    return SUPABASE_URL.startsWith('https://') &&
      SUPABASE_KEY.startsWith('sb_publishable_');
  }

  if (!isConfigured()) {
    loginButton.disabled = true;
    loginMessage.textContent = 'Backend setup is not complete yet.';
    return;
  }

  if (!window.supabase || !window.supabase.createClient) {
    loginButton.disabled = true;
    loginMessage.textContent = 'The secure login library could not be loaded. Please refresh and try again.';
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  function normaliseEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function showLogin(message = '') {
    dashboard.hidden = true;
    adminNav.hidden = true;
    loginPanel.hidden = false;
    loginMessage.textContent = message;
    saveMessage.textContent = '';
  }

  async function showDashboard(user) {
    if (!user || normaliseEmail(user.email) !== ADMIN_EMAIL) {
      await client.auth.signOut();
      showLogin('This account is not authorised to administer EUNITRA.');
      return;
    }
    loginPanel.hidden = true;
    dashboard.hidden = false;
    adminNav.hidden = false;
    adminIdentity.textContent = user.email;
    await loadStats();
  }

  async function loadStats() {
    saveMessage.textContent = 'Loading current values…';
    const { data, error } = await client
      .from('site_stats')
      .select('projects,success,markets,updated_at')
      .eq('id', 1)
      .single();

    if (error) {
      console.error(error);
      saveMessage.textContent = 'Could not load the current statistics. Please try again.';
      return;
    }

    projects.value = data.projects;
    success.value = data.success;
    markets.value = data.markets;
    saveMessage.textContent = data.updated_at
      ? `Current values loaded. Last published ${new Date(data.updated_at).toLocaleString()}.`
      : 'Current values loaded.';
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginMessage.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Sending secure link…';

    try {
      const email = normaliseEmail(loginEmail.value);
      if (email !== ADMIN_EMAIL) {
        loginMessage.textContent = 'This email address is not authorised for EUNITRA administration.';
        return;
      }

      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: ADMIN_REDIRECT
        }
      });

      if (error) throw error;
      loginMessage.textContent = 'A secure sign-in link has been sent to ulku@eunitra.com. Open it on this device to continue.';
    } catch (error) {
      console.error(error);
      loginMessage.textContent = 'We could not send the sign-in link. Please try again.';
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = 'Email me a secure sign-in link';
    }
  });

  statsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    publishButton.disabled = true;
    publishButton.textContent = 'Publishing…';
    saveMessage.textContent = '';

    const payload = {
      projects: Number(projects.value),
      success: Number(success.value),
      markets: Number(markets.value),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await client
        .from('site_stats')
        .update(payload)
        .eq('id', 1)
        .select('projects,success,markets,updated_at')
        .single();

      if (error) throw error;
      saveMessage.textContent = `Published successfully at ${new Date(data.updated_at).toLocaleString()}.`;
    } catch (error) {
      console.error(error);
      saveMessage.textContent = 'The changes could not be published. Please try again.';
    } finally {
      publishButton.disabled = false;
      publishButton.textContent = 'Publish changes';
    }
  });

  reloadButton.addEventListener('click', loadStats);

  logoutButton.addEventListener('click', async () => {
    await client.auth.signOut();
    showLogin('You have been signed out.');
  });

  client.auth.onAuthStateChange((_event, session) => {
    if (!session) showLogin();
  });

  (async () => {
    const { data: { session } } = await client.auth.getSession();
    if (session?.user) await showDashboard(session.user);
    else showLogin();
  })();
})();
