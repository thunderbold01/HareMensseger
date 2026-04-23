import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para adicionar token em TODAS as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ ${error.response?.status} ${error.config?.url}`, error.response?.data);
        
        // Se token expirou, redireciona para login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);

// Serviços de Autenticação
export const authService = {
    register: (userData) => api.post('/registro/', userData),
    login: (credentials) => api.post('/login/', credentials),
    logout: () => api.post('/logout/'),
    getProfile: () => api.get('/perfil/'),
};

// Serviços de Usuário
export const userService = {
    searchByPhone: (phone) => api.get(`/buscar/?telefone=${encodeURIComponent(phone)}`),
    getFriendRequests: () => api.get('/solicitacoes/'),
    sendFriendRequest: (phone, message) => api.post('/solicitacoes/enviar/', {
        telefone: phone,
        mensagem: message || 'Olá! Gostaria de adicionar você.'
    }),
    respondToRequest: (requestId, action) => api.post(`/solicitacoes/${requestId}/responder/`, {
        acao: action
    }),
    getFriends: () => api.get('/amigos/'),
};

// Serviços de Chat
export const chatService = {
    getConversations: () => api.get('/conversas/'),
    getMessages: (conversationId) => api.get(`/conversas/${conversationId}/mensagens/`),
    sendMessage: (conversationId, content) => api.post(`/conversas/${conversationId}/enviar/`, {
        conteudo: content,
        tipo: 'TEXTO'
    }),
};

// Serviços de Criptografia
export const cryptoService = {
    testCrypto: () => api.get('/crypto/demo/'),
};

// ============================================
// SERVIÇOS DE ADMIN - ADICIONADO
// ============================================
export const adminService = {
    getStats: () => api.get('/admin/stats/'),
    getUsuarios: () => api.get('/admin/usuarios/'),
    getMensagens: () => api.get('/admin/mensagens/'),
    getChaves: () => api.get('/admin/chaves/'),
    getLogs: () => api.get('/admin/logs/'),
    getEstatisticas: () => api.get('/admin/estatisticas/'),
    forcarLogout: (userId) => api.post(`/admin/forcar-logout/${userId}/`),
};

export default api;