// Lightweight client-side auth helper for the Inventory app
// Methods: auth.login(credentials, remember) -> Promise<{ok,message}>
//          auth.logout()
//          auth.isAuthenticated()
//          auth.getUser()

const auth = (function(){
  const KEY = 'inventory_user';
  const TOKEN = 'inventory_token';

  function _store(user, token, remember){
    const target = remember ? localStorage : sessionStorage;
    target.setItem(KEY, JSON.stringify(user));
    target.setItem(TOKEN, token);
  }

  function _clear(){
    localStorage.removeItem(KEY); localStorage.removeItem(TOKEN);
    sessionStorage.removeItem(KEY); sessionStorage.removeItem(TOKEN);
  }

  function getUser(){
    const raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    try { return raw? JSON.parse(raw): null } catch(e){return null}
  }

  function isAuthenticated(){
    return !!(sessionStorage.getItem(TOKEN) || localStorage.getItem(TOKEN));
  }

  // Simulated login — replace with real API call when available
  async function login(credentials, remember=false){
    // Basic client-side validation
    if(!credentials || !credentials.username || !credentials.password) return {ok:false, message:'Missing credentials'};

    // Demo rule: accept if password length >= 1
    // For real projects, call your backend here (fetch POST /api/auth)
    await new Promise(r=>setTimeout(r, 250));
    const ok = credentials.password.length > 0;
    if(!ok) return {ok:false, message:'Invalid username or password'};

    const user = {username: credentials.username, name: credentials.username.split('@')[0]};
    const token = btoa(credentials.username + '::' + Date.now());
    _store(user, token, !!remember);
    return {ok:true};
  }

  function logout(){
    _clear();
  }

  return {login, logout, isAuthenticated, getUser};
})();

// Expose for pages that don't use modules
window.auth = auth;
