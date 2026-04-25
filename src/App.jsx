import React, { useState, useEffect, useRef } from 'react';
import { authService, userService, chatService } from './services/api';
import Admin from './Admin';

// ===== PALETA ÚNICA =====
const C = {
  bg: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#f0f0f0',
  text: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',
  border: '#e5e5e5',
  success: '#10b981',
  danger: '#dc2626',
  warning: '#f59e0b',
  online: '#10b981',
  offline: '#cbd5e1',
};

// ===== ÍCONES SVG =====
const Icons = {
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  PersonAdd: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Chat: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  CloseCircle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Bell: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  BellOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Bot: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="3"/><path d="M12 7v4"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/><line x1="8" y1="21" x2="16" y2="21"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

// ===== LINHA DIVISÓRIA =====
const Divider = React.memo(() => (
  <div style={{
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #dc2626, #06b6d4, #dc2626, transparent)',
    boxShadow: '0 1px 6px rgba(220,38,38,0.15), 0 1px 6px rgba(6,182,212,0.1)',
    borderRadius: '1px', margin: 0, opacity: 0.8
  }}/>
));

// ===== AVATAR =====
const Avatar = React.memo(({ name, online, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: 12,
    background: 'linear-gradient(135deg, #dc2626, #06b6d4)',
    color: '#fff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '800',
    fontSize: size > 40 ? 15 : 12, position: 'relative', flexShrink: 0,
    boxShadow: '0 4px 14px rgba(220,38,38,0.25), 0 2px 8px rgba(6,182,212,0.15)'
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
  const [authPage, setAuthPage] = useState('login');
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
  const [fadeIn, setFadeIn] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  
  // Chat IA
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  
  const msgEnd = useRef(null);
  const aiMsgEnd = useRef(null);

  useEffect(() => {
    const h = () => { setIsMobile(window.innerWidth < 768); if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
  }, []);

  const handleSelectFriend = (f) => { setSelFriend(f); if (isMobile) setSidebarOpen(false); };

  useEffect(() => {
    const t = localStorage.getItem('token'), u = localStorage.getItem('user');
    if (t && u) {
      try { const d = JSON.parse(u); setUser(d); setAuth(true); setIsAdmin(d.username === 'admin'); } 
      catch (e) { localStorage.clear(); }
    }
  }, []);

  // Animação fade
  useEffect(() => {
    requestAnimationFrame(() => setFadeIn(true));
  }, []);

  const changePage = (page) => {
    setPageTransition(true);
    setTimeout(() => {
      setAuthPage(page);
      setPageTransition(false);
    }, 300);
  };

  useEffect(() => {
    if (auth && !isAdmin && 'Notification' in window && Notification.permission === 'granted') 
      setNotificationsEnabled(true);
  }, [auth, isAdmin]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) { alert('Navegador não suporta.'); return; }
    try {
      const p = await Notification.requestPermission();
      if (p === 'granted') { setNotificationsEnabled(true); new Notification('🔔 Haremessenger', { body: 'Notificações ativadas!' }); }
      else alert('❌ Permissão negada.');
    } catch (e) {}
  };

  const disableNotifications = () => setNotificationsEnabled(false);

  // Polling
  useEffect(() => {
    if (!selFriend?.conversa_id) return;
    let a = true;
    const p = async () => { if (!a) return; try { const r = await chatService.getMessages(selFriend.conversa_id); if (a) setMsgs(r.data.mensagens || []); } catch (e) {} };
    p(); const i = setInterval(p, 1000);
    return () => { a = false; clearInterval(i); };
  }, [selFriend?.conversa_id]);

  useEffect(() => {
    if (!auth || isAdmin) return;
    let a = true;
    const p = async () => {
      if (!a) return;
      try {
        const [fr, rq] = await Promise.all([userService.getFriends(), userService.getFriendRequests()]);
        if (a) { setFriends(fr.data.amigos || []); setRequests(rq.data.recebidas || []); }
      } catch (e) {}
    };
    p(); const i = setInterval(p, 2000);
    return () => { a = false; clearInterval(i); };
  }, [auth, isAdmin]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { aiMsgEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

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
    setAiMessages([]); setShowAiChat(false);
  };

  const sendMsg = async () => {
    const m = newMsg.trim(); if (!m || !selFriend?.conversa_id) return;
    setNewMsg('');
    try { await chatService.sendMessage(selFriend.conversa_id, m); const r = await chatService.getMessages(selFriend.conversa_id); setMsgs(r.data.mensagens || []); }
    catch (err) { setNewMsg(m); }
  };

  // ===== CHAT IA - THUNDERBOLD_AI =====
  const toggleAiChat = () => {
    if (!showAiChat) {
      setAiMessages([{ role: 'assistant', content: '👋 Olá! Eu sou o Thunderbold_AI. Como posso ajudar você hoje?', id: Date.now() }]);
    }
    setShowAiChat(!showAiChat);
  };

  const sendToAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    
    const userMsg = { role: 'user', content: aiInput.trim(), id: Date.now() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:8000/api'
        : 'https://secure-messaging-api.onrender.com/api';
      
      const response = await fetch(`${apiUrl}/ai/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ mensagem: userMsg.content })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setAiMessages(prev => [...prev, {
          role: 'assistant', content: data.reply, id: Date.now() + 1, cached: data.cached
        }]);
      } else {
        setAiMessages(prev => [...prev, {
          role: 'assistant', content: '❌ ' + (data.erro || 'Erro ao processar'), id: Date.now() + 1
        }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, {
        role: 'assistant', content: '❌ Erro de conexão com o servidor', id: Date.now() + 1
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:8000/api'
        : 'https://secure-messaging-api.onrender.com/api';
      
      await fetch(`${apiUrl}/ai/clear/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      });
    } catch (e) {}
    setAiMessages([{ role: 'assistant', content: '🧹 Histórico limpo! Nova conversa iniciada.', id: Date.now() }]);
  };

  const doSearch = async () => { if (!searchPhone.trim()) return; try { const r = await userService.searchByPhone(searchPhone); setSearchResult(r.data); } catch (e) {} };
  const sendReq = async () => { try { await userService.sendFriendRequest(searchResult.usuario.telefone); alert('Solicitação enviada!'); setShowSearch(false); setSearchPhone(''); setSearchResult(null); } catch (e) { alert(e.response?.data?.erro || 'Erro'); } };
  const acceptReq = async (id) => { try { await userService.respondToRequest(id, 'ACEITAR'); const [fr, rq] = await Promise.all([userService.getFriends(), userService.getFriendRequests()]); setFriends(fr.data.amigos || []); setRequests(rq.data.recebidas || []); } catch (e) {} };
  const rejectReq = async (id) => { try { await userService.respondToRequest(id, 'RECUSAR'); const r = await userService.getFriendRequests(); setRequests(r.data.recebidas || []); } catch (e) {} };

  const ini = (n) => (n ? n.substring(0, 2).toUpperCase() : '??');
  const ft = (iso) => iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  if (auth && isAdmin) return <Admin />;

  // ===== LOGIN PAGE =====
  if (!auth) {
    return (
      <div style={{
        minHeight: '100vh', minHeight: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f5',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e0e0e0\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        padding: 20, position: 'fixed', inset: 0, overflow: 'hidden'
      }}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5;overscroll-behavior:none}
          @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
          @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          @keyframes fadeInScale{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
          @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
          input{font-size:16px!important}
        `}</style>

        <div style={{
          width: '100%', maxWidth: 420, background: '#fff',
          borderRadius: 20, padding: '36px 28px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
          position: 'relative', overflow: 'hidden',
          animation: 'fadeInScale 0.5s ease',
          maxHeight: '95vh', overflowY: 'auto'
        }}>
          {/* Linha camaleão */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #dc2626, #06b6d4, #dc2626)',
            animation: 'shimmer 3s ease-in-out infinite', backgroundSize: '200% 100%'
          }}/>

          <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 6, animation: 'fadeInUp 0.6s ease' }}>
            <div style={{
              width: 56, height: 56, margin: '0 auto 12px',
              background: 'linear-gradient(135deg, #dc2626, #06b6d4)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 8px 24px rgba(220,38,38,0.3), 0 4px 12px rgba(6,182,212,0.2)'
            }}><Icons.Lock /></div>
            <h1 style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Haremessenger</h1>
            <p style={{ color: '#94a3b8', fontSize: 12 }}>Mensageiro Seguro com Criptografia</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: '#f0f0f0', borderRadius: 10,
            padding: 3, marginBottom: 24
          }}>
            <button onClick={() => changePage('login')} style={tabBtnStyle(authPage === 'login')}>Entrar</button>
            <button onClick={() => changePage('register')} style={tabBtnStyle(authPage === 'register')}>Criar Conta</button>
          </div>

          {/* Formulário com transição */}
          <div style={{
            opacity: pageTransition ? 0 : 1,
            transform: pageTransition ? 'translateY(8px)' : 'translateY(0)',
            transition: 'all 0.3s ease'
          }}>
            {authPage === 'login' ? (
              <form onSubmit={doLogin}>
                <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                  <input type="text" placeholder="Username" value={login.username}
                    onChange={e => setLogin(p => ({ ...p, username: e.target.value }))} required style={inp}/>
                </div>
                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <input type="password" placeholder="Senha" value={login.password}
                    onChange={e => setLogin(p => ({ ...p, password: e.target.value }))} required style={{ ...inp, marginBottom: 20 }}/>
                </div>
                <div style={{ animation: 'fadeInUp 0.6s ease' }}>
                  <button type="submit" disabled={loading} style={btnStyle(loading)}>
                    {loading ? <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid transparent', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: 8 }}/> Entrando...</> : '🔐 Entrar'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={doRegister}>
                <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                  <input type="text" placeholder="Username" value={reg.username}
                    onChange={e => setReg(p => ({ ...p, username: e.target.value }))} required style={inp}/>
                </div>
                <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <input type="tel" placeholder="Telefone" value={reg.telefone}
                    onChange={e => setReg(p => ({ ...p, telefone: e.target.value }))} required style={inp}/>
                </div>
                <div style={{ animation: 'fadeInUp 0.6s ease' }}>
                  <input type="password" placeholder="Senha" value={reg.password}
                    onChange={e => setReg(p => ({ ...p, password: e.target.value }))} required style={{ ...inp, marginBottom: 20 }}/>
                </div>
                <div style={{ animation: 'fadeInUp 0.7s ease' }}>
                  <button type="submit" disabled={loading} style={btnStyle(loading)}>
                    {loading ? <><span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid transparent', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', marginRight: 8 }}/> Criando...</> : '✨ Criar Conta'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div style={{
      height: '100vh', height: '100dvh', display: 'flex', flexDirection: 'column',
      background: '#f5f5f5',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e8e8e8\' fill-opacity=\'0.5\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      overflow: 'hidden'
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;background:#f5f5f5}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes badgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d0d0d0;border-radius:3px}
        .badge-pulse{animation:badgePulse 2s infinite}
        input{font-size:16px!important}
        @media(min-width:768px){input{font-size:14px!important}}
      `}</style>

      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={iconBtn}>
              {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          )}
          <h1 style={logoStyle(isMobile)}><Icons.Lock /> Haremessenger</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {/* Botão Thunderbold_AI */}
          <button onClick={toggleAiChat} style={{
            padding: '6px 10px', borderRadius: 7,
            background: showAiChat ? '#f0fdf4' : 'transparent',
            border: showAiChat ? '1px solid #10b981' : '1px solid #e5e5e5',
            cursor: 'pointer', fontSize: 16, color: showAiChat ? '#10b981' : '#64748b',
            display: 'flex', alignItems: 'center', gap: 4, position: 'relative',
            fontWeight: 600, fontSize: 11
          }}>
            <Icons.Bot /> AI
          </button>
          <button onClick={notificationsEnabled ? disableNotifications : enableNotifications}
            style={notifBtnStyle(notificationsEnabled)}>
            {notificationsEnabled ? <Icons.Bell /> : <Icons.BellOff />}
          </button>
          {!isMobile && (
            <>
              <button onClick={() => setShowSearch(true)} style={addBtnStyle}>
                <Icons.PersonAdd /> Adicionar
                {requests.length > 0 && <span className="badge-pulse" style={badgeStyle}>{requests.length}</span>}
              </button>
              <Avatar name={user?.username} size={32} />
              <span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>{user?.username}</span>
            </>
          )}
          <button onClick={doLogout} style={logoutBtnStyle}>
            <Icons.Logout /> {!isMobile && 'Sair'}
          </button>
        </div>
      </header>

      <Divider />

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <div style={sidebarStyle(isMobile, sidebarOpen)}>
          <div style={{ display: 'flex', padding: '10px 10px 6px', gap: 5, flexShrink: 0 }}>
            <button onClick={() => { setTab('chats'); if (showAiChat) setShowAiChat(false); }} style={sideTab(tab === 'chats' && !showAiChat)}>
              <Icons.Chat /> Chats
            </button>
            <button onClick={() => setTab('requests')} style={sideTab(tab === 'requests')}>
              <Icons.Users /> Pedidos
              {requests.length > 0 && <span className="badge-pulse" style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', borderRadius: 9, padding: '2px 6px', fontSize: 9, fontWeight: 700 }}>{requests.length}</span>}
            </button>
          </div>

          <Divider />

          <div style={listStyle}>
            {tab === 'chats' && friends.map(f => (
              <div key={f.id} onClick={() => { handleSelectFriend(f); setShowAiChat(false); }} style={friendItemStyle(selFriend?.id === f.id)}>
                <Avatar name={f.username} online={f.online} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{f.username}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{f.telefone}</div>
                </div>
              </div>
            ))}
            {tab === 'requests' && requests.map(r => (
              <div key={r.id} style={requestItem}>
                <Avatar name={r.remetente} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{r.remetente}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{r.telefone}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => acceptReq(r.id)} style={acceptBtn}><Icons.Check /></button>
                  <button onClick={() => rejectReq(r.id)} style={rejectBtn}><Icons.CloseCircle /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={overlayStyle}/>}

        {/* CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', minWidth: 0 }}>
          {/* Thunderbold_AI Chat */}
          {showAiChat ? (
            <>
              <div style={chatHeader}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                }}>🤖</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Thunderbold_AI</div>
                  <div style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}/> Online - Sempre disponível
                  </div>
                </div>
                <button onClick={clearAiHistory} style={iconBtn} title="Limpar histórico">
                  <Icons.Trash />
                </button>
              </div>

              <Divider />

              <div style={msgArea}>
                {aiMessages.map(m => (
                  <div key={m.id} style={msgBubble(m.role === 'user')}>
                    <div style={{ fontWeight: 600, fontSize: 10, marginBottom: 2, opacity: 0.7 }}>
                      {m.role === 'user' ? user?.username || 'Você' : 'Thunderbold_AI'}
                      {m.cached && <span style={{ fontSize: 8, marginLeft: 4, opacity: 0.5 }}>(cache)</span>}
                    </div>
                    {m.content}
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ alignSelf: 'flex-start', padding: 12, background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <span style={{ display: 'inline-flex', gap: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 1.4s infinite' }}/>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 1.4s infinite 0.2s' }}/>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 1.4s infinite 0.4s' }}/>
                    </span>
                  </div>
                )}
                <div ref={aiMsgEnd}/>
              </div>

              <Divider />

              <div style={chatInputBar}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sendToAI())}
                  placeholder="Pergunte ao Thunderbold_AI..." style={msgInput}/>
                <button onClick={sendToAI} disabled={!aiInput.trim() || aiLoading} style={sendBtnStyle(!aiInput.trim() || aiLoading)}>
                  <Icons.Send />
                </button>
              </div>
            </>
          ) : selFriend ? (
            <>
              <div style={chatHeader}>
                {isMobile && <button onClick={() => { setSelFriend(null); setSidebarOpen(true); }} style={iconBtn}><Icons.ChevronLeft /></button>}
                <Avatar name={selFriend.username} online={selFriend.online} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{selFriend.username}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: selFriend.online ? '#10b981' : '#cbd5e1', boxShadow: selFriend.online ? '0 0 6px rgba(16,185,129,0.5)' : 'none' }}/>
                    {selFriend.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              <Divider />

              <div style={msgArea}>
                {msgs.map(m => (
                  <div key={m.id} style={msgBubble(m.remetente === user.username)}>
                    {typeof m.conteudo === 'string' ? m.conteudo : '[Mensagem criptografada]'}
                    <div style={{ fontSize: 9, marginTop: 3, textAlign: 'right', opacity: 0.6 }}>{ft(m.enviada_em)}</div>
                  </div>
                ))}
                <div ref={msgEnd}/>
              </div>

              <Divider />

              <div style={chatInputBar}>
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sendMsg())}
                  placeholder="Mensagem..." style={msgInput}/>
                <button onClick={sendMsg} disabled={!newMsg.trim()} style={sendBtnStyle(!newMsg.trim())}>
                  <Icons.Send />
                </button>
              </div>
            </>
          ) : (
            <div style={emptyChat}>
              <div style={{ textAlign: 'center', maxWidth: 300 }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.08 }}>💬</div>
                <h2 style={{ fontSize: 17, fontWeight: 700, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
                  {isMobile ? 'Suas conversas' : 'Seus chats'}
                </h2>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                  {isMobile ? 'Toque no menu ☰' : 'Escolha um amigo para conversar'}
                </p>
                <button onClick={toggleAiChat} style={{
                  padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto'
                }}>
                  <Icons.Bot /> Falar com Thunderbold_AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobile && !selFriend && !showAiChat && (
        <>
          <Divider />
          <div style={mobileNav}>
            <button onClick={() => { setTab('chats'); setSidebarOpen(true); }} style={mobileNavBtn}>
              <Icons.Chat /><span style={{ fontSize: 9 }}>Chats</span>
            </button>
            <button onClick={() => { setTab('requests'); setSidebarOpen(true); }} style={{ ...mobileNavBtn, position: 'relative' }}>
              <Icons.Users /><span style={{ fontSize: 9 }}>Pedidos</span>
              {requests.length > 0 && <span className="badge-pulse" style={{ position: 'absolute', top: -4, right: 'calc(50% - 20px)', background: '#ef4444', color: '#fff', borderRadius: 10, padding: '3px 7px', fontSize: 9, fontWeight: 800, minWidth: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>{requests.length}</span>}
            </button>
            <button onClick={toggleAiChat} style={mobileNavBtn}>
              <Icons.Bot /><span style={{ fontSize: 9 }}>IA</span>
            </button>
            <button onClick={() => setShowSearch(true)} style={mobileNavBtn}>
              <Icons.PersonAdd /><span style={{ fontSize: 9 }}>Adicionar</span>
            </button>
          </div>
        </>
      )}

      {/* SEARCH MODAL */}
      {showSearch && (
        <div onClick={() => setShowSearch(false)} style={modalOverlay}>
          <div onClick={e => e.stopPropagation()} style={modalContent}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #dc2626, #06b6d4, #dc2626)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }}/>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <Icons.PersonAdd /> Buscar Amigo
            </h2>
            <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>Digite o número de telefone.</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <input type="tel" placeholder="+55 (00) 00000-0000" value={searchPhone} onChange={e => setSearchPhone(e.target.value)}
                style={{ flex: 1, padding: '11px 14px', background: '#f0f0f0', border: '2px solid #e5e5e5', borderRadius: 8, fontSize: 16, outline: 'none', color: '#0f172a' }}/>
              <button onClick={doSearch} style={{ padding: '11px 18px', background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.25)', whiteSpace: 'nowrap' }}>Buscar</button>
            </div>
            {searchResult?.encontrado && (
              <div style={{ padding: 12, background: '#f0f0f0', borderRadius: 10, marginBottom: 12, border: '1px solid #e5e5e5' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>{searchResult.usuario.username}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>{searchResult.usuario.telefone}</div>
                {searchResult.is_amigo ? <span style={statusBadge('#10b981')}>✅ Já são amigos</span>
                  : searchResult.solicitacao_enviada ? <span style={statusBadge('#f59e0b')}>⏳ Aguardando</span>
                  : <button onClick={sendReq} style={{ width: '100%', padding: 10, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.25)' }}>🤝 Adicionar Amigo</button>}
              </div>
            )}
            <button onClick={() => setShowSearch(false)} style={{ width: '100%', padding: 11, background: '#f0f0f0', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ESTILOS =====
const inp = { width: '100%', padding: '12px 14px', background: '#f0f0f0', border: '2px solid #e5e5e5', borderRadius: 10, fontSize: 16, outline: 'none', color: '#0f172a', marginBottom: 14, boxSizing: 'border-box' };
const btnStyle = (l) => ({ width: '100%', padding: 13, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: l ? 'not-allowed' : 'pointer', opacity: l ? 0.8 : 1, boxShadow: '0 5px 20px rgba(220,38,38,0.25), 0 2px 10px rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const tabBtnStyle = (a) => ({ flex: 1, padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: a ? 700 : 400, background: a ? '#fff' : 'transparent', color: a ? '#dc2626' : '#94a3b8', boxShadow: a ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' });
const iconBtn = { background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: '#334155', display: 'flex', alignItems: 'center' };

const headerStyle = { background: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', zIndex: 100, flexShrink: 0 };
const logoStyle = (mob) => ({ fontSize: mob ? 15 : 18, fontWeight: 800, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 6 });

const notifBtnStyle = (active) => ({ padding: '6px 10px', borderRadius: 7, background: active ? '#fef2f2' : 'transparent', border: active ? '1px solid #dc2626' : '1px solid #e5e5e5', cursor: 'pointer', fontSize: 14, color: active ? '#dc2626' : '#94a3b8', display: 'flex', alignItems: 'center', position: 'relative' });
const addBtnStyle = { padding: '6px 12px', borderRadius: 7, background: 'linear-gradient(135deg, #dc2626, #06b6d4)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, position: 'relative', boxShadow: '0 3px 12px rgba(220,38,38,0.25), 0 2px 8px rgba(6,182,212,0.2)' };
const badgeStyle = { position: 'absolute', top: -5, right: -5, background: '#ef4444', color: '#fff', borderRadius: 9, padding: '2px 6px', fontSize: 9, fontWeight: 700 };
const logoutBtnStyle = { padding: '6px 12px', background: 'transparent', border: '1px solid #e5e5e5', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 };

const sidebarStyle = (mob, open) => ({ width: mob ? '100%' : 360, height: '100%', background: '#fff', borderRight: mob ? 'none' : '1px solid #e5e5e5', display: mob && !open ? 'none' : 'flex', flexDirection: 'column', position: mob ? 'absolute' : 'relative', zIndex: 50, flexShrink: 0, boxShadow: mob ? '0 20px 40px rgba(0,0,0,0.15)' : 'none', animation: mob && open ? 'slideIn 0.2s ease' : 'none' });
const sideTab = (active) => ({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: active ? 700 : 400, background: active ? 'linear-gradient(135deg, #dc2626, #06b6d4)' : 'transparent', color: active ? '#fff' : '#64748b', position: 'relative', transition: 'all 0.15s', boxShadow: active ? '0 3px 10px rgba(220,38,38,0.25)' : 'none' });
const listStyle = { flex: 1, overflowY: 'auto', padding: '5px 8px', WebkitOverflowScrolling: 'touch' };
const friendItemStyle = (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: 9, borderRadius: 10, cursor: 'pointer', marginBottom: 2, background: active ? '#fef2f2' : 'transparent', border: active ? '1px solid #dc2626' : '1px solid transparent', transition: 'all 0.15s' });
const requestItem = { display: 'flex', alignItems: 'center', gap: 8, padding: 9, background: '#f0f0f0', borderRadius: 10, marginBottom: 5, border: '1px solid #e5e5e5' };
const acceptBtn = { padding: 6, background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.25)' };
const rejectBtn = { padding: 6, background: 'transparent', border: '1px solid #dc2626', borderRadius: 6, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const overlayStyle = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 };

const chatHeader = { padding: '10px 14px', background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' };
const msgArea = { flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, WebkitOverflowScrolling: 'touch' };
const msgBubble = (isOwn) => ({ maxWidth: '72%', padding: '10px 13px', borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isOwn ? 'linear-gradient(135deg, #dc2626, #06b6d4)' : '#fff', color: isOwn ? '#fff' : '#0f172a', alignSelf: isOwn ? 'flex-end' : 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word', animation: 'fadeInUp 0.2s ease' });
const chatInputBar = { padding: '10px 14px', background: '#fff', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 };
const msgInput = { flex: 1, padding: '10px 16px', background: '#f0f0f0', border: '2px solid #e5e5e5', borderRadius: 50, fontSize: 16, outline: 'none', color: '#0f172a' };
const sendBtnStyle = (disabled) => ({ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #06b6d4)', border: 'none', color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(220,38,38,0.25), 0 2px 8px rgba(6,182,212,0.2)' });
const emptyChat = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };

const mobileNav = { background: '#fff', padding: '5px 4px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexShrink: 0, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', gap: 1, zIndex: 60 };
const mobileNavBtn = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px 6px', fontSize: 16, minWidth: 50, transition: 'all 0.15s', borderRadius: 8, position: 'relative' };

const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 };
const modalContent = { background: '#fff', borderRadius: 18, padding: 24, width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', position: 'relative', WebkitOverflowScrolling: 'touch' };
const statusBadge = (color) => ({ padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, background: color + '15', color: color, border: '1px solid ' + color });

export default App;
