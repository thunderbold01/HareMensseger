import axios from 'axios';

/**
 * =========================
 * API BASE URL (PRODUÇÃO)
 * =========================
 * Backend Django no Render
 */
const API_URL = "https://secure-messaging-api.onrender.com";

/**
 * =========================
 * LOCAL DEVELOPMENT (DESCOMENTA QUANDO PRECISAR)
 * =========================
 */
// const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 * Adiciona token automaticamente em todas requisições
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 * Trata respostas e erros globais
 */
api.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(
            `❌ ${error.response?.status} ${error.config?.url}`,
            error.response?.data
        );

        /**
         * Se token expirar → logout automático
         */
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

/**
 * =========================
 * AUTH SERVICE
 * =========================
 */
export const authService = {
    register: (userData) => api.post('/registro/', userData),
    login: (credentials) => api.post('/login/', credentials),
    logout: () => api.post('/logout/'),
    getProfile: () => api.get('/perfil/'),
};

/**
 * =========================
 * USER SERVICE
 * =========================
 */
export const userService = {
    searchByPhone: (phone) =>
        api.get(`/buscar/?telefone=${encodeURIComponent(phone)}`),

    getFriendRequests: () => api.get('/solicitacoes/'),

    sendFriendRequest: (phone, message) =>
        api.post('/solicitacoes/enviar/', {
            telefone: phone,
            mensagem: message || 'Olá! Gostaria de adicionar você.'
        }),

    respondToRequest: (requestId, action) =>
        api.post(`/solicitacoes/${requestId}/responder/`, {
            acao: action
        }),

    getFriends: () => api.get('/amigos/'),
};

/**
 * =========================
 * CHAT SERVICE
 * =========================
 */
export const chatService = {
    getConversations: () => api.get('/conversas/'),

    getMessages: (conversationId) =>
        api.get(`/conversas/${conversationId}/mensagens/`),

    sendMessage: (conversationId, content) =>
        api.post(`/conversas/${conversationId}/enviar/`, {
            conteudo: content,
            tipo: 'TEXTO'
        }),
};

/**
 * =========================
 * CRYPTO SERVICE
 * =========================
 */
export const cryptoService = {
    testCrypto: () => api.get('/crypto/demo/'),
};

/**
 * =========================
 * ADMIN SERVICE
 * =========================
 * (cuidado: exposto no frontend)
 */
export const adminService = {
    getStats: () => api.get('/admin/stats/'),
    getUsuarios: () => api.get('/admin/usuarios/'),
    getMensagens: () => api.get('/admin/mensagens/'),
    getChaves: () => api.get('/admin/chaves/'),
    getLogs: () => api.get('/admin/logs/'),
    getEstatisticas: () => api.get('/admin/estatisticas/'),

    forcarLogout: (userId) =>
        api.post(`/admin/forcar-logout/${userId}/`),
};

export default api;