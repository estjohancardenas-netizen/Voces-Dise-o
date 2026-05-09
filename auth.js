// Simple auth utility using localStorage and Web Crypto API for password hashing
const Auth = (function(){
  const USERS_KEY = 'vdm_users';
  const SESSION_KEY = 'vdm_session';

  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(arr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  }

  async function register({name, email, password}){
    email = (email||'').toLowerCase();
    if(!email || !password) throw new Error('Email y contraseña requeridos');
    const users = getUsers();
    if(users.find(u=>u.email===email)) throw new Error('Usuario ya existe');
    const pwd = await hashPassword(password);
    const id = 'u_'+Date.now();
    const user = {id, name: name||'', email, password: pwd, createdAt: new Date().toISOString()};
    users.push(user);
    saveUsers(users);
    setSession(user);
    return user;
  }

  async function login({email, password}){
    email = (email||'').toLowerCase();
    const users = getUsers();
    const pwd = await hashPassword(password);
    const user = users.find(u=>u.email===email && u.password===pwd);
    if(!user) throw new Error('Credenciales inválidas');
    setSession(user);
    return user;
  }

  function setSession(user){
    localStorage.setItem(SESSION_KEY, JSON.stringify({id:user.id,email:user.email,name:user.name,ts:Date.now()}));
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
  }

  function getCurrentUser(){
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  }

  return {register, login, logout, getCurrentUser, getUsers};
})();

if(typeof window !== 'undefined') window.Auth = Auth;
