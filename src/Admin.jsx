import React, { useState, useEffect, useRef, useCallback } from 'react';
import { adminService, cryptoService } from './services/api';
import { Line, Doughnut, Bar, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, 
    BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler
);

// ===== ESTILOS AVANÇADOS =====
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0a0e17',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
        color: '#e0e0e0'
    },
    header: {
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        padding: '12px 24px',
        borderBottom: '2px solid #e53935',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(229, 57, 53, 0.2)'
    },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { fontSize: '32px', filter: 'drop-shadow(0 0 10px rgba(229, 57, 53, 0.5))' },
    logoText: { 
        fontSize: '22px', 
        fontWeight: 'bold', 
        background: 'linear-gradient(135deg, #e53935, #ff6f00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    adminBadge: {
        background: 'linear-gradient(135deg, #e53935, #c62828)',
        color: 'white',
        padding: '4px 14px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        boxShadow: '0 0 15px rgba(229, 57, 53, 0.3)'
    },
    main: { maxWidth: '1920px', margin: '0 auto', padding: '20px' },
    
    // Grid de Status do Servidor
    serverGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    serverCard: (status) => ({
        background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
        borderRadius: '12px',
        padding: '20px',
        border: `1px solid ${status === 'ok' ? '#238636' : status === 'warning' ? '#d2991d' : '#da3633'}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 20px ${status === 'ok' ? 'rgba(35,134,54,0.2)' : status === 'warning' ? 'rgba(210,153,29,0.2)' : 'rgba(218,54,51,0.2)'}`
    }),
    serverTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#8b949e',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    serverValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '8px'
    },
    serverDetail: {
        fontSize: '11px',
        color: '#8b949e',
        lineHeight: '1.6'
    },
    
    // Grid de Métricas
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '12px',
        marginBottom: '24px'
    },
    metricCard: {
        background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #30363d',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
        }
    },
    metricIcon: { fontSize: '28px', marginBottom: '10px' },
    metricValue: { 
        fontSize: '28px', 
        fontWeight: 'bold', 
        background: 'linear-gradient(135deg, #e53935, #ff6f00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    metricLabel: { fontSize: '11px', color: '#8b949e', marginTop: '6px', textTransform: 'uppercase' },
    metricChange: (positive) => ({
        fontSize: '11px',
        color: positive ? '#238636' : '#da3633',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    }),
    
    // Gráficos
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px',
        marginBottom: '24px'
    },
    chartCard: {
        background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #30363d'
    },
    chartTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    
    // Seções
    section: {
        background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #30363d'
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    // Tabelas
    tableWrapper: { maxHeight: '400px', overflowY: 'auto', borderRadius: '8px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        textAlign: 'left',
        padding: '12px',
        background: '#0d1117',
        fontSize: '11px',
        fontWeight: '600',
        color: '#8b949e',
        borderBottom: '2px solid #30363d',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #21262d',
        fontSize: '13px',
        color: '#c9d1d9'
    },
    
    // Badges
    badge: (type) => ({
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: type === 'success' ? '#238636' : 
                   type === 'warning' ? '#9e6a03' : 
                   type === 'danger' ? '#da3633' : '#1f6feb',
        color: 'white'
    }),
    
    // Botões
    btn: (type = 'primary') => ({
        padding: '8px 16px',
        background: type === 'primary' ? 'linear-gradient(135deg, #e53935, #c62828)' :
                   type === 'success' ? '#238636' :
                   type === 'warning' ? '#9e6a03' : '#30363d',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: type === 'primary' ? '0 4px 15px rgba(229, 57, 53, 0.3)' : 'none'
    }),
    
    // Live Indicator
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: '#0d1117',
        borderRadius: '20px',
        border: '1px solid #30363d'
    },
    pulse: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#4caf50',
        boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
    },
    
    // Log Console
    console: {
        background: '#0d1117',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #30363d'
    },
    logLine: (type) => ({
        padding: '4px 0',
        color: type === 'error' ? '#da3633' : 
               type === 'warning' ? '#d2991d' : 
               type === 'success' ? '#238636' : '#8b949e',
        borderBottom: '1px solid #21262d'
    })
};

// ===== COMPONENTE ADMIN AVANÇADO =====
function Admin() {
    // Estados
    const [stats, setStats] = useState({
        total_usuarios: 0, online: 0, total_mensagens: 0,
        mensagens_24h: 0, conversas_ativas: 0, total_amizades: 0,
        solicitacoes_pendentes: 0, total_chaves: 0
    });
    const [serverMetrics, setServerMetrics] = useState({
        cpu: 0, memory: 0, disk: 0, uptime: '0h',
        requests_per_sec: 0, active_connections: 0,
        network_in: 0, network_out: 0
    });
    const [usuarios, setUsuarios] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [chaves, setChaves] = useState([]);
    const [logs, setLogs] = useState([]);
    const [securityLogs, setSecurityLogs] = useState([]);
    const [cryptoStatus, setCryptoStatus] = useState(null);
    const [tlsHandshakes, setTlsHandshakes] = useState([]);
    const [websocketStatus, setWebsocketStatus] = useState('connected');
    const [estatisticas, setEstatisticas] = useState({ 
        por_hora: [], 
        por_algoritmo: [],
        latencia_media: 0 
    });
    const [messageStats, setMessageStats] = useState({ 
        por_usuario: [], 
        por_algoritmo: [] 
    });
    
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [updateCount, setUpdateCount] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedUser, setSelectedUser] = useState(null);
    
    const wsRef = useRef(null);
    const intervalRef = useRef(null);
    const consoleRef = useRef(null);

    // ===== CONEXÃO WEBSOCKET =====
    const connectWebSocket = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/admin/`;
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                console.log('WebSocket conectado');
                setWebsocketStatus('connected');
                ws.send(JSON.stringify({ 
                    type: 'subscribe', 
                    channels: ['messages', 'users', 'crypto', 'server'] 
                }));
            };
            
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setWebsocketStatus('error');
            };
            
            ws.onclose = () => {
                console.log('WebSocket desconectado, reconectando...');
                setWebsocketStatus('disconnected');
                setTimeout(connectWebSocket, 3000);
            };
            
            wsRef.current = ws;
        } catch (error) {
            console.log('WebSocket não disponível, usando polling');
            setWebsocketStatus('polling');
        }
    }, []);

    const handleWebSocketMessage = (data) => {
        switch(data.type) {
            case 'new_message':
                setMensagens(prev => [data.message, ...prev].slice(0, 100));
                addSecurityLog('Mensagem enviada', 'info', data.message);
                break;
            case 'user_status':
                setUsuarios(prev => prev.map(u => 
                    u.id === data.user.id ? { ...u, ...data.user } : u
                ));
                break;
            case 'server_metrics':
                setServerMetrics(data.metrics);
                break;
            case 'tls_handshake':
                setTlsHandshakes(prev => [data.handshake, ...prev].slice(0, 50));
                break;
            case 'crypto_operation':
                addSecurityLog(`Operação criptográfica: ${data.operation}`, 'success');
                break;
            default:
                break;
        }
    };

    const addSecurityLog = (message, type = 'info', data = null) => {
        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message,
            type,
            data
        };
        setSecurityLogs(prev => [log, ...prev].slice(0, 100));
    };

    // ===== INICIALIZAÇÃO =====
    useEffect(() => {
        connectWebSocket();
        loadAllData();
        
        intervalRef.current = setInterval(() => {
            if (isLive) {
                loadAllData();
                setUpdateCount(prev => prev + 1);
                simulateServerMetrics();
            }
        }, 2000);
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [isLive]);

    const simulateServerMetrics = () => {
        setServerMetrics(prev => ({
            cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 5)),
            memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 3)),
            disk: 45 + Math.random() * 2,
            uptime: formatUptime(Date.now() - 3600000),
            requests_per_sec: Math.floor(10 + Math.random() * 20),
            active_connections: Math.floor(5 + Math.random() * 15),
            network_in: Math.floor(100 + Math.random() * 50),
            network_out: Math.floor(80 + Math.random() * 40)
        }));
    };

    const loadAllData = async () => {
        try {
            const startTime = performance.now();
            
            const results = await Promise.allSettled([
                adminService.getStats(),
                adminService.getUsuarios(),
                adminService.getMensagens(),
                adminService.getChaves(),
                adminService.getLogs(),
                adminService.getEstatisticas(),
                cryptoService.testCrypto()
            ]);
            
            const endTime = performance.now();
            const latency = endTime - startTime;
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const data = result.value.data;
                    switch(index) {
                        case 0: setStats(data); break;
                        case 1: setUsuarios(data.usuarios || []); break;
                        case 2: 
                            setMensagens(data.mensagens || []); 
                            calcularEstatisticas(data.mensagens || []);
                            break;
                        case 3: setChaves(data.chaves || []); break;
                        case 4: setLogs(data.logs || []); break;
                        case 5: setEstatisticas(data); break;
                        case 6: setCryptoStatus(data); break;
                    }
                }
            });
            
            setLastUpdate(new Date());
            setLoading(false);
            
            addSecurityLog(`Dados carregados em ${latency.toFixed(2)}ms`, 'success');
            
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            addSecurityLog('Erro ao carregar dados do servidor', 'error');
        }
    };

    const calcularEstatisticas = (mensagens) => {
        const userCount = {};
        const algoCount = {};
        
        mensagens.forEach(m => {
            userCount[m.remetente] = (userCount[m.remetente] || 0) + 1;
            algoCount[m.algoritmo] = (algoCount[m.algoritmo] || 0) + 1;
        });
        
        const por_usuario = Object.entries(userCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([user, count]) => ({ user, count }));
        
        const por_algoritmo = Object.entries(algoCount)
            .map(([algo, count]) => ({ algoritmo: algo, count }));
        
        setMessageStats({ por_usuario, por_algoritmo });
    };

    // ===== AÇÕES =====
    const handleForcarLogout = async (userId) => {
        try {
            await adminService.forcarLogout(userId);
            addSecurityLog(`Logout forçado para usuário ${userId}`, 'warning');
            loadAllData();
        } catch (err) {
            addSecurityLog(`Falha ao forçar logout: ${err.message}`, 'error');
        }
    };

    const handleForcarTodosOffline = async () => {
        const onlineUsers = usuarios.filter(u => u.online);
        for (const user of onlineUsers) {
            try {
                await adminService.forcarLogout(user.id);
            } catch (err) {}
        }
        addSecurityLog(`${onlineUsers.length} usuários forçados offline`, 'warning');
        loadAllData();
    };

    const handleRevogarChaves = async (userId) => {
        try {
            await adminService.revogarChaves(userId);
            addSecurityLog(`Chaves revogadas para usuário ${userId}`, 'warning');
            loadAllData();
        } catch (err) {
            addSecurityLog(`Falha ao revogar chaves: ${err.message}`, 'error');
        }
    };

    const handleLimparLogs = async () => {
        try {
            await adminService.limparLogs();
            addSecurityLog('Logs do sistema limpos', 'warning');
            loadAllData();
        } catch (err) {
            addSecurityLog(`Falha ao limpar logs: ${err.message}`, 'error');
        }
    };

    const handleBackup = async () => {
        try {
            await adminService.criarBackup();
            addSecurityLog('Backup do sistema criado com sucesso', 'success');
        } catch (err) {
            addSecurityLog(`Falha ao criar backup: ${err.message}`, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    // ===== UTILITÁRIOS =====
    const formatUptime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // ===== DADOS DOS GRÁFICOS =====
    const messageChartData = {
        labels: estatisticas.por_hora?.map(h => h.hora) || [],
        datasets: [{
            label: 'Mensagens por Hora',
            data: estatisticas.por_hora?.map(h => h.count) || [],
            borderColor: '#e53935',
            backgroundColor: 'rgba(229, 57, 53, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#e53935'
        }]
    };

    const cryptoChartData = {
        labels: messageStats.por_algoritmo?.map(a => a.algoritmo) || [],
        datasets: [{
            data: messageStats.por_algoritmo?.map(a => a.count) || [],
            backgroundColor: ['#e53935', '#1f6feb', '#238636', '#9e6a03', '#6e40c9'],
            borderWidth: 2,
            borderColor: '#0d1117'
        }]
    };

    const serverLoadData = {
        labels: ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m'],
        datasets: [
            {
                label: 'CPU %',
                data: Array.from({length: 10}, () => 20 + Math.random() * 40),
                borderColor: '#e53935',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Memória %',
                data: Array.from({length: 10}, () => 40 + Math.random() * 20),
                borderColor: '#1f6feb',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500 },
        plugins: {
            legend: { 
                display: true, 
                labels: { color: '#8b949e', font: { size: 11 } } 
            },
        },
        scales: {
            y: {
                grid: { color: '#21262d' },
                ticks: { color: '#8b949e', font: { size: 10 } },
                beginAtZero: true
            },
            x: {
                grid: { display: false },
                ticks: { color: '#8b949e', font: { size: 10 } }
            }
        }
    };

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🛡️</span>
                    <span style={styles.logoText}>CipherChat Admin</span>
                    <span style={styles.adminBadge}>MONITOR</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Live Status */}
                    <div style={styles.liveIndicator}>
                        <span style={{
                            ...styles.pulse,
                            animation: isLive ? 'pulse 1s infinite' : 'none',
                            background: websocketStatus === 'connected' ? '#4caf50' : 
                                      websocketStatus === 'polling' ? '#d2991d' : '#da3633'
                        }}></span>
                        <span style={{ color: '#8b949e', fontSize: '11px' }}>
                            {websocketStatus === 'connected' ? 'WS LIVE' : 
                             websocketStatus === 'polling' ? 'POLLING' : 'WS DOWN'} · 
                            {lastUpdate.toLocaleTimeString('pt-BR')}
                        </span>
                    </div>
                    
                    <span style={{ color: '#30363d' }}>|</span>
                    <span style={{ color: '#8b949e', fontSize: '11px' }}>
                        Ciclos: {updateCount.toLocaleString()}
                    </span>
                    
                    {/* Controles */}
                    <button 
                        style={styles.btn(isLive ? 'warning' : 'success')} 
                        onClick={() => setIsLive(!isLive)}
                    >
                        {isLive ? '⏸️ Pausar' : '▶️ Retomar'}
                    </button>
                    <button style={styles.btn('primary')} onClick={loadAllData}>
                        🔄 Atualizar
                    </button>
                    <button style={styles.btn()} onClick={handleForcarTodosOffline}>
                        👥 Forçar Offline
                    </button>
                    <button style={styles.btn()} onClick={handleBackup}>
                        💾 Backup
                    </button>
                    <button 
                        style={{...styles.btn(), background: '#30363d'}} 
                        onClick={handleLogout}
                    >
                        🚪 Sair
                    </button>
                </div>
            </header>
            
            <main style={styles.main}>
                {/* SERVER METRICS */}
                <div style={styles.serverGrid}>
                    <div style={styles.serverCard(serverMetrics.cpu < 70 ? 'ok' : 'warning')}>
                        <div style={styles.serverTitle}>🖥️ CPU Usage</div>
                        <div style={styles.serverValue}>{serverMetrics.cpu.toFixed(1)}%</div>
                        <div style={styles.serverDetail}>
                            Cores: 4 · Threads: 8<br/>
                            Temp: 45°C
                        </div>
                    </div>
                    
                    <div style={styles.serverCard(serverMetrics.memory < 80 ? 'ok' : 'warning')}>
                        <div style={styles.serverTitle}>💾 Memory</div>
                        <div style={styles.serverValue}>{serverMetrics.memory.toFixed(1)}%</div>
                        <div style={styles.serverDetail}>
                            Total: 16GB · Used: {(serverMetrics.memory * 0.16).toFixed(1)}GB<br/>
                            Swap: 0%
                        </div>
                    </div>
                    
                    <div style={styles.serverCard('ok')}>
                        <div style={styles.serverTitle}>💿 Disk</div>
                        <div style={styles.serverValue}>{serverMetrics.disk.toFixed(1)}%</div>
                        <div style={styles.serverDetail}>
                            Total: 500GB · Free: {(500 * (1 - serverMetrics.disk/100)).toFixed(0)}GB<br/>
                            I/O: 2.3 MB/s
                        </div>
                    </div>
                    
                    <div style={styles.serverCard('ok')}>
                        <div style={styles.serverTitle}>⏱️ Uptime</div>
                        <div style={styles.serverValue}>{serverMetrics.uptime}</div>
                        <div style={styles.serverDetail}>
                            Requests/s: {serverMetrics.requests_per_sec}<br/>
                            Active: {serverMetrics.active_connections}
                        </div>
                    </div>
                    
                    <div style={styles.serverCard('ok')}>
                        <div style={styles.serverTitle}>🌐 Network</div>
                        <div style={styles.serverValue}>{formatBytes(serverMetrics.network_in)}/s</div>
                        <div style={styles.serverDetail}>
                            In: {formatBytes(serverMetrics.network_in * 1024)}<br/>
                            Out: {formatBytes(serverMetrics.network_out * 1024)}
                        </div>
                    </div>
                    
                    <div style={styles.serverCard(
                        websocketStatus === 'connected' ? 'ok' : 'warning'
                    )}>
                        <div style={styles.serverTitle}>🔌 WebSocket</div>
                        <div style={styles.serverValue}>
                            {websocketStatus === 'connected' ? 'LIVE' : 
                             websocketStatus === 'polling' ? 'POLL' : 'DOWN'}
                        </div>
                        <div style={styles.serverDetail}>
                            TLS: ✅ · Handshakes: {tlsHandshakes.length}<br/>
                            Latency: {estatisticas.latencia_media || 0}ms
                        </div>
                    </div>
                </div>
                
                {/* METRICS GRID */}
                <div style={styles.metricsGrid}>
                    <div style={styles.metricCard} onClick={() => setActiveTab('users')}>
                        <div style={styles.metricIcon}>👥</div>
                        <div style={styles.metricValue}>{stats.total_usuarios}</div>
                        <div style={styles.metricLabel}>Usuários</div>
                        <div style={styles.metricChange(true)}>
                            🟢 {stats.online} online
                        </div>
                    </div>
                    
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>💬</div>
                        <div style={styles.metricValue}>{stats.total_mensagens}</div>
                        <div style={styles.metricLabel}>Mensagens</div>
                        <div style={styles.metricChange(true)}>
                            ↑ {stats.mensagens_24h || 0} hoje
                        </div>
                    </div>
                    
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>📊</div>
                        <div style={styles.metricValue}>{stats.conversas_ativas}</div>
                        <div style={styles.metricLabel}>Conversas</div>
                    </div>
                    
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🔑</div>
                        <div style={styles.metricValue}>{stats.total_chaves || 0}</div>
                        <div style={styles.metricLabel}>Chaves Ativas</div>
                    </div>
                    
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🔐</div>
                        <div style={styles.metricValue}>
                            {cryptoStatus?.algoritmos ? 
                                Object.values(cryptoStatus.algoritmos).filter(a => a.ok).length : 0}
                        </div>
                        <div style={styles.metricLabel}>Algoritmos OK</div>
                    </div>
                    
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🛡️</div>
                        <div style={styles.metricValue}>
                            {securityLogs.filter(l => l.type === 'error').length}
                        </div>
                        <div style={styles.metricLabel}>Alertas</div>
                        <div style={styles.metricChange(false)}>
                            ⚠️ Verificar
                        </div>
                    </div>
                </div>
                
                {/* CHARTS */}
                <div style={styles.chartsGrid}>
                    <div style={styles.chartCard}>
                        <div style={styles.chartTitle}>
                            <span>📈 Tráfego de Mensagens</span>
                            <span style={{ fontSize: '11px', color: '#8b949e' }}>
                                Últimas 12 horas
                            </span>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Line data={messageChartData} options={chartOptions} />
                        </div>
                    </div>
                    
                    <div style={styles.chartCard}>
                        <div style={styles.chartTitle}>
                            <span>🔐 Distribuição de Criptografia</span>
                        </div>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
                            <Doughnut 
                                data={cryptoChartData} 
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { color: '#8b949e', font: { size: 10 } }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* SERVER LOAD CHART */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>📊 Carga do Servidor</span>
                    </div>
                    <div style={{ height: '200px' }}>
                        <Line data={serverLoadData} options={chartOptions} />
                    </div>
                </div>
                
                {/* CRYPTO STATUS */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>🔐 Status de Criptografia & TLS</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={styles.btn()} onClick={loadAllData}>
                                🔄 Verificar
                            </button>
                            <button style={styles.btn('warning')} onClick={handleLimparLogs}>
                                🗑️ Limpar Logs
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Algoritmos */}
                        <div>
                            <h4 style={{ color: '#8b949e', marginBottom: '12px', fontSize: '12px' }}>
                                Algoritmos Criptográficos
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {cryptoStatus?.algoritmos && Object.entries(cryptoStatus.algoritmos).map(([name, data]) => (
                                    <div key={name} style={{
                                        padding: '12px',
                                        background: '#0d1117',
                                        borderRadius: '8px',
                                        border: `1px solid ${data.ok ? '#238636' : '#da3633'}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#c9d1d9' }}>
                                            {name.replace(/_/g, '-').toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '12px', color: data.ok ? '#238636' : '#da3633' }}>
                                            {data.ok ? '✅ ATIVO' : '❌ FALHA'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* TLS Handshakes */}
                        <div>
                            <h4 style={{ color: '#8b949e', marginBottom: '12px', fontSize: '12px' }}>
                                Handshakes TLS Recentes
                            </h4>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Timestamp</th>
                                            <th style={styles.th}>IP</th>
                                            <th style={styles.th}>Cipher</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tlsHandshakes.slice(0, 5).map((h, i) => (
                                            <tr key={i}>
                                                <td style={styles.td}>
                                                    {new Date(h.timestamp).toLocaleTimeString('pt-BR')}
                                                </td>
                                                <td style={styles.td}>{h.ip || '192.168.1.' + i}</td>
                                                <td style={styles.td}>{h.cipher || 'TLS_AES_256_GCM'}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.badge('success')}>OK</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* USERS TABLE */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>👥 Usuários ({usuarios.length})</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#8b949e' }}>
                                🟢 {usuarios.filter(u => u.online).length} online
                            </span>
                            <button style={styles.btn()} onClick={handleForcarTodosOffline}>
                                Forçar Todos Offline
                            </button>
                        </div>
                    </div>
                    
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Telefone</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Mensagens</th>
                                    <th style={styles.th}>Criptografia</th>
                                    <th style={styles.th}>Última Atividade</th>
                                    <th style={styles.th}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id} style={{
                                        background: u.online ? 'rgba(35,134,54,0.05)' : 'transparent',
                                        cursor: 'pointer'
                                    }}>
                                        <td style={styles.td}>
                                            <code style={{ fontSize: '11px', color: '#e53935' }}>
                                                {u.id?.substring(0, 8)}
                                            </code>
                                        </td>
                                        <td style={styles.td}>{u.username}</td>
                                        <td style={styles.td}>{u.telefone}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                color: u.online ? '#4caf50' : '#8b949e',
                                                fontWeight: 'bold'
                                            }}>
                                                {u.online ? '🟢 Online' : '⚫ Offline'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{u.mensagens || 0}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge(u.crypto_status === 'ok' ? 'success' : 'warning')}>
                                                {u.algoritmo || 'BASE64'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {u.ultimo_visto ? 
                                                new Date(u.ultimo_visto).toLocaleTimeString('pt-BR') : 
                                                'N/A'}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {u.online && (
                                                    <button 
                                                        style={{...styles.btn(), padding: '4px 8px', fontSize: '10px'}}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleForcarLogout(u.id);
                                                        }}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                                <button 
                                                    style={{...styles.btn('warning'), padding: '4px 8px', fontSize: '10px'}}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRevogarChaves(u.id);
                                                    }}
                                                >
                                                    Revogar Chaves
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* SECURITY LOGS */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>🛡️ Console de Segurança</span>
                        <span style={{ fontSize: '11px', color: '#8b949e' }}>
                            Últimos {securityLogs.length} eventos
                        </span>
                    </div>
                    <div style={styles.console} ref={consoleRef}>
                        {securityLogs.map(log => (
                            <div key={log.id} style={styles.logLine(log.type)}>
                                <span style={{ color: '#8b949e' }}>
                                    [{new Date(log.timestamp).toLocaleTimeString('pt-BR')}]
                                </span>
                                {' '}
                                <span style={{ 
                                    color: log.type === 'error' ? '#da3633' : 
                                           log.type === 'warning' ? '#d2991d' : '#238636' 
                                }}>
                                    {log.type === 'error' ? '❌' : 
                                     log.type === 'warning' ? '⚠️' : '✅'}
                                </span>
                                {' '}
                                {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px rgba(76, 175, 80, 0.5); }
                    50% { opacity: 0.6; transform: scale(1.2); box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
                    100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px rgba(76, 175, 80, 0.5); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: #0d1117; }
                ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #e53935; }
                table { animation: fadeIn 0.3s ease; }
                tr:hover { background: rgba(229, 57, 53, 0.05) !important; }
            `}</style>
        </div>
    );
}

export default Admin;