import React, { useState, useEffect, useRef } from 'react';
import { authService, userService, chatService } from './services/api';
import Admin from './Admin';

// ============================================
// 🎨 ESTILOS MODERNOS - TEMA CLARO
// ============================================
const theme = {
  colors: {
    primary: '#6C63FF',
    primaryDark: '#5A52D5',
    primaryLight: '#F0EEFF',
    secondary: '#00D474',
    background: '#F8F9FC',
    surface: '#FFFFFF',
    surfaceHover: '#F5F7FA',
    border: '#E8ECF1',
    text: '#1A1A2E',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    bubbleSent: '#6C63FF',
    bubbleReceived: '#F1F5F9',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    shadowHover: '0 8px 30px rgba(108, 99, 255, 0.15)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    size: {
      xs: '11px',
      sm: '13px',
      base: '14px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

const styles = {
  // ===== LAYOUT =====
  app: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    fontFamily: theme.font.family,
    display: 'flex',
    color: theme.colors.text,
  },
  
  // ===== SIDEBAR =====
  sidebar: {
    width: '380px',
    minWidth: '380px',
    backgroundColor: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
  },
  
  sidebarHeader: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logoIcon: { fontSize: '26px' },
  logoText: {
    fontSize: theme.font.size.lg,
    fontWeight: theme.font.weight.bold,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  headerActions: { display: 'flex', gap: theme.spacing.sm },
  
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  
  // ===== SEARCH =====
  searchBox: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: `12px 16px 12px 44px`,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.size.base,
    color: theme.colors.text,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    left: `${theme.spacing.xl + 8}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.textMuted,
    fontSize: '16px',
  },
  
  // ===== TABS =====
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: `0 ${theme.spacing.xl}`,
  },
  tab: {
    flex: 1,
    padding: `${theme.spacing.md} 0`,
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.colors.textMuted,
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
    position: 'relative',
  },
  tabActive: {
    color: theme.colors.primary,
    borderBottomColor: theme.colors.primary,
  },
  
  // ===== CONTACTS LIST =====
  contactsList: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing.md,
  },
  
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.radius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: theme.spacing.xs,
  },
  contactItemHover: {
    backgroundColor: theme.colors.primaryLight,
  },
  contactItemActive: {
    backgroundColor: theme.colors.primaryLight,
    borderLeft: `3px solid ${theme.colors.primary}`,
  },
  
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: theme.radius.full,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: theme.font.weight.semibold,
    fontSize: theme.font.size.lg,
    position: 'relative',
    flexShrink: 0,
    boxShadow: theme.shadow,
  },
  avatarSmall: {
    width: '44px',
    height: '44px',
    fontSize: theme.font.size.base,
  },
  statusDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '14px',
    height: '14px',
    borderRadius: theme.radius.full,
    border: `2px solid ${theme.colors.surface}`,
  },
  statusOnline: { backgroundColor: theme.colors.success },
  statusOffline: { backgroundColor: theme.colors.textLight },
  
  contactInfo: { flex: 1, minWidth: 0 },
  contactName: {
    fontWeight: theme.font.weight.semibold,
    fontSize: theme.font.size.base,
    marginBottom: theme.spacing.xs,
  },
  contactLastMsg: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.sm,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  contactMeta: { textAlign: 'right', flexShrink: 0 },
  contactTime: { fontSize: theme.font.size.xs, color: theme.colors.textLight },
  contactUnread: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    fontSize: theme.font.size.xs,
    width: '22px',
    height: '22px',
    borderRadius: theme.radius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: theme.font.weight.bold,
    marginTop: theme.spacing.xs,
    marginLeft: 'auto',
  },
  
  // ===== FRIEND REQUESTS =====
  requestItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primaryLight,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
  },
  requestInfo: { flex: 1 },
  requestName: { fontWeight: theme.font.weight.semibold, fontSize: theme.font.size.base },
  requestMutual: { fontSize: theme.font.size.xs, color: theme.colors.textMuted },
  requestActions: { display: 'flex', gap: theme.spacing.sm },
  
  // ===== BUTTONS =====
  btn: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: theme.radius.md,
    fontSize: theme.font.size.base,
    fontWeight: theme.font.weight.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  btnHover: {
    backgroundColor: theme.colors.primaryDark,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadowHover,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
  },
  btnSuccess: { backgroundColor: theme.colors.success, color: 'white' },
  btnDanger: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: theme.colors.danger },
  btnSm: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    fontSize: theme.font.size.sm,
    borderRadius: theme.radius.sm,
    width: 'auto',
  },
  
  // ===== INPUTS =====
  input: {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.size.base,
    color: theme.colors.text,
    outline: 'none',
    marginBottom: theme.spacing.md,
    transition: 'border-color 0.2s',
  },
  inputFocus: { borderColor: theme.colors.primary },
  
  // ===== CHAT AREA =====
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  
  chatHeader: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  backBtn: {
    display: 'none',
    width: '36px',
    height: '36px',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: '18px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatUserInfo: { flex: 1 },
  chatUserName: { fontSize: theme.font.size.base, fontWeight: theme.font.weight.semibold },
  chatUserStatus: { fontSize: theme.font.size.xs, color: theme.colors.success },
  chatHeaderActions: { display: 'flex', gap: theme.spacing.sm, marginLeft: 'auto' },
  
  // ===== MESSAGES =====
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: `${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.lg}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  
  message: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '18px',
    maxWidth: '75%',
    fontSize: theme.font.size.base,
    lineHeight: '1.5',
    wordBreak: 'break-word',
    animation: 'msgIn 0.3s ease',
  },
  messageSent: {
    backgroundColor: theme.colors.bubbleSent,
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '6px',
  },
  messageReceived: {
    backgroundColor: theme.colors.bubbleReceived,
    color: theme.colors.text,
    alignSelf: 'flex-start',
    border: `1px solid ${theme.colors.border}`,
    borderBottomLeftRadius: '6px',
  },
  messageTime: {
    fontSize: theme.font.size.xs,
    opacity: 0.7,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  messageImage: {
    maxWidth: '100%',
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  
  dateDivider: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
    margin: `${theme.spacing.lg} 0`,
    position: 'relative',
  },
  
  // ===== CHAT INPUT =====
  chatInputArea: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.surface,
    borderTop: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing.md,
  },
  attachBtn: {
    width: '42px',
    height: '42px',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.surfaceHover,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    display: 'flex',
    alignItems: 'flex-end',
    padding: '4px',
  },
  textarea: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: theme.colors.text,
    fontSize: theme.font.size.base,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    resize: 'none',
    outline: 'none',
    maxHeight: '120px',
    fontFamily: 'inherit',
    lineHeight: '1.4',
  },
  sendBtn: {
    width: '42px',
    height: '42px',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  
  // ===== IMAGE PREVIEW =====
  imagePreview: {
    display: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.surface,
    borderTop: `1px solid ${theme.colors.border}`,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  imagePreviewActive: { display: 'flex' },
  previewImg: {
    width: '60px',
    height: '60px',
    borderRadius: theme.radius.sm,
    objectFit: 'cover',
  },
  previewName: {
    flex: 1,
    fontSize: theme.font.size.sm,
    color: theme.colors.textMuted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removePreview: {
    width: '32px',
    height: '32px',
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    color: theme.colors.danger,
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ===== MODAL =====
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    width: '90%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    animation: 'modalIn 0.3s ease',
  },
  modalTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: theme.font.weight.bold,
    marginBottom: theme.spacing.sm,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  modalSubtitle: { color: theme.colors.textMuted, fontSize: theme.font.size.sm, marginBottom: theme.spacing.xl },
  modalActions: { display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg },
  
  // ===== EMOJI PICKER =====
  emojiPicker: {
    display: 'none',
    position: 'absolute',
    bottom: '80px',
    left: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    width: '300px',
    boxShadow: theme.shadow,
    zIndex: 100,
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: theme.spacing.xs,
  },
  emojiBtn: {
    fontSize: '20px',
    padding: theme.spacing.xs,
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    textAlign: 'center',
    transition: 'background 0.2s',
  },
  
  // ===== TYPING INDICATOR =====
  typingIndicator: {
    display: 'none',
    alignSelf: 'flex-start',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.bubbleReceived,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '18px',
    borderBottomLeftRadius: '6px',
    gap: '4px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.textMuted,
    animation: 'typing 1.4s infinite',
  },
  
  // ===== TOAST =====
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderLeft: `4px solid ${theme.colors.primary}`,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow,
    zIndex: 3000,
    transform: 'translateX(120%)',
    transition: 'transform 0.4s ease',
    maxWidth: '340px',
  },
  toastShow: { transform: 'translateX(0)' },
  toastTitle: { fontWeight: theme.font.weight.semibold, fontSize: theme.font.size.base },
  toastMsg: { fontSize: theme.font.size.sm, color: theme.colors.textMuted, marginTop: theme.spacing.xs },
  
  // ===== LOGIN SCREEN =====
  loginScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 50%, ${theme.colors.primaryLight} 100%)`,
  },
  loginBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxl,
    borderRadius: theme.radius.xl,
    width: '90%',
    maxWidth: '420px',
    boxShadow: theme.shadow,
    textAlign: 'center',
  },
  loginLogo: {
    fontSize: '28px',
    fontWeight: theme.font.weight.bold,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing.sm,
  },
  loginSubtitle: { color: theme.colors.textMuted, marginBottom: theme.spacing.xxl, fontSize: theme.font.size.sm },
  
  // ===== BADGE =====
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: theme.colors.danger,
    color: 'white',
    fontSize: theme.font.size.xs,
    width: '18px',
    height: '18px',
    borderRadius: theme.radius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: theme.font.weight.bold,
  },
  
  // ===== EMPTY STATE =====
  emptyState: {
    textAlign: 'center',
    padding: `${theme.spacing.xxl} ${theme.spacing.lg}`,
    color: theme.colors.textMuted,
  },
  
  // ===== ANIMATIONS =====
  '@keyframes msgIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes modalIn': {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
    '30%': { transform: 'translateY(-6px)', opacity: 1 },
  },
};

// ============================================
// 🎨 CSS GLOBAL INJECT
// ============================================
const GlobalStyles = () => (
  <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${theme.colors.primary}; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: ${theme.colors.primaryDark}; }
    
    @media (max-width: 768px) {
      .sidebar { width: 100% !important; min-width: 100% !important; position: absolute; z-index: 10; }
      .chat-area { position: absolute; z-index: 20; width: 100%; height: 100vh; transform: translateX(100%); transition: transform 0.3s ease; }
      .chat-area.active { transform: translateX(0); }
      .back-btn { display: flex !important; }
      .message { max-width: 85% !important; }
    }
  `}</style>
);

// ============================================
// 🔤 EMOJIS
// ============================================
const EMOJIS = [
  '😀','😂','🥹','😍','🤩','😎','🥳','😇','🤔','😅','😊','🤗','😋','🤭','😏','😌',
  '😢','😤','🤯','🥺','😴','🤮','👍','👎','❤️','🔥','⭐','🎉','💯','🙏','💪','👋',
  '📸','🎵','🎮','📚','☕','🍕','🌈','🌙','✅','❌','💬','🔔','💡','🎯','🚀','💎',
];

// ============================================
// 🧩 COMPONENTE PRINCIPAL
// ============================================
function App() {
  // ===== ESTADOS =====
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [activeTab, setActiveTab] = useState('chats');
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', telefone: '' });
  const [loading, setLoading] = useState(false);
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState(null);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ===== EFEITOS =====
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.username === 'admin');
        if (userData.username !== 'admin') loadFriends();
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    if (showChat && selectedFriend?.conversa_id) {
      loadMessages();
    }
  }, [showChat, selectedFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.scrollHeight, 120) + 'px';
    }
  }, [newMessage]);

  // ===== FUNÇÕES DE API =====
  const loadFriends = async () => {
    try {
      const res = await userService.getFriends();
      setFriends(res.data.amigos || []);
      // Carregar pedidos pendentes
      const reqs = await userService.getFriendRequests();
      setFriendRequests(reqs.data?.pendentes || []);
    } catch (err) {
      console.error('Erro ao carregar amigos:', err);
    }
  };

  const loadMessages = async () => {
    if (!selectedFriend?.conversa_id) return;
    try {
      const res = await chatService.getMessages(selectedFriend.conversa_id);
      setMessages(res.data.mensagens || []);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  // ===== AUTH =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(loginData);
      const userData = res.data.usuario;
      const authToken = res.data.token;
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAdmin(userData.username === 'admin');
      if (userData.username !== 'admin') loadFriends();
      
      setLoginData({ username: '', password: '' });
      showToast('✅ Bem-vindo!', `Olá ${userData.username} 👋`);
    } catch (err) {
      showToast('❌ Erro', err.response?.data?.erro || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...registerData, numero_celular: registerData.telefone };
      const res = await authService.register(payload);
      const userData = res.data.usuario;
      const authToken = res.data.token;
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAdmin(userData.username === 'admin');
      if (userData.username !== 'admin') loadFriends();
      
      setRegisterData({ username: '', password: '', telefone: '' });
      showToast('✅ Conta criada!', 'Bem-vindo ao CipherChat 🎉');
    } catch (err) {
      showToast('❌ Erro', err.response?.data?.erro || 'Erro no registro');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.clear();
    setFriends([]);
    setShowChat(false);
    setSelectedFriend(null);
  };

  // ===== CHAT =====
  const openChat = (friend) => {
    setSelectedFriend(friend);
    setShowChat(true);
    // Mobile: adicionar classe active
    if (window.innerWidth <= 768) {
      document.querySelector('.chat-area')?.classList.add('active');
    }
  };

  const goBack = () => {
    setShowChat(false);
    document.querySelector('.chat-area')?.classList.remove('active');
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;
    if (!selectedFriend?.conversa_id) return;
    
    const content = newMessage.trim();
    const image = selectedImage;
    
    // Adicionar mensagem otimista
    const newMsg = {
      id: Date.now(),
      remetente: user.username,
      conteudo: content,
      imagem: image,
      enviada_em: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    
    // Limpar inputs
    setNewMessage('');
    setSelectedImage(null);
    setShowEmoji(false);
    
    try {
      await chatService.sendMessage(selectedFriend.conversa_id, content, image);
      setTimeout(loadMessages, 500);
      
      // Simular resposta
      simulateReply();
    } catch (err) {
      console.error('Erro ao enviar:', err);
    }
  };

  const simulateReply = () => {
    setTyping(true);
    const replies = [
      'Que legal! 😄', 'Entendi! 👍', 'Hahaha 😂', 'Sim, com certeza!',
      'Que demais! 🎉', 'Vou pensar sobre isso...', 'Top! 🔥', 'Boa ideia! 💡',
    ];
    
    setTimeout(() => {
      setTyping(false);
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        remetente: selectedFriend.username,
        conteudo: reply,
        enviada_em: new Date().toISOString(),
      }]);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ===== IMAGENS =====
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePreview = () => setSelectedImage(null);

  const viewImage = (src) => {
    const win = window.open('', '_blank');
    win.document.write(`<img src="${src}" style="max-width:100%;max-height:100vh;display:block;margin:auto;">`);
  };

  // ===== EMOJI =====
  const toggleEmoji = () => setShowEmoji(!showEmoji);
  
  const insertEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  // ===== FRIEND REQUESTS =====
  const handleSearch = async () => {
    if (!searchPhone.trim()) return;
    setLoading(true);
    try {
      const res = await userService.searchByPhone(searchPhone);
      setSearchResult(res.data);
    } catch (err) {
      showToast('❌ Não encontrado', 'Usuário não existe');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult?.usuario) return;
    try {
      await userService.sendFriendRequest(searchResult.usuario.telefone);
      showToast('✅ Pedido enviado!', `Aguarde a resposta de ${searchResult.usuario.username}`);
      setShowSearchModal(false);
      setSearchPhone('');
      setSearchResult(null);
    } catch (err) {
      showToast('❌ Erro', err.response?.data?.erro || 'Não foi possível enviar');
    }
  };

  const acceptRequest = async (requestId, userPhone) => {
    try {
      await userService.acceptFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      loadFriends();
      showToast('✅ Amigo adicionado!', 'Vocês agora podem conversar 🎉');
    } catch (err) {
      showToast('❌ Erro', 'Não foi possível aceitar');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await userService.rejectFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      showToast('🗑️ Pedido recusado');
    } catch (err) {
      showToast('❌ Erro', 'Não foi possível recusar');
    }
  };

  // ===== UTILITÁRIOS =====
  const showToast = (title, msg) => {
    setToast({ title, msg, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.replace(/[^\w\s]/g, '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const filterContacts = (query) => {
    // Implementação simples de filtro
    return true;
  };

  // ===== RENDER ADMIN =====
  if (isAuthenticated && isAdmin) {
    return <Admin />;
  }

  // ===== RENDER LOGIN =====
  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <div style={styles.loginScreen}>
          <div style={styles.loginBox}>
            <div style={styles.loginLogo}>💬 CipherChat</div>
            <p style={styles.loginSubtitle}>Converse com segurança e privacidade</p>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: theme.colors.surfaceHover, padding: '4px', borderRadius: '12px' }}>
              <button 
                style={{...styles.tab, ...(activeTab === 'login' ? styles.tabActive : {})}}
                onClick={() => setActiveTab('login')}
              >
                Entrar
              </button>
              <button 
                style={{...styles.tab, ...(activeTab === 'register' ? styles.tabActive : {})}}
                onClick={() => setActiveTab('register')}
              >
                Criar conta
              </button>
            </div>
            
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin}>
                <input 
                  style={styles.input} 
                  type="text" 
                  placeholder="Nome de usuário" 
                  value={loginData.username} 
                  onChange={e => setLoginData({...loginData, username: e.target.value})} 
                  required 
                />
                <input 
                  style={styles.input} 
                  type="password" 
                  placeholder="Senha" 
                  value={loginData.password} 
                  onChange={e => setLoginData({...loginData, password: e.target.value})} 
                  required 
                />
                <button style={styles.btn} type="submit" disabled={loading}>
                  {loading ? '⏳' : '🚀'} {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <input 
                  style={styles.input} 
                  type="text" 
                  placeholder="Nome de usuário" 
                  value={registerData.username} 
                  onChange={e => setRegisterData({...registerData, username: e.target.value})} 
                  required 
                />
                <input 
                  style={styles.input} 
                  type="tel" 
                  placeholder="Telefone (ex: 11999999999)" 
                  value={registerData.telefone} 
                  onChange={e => setRegisterData({...registerData, telefone: e.target.value})} 
                  required 
                />
                <input 
                  style={styles.input} 
                  type="password" 
                  placeholder="Senha (mín. 6 caracteres)" 
                  value={registerData.password} 
                  onChange={e => setRegisterData({...registerData, password: e.target.value})} 
                  required 
                />
                <button style={styles.btn} type="submit" disabled={loading}>
                  {loading ? '⏳' : '📝'} {loading ? 'Criando...' : 'Criar conta'}
                </button>
              </form>
            )}
            
            <p style={{ marginTop: '20px', fontSize: theme.font.size.sm, color: theme.colors.textMuted }}>
              Ao continuar, você concorda com nossos <a href="#" style={{ color: theme.colors.primary }}>Termos</a>
            </p>
          </div>
        </div>
      </>
    );
  }

  // ===== RENDER APP PRINCIPAL =====
  return (
    <>
      <GlobalStyles />
      <div style={styles.app}>
        
        {/* ===== SIDEBAR ===== */}
        <aside className="sidebar" style={styles.sidebar}>
          {/* Header */}
          <div style={styles.sidebarHeader}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>💬</span>
              <span style={styles.logoText}>CipherChat</span>
            </div>
            <div style={styles.headerActions}>
              <button style={styles.iconBtn} onClick={() => setShowSearchModal(true)} title="Adicionar amigo">
                👤
                {friendRequests.length > 0 && <span style={styles.badge}>{friendRequests.length}</span>}
              </button>
              <button style={styles.iconBtn} onClick={handleLogout} title="Sair">🚪</button>
            </div>
          </div>
          
          {/* Search */}
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              style={styles.searchInput} 
              placeholder="Buscar conversas..." 
              onChange={(e) => filterContacts(e.target.value)}
            />
          </div>
          
          {/* Tabs */}
          <div style={styles.tabs}>
            <div 
              style={{...styles.tab, ...(activeTab === 'chats' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('chats')}
            >
              💬 Chats
            </div>
            <div 
              style={{...styles.tab, ...(activeTab === 'requests' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('requests')}
            >
              👥 Pedidos
              {friendRequests.length > 0 && <span style={{...styles.badge, position: 'relative', top: '-2px', marginLeft: '4px'}}>{friendRequests.length}</span>}
            </div>
            <div 
              style={{...styles.tab, ...(activeTab === 'groups' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('groups')}
            >
              👨‍👩‍👧 Grupos
            </div>
          </div>
          
          {/* Content */}
          <div style={styles.contactsList}>
            
            {/* Aba Chats */}
            {activeTab === 'chats' && (
              <>
                {friends.map(friend => (
                  <div 
                    key={friend.id} 
                    style={{
                      ...styles.contactItem,
                      ...(selectedFriend?.id === friend.id ? styles.contactItemActive : {}),
                    }}
                    onClick={() => openChat(friend)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.primaryLight}
                    onMouseLeave={(e) => {
                      if (selectedFriend?.id !== friend.id) {
                        e.currentTarget.style.backgroundColor = '';
                      }
                    }}
                  >
                    <div style={styles.avatar}>
                      {getInitials(friend.username)}
                      <span style={{...styles.statusDot, ...(friend.online ? styles.statusOnline : styles.statusOffline)}}></span>
                    </div>
                    <div style={styles.contactInfo}>
                      <div style={styles.contactName}>{friend.username}</div>
                      <div style={styles.contactLastMsg}>
                        {friend.ultima_mensagem || 'Inicie uma conversa 👋'}
                      </div>
                    </div>
                    <div style={styles.contactMeta}>
                      <div style={styles.contactTime}>{friend.ultima_mensagem_time || ''}</div>
                      {friend.nao_lidas > 0 && (
                        <div style={styles.contactUnread}>{friend.nao_lidas}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {friends.length === 0 && (
                  <div style={styles.emptyState}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                    <p>Nenhum amigo ainda</p>
                    <p style={{ fontSize: theme.font.size.sm, marginTop: '8px' }}>Clique em 👤 para buscar amigos</p>
                  </div>
                )}
              </>
            )}
            
            {/* Aba Pedidos */}
            {activeTab === 'requests' && (
              <>
                {friendRequests.map(req => (
                  <div key={req.id} style={styles.requestItem}>
                    <div style={{...styles.avatar, ...styles.avatarSmall}}>
                      {getInitials(req.remetente_username)}
                    </div>
                    <div style={styles.requestInfo}>
                      <div style={styles.requestName}>{req.remetente_username}</div>
                      <div style={styles.requestMutual}>Quer ser seu amigo</div>
                    </div>
                    <div style={styles.requestActions}>
                      <button 
                        style={{...styles.btnSm, ...styles.btnSuccess}} 
                        onClick={() => acceptRequest(req.id, req.remetente_telefone)}
                      >
                        ✓
                      </button>
                      <button 
                        style={{...styles.btnSm, ...styles.btnDanger}} 
                        onClick={() => rejectRequest(req.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                
                {friendRequests.length === 0 && (
                  <div style={styles.emptyState}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
                    <p>Nenhum pedido pendente</p>
                  </div>
                )}
              </>
            )}
            
            {/* Aba Grupos */}
            {activeTab === 'groups' && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👨‍👩‍👧‍👦</div>
                <p>Em breve: chats em grupo!</p>
              </div>
            )}
            
          </div>
        </aside>
        
        {/* ===== CHAT AREA ===== */}
        <main className="chat-area" style={styles.chatArea}>
          
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <button className="back-btn" style={styles.backBtn} onClick={goBack}>←</button>
                <div style={{...styles.avatar, ...styles.avatarSmall}}>
                  {getInitials(selectedFriend.username)}
                  <span style={{...styles.statusDot, ...(selectedFriend.online ? styles.statusOnline : styles.statusOffline)}}></span>
                </div>
                <div style={styles.chatUserInfo}>
                  <div style={styles.chatUserName}>{selectedFriend.username}</div>
                  <div style={styles.chatUserStatus}>
                    {selectedFriend.online ? '● Online' : '● Offline'}
                  </div>
                </div>
                <div style={styles.chatHeaderActions}>
                  <button style={styles.iconBtn} title="Chamada de voz">📞</button>
                  <button style={styles.iconBtn} title="Chamada de vídeo">📹</button>
                  <button style={styles.iconBtn} title="Mais opções">⋮</button>
                </div>
              </div>
              
              {/* Messages */}
              <div style={styles.messagesArea}>
                <div style={styles.dateDivider}>
                  <span style={{ backgroundColor: theme.colors.background, padding: '0 12px', position: 'relative', zIndex: 1 }}>
                    Hoje
                  </span>
                </div>
                
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    style={{
                      ...styles.message,
                      ...(msg.remetente === user.username ? styles.messageSent : styles.messageReceived)
                    }}
                  >
                    {msg.imagem && (
                      <img 
                        src={msg.imagem} 
                        alt="attachment" 
                        style={styles.messageImage}
                        onClick={() => viewImage(msg.imagem)}
                      />
                    )}
                    {msg.conteudo && <div>{escapeHtml(msg.conteudo)}</div>}
                    <div style={styles.messageTime}>
                      {formatTime(msg.enviada_em)}
                      {msg.remetente === user.username && <span>✓✓</span>}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {typing && (
                  <div style={{...styles.typingIndicator, display: 'flex'}}>
                    <span style={styles.typingDot}></span>
                    <span style={{...styles.typingDot, animationDelay: '0.2s'}}></span>
                    <span style={{...styles.typingDot, animationDelay: '0.4s'}}></span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Image Preview */}
              <div style={{...styles.imagePreview, ...(selectedImage ? styles.imagePreviewActive : {})}}>
                <img src={selectedImage} alt="preview" style={styles.previewImg} />
                <span style={styles.previewName}>imagem.jpg</span>
                <button style={styles.removePreview} onClick={removePreview}>✕</button>
              </div>
              
              {/* Emoji Picker */}
              {showEmoji && (
                <div style={styles.emojiPicker}>
                  <div style={styles.emojiGrid}>
                    {EMOJIS.map(emoji => (
                      <span 
                        key={emoji} 
                        style={styles.emojiBtn}
                        onClick={() => insertEmoji(emoji)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.surfaceHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input */}
              <div style={styles.chatInputArea}>
                <button 
                  style={styles.attachBtn} 
                  onClick={() => document.getElementById('fileInput').click()}
                  title="Anexar imagem"
                >
                  📎
                </button>
                <input 
                  type="file" 
                  id="fileInput" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                
                <div style={styles.inputWrapper}>
                  <button 
                    style={{...styles.attachBtn, width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: 'none', fontSize: '18px'}}
                    onClick={toggleEmoji}
                    title="Emojis"
                  >
                    😊
                  </button>
                  <textarea
                    ref={textareaRef}
                    style={styles.textarea}
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                </div>
                
                <button style={styles.sendBtn} onClick={handleSendMessage} title="Enviar">
                  ➤
                </button>
              </div>
            </>
          ) : (
            /* Empty Chat State */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: theme.colors.textMuted }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>💬</div>
              <h3 style={{ fontSize: theme.font.size.lg, fontWeight: theme.font.weight.semibold, marginBottom: '8px' }}>
                Selecione uma conversa
              </h3>
              <p style={{ fontSize: theme.font.size.base }}>
                Escolha um amigo para começar a conversar
              </p>
            </div>
          )}
          
        </main>
        
        {/* ===== MODAL BUSCAR AMIGO ===== */}
        {showSearchModal && (
          <div style={styles.modalOverlay} onClick={() => setShowSearchModal(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={styles.modalTitle}>🔍 Buscar Amigo</h3>
                <button 
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.colors.textMuted }}
                  onClick={() => setShowSearchModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <p style={styles.modalSubtitle}>Digite o número de telefone para encontrar alguém</p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input 
                  style={{...styles.input, marginBottom: 0, flex: 1}} 
                  type="tel" 
                  placeholder="Ex: 11999999999" 
                  value={searchPhone} 
                  onChange={e => setSearchPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  style={{...styles.btn, width: 'auto', padding: '12px 20px'}} 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? '⏳' : 'Buscar'}
                </button>
              </div>
              
              {searchResult?.encontrado && (
                <div style={{...styles.contactItem, backgroundColor: theme.colors.surfaceHover, cursor: 'default'}}>
                  <div style={styles.avatar}>{getInitials(searchResult.usuario.username)}</div>
                  <div style={styles.contactInfo}>
                    <div style={styles.contactName}>{searchResult.usuario.username}</div>
                    <div style={styles.contactLastMsg}>{searchResult.usuario.telefone}</div>
                  </div>
                  {searchResult.is_amigo ? (
                    <span style={{ color: theme.colors.success, fontWeight: theme.font.weight.semibold }}>✅ Amigo</span>
                  ) : searchResult.solicitacao_enviada ? (
                    <span style={{ color: theme.colors.warning, fontWeight: theme.font.weight.semibold }}>⏳ Pendente</span>
                  ) : (
                    <button 
                      style={{...styles.btnSm, ...styles.btnSuccess}} 
                      onClick={handleSendRequest}
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              )}
              
              <p style={{ marginTop: '20px', fontSize: theme.font.size.xs, color: theme.colors.textLight, textAlign: 'center' }}>
                💡 Dica: Use números de teste como 11111111 ou 22222222
              </p>
            </div>
          </div>
        )}
        
        {/* ===== TOAST ===== */}
        {toast && (
          <div style={{...styles.toast, ...styles.toastShow}}>
            <div style={styles.toastTitle}>{toast.title}</div>
            <div style={styles.toastMsg}>{toast.msg}</div>
          </div>
        )}
        
      </div>
    </>
  );
}

export default App;