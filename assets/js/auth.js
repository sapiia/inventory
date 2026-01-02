// Lightweight client-side auth helper for the Inventory app
// Methods: auth.login(credentials, remember) -> Promise<{ok,message}>
//          auth.register(userData, remember) -> Promise<{ok,message}>
//          auth.logout()
//          auth.isAuthenticated()
//          auth.getUser()

const auth = (function(){
  const KEY = 'inventory_user';
  const TOKEN = 'inventory_token';
  const USERS_KEY = 'inventory_users';

  function _loadUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }

  function _saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

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

  async function login(credentials, remember=false){
    if(!credentials || !credentials.username || !credentials.password) return {ok:false, message:'Missing credentials'};

    const users = _loadUsers();
    const user = users.find(u =>
      (u.username.toLowerCase() === credentials.username.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === credentials.username.toLowerCase())
    );

    if(!user || user.password !== credentials.password){
      await new Promise(r=>setTimeout(r, 250)); // Simulate delay
      return {ok:false, message:'Invalid username/email or password'};
    }

    const token = btoa(credentials.username + '::' + Date.now());
    _store(user, token, !!remember);
    return {ok:true};
  }

  async function register(userData, remember=false){
    if(!userData || !userData.name || !userData.email || !userData.username || !userData.password){
      return {ok:false, message:'All required fields must be filled'};
    }

    const users = _loadUsers();
    const existing = users.find(u =>
      u.username.toLowerCase() === userData.username.toLowerCase() ||
      u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if(existing){
      return {ok:false, message:'Username or email already exists'};
    }

    const newUser = {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      phone: userData.phone || '',
      password: userData.password
    };

    users.push(newUser);
    _saveUsers(users);

    const token = btoa(userData.username + '::' + Date.now());
    _store(newUser, token, !!remember);
    return {ok:true};
  }

  function logout(){
    _clear();
  }

  return {login, register, logout, isAuthenticated, getUser};
})();

// Expose for pages that don't use modules
window.auth = auth;
