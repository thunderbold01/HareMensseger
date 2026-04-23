import React, { useState, useEffect, useRef } from 'react';
import { authService, userService, chatService } from './services/api';
import Admin from './Admin';

// ===== PALETA DE CORES - TEMA BRANCO COM CONTORNOS CIANO/AZUL =====
const C = {
  gradientStart: '#06b6d4',
  gradientEnd: '#3b82f6',
  gradientLight: 'rgba(6, 182, 212, 0.1)',
  gradientLighter: 'rgba(59, 130, 246, 0.05)',
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#fafafa',
  text: '#0f172a',
  textMuted: '#64748b',
  textInverse: '#ffffff',
  border: '#e2e8f0',
  borderGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  borderGlow: '0 0 0 1px rgba(6, 182, 212, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  shadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
  shadowMd: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  shadowLg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
  shadowGlow: '0 0 0 1px rgba(6, 182, 212, 0.2), 0 8px 32px rgba(59, 130, 246, 0.15)',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  online: '#10b981',
  offline: '#94a3b8',
  sent: '#f0f9ff',
  sentBorder: '#bae6fd',
  received: '#ffffff',
  receivedBorder: '#f1f5f9',
  radius: '12px',
  radiusLg: '20px',
  radiusFull: '9999px',
};

// ===== ÍCONES SVG =====
const Icons = {
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  PersonAdd: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Chat: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Notifications: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  NotificationsOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CloseCircle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  MoreVert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

// ===== ESTILOS BASE =====
const buttonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '10px 20px',
  borderRadius: C.radius,
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const btnGradient = {
  ...buttonBase,
  background: `linear-gradient(135deg, ${C.gradientStart}, ${C.gradientEnd})`,
  color: C.textInverse,
  boxShadow: `0 4px 14px 0 rgba(6, 182, 212, 0.3)`,
};

const btnOutline = {
  ...buttonBase,
  background: C.surface,
  color: C.text,
  border: `1px solid ${C.border}`,
};

const inputBase = {
  width: '100%',
  padding: '12px 16px',
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  borderRadius: C.radius,
  fontSize: '14px',
  color: C.text,
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
};

// ===== COMPONENTE PRINCIPAL =====
function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const msgEnd = useRef(null);
  const pollingRef = useRef(null);

  // ===== INICIALIZAÇÃO =====
  useEffect(() => {
    const t = localStorage.getItem('token'), u = localStorage.getItem('user');
    if (t && u) {
      try {
        const d = JSON.parse(u);
        setUser(d);
        setAuth(true);
        if (d.username === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          loadFriends();
          loadRequests();
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  // ===== NOTIFICAÇÕES =====
  useEffect(() => {
    if (auth && !isAdmin && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, [auth, isAdmin]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('🔔 CipherChat', {
          body: 'Notificações ativadas com sucesso!',
        });
      } else {
        alert('❌ Permissão negada. Ative nas configurações do navegador.');
      }
    } catch (e) {
      console.error('Erro:', e);
    }
  };

  const disableNotifications = async () => {
    setNotificationsEnabled(false);
    alert('🔕 Notificações desativadas.');
  };

  // ===== POLLING DE MENSAGENS =====
  useEffect(() => {
    if (selFriend?.conversa_id) {
      loadMsgs();
      pollingRef.current = setInterval(loadMsgs, 2000);
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [selFriend?.conversa_id]);

  // ===== POLLING DE AMIGOS =====
  useEffect(() => {
    if (auth && !isAdmin) {
      const friendPolling = setInterval(() => {
        loadFriends();
        loadRequests();
      }, 5000);
      return () => clearInterval(friendPolling);
    }
  }, [auth, isAdmin]);

  // ===== SCROLL AUTOMÁTICO =====
  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // ===== API CALLS =====
  const loadFriends = async () => {
    try {
      const r = await userService.getFriends();
      setFriends(r.data.amigos || []);
    } catch (e) {
      console.error('Erro ao carregar amigos:', e);
    }
  };

  const loadRequests = async () => {
    try {
      const r = await userService.getFriendRequests();
      setRequests(r.data.recebidas || []);
    } catch (e) {
      console.error('Erro ao carregar solicitações:', e);
    }
  };

  const loadMsgs = async () => {
    if (!selFriend?.conversa_id) return;
    try {
      const r = await chatService.getMessages(selFriend.conversa_id);
      const mensagens = r.data.mensagens || [];
      setMsgs(mensagens);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await authService.login(login);
      const userData = r.data.usuario;
      setUser(userData);
      setAuth(true);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.username === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        loadFriends();
        loadRequests();
      }
      setLogin({ username: '', password: '' });
    } catch (err) {
      alert('Login falhou. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await authService.register({
        username: reg.username,
        password: reg.password,
        numero_celular: reg.telefone,
      });
      const userData = r.data.usuario;
      setUser(userData);
      setAuth(true);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.username === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        loadFriends();
        loadRequests();
      }
      setReg({ username: '', password: '', telefone: '' });
    } catch (err) {
      alert('Registro falhou. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const doLogout = () => {
    localStorage.clear();
    setAuth(false);
    setUser(null);
    setIsAdmin(false);
    setNotificationsEnabled(false);
    setFriends([]);
    setSelFriend(null);
    setMsgs([]);
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  const sendMsg = async () => {
    if (!newMsg.trim() || !selFriend?.conversa_id) return;

    const conteudo = newMsg.trim();
    setNewMsg('');

    try {
      await chatService.sendMessage(selFriend.conversa_id, conteudo);
      setTimeout(() => {
        loadMsgs();
      }, 300);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setNewMsg(conteudo);
      alert('Erro ao enviar mensagem');
    }
  };

  const doSearch = async () => {
    if (!searchPhone.trim()) return;
    try {
      const r = await userService.searchByPhone(searchPhone);
      setSearchResult(r.data);
    } catch (err) {
      console.error('Erro na busca:', err);
    }
  };

  const sendReq = async () => {
    if (!searchResult?.usuario) return;
    try {
      await userService.sendFriendRequest(searchResult.usuario.telefone);
      alert('Solicitação enviada!');
      setShowSearch(false);
      setSearchPhone('');
      setSearchResult(null);
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao enviar solicitação');
    }
  };

  const acceptReq = async (id) => {
    try {
      await userService.respondToRequest(id, 'ACEITAR');
      loadFriends();
      loadRequests();
    } catch (e) {
      console.error('Erro ao aceitar:', e);
    }
  };

  const rejectReq = async (id) => {
    try {
      await userService.respondToRequest(id, 'RECUSAR');
      loadRequests();
    } catch (e) {
      console.error('Erro ao recusar:', e);
    }
  };

  const ini = (n) => (n ? n.substring(0, 2).toUpperCase() : '?');
  const ft = (iso) =>
    iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  // ===== ESTILOS =====
  const S = {
    appContainer: {
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      background: C.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    loginBg: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${C.gradientLighter} 0%, ${C.bg} 50%, ${C.gradientLight} 100%)`,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    loginDecor: {
      position: 'absolute',
      width: '800px',
      height: '800px',
      borderRadius: '50%',
      background: `radial-gradient(ellipse at center, ${C.gradientLight} 0%, transparent 60%)`,
      top: '-300px',
      right: '-300px',
      pointerEvents: 'none',
      opacity: 0.6,
    },
    loginCard: {
      position: 'relative',
      borderRadius: C.radiusLg,
      background: C.surface,
      boxShadow: C.shadowGlow,
      width: '100%',
      maxWidth: '420px',
      padding: '36px 32px',
      zIndex: 1,
      boxSizing: 'border-box',
    },
    loginHeader: { textAlign: 'center', marginBottom: '28px' },
    loginLogo: {
      fontSize: '28px',
      fontWeight: '800',
      background: C.borderGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    loginSubtitle: { color: C.textMuted, fontSize: '13px', fontWeight: '400' },
    tabRow: {
      display: 'flex',
      background: C.surfaceAlt,
      borderRadius: C.radius,
      padding: '4px',
      marginBottom: '24px',
      border: `1px solid ${C.border}`,
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: '10px 14px',
      border: 'none',
      borderRadius: C.radius,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: active ? '700' : '500',
      background: active ? C.surface : 'transparent',
      color: active ? C.gradientStart : C.textMuted,
      boxShadow: active ? C.shadow : 'none',
      transition: 'all 0.2s ease',
    }),
    inputGroup: { marginBottom: '14px' },
    inputLabel: {
      display: 'block',
      fontSize: '11px',
      fontWeight: '700',
      color: C.textMuted,
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
    },
    btnFull: { ...btnGradient, width: '100%', padding: '12px', fontSize: '14px', marginTop: '4px' },
    btnFullDisabled: { ...btnGradient, width: '100%', padding: '12px', fontSize: '14px', marginTop: '4px', opacity: 0.6, cursor: 'not-allowed' },
    header: {
      background: C.surface,
      padding: '0 20px',
      height: '64px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: C.shadowSm,
      width: '100%',
      boxSizing: 'border-box',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    logo: {
      fontSize: '20px',
      fontWeight: '800',
      background: C.borderGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    headerRight: { display: 'flex', alignItems: 'center', gap: '8px' },
    avatar: (size = 38) => ({
      width: size,
      height: size,
      borderRadius: C.radiusFull,
      background: `linear-gradient(135deg, ${C.gradientStart}, ${C.gradientEnd})`,
      color: C.textInverse,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: size > 40 ? '15px' : '11px',
      flexShrink: 0,
      position: 'relative',
      boxShadow: `0 4px 12px rgba(6, 182, 212, 0.25)`,
      border: `2px solid ${C.surface}`,
    }),
    statusDot: (online) => ({
      position: 'absolute',
      bottom: '1px',
      right: '1px',
      width: '11px',
      height: '11px',
      borderRadius: C.radiusFull,
      border: `2px solid ${C.surface}`,
      background: online ? C.online : C.offline,
      boxShadow: online ? `0 0 0 2px ${C.online}30` : 'none',
    }),
    iconBtn: {
      width: '40px',
      height: '40px',
      borderRadius: C.radius,
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'all 0.2s ease',
      color: C.textMuted,
    },
    badge: {
      position: 'absolute',
      top: '-3px',
      right: '-3px',
      background: C.danger,
      color: C.textInverse,
      borderRadius: C.radiusFull,
      minWidth: '18px',
      height: '18px',
      fontSize: '10px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5px',
      boxShadow: `0 2px 6px rgba(239, 68, 68, 0.3)`,
    },
    notifBtn: (active) => ({
      width: '40px',
      height: '40px',
      borderRadius: C.radius,
      background: active ? C.success + '10' : C.surfaceAlt,
      border: `1px solid ${active ? C.success : C.border}`,
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transition: 'all 0.2s ease',
      color: active ? C.success : C.textMuted,
    }),
    main: {
      display: 'flex',
      flex: 1,
      height: 'calc(100vh - 64px)',
      width: '100%',
      background: C.bg,
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    sidebar: {
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxShadow: C.shadowSm,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      width: sidebarCollapsed ? '72px' : '340px',
      overflow: 'hidden',
      position: 'relative',
    },
    sidebarHeader: {
      padding: '14px 16px',
      borderBottom: `1px solid ${C.border}`,
      background: C.surfaceAlt,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchBox: {
      position: 'relative',
      flex: 1,
      display: sidebarCollapsed ? 'none' : 'block',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: C.textMuted,
      fontSize: '16px',
      pointerEvents: 'none',
      zIndex: 1,
    },
    searchInput: {
      ...inputBase,
      paddingLeft: '38px',
      paddingRight: '12px',
      background: C.surface,
      fontSize: '13px',
      width: '100%',
    },
    sidebarToggle: {
      position: 'absolute',
      right: '-12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '24px',
      height: '40px',
      borderRadius: C.radiusFull,
      background: C.surface,
      border: `1px solid ${C.border}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: C.shadow,
      zIndex: 10,
      color: C.textMuted,
      transition: 'all 0.2s ease',
    },
    sideTabs: {
      display: 'flex',
      padding: '8px 12px',
      gap: '4px',
      borderBottom: `1px solid ${C.border}`,
      background: C.surface,
    },
    sideTab: (active) => ({
      flex: 1,
      padding: '9px 12px',
      textAlign: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? 700 : 500,
      color: active ? C.gradientStart : C.textMuted,
      borderRadius: C.radius,
      background: active ? C.gradientLight : 'transparent',
      transition: 'all 0.2s ease',
      display: sidebarCollapsed ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    }),
    contactList: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '6px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
    },
    contact: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: sidebarCollapsed ? '0' : '10px',
      padding: sidebarCollapsed ? '12px' : '10px 12px',
      borderRadius: C.radius,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: active ? C.gradientLight : 'transparent',
      border: active ? `1px solid ${C.gradientStart}30` : '1px solid transparent',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      minWidth: 0,
    }),
    contactContent: {
      display: sidebarCollapsed ? 'none' : 'flex',
      alignItems: 'center',
      gap: '10px',
      flex: 1,
      minWidth: 0,
    },
    contactInfo: { flex: 1, minWidth: 0 },
    contactName: {
      fontWeight: '600',
      fontSize: '13px',
      color: C.text,
      marginBottom: '2px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contactPhone: {
      fontSize: '11px',
      color: C.textMuted,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    requestCard: {
      display: sidebarCollapsed ? 'none' : 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      background: C.surfaceAlt,
      borderRadius: C.radius,
      marginBottom: '5px',
      border: `1px solid ${C.border}`,
      transition: 'all 0.2s ease',
      minWidth: 0,
    },
    requestInfo: { flex: 1, minWidth: 0 },
    requestName: { fontWeight: '600', fontSize: '13px', color: C.text },
    requestPhone: { fontSize: '10px', color: C.textMuted },
    requestActions: { display: 'flex', gap: '5px', flexShrink: 0 },
    btnSm: (bg) => ({
      padding: '6px 12px',
      border: 'none',
      borderRadius: C.radius,
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600',
      background: bg,
      color: C.textInverse,
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      transition: 'all 0.15s ease',
    }),
    btnSmOutline: (color) => ({
      padding: '6px 12px',
      border: `1px solid ${color}`,
      borderRadius: C.radius,
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600',
      background: 'transparent',
      color: color,
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      transition: 'all 0.15s ease',
    }),
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(to bottom, ${C.bg}, ${C.surfaceAlt})`,
      position: 'relative',
      minWidth: 0,
      overflow: 'hidden',
    },
    chatHeader: {
      padding: '14px 20px',
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: C.shadowSm,
      minWidth: 0,
    },
    chatTitle: { fontWeight: '700', fontSize: '15px', color: C.text },
    chatStatus: { fontSize: '11px', color: C.textMuted, display: 'flex', alignItems: 'center', gap: '4px' },
    messageArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    message: (isSent) => ({
      maxWidth: '70%',
      padding: '10px 14px',
      borderRadius: isSent ? `${C.radius} ${C.radius} 4px ${C.radius}` : `${C.radius} ${C.radius} ${C.radius} 4px`,
      background: isSent ? `linear-gradient(135deg, ${C.sent}, ${C.sentBorder})` : C.received,
      border: `1px solid ${isSent ? C.sentBorder : C.receivedBorder}`,
      boxShadow: isSent ? `0 2px 8px rgba(6, 182, 212, 0.1)` : C.shadowSm,
      alignSelf: isSent ? 'flex-end' : 'flex-start',
      fontSize: '13px',
      lineHeight: 1.5,
      color: C.text,
      wordBreak: 'break-word',
      position: 'relative',
    }),
    messageTime: { fontSize: '9px', color: C.textMuted, marginTop: '5px', textAlign: 'right', opacity: 0.7 },
    chatInput: {
      padding: '14px 20px',
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      boxShadow: `0 -2px 8px ${C.bg}`,
    },
    messageInput: {
      ...inputBase,
      flex: 1,
      padding: '12px 16px',
      borderRadius: C.radiusFull,
      background: C.surfaceAlt,
      fontSize: '13px',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '100px',
    },
    sendButton: {
      ...btnGradient,
      width: '44px',
      height: '44px',
      borderRadius: C.radiusFull,
      padding: 0,
      fontSize: '16px',
      boxShadow: `0 4px 14px rgba(6, 182, 212, 0.3)`,
      flexShrink: 0,
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: C.textMuted,
      padding: '32px',
    },
    emptyContent: { textAlign: 'center', maxWidth: '280px' },
    emptyIcon: { fontSize: '56px', marginBottom: '14px', opacity: 0.5 },
    emptyTitle: { fontSize: '17px', fontWeight: '600', color: C.text, marginBottom: '6px' },
    emptyText: { fontSize: '13px', lineHeight: 1.6 },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    },
    modal: {
      position: 'relative',
      borderRadius: C.radiusLg,
      background: C.surface,
      boxShadow: C.shadowGlow,
      width: '100%',
      maxWidth: '440px',
      padding: '28px',
      boxSizing: 'border-box',
    },
    modalTitle: {
      fontSize: '19px',
      fontWeight: '700',
      color: C.text,
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
    },
    modalSubtitle: { color: C.textMuted, fontSize: '12px', marginBottom: '20px', lineHeight: 1.5 },
    modalSearch: { display: 'flex', gap: '8px', marginBottom: '18px' },
    modalResult: { padding: '16px', background: C.surfaceAlt, borderRadius: C.radius, border: `1px solid ${C.border}` },
    resultName: { fontWeight: '600', fontSize: '14px', color: C.text, marginBottom: '3px' },
    resultPhone: { fontSize: '12px', color: C.textMuted, marginBottom: '10px' },
    resultStatus: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      fontWeight: '500',
      padding: '5px 10px',
      borderRadius: C.radiusFull,
      background: C.success + '15',
      color: C.success,
    },
  };

  // ===== REDIRECIONAR ADMIN =====
  if (auth && isAdmin) return <Admin />;

  // ===== LOGIN PAGE =====
  if (!auth) {
    return (
      <div style={S.loginBg}>
        <div style={S.loginDecor} />
        <div style={S.loginCard}>
          <div style={S.loginHeader}>
            <div style={S.loginLogo}><Icons.Lock /> CipherChat</div>
            <div style={S.loginSubtitle}>Mensageiro Seguro com Criptografia</div>
          </div>
          <div style={S.tabRow}>
            <button style={S.tabBtn(authTab === 'login')} onClick={() => setAuthTab('login')}>Entrar</button>
            <button style={S.tabBtn(authTab === 'register')} onClick={() => setAuthTab('register')}>Registrar</button>
          </div>
          {authTab === 'login' ? (
            <form onSubmit={doLogin}>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Username</label>
                <input style={inputBase} type="text" placeholder="Seu username" value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} required />
              </div>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Senha</label>
                <input style={inputBase} type="password" placeholder="••••••••" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} required />
              </div>
              <button style={loading ? S.btnFullDisabled : S.btnFull} type="submit" disabled={loading}>
                {loading ? 'Entrando...' : '🔐 Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={doRegister}>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Username</label>
                <input style={inputBase} type="text" placeholder="Escolha um username" value={reg.username} onChange={e => setReg({ ...reg, username: e.target.value })} required />
              </div>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Telefone</label>
                <input style={inputBase} type="tel" placeholder="+55 (00) 00000-0000" value={reg.telefone} onChange={e => setReg({ ...reg, telefone: e.target.value })} required />
              </div>
              <div style={S.inputGroup}>
                <label style={S.inputLabel}>Senha</label>
                <input style={inputBase} type="password" placeholder="Crie uma senha segura" value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} required />
              </div>
              <button style={loading ? S.btnFullDisabled : S.btnFull} type="submit" disabled={loading}>
                {loading ? 'Registrando...' : '✨ Criar Conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div style={S.appContainer}>
      <style>{`
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.gradientStart}; }
        input, textarea, button { font-family: inherit; }
      `}</style>

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <button style={S.iconBtn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? 'Expandir' : 'Recolher sidebar'}>
            {sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
          <div style={S.logo}><Icons.Lock /> CipherChat</div>
        </div>
        <div style={S.headerRight}>
          <button style={S.notifBtn(notificationsEnabled)} onClick={notificationsEnabled ? disableNotifications : enableNotifications} title={notificationsEnabled ? 'Desativar notificações' : 'Ativar notificações'}>
            {notificationsEnabled ? '🔔' : '🔕'}
          </button>
          <button style={S.iconBtn} onClick={() => setShowSearch(true)} title="Adicionar amigo">
            <Icons.PersonAdd />
            {requests.length > 0 && <span style={S.badge}>{requests.length}</span>}
          </button>
          <div style={S.avatar(36)}>{ini(user?.username)}<span style={S.statusDot(true)}></span></div>
          {!sidebarCollapsed && <span style={{ fontWeight: '600', color: C.text, fontSize: '13px' }}>{user?.username}</span>}
          <button onClick={doLogout} style={{ padding: '8px 14px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: C.radius, cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: C.textMuted, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icons.Logout /> {sidebarCollapsed ? '' : 'Sair'}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div style={S.main}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          <button style={S.sidebarToggle} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? 'Expandir' : 'Recolher'}>
            {sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
          <div style={S.sidebarHeader}>
            <div style={S.searchBox}>
              <span style={S.searchIcon}><Icons.Search /></span>
              <input style={S.searchInput} placeholder="Buscar..." />
            </div>
          </div>
          <div style={S.sideTabs}>
            <div style={S.sideTab(tab === 'chats')} onClick={() => setTab('chats')}><Icons.Chat /> {!sidebarCollapsed && 'Chats'}</div>
            <div style={S.sideTab(tab === 'requests')} onClick={() => setTab('requests')}>📨 {!sidebarCollapsed && `Pedidos ${requests.length > 0 ? `(${requests.length})` : ''}`}</div>
          </div>
          <div style={S.contactList}>
            {tab === 'chats' && friends.map(f => (
              <div key={f.id} style={S.contact(selFriend?.id === f.id)} onClick={() => setSelFriend(f)}>
                <div style={S.avatar(42)}>{ini(f.username)}<span style={S.statusDot(f.online)}></span></div>
                {!sidebarCollapsed && (
                  <div style={S.contactContent}>
                    <div style={S.contactInfo}>
                      <div style={S.contactName}>{f.username}</div>
                      <div style={S.contactPhone}>{f.telefone}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {tab === 'chats' && friends.length === 0 && !sidebarCollapsed && (
              <div style={S.emptyState}><div style={S.emptyContent}><div style={S.emptyIcon}>👋</div><h3 style={S.emptyTitle}>Nenhum amigo</h3><p style={S.emptyText}>Adicione amigos pelo botão +</p></div></div>
            )}
            {tab === 'requests' && requests.map(r => (
              <div key={r.id} style={S.requestCard}>
                <div style={S.avatar(38)}>{ini(r.remetente)}</div>
                <div style={S.requestInfo}>
                  <div style={S.requestName}>{r.remetente}</div>
                  <div style={S.requestPhone}>{r.telefone}</div>
                </div>
                <div style={S.requestActions}>
                  <button style={S.btnSm(C.success)} onClick={() => acceptReq(r.id)}><Icons.Check /></button>
                  <button style={S.btnSmOutline(C.danger)} onClick={() => rejectReq(r.id)}><Icons.CloseCircle /></button>
                </div>
              </div>
            ))}
            {tab === 'requests' && requests.length === 0 && !sidebarCollapsed && (
              <div style={S.emptyState}><div style={S.emptyContent}><div style={S.emptyIcon}>✨</div><h3 style={S.emptyTitle}>Sem pedidos</h3></div></div>
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={S.chatArea}>
          {selFriend ? (
            <>
              <div style={S.chatHeader}>
                <div style={S.avatar(40)}>{ini(selFriend.username)}<span style={S.statusDot(selFriend.online)}></span></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.chatTitle}>{selFriend.username}</div>
                  <div style={S.chatStatus}>{selFriend.online ? '🟢 Online' : '⚫ Offline'}</div>
                </div>
                <button style={{ width: '36px', height: '36px', borderRadius: C.radius, background: C.surfaceAlt, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textMuted, transition: 'all 0.2s ease', flexShrink: 0 }} title="Mais opções">
                  <Icons.MoreVert />
                </button>
              </div>
              <div style={S.messageArea}>
                {msgs.map(m => (
                  <div key={m.id} style={S.message(m.remetente === user.username)}>
                    {typeof m.conteudo === 'string' ? m.conteudo : '[Mensagem criptografada]'}
                    <div style={S.messageTime}>{ft(m.enviada_em)}</div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div style={S.chatInput}>
                <input style={S.messageInput} placeholder="Digite sua mensagem..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMsg())} />
                <button style={S.sendButton} onClick={sendMsg} disabled={!newMsg.trim()}><Icons.Send /></button>
              </div>
            </>
          ) : (
            <div style={S.emptyState}>
              <div style={S.emptyContent}>
                <div style={{ fontSize: '64px', marginBottom: '16px', background: C.borderGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💬</div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.text, marginBottom: '8px' }}>Selecione um amigo</h2>
                <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.6 }}>Escolha uma conversa na lista ao lado para começar a trocar mensagens de forma segura.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH MODAL */}
      {showSearch && (
        <div style={S.modalOverlay} onClick={() => setShowSearch(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h2 style={S.modalTitle}><Icons.PersonAdd /> Buscar Amigo</h2>
            <p style={S.modalSubtitle}>Digite o número de telefone para encontrar alguém e enviar um pedido de amizade.</p>
            <div style={S.modalSearch}>
              <input style={{ ...inputBase, marginBottom: 0, flex: 1 }} type="tel" placeholder="+55 (00) 00000-0000" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} />
              <button style={{ ...btnGradient, width: 'auto', padding: '12px 20px', flexShrink: 0 }} onClick={doSearch}>Buscar</button>
            </div>
            {searchResult?.encontrado && (
              <div style={S.modalResult}>
                <div style={S.resultName}>{searchResult.usuario.username}</div>
                <div style={S.resultPhone}>{searchResult.usuario.telefone}</div>
                {searchResult.is_amigo ? (
                  <span style={S.resultStatus}>✅ Já são amigos</span>
                ) : searchResult.solicitacao_enviada ? (
                  <span style={{ ...S.resultStatus, background: C.warning + '15', color: C.warning }}>⏳ Aguardando</span>
                ) : (
                  <button style={{ ...btnGradient, width: '100%' }} onClick={sendReq}>🤝 Adicionar Amigo</button>
                )}
              </div>
            )}
            <button style={{ ...btnOutline, width: '100%', marginTop: '14px', background: C.surfaceAlt }} onClick={() => setShowSearch(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;