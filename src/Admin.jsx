import React, { useState, useEffect, useRef } from 'react';
import { adminService, cryptoService } from './services/api';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0d1117', fontFamily: 'system-ui, sans-serif' },
    header: { backgroundColor: '#161b22', padding: '16px 32px', borderBottom: '3px solid #e53935', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { fontSize: '28px' },
    logoText: { fontSize: '20px', fontWeight: 'bold', color: 'white' },
    adminBadge: { backgroundColor: '#e53935', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginLeft: '12px' },
    main: { maxWidth: '1800px', margin: '0 auto', padding: '24px' },
    
    // Métricas
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' },
    metricCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '20px', border: '1px solid #30363d' },
    metricIcon: { fontSize: '24px', marginBottom: '8px' },
    metricValue: { fontSize: '28px', fontWeight: 'bold', color: 'white' },
    metricLabel: { fontSize: '12px', color: '#8b949e', marginTop: '4px' },
    trend: { fontSize: '11px', color: '#4caf50', marginTop: '8px' },
    
    // Gráficos
    chartsRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' },
    chartCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '20px', border: '1px solid #30363d' },
    chartTitle: { fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    
    // Seções
    section: { backgroundColor: '#161b22', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #30363d' },
    sectionTitle: { fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' },
    
    // Tabelas
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 12px', backgroundColor: '#0d1117', fontSize: '11px', fontWeight: '600', color: '#8b949e', borderBottom: '1px solid #30363d' },
    td: { padding: '10px 12px', borderBottom: '1px solid #30363d', fontSize: '13px', color: '#c9d1d9' },
    
    // Badges
    badge: { display: 'inline-block', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '500' },
    badgeSuccess: { backgroundColor: '#238636', color: 'white' },
    badgeWarning: { backgroundColor: '#9e6a03', color: 'white' },
    badgeInfo: { backgroundColor: '#1f6feb', color: 'white' },
    
    // Botões
    btn: { padding: '8px 16px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
    btnOutline: { padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #30363d', borderRadius: '6px', fontSize: '12px', color: '#c9d1d9', cursor: 'pointer' },
    
    // Status
    liveIndicator: { display: 'flex', alignItems: 'center', gap: '8px' },
    pulse: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' },
    
    // Usuário online
    online: { color: '#4caf50', fontWeight: 'bold' },
    offline: { color: '#8b949e' },
};

function Admin() {
    const [stats, setStats] = useState({
        total_usuarios: 0,
        online: 0,
        total_mensagens: 0,
        mensagens_24h: 0,
        conversas_ativas: 0,
        total_amizades: 0,
        solicitacoes_pendentes: 0,
        total_chaves: 0,
    });
    
    const [usuarios, setUsuarios] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [chaves, setChaves] = useState([]);
    const [logs, setLogs] = useState([]);
    const [cryptoStatus, setCryptoStatus] = useState(null);
    const [estatisticas, setEstatisticas] = useState({ por_hora: [] });
    const [messageStats, setMessageStats] = useState({ por_usuario: [], por_algoritmo: [] });
    
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [updateCount, setUpdateCount] = useState(0);
    
    const intervalRef = useRef(null);
    
    useEffect(() => {
        loadAllData();
        
        // Atualização a cada 1 segundo
        intervalRef.current = setInterval(() => {
            if (isLive) {
                loadAllData();
                setUpdateCount(prev => prev + 1);
            }
        }, 1000);
        
        return () => clearInterval(intervalRef.current);
    }, [isLive]);
    
    const loadAllData = async () => {
        try {
            const [statsRes, usuariosRes, mensagensRes, chavesRes, logsRes, cryptoRes, estatRes] = await Promise.all([
                adminService.getStats(),
                adminService.getUsuarios(),
                adminService.getMensagens(),
                adminService.getChaves(),
                adminService.getLogs(),
                cryptoService.testCrypto(),
                adminService.getEstatisticas(),
            ]);
            
            setStats(statsRes.data);
            setUsuarios(usuariosRes.data.usuarios || []);
            setMensagens(mensagensRes.data.mensagens || []);
            setChaves(chavesRes.data.chaves || []);
            setLogs(logsRes.data.logs || []);
            setCryptoStatus(cryptoRes.data);
            setEstatisticas(estatRes.data);
            setLastUpdate(new Date());
            
            // Calcular estatísticas adicionais
            calcularEstatisticasMensagens(mensagensRes.data.mensagens || []);
            
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const calcularEstatisticasMensagens = (mensagens) => {
        // Por usuário
        const userCount = {};
        mensagens.forEach(m => {
            userCount[m.remetente] = (userCount[m.remetente] || 0) + 1;
        });
        
        const por_usuario = Object.entries(userCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([user, count]) => ({ user, count }));
        
        // Por algoritmo
        const algoCount = {};
        mensagens.forEach(m => {
            algoCount[m.algoritmo] = (algoCount[m.algoritmo] || 0) + 1;
        });
        
        const por_algoritmo = Object.entries(algoCount)
            .map(([algo, count]) => ({ algoritmo: algo, count }));
        
        setMessageStats({ por_usuario, por_algoritmo });
    };
    
    const handleForcarLogout = async (userId) => {
        try {
            await adminService.forcarLogout(userId);
            loadAllData();
        } catch (err) {
            alert('Erro ao forçar logout');
        }
    };
    
    const handleForcarTodosOffline = async () => {
        for (const user of usuarios.filter(u => u.online)) {
            try {
                await adminService.forcarLogout(user.id);
            } catch (err) {}
        }
        loadAllData();
    };
    
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };
    
    // Dados do gráfico de mensagens
    const messageChartData = {
        labels: estatisticas.por_hora?.map(h => h.hora) || [],
        datasets: [{
            label: 'Mensagens',
            data: estatisticas.por_hora?.map(h => h.count) || [],
            borderColor: '#e53935',
            backgroundColor: 'rgba(229, 57, 53, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
        }]
    };
    
    // Dados do gráfico de usuários
    const userChartData = {
        labels: messageStats.por_usuario?.map(u => u.user) || [],
        datasets: [{
            label: 'Mensagens por Usuário',
            data: messageStats.por_usuario?.map(u => u.count) || [],
            backgroundColor: '#1f6feb',
            borderRadius: 4,
        }]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                grid: { color: '#30363d' },
                ticks: { color: '#8b949e' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#8b949e' }
            }
        }
    };
    
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🛡️</span>
                    <span style={styles.logoText}>SecureMessaging Admin</span>
                    <span style={styles.adminBadge}>SERVIDOR</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={styles.liveIndicator}>
                        <span style={{...styles.pulse, animation: isLive ? 'pulse 1s infinite' : 'none' }}></span>
                        <span style={{ color: '#8b949e', fontSize: '12px' }}>
                            {isLive ? 'AO VIVO' : 'PAUSADO'} · {lastUpdate.toLocaleTimeString('pt-BR')}
                        </span>
                    </div>
                    <span style={{ color: '#30363d' }}>|</span>
                    <span style={{ color: '#8b949e', fontSize: '12px' }}>Atualizações: {updateCount}</span>
                    <button style={styles.btnOutline} onClick={() => setIsLive(!isLive)}>
                        {isLive ? '⏸️ Pausar' : '▶️ Retomar'}
                    </button>
                    <button style={styles.btn} onClick={loadAllData}>🔄 Atualizar</button>
                    <button style={styles.btnOutline} onClick={handleForcarTodosOffline}>👥 Forçar Todos Offline</button>
                    <button style={{...styles.btn, backgroundColor: '#30363d'}} onClick={handleLogout}>🚪 Sair</button>
                </div>
            </header>
            
            <main style={styles.main}>
                {/* Métricas */}
                <div style={styles.metricsGrid}>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>👥</div>
                        <div style={styles.metricValue}>{stats.total_usuarios}</div>
                        <div style={styles.metricLabel}>Usuários</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🟢</div>
                        <div style={styles.metricValue}>{stats.online}</div>
                        <div style={styles.metricLabel}>Online</div>
                        <div style={styles.trend}>{((stats.online / stats.total_usuarios) * 100 || 0).toFixed(1)}% do total</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>💬</div>
                        <div style={styles.metricValue}>{stats.total_mensagens}</div>
                        <div style={styles.metricLabel}>Mensagens</div>
                        <div style={styles.trend}>+{stats.mensagens_24h || 0} hoje</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>📊</div>
                        <div style={styles.metricValue}>{stats.conversas_ativas}</div>
                        <div style={styles.metricLabel}>Conversas</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🤝</div>
                        <div style={styles.metricValue}>{stats.total_amizades || 0}</div>
                        <div style={styles.metricLabel}>Amizades</div>
                    </div>
                    <div style={styles.metricCard}>
                        <div style={styles.metricIcon}>🔑</div>
                        <div style={styles.metricValue}>{stats.total_chaves || 0}</div>
                        <div style={styles.metricLabel}>Chaves</div>
                    </div>
                </div>
                
                {/* Gráficos */}
                <div style={styles.chartsRow}>
                    <div style={styles.chartCard}>
                        <div style={styles.chartTitle}>
                            <span>📈 Mensagens (Últimas 12 horas)</span>
                            <span style={{ fontSize: '11px', color: '#8b949e' }}>Atualizado a cada 1s</span>
                        </div>
                        <div style={{ height: '250px' }}>
                            <Line data={messageChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div style={styles.chartCard}>
                        <div style={styles.chartTitle}>🔐 Algoritmos Ativos</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px' }}>
                            {cryptoStatus?.algoritmos && Object.entries(cryptoStatus.algoritmos).map(([name, data]) => (
                                <div key={name} style={{ 
                                    padding: '8px 12px', 
                                    backgroundColor: data.ok ? '#238636' : '#da3633', 
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: 'white'
                                }}>
                                    {name.replace(/_/g, '-')} {data.ok ? '✅' : '❌'}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <div style={styles.chartTitle}>📊 Mensagens por Algoritmo</div>
                            {messageStats.por_algoritmo.map(a => (
                                <div key={a.algoritmo} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#c9d1d9', fontSize: '12px' }}>
                                    <span>{a.algoritmo}</span>
                                    <span style={{ color: '#e53935' }}>{a.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Gráfico de usuários mais ativos */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>🏆 Usuários Mais Ativos</span>
                    </div>
                    <div style={{ height: '200px' }}>
                        <Bar data={userChartData} options={chartOptions} />
                    </div>
                </div>
                
                {/* Usuários */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span>👥 Usuários ({usuarios.length})</span>
                        <span style={{ fontSize: '12px', color: '#8b949e' }}>
                            🟢 {usuarios.filter(u => u.online).length} online
                        </span>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Telefone</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Mensagens</th>
                                    <th style={styles.th}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td style={styles.td}>{u.username}</td>
                                        <td style={styles.td}>{u.telefone}</td>
                                        <td style={styles.td}>
                                            <span style={u.online ? styles.online : styles.offline}>
                                                {u.online ? '🟢 Online' : '⚫ Offline'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{u.mensagens}</td>
                                        <td style={styles.td}>
                                            {u.online && (
                                                <button 
                                                    style={{...styles.btnOutline, padding: '4px 8px', fontSize: '10px'}}
                                                    onClick={() => handleForcarLogout(u.id)}
                                                >
                                                    Forçar Logout
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Mensagens Recentes e Chaves */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>💬 Mensagens Recentes</div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Remetente</th>
                                        <th style={styles.th}>Destinatário</th>
                                        <th style={styles.th}>Conteúdo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mensagens.slice(0, 8).map(m => (
                                        <tr key={m.id}>
                                            <td style={styles.td}>{m.remetente}</td>
                                            <td style={styles.td}>{m.destinatario}</td>
                                            <td style={styles.td}>{m.conteudo?.substring(0, 30)}...</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>🔑 Chaves Criptográficas</div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Usuário</th>
                                        <th style={styles.th}>Algoritmo</th>
                                        <th style={styles.th}>Tipo</th>
                                        <th style={styles.th}>Fingerprint</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chaves.slice(0, 8).map(c => (
                                        <tr key={c.id}>
                                            <td style={styles.td}>{c.usuario}</td>
                                            <td style={styles.td}>
                                                <span style={{...styles.badge, ...styles.badgeWarning}}>{c.algoritmo}</span>
                                            </td>
                                            <td style={styles.td}>{c.tipo}</td>
                                            <td style={styles.td}>{c.fingerprint}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

export default Admin;