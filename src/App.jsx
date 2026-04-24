import React, { useState, useEffect, useRef } from 'react';
import { authService, userService, chatService } from './services/api';
import Admin from './Admin';

// ===== PALETA DE CORES - TEMA CLARO COM LINHAS VERMELHO-CIANO =====
const C = {
  primary: '#06b6d4',
  primaryDark: '#0891b2',
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textInverse: '#ffffff',
  border: '#e2e8f0',
  success: '#10b981',
  danger: '#dc2626',
  warning: '#f59e0b',
  online: '#10b981',
  offline: '#cbd5e1',
  radius: '10px',
  radiusSm: '8px',
  radiusLg: '16px',
  radiusFull: '50px',
};

// ===== ÍCONES SVG =====
const Icons = {
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  PersonAdd: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Chat: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  CloseCircle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  ChevronLeft: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Bell: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  BellOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// ===== LINHA DIVISÓRIA VERMELHO-CIANO =====
const Divider = React.memo(() => (
  <div style={{
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #dc2626, #06b6d4, #dc2626, transparent)',
    boxShadow: '0 1px 6px rgba(220,38,38,0.2), 0 1px 6px rgba(6,182,212,0.15)',
    borderRadius: '1px',
    margin: 0,
    opacity: 0.8
  }}/>
));

// ===== AVATAR =====
const Avatar = React.memo(({ name, online, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: 12,
    background: 'linear-gradient(135deg, #dc2626, #06b6d4)',
    color: '#fff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '700',
    fontSize: size > 40 ? 15 : 12, position: 'relative', flexShrink: 0,
    boxShadow: '0 4px 14px rgba(220,38,38,0.25), 0 2px 8px rgba(6,182,212,0.2)'
  }}>
    {(name || '??').substring(0, 2).toUpperCase()}
    {online !== undefined && (
      <span style={{
        position: 'absolute', bottom: -2, right: -2,
        width: 13, height: 13, borderRadius: '50%',
        border: '2px solid #fff',
        background: online ? '#10b981' : '#cbd5e1',
        boxShadow: online ? '0 0 8px rgba(16,185,129,0.5)' : 'none'
      }}/>
    )}
  </div>
));

// ===== COMPONENTE PRINCIPAL =====
function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [reg, setReg] = useState({ username: '', password: '', telefone: '' });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('chats');
  const [friends, setFriends] = useState([]);
  const [selFriend, setSelFriend] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [requests, setRequests] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const msgEnd = useRef(null);

  useEffect(() => {
    const h = () => { setIsMobile(window.innerWidth < 768); if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
  }, []);

  const handleSelectFriend = (f) => { setSelFriend(f); if (isMobile) setSidebarOpen(false); };

  useEffect(() => {
    const t = localStorage.getItem('token'), u = localStorage.getItem('user');
    if (t && u) { try { const d = JSON.parse(u); setUser(d); setAuth(true); setIsAdmin(d.username === 'admin'); } catch (e) { localStorage.clear(); } }
  }, []);

  useEffect(() => {
    if (auth && !isAdmin && 'Notification' in window && Notification.permission === 'granted') setNotificationsEnabled(true);
  }, [auth, isAdmin]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) { alert('Navegador não suporta notificações.'); return; }
    try {
      const p = await Notification.requestPermission();
      if (p === 'granted') { setNotificationsEnabled(true); new Notification('🔔 Haremessenger', { body: 'Notificações ativadas!' }); }
      else alert('❌ Permissão negada.');
    } catch (e) {}
  };

  const disableNotifications = () => { setNotificationsEnabled(false); };

  // Polling
  useEffect(() => {
    if (!selFriend?.conversa_id) return;
    let active = true;
    const poll = async () => { if (!active) return; try { const r = await chatService.getMessages(selFriend.conversa_id); if (active) setMsgs(r.data.mensagens || []); } catch (e) {} };
    poll(); const i = setInterval(poll, 1000);
    return () => { active = false; clearInterval(i); };
  }, [selFriend?.conversa_id]);

  useEffect(() => {
    if (!auth || isAdmin) return;
    let active = true;
    const poll = async () => {
      if (!active) return;
      try {
        const [fr, rq] = await Promise.all([userService.getFriends(), userService.getFriendRequests()]);
        if (active) { setFriends(fr.data.amigos || []); setRequests(rq.data.recebidas || []); }
      } catch (e) {}
    };
    poll(); const i = setInterval(poll, 2000);
    return () => { active = false; clearInterval(i); };
  }, [auth, isAdmin]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const doLogin = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await authService.login(login); const d = r.data.usuario;
      setUser(d); setAuth(true); localStorage.setItem('token', r.data.token); localStorage.setItem('user', JSON.stringify(d));
      setIsAdmin(d.username === 'admin'); setLogin({ username: '', password: '' });
    } catch (err) { alert('Login falhou.'); } finally { setLoading(false); }
  };

  const doRegister = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await authService.register({ username: reg.username, password: reg.password, numero_celular: reg.telefone });
      const d = r.data.usuario; setUser(d); setAuth(true);
      localStorage.setItem('token', r.data.token); localStorage.setItem('user', JSON.stringify(d));
      setIsAdmin(d.username === 'admin'); setReg({ username: '', password: '', telefone: '' });
    } catch (err) { alert('Registro falhou.'); } finally { setLoading(false); }
  };

  const doLogout = () => {
    localStorage.clear(); setAuth(false); setUser(null); setIsAdmin(false);
    setNotificationsEnabled(false); setFriends([]); setSelFriend(null); setMsgs([]);
  };

  const sendMsg = async () => {
    const m = newMsg.trim(); if (!m || !selFriend?.conversa_id) return;
    setNewMsg('');
    try { await chatService.sendMessage(selFriend.conversa_id, m); const r = await chatService.getMessages(selFriend.conversa_id); setMsgs(r.data.mensagens || []); }
    catch (err) { setNewMsg(m); }
  };

  const doSearch = async () => { if (!searchPhone.trim()) return; try { const r = await userService.searchByPhone(searchPhone); setSearchResult(r.data); } catch (e) {} };
  const sendReq = async () => { try { await userService.sendFriendRequest(searchResult.usuario.telefone); alert('Solicitação enviada!'); setShowSearch(false); setSearchPhone(''); setSearchResult(null); } catch (e) { alert(e.response?.data?.erro || 'Erro'); } };
  const acceptReq = async (id) => { try { await userService.respondToRequest(id, 'ACEITAR'); const [fr, rq] = await Promise.all([userService.getFriends(), userService.getFriendRequests()]); setFriends(fr.data.amigos || []); setRequests(rq.data.recebidas || []); } catch (e) {} };
  const rejectReq = async (id) => { try { await userService.respondToRequest(id, 'RECUSAR'); const r = await userService.getFriendRequests(); setRequests(r.data.recebidas || []); } catch (e) {} };

  const ini = (n) => (n ? n.substring(0, 2).toUpperCase() : '??');
  const ft = (iso) => iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  if (auth && isAdmin) return <Admin />;

  // ===== LOGIN =====
  if (!auth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 16 }}>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8fafc}input:focus{border-color:#dc2626!important;box-shadow:0 0 0 3px rgba(220,38,38,0.08)!important}`}</style>
        <div style={{
          width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, padding: '36px 28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Efeito camaleão no topo do card */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #dc2626, #06b6d4, #dc2626)',
            animation: 'shimmer 3s ease-in-out infinite',
            backgroundSize: '200% 100%'
          }}/>
          <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 8 }}>
            <div style={{
              width: 56, height: 56, margin: '0 auto 12px',
              background: 'linear-gradient(135deg, #dc2626, #06b6d4)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 8px 24px rgba(220,38,38,0.3), 0 4px 12px rgba(6,182,212,0.2)'
            }}><Icons.Lock /></div>
            <h1 style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Haremessenger</h1>
            <p style={{ color: '#94a3b8', fontSize: 12 }}>Mensageiro Seguro com Criptografia</p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3, marginBottom: 20 }}>
            <button onClick={() => setAuthTab('login')} style={tabBtn(authTab === 'login')}>Entrar</button>
            <button onClick={() => setAuthTab('register')} style={tabBtn(authTab === 'register')}>Registrar</button>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={doLogin}>
              <input type="text" placeholder="Username" value={login.username} onChange={e => setLogin(p => ({ ...p, username: e.target.value }))} required style={inp} />
              <input type="password" placeholder="Senha" value={login.password} onChange={e => setLogin(p => ({ ...p, password: e.target.value }))} required style={{ ...inp, marginBottom: 18 }} />
              <button type="submit" disabled={loading} style={btn(loading)}>{loading ? 'Entrando...' : '🔐 Entrar'}</button>
            </form>
          ) : (
            <form onSubmit={doRegister}>
              <input type="text" placeholder="Username" value={reg.username} onChange={e => setReg(p => ({ ...p, username: e.target.value }))} required style={inp} />
              <input type="tel" placeholder="Telefone" value={reg.telefone} onChange={e => setReg(p => ({ ...p, telefone: e.target.value }))} required style={inp} />
              <input type="password" placeholder="Senha" value={reg.password} onChange={e => setReg(p => ({ ...p, password: e.target.value }))} required style={{ ...inp, marginBottom: 18 }} />
              <button type="submit" disabled={loading} style={btn(loading)}>{loading ? 'Registrando...' : '✨ Criar Conta'}</button>
            </form>
          )}
        </div>
        <style>{`@keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;background:#f8fafc}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:#dc2626}
        input:focus{border-color:#dc2626!important;box-shadow:0 0 0 3px rgba(220,38,38,0.06)!important}
      `}</style>

      {/* HEADER */}
      <header style={{
        background: '#fff', padding: '10px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', zIndex: 100, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={iconBtn}>
              {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          )}
          <h1 style={{ fontSize: isMobile ? 16 : 19, fontWeight: 800, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icons.Lock /> Haremessenger
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <button onClick={notificationsEnabled ? disableNotifications : enableNotifications}
            style={{ padding: '6px 10px', borderRadius: 7, background: notificationsEnabled ? '#fef2f2' : 'transparent', border: notificationsEnabled ? '1px solid #dc2626' : '1px solid #e2e8f0', cursor: 'pointer', fontSize: 14, color: notificationsEnabled ? '#dc2626' : '#94a3b8', display: 'flex', alignItems: 'center' }}>
            {notificationsEnabled ? <Icons.Bell /> : <Icons.BellOff />}
          </button>
          {!isMobile && (
            <>
              <button onClick={() => setShowSearch(true)} style={{
                padding: '6px 13px', borderRadius: 7, background: 'linear-gradient(135deg, #dc2626, #06b6d4)',
                color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4, position: 'relative',
                boxShadow: '0 3px 10px rgba(220,38,38,0.25), 0 2px 6px rgba(6,182,212,0.2)'
              }}>
                <Icons.PersonAdd /> Adicionar
                {requests.length > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', borderRadius: 9, padding: '2px 6px', fontSize: 9, fontWeight: 700 }}>{requests.length}</span>}
              </button>
              <Avatar name={user?.username} size={34} />
              <span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>{user?.username}</span>
            </>
          )}
          <button onClick={doLogout} style={{
            padding: '6px 12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 7,
            cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4
          }}><Icons.Logout /> {!isMobile && 'Sair'}</button>
        </div>
      </header>

      <Divider />

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <div style={{
          width: isMobile ? '100%' : 370, height: '100%', background: '#fff',
          borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
          display: isMobile && !sidebarOpen ? 'none' : 'flex', flexDirection: 'column',
          position: isMobile ? 'absolute' : 'relative', zIndex: 50, flexShrink: 0,
          boxShadow: isMobile ? '0 20px 40px rgba(0,0,0,0.15)' : 'none',
          animation: isMobile && sidebarOpen ? 'slideIn 0.2s ease' : 'none'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', padding: '10px 10px 6px', gap: 5, flexShrink: 0 }}>
            <button onClick={() => setTab('chats')} style={sTab(tab === 'chats')}><Icons.Chat /> Chats</button>
            <button onClick={() => setTab('requests')} style={sTab(tab === 'requests')}>
              <Icons.Users /> Pedidos
              {requests.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', borderRadius: 9, padding: '2px 6px', fontSize: 9, fontWeight: 700 }}>{requests.length}</span>}
            </button>
          </div>

          <Divider />

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '5px 8px' }}>
            {tab === 'chats' && friends.map(f => (
              <div key={f.id} onClick={() => handleSelectFriend(f)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: 9, borderRadius: 10,
                cursor: 'pointer', marginBottom: 2, background: selFriend?.id === f.id ? '#fef2f2' : 'transparent',
                border: selFriend?.id === f.id ? '1px solid #dc2626' : '1px solid transparent', transition: 'all 0.15s'
              }}>
                <Avatar name={f.username} online={f.online} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{f.username}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{f.telefone}</div>
                </div>
              </div>
            ))}
            {tab === 'requests' && requests.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: 9,
                background: '#f8fafc', borderRadius: 10, marginBottom: 5, border: '1px solid #e2e8f0'
              }}>
                <Avatar name={r.remetente} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{r.remetente}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{r.telefone}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => acceptReq(r.id)} style={accBtn}><Icons.Check /></button>
                  <button onClick={() => rejectReq(r.id)} style={rejBtn}><Icons.CloseCircle /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay */}
        {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}/>}

        {/* CHAT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', minWidth: 0 }}>
          {selFriend ? (
            <>
              <div style={{ padding: '10px 18px', background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {isMobile && <button onClick={() => { setSelFriend(null); setSidebarOpen(true); }} style={iconBtn}><Icons.ChevronLeft /></button>}
                <Avatar name={selFriend.username} online={selFriend.online} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{selFriend.username}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: selFriend.online ? '#10b981' : '#cbd5e1' }}/> {selFriend.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              <Divider />

              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {msgs.map(m => (
                  <div key={m.id} style={{
                    maxWidth: '72%', padding: '9px 13px',
                    borderRadius: m.remetente === user.username ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.remetente === user.username ? 'linear-gradient(135deg, #dc2626, #06b6d4)' : '#fff',
                    color: m.remetente === user.username ? '#fff' : '#0f172a',
                    alignSelf: m.remetente === user.username ? 'flex-end' : 'flex-start',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', fontSize: 13, lineHeight: 1.5,
                    wordBreak: 'break-word', animation: 'fadeInUp 0.2s ease'
                  }}>
                    {typeof m.conteudo === 'string' ? m.conteudo : '[Mensagem criptografada]'}
                    <div style={{ fontSize: 9, marginTop: 3, textAlign: 'right', opacity: 0.6 }}>{ft(m.enviada_em)}</div>
                  </div>
                ))}
                <div ref={msgEnd}/>
              </div>

              <Divider />

              <div style={{ padding: '10px 18px', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sendMsg())}
                  placeholder="Mensagem..."
                  style={{ flex: 1, padding: '10px 16px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: 50, fontSize: 13, outline: 'none', color: '#0f172a' }}/>
                <button onClick={sendMsg} disabled={!newMsg.trim()} style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dc2626, #06b6d4)', border: 'none', color: '#fff',
                  cursor: newMsg.trim() ? 'pointer' : 'not-allowed', opacity: newMsg.trim() ? 1 : 0.5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(220,38,38,0.25), 0 2px 6px rgba(6,182,212,0.2)'
                }}><Icons.Send /></button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <div style={{ textAlign: 'center', maxWidth: 300 }}>
                <div style={{ fontSize: 56, marginBottom: 10, opacity: 0.15 }}>💬</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{isMobile ? 'Conversas' : 'Seus chats'}</h2>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>{isMobile ? 'Toque no menu ☰' : 'Escolha um amigo'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobile && !selFriend && (
        <>
          <Divider />
          <div style={{
            background: '#fff', padding: '4px 10px',
            display: 'flex', justifyContent: 'space-around', flexShrink: 0,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
          }}>
            <button onClick={() => { setTab('chats'); setSidebarOpen(true); }} style={mobNav}><Icons.Chat /><span style={{ fontSize: 9 }}>Chats</span></button>
            <button onClick={() => { setTab('requests'); setSidebarOpen(true); }} style={{ ...mobNav, position: 'relative' }}>
              <Icons.Users /><span style={{ fontSize: 9 }}>Pedidos</span>
              {requests.length > 0 && <span style={{ position: 'absolute', top: 0, right: 'calc(50% - 18px)', background: '#ef4444', color: '#fff', borderRadius: 8, padding: '1px 5px', fontSize: 8, fontWeight: 700 }}>{requests.length}</span>}
            </button>
            <button onClick={() => setShowSearch(true)} style={mobNav}><Icons.PersonAdd /><span style={{ fontSize: 9 }}>Adicionar</span></button>
          </div>
        </>
      )}

      {/* SEARCH MODAL */}
      {showSearch && (
        <div onClick={() => setShowSearch(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 18, padding: 24, width: '100%', maxWidth: 440,
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #dc2626, #06b6d4, #dc2626)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }}/>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, marginTop: 6, display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <Icons.PersonAdd /> Buscar Amigo
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Digite o número de telefone.</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <input type="tel" placeholder="+55 (00) 00000-0000" value={searchPhone} onChange={e => setSearchPhone(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}/>
              <button onClick={doSearch} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(220,38,38,0.2)' }}>Buscar</button>
            </div>
            {searchResult?.encontrado && (
              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, marginBottom: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{searchResult.usuario.username}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>{searchResult.usuario.telefone}</div>
                {searchResult.is_amigo ? <span style={{ padding: '5px 10px', background: '#f0fdf4', color: '#10b981', borderRadius: 16, fontSize: 11, fontWeight: 600 }}>✅ Amigos</span>
                  : searchResult.solicitacao_enviada ? <span style={{ padding: '5px 10px', background: '#fffbeb', color: '#f59e0b', borderRadius: 16, fontSize: 11, fontWeight: 600 }}>⏳ Aguardando</span>
                  : <button onClick={sendReq} style={{ width: '100%', padding: 10, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 3px 10px rgba(220,38,38,0.2)' }}>🤝 Adicionar</button>}
              </div>
            )}
            <button onClick={() => setShowSearch(false)} style={{ width: '100%', padding: 10, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ESTILOS =====
const inp = { width: '100%', padding: '11px 14px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 12, color: '#0f172a', boxSizing: 'border-box' };
const btn = (l) => ({ width: '100%', padding: 12, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: l ? 'not-allowed' : 'pointer', opacity: l ? 0.7 : 1, boxShadow: '0 4px 14px rgba(220,38,38,0.25), 0 2px 8px rgba(6,182,212,0.2)' });
const tabBtn = (a) => ({ flex: 1, padding: 9, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: a ? 700 : 400, background: a ? '#fff' : 'transparent', color: a ? '#dc2626' : '#94a3b8', boxShadow: a ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.15s' });
const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#334155', display: 'flex', alignItems: 'center' };
const sTab = (a) => ({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: a ? 700 : 400, background: a ? 'linear-gradient(135deg, #dc2626, #06b6d4)' : 'transparent', color: a ? '#fff' : '#64748b', position: 'relative', transition: 'all 0.15s', boxShadow: a ? '0 2px 8px rgba(220,38,38,0.2)' : 'none' });
const accBtn = { padding: 6, background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(16,185,129,0.2)' };
const rejBtn = { padding: 6, background: 'transparent', border: '1px solid #dc2626', borderRadius: 6, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const mobNav = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px 8px', fontSize: 16 };

export default App;
