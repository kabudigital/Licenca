import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut,
  X,
  Eye,
  EyeOff,
  Database,
  Terminal,
  FileCode,
  Key,
  UserCheck,
  AlertTriangle,
  Settings,
  RefreshCcw,
  Search,
  CheckCircle2,
  Ban,
  History,
  Phone,
  Lock,
  User as UserIcon,
  Activity,
  Server,
  Code2,
  Globe,
  LockKeyhole,
  Cpu,
  Monitor,
  Copy,
  Check,
  CreditCard,
  CalendarDays,
  Smartphone
} from 'lucide-react';

// --- Tipagens ---
type Role = 'ADMIN' | 'REVENDEDOR';
type Plan = 'MENSAL' | 'ANUAL' | 'VITALICIO';
type View = 'DASHBOARD' | 'RESELLERS' | 'MY_LICENSES' | 'MONITORING' | 'API' | 'SQL';

interface User {
  id: number;
  usuario: string;
  nome: string;
  role: Role;
}

interface Reseller {
  id: number;
  nome: string;
  usuario: string;
  senha?: string;
  telefone: string;
  status: 'ATIVO' | 'BLOQUEADO';
}

interface License {
  id: number;
  revendedorId: number;
  revendedorNome: string;
  nome: string;
  email: string;
  validade: string;
  hwid: string | null;
  tipo: Plan;
  status: 'ATIVO' | 'BLOQUEADO';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('DASHBOARD');
  const [loginInput, setLoginInput] = useState({ usuario: '', senha: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Estados de Cadastro ---
  const [newReseller, setNewReseller] = useState({ nome: '', usuario: '', senha: '', telefone: '' });
  const [newLicense, setNewLicense] = useState({ nome: '', email: '', validade: '', tipo: 'MENSAL' as Plan });

  // --- Dados Simulados ---
  const [resellers, setResellers] = useState<Reseller[]>([
    { id: 1, nome: 'Premium Digital', usuario: 'premium', telefone: '(11) 98877-6655', status: 'ATIVO' },
    { id: 2, nome: 'Revenda Elite', usuario: 'elite', telefone: '(21) 91122-3344', status: 'ATIVO' },
  ]);

  const [licenses, setLicenses] = useState<License[]>([
    { id: 1, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Carlos Developer', email: 'carlos@work.com', validade: '2025-12-31', hwid: 'DESKTOP-8899-AX', tipo: 'VITALICIO', status: 'ATIVO' },
    { id: 2, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Beatriz Silva', email: 'beatriz@gmail.com', validade: '2025-06-15', hwid: null, tipo: 'MENSAL', status: 'ATIVO' },
  ]);

  // --- Utilitários ---
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // --- Login Unificado ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { usuario, senha } = loginInput;

    if (usuario === 'admin' && senha === 'admin123') {
      setUser({ id: 0, usuario: 'admin', nome: 'Administrador Master', role: 'ADMIN' });
      setView('DASHBOARD');
    } else {
      const resellerFound = resellers.find(r => r.usuario === usuario && senha === '123456');
      if (resellerFound) {
        setUser({ id: resellerFound.id, usuario: resellerFound.usuario, nome: resellerFound.nome, role: 'REVENDEDOR' });
        setView('DASHBOARD');
      } else {
        setLoginError('Credenciais Master ou de Revenda incorretas.');
      }
    }
  };

  const handleAddReseller = () => {
    if (!newReseller.nome || !newReseller.usuario || !newReseller.senha || !newReseller.telefone) return alert("Preencha todos os campos, incluindo telefone!");
    setResellers([...resellers, { ...newReseller, id: resellers.length + 1, status: 'ATIVO' }]);
    setShowModal(false);
    setNewReseller({ nome: '', usuario: '', senha: '', telefone: '' });
  };

  const handleAddLicense = () => {
    if (!newLicense.email || !newLicense.validade) return alert("Preencha os campos obrigatórios!");
    const id = licenses.length + 1;
    const item: License = {
      ...newLicense,
      id,
      revendedorId: user?.id || 0,
      revendedorNome: user?.nome || '',
      hwid: null,
      status: 'ATIVO'
    };
    setLicenses([...licenses, item]);
    setShowLicenseModal(false);
    setNewLicense({ nome: '', email: '', validade: '', tipo: 'MENSAL' });
  };

  const handleResetHWID = (id: number) => {
    if (confirm("Deseja resetar a trava de PC? O sistema aceitará o próximo computador que logar.")) {
      setLicenses(licenses.map(l => l.id === id ? { ...l, hwid: null } : l));
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();
  const myLicenses = user?.role === 'ADMIN' ? licenses : licenses.filter(l => l.revendedorId === user?.id);

  const stats = {
    ativas: myLicenses.filter(l => l.status === 'ATIVO' && !isExpired(l.validade)).length,
    total: myLicenses.length,
    vencidas: myLicenses.filter(l => isExpired(l.validade)).length,
    revendedores: resellers.length
  };

  const sqlFinal = `-- ORVEX PRO - INFRAESTRUTURA COMPLETA SQL
-- Lógica: Controle de Revendas + Trava Single PC (HWID)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- 1. Tabela de Administradores Master
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`usuario\` varchar(50) NOT NULL UNIQUE,
  \`senha\` varchar(255) NOT NULL,
  \`nome\` varchar(100) DEFAULT NULL,
  \`token_api\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabela de Revendedores (Parceiros)
CREATE TABLE IF NOT EXISTS \`revendedores\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nome\` varchar(100) NOT NULL,
  \`usuario\` varchar(50) NOT NULL UNIQUE,
  \`senha\` varchar(255) NOT NULL,
  \`telefone\` varchar(30) NOT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') DEFAULT 'ATIVO',
  \`criado_em\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabela de Licenças (Usuários Finais com Trava de PC)
CREATE TABLE IF NOT EXISTS \`licencas\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`revendedor_id\` int(11) NOT NULL,
  \`nome\` varchar(100) DEFAULT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`validade\` date NOT NULL,
  \`hwid\` varchar(255) DEFAULT NULL COMMENT 'ID Único do Hardware (Travado no 1º acesso)',
  \`tipo\` enum('MENSAL','ANUAL','VITALICIO') NOT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') DEFAULT 'ATIVO',
  \`criado_em\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_hwid_lock\` (\`hwid\`),
  CONSTRAINT \`fk_reseller_id\` FOREIGN KEY (\`revendedor_id\`) REFERENCES \`revendedores\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserção do Admin Inicial
INSERT INTO \`admins\` (\`usuario\`, \`senha\`, \`nome\`) VALUES ('admin', 'admin123', 'Diretor Geral');

COMMIT;`;

  const phpCheckCode = `<?php
/**
 * check.php - Verificação de Licença e Trava de HWID
 * Proteção Sênior para Software (C#, Python, C++, etc)
 */
header('Content-Type: application/json');

// 1. Configuração do Banco de Dados
$host = 'localhost';
$db   = 'orvex_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die(json_encode(['status' => 'error', 'message' => 'Falha na conexão']));
}

// 2. Recebimento de Parâmetros (E-mail e HWID capturado pelo Software)
$email = filter_input(INPUT_GET, 'email', FILTER_SANITIZE_EMAIL);
$hwid  = filter_input(INPUT_GET, 'hwid', FILTER_SANITIZE_STRING);

if (!$email || !$hwid) {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetros inválidos']);
    exit;
}

// 3. Consulta de Licença
$stmt = $pdo->prepare("SELECT * FROM licencas WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$lic = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lic) {
    echo json_encode(['status' => 'invalid', 'message' => 'Licença não cadastrada']);
    exit;
}

// 4. Validações de Status e Validade
if ($lic['status'] !== 'ATIVO') {
    echo json_encode(['status' => 'blocked', 'message' => 'Sua licença foi suspensa']);
    exit;
}

if (strtotime($lic['validade']) < time()) {
    echo json_encode(['status' => 'expired', 'message' => 'Assinatura expirada em ' . $lic['validade']]);
    exit;
}

// 5. Lógica da Trava Single PC (HWID)
if (empty($lic['hwid'])) {
    // Primeiro acesso: Vincula o PC atual permanentemente
    $update = $pdo->prepare("UPDATE licencas SET hwid = ? WHERE id = ?");
    $update->execute([$hwid, $lic['id']]);
    echo json_encode([
        'status' => 'success', 
        'message' => 'PC Vinculado com sucesso!',
        'validade' => $lic['validade']
    ]);
} else {
    // Acessos posteriores: Compara o hardware atual com o travado
    if ($lic['hwid'] !== $hwid) {
        echo json_encode([
            'status' => 'hwid_mismatch', 
            'message' => 'Acesso negado: Esta licença está ativa em outro computador'
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Acesso autorizado',
        'validade' => $lic['validade']
    ]);
}
?>`;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#020617] relative overflow-hidden selection:bg-indigo-500/30">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-[440px]">
          <div className="text-center mb-10">
            <div className="inline-flex p-5 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 mb-6 shadow-xl shadow-indigo-600/5 animate-pulse">
              <Shield className="text-indigo-500 w-14 h-14" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Orvex<span className="text-indigo-500">Pro</span></h1>
            <p className="text-slate-500 font-bold mt-3 uppercase text-[10px] tracking-[0.4em]">Unified Licensing System</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Usuário ou E-mail</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input type="text" value={loginInput.usuario} onChange={(e) => setLoginInput({...loginInput, usuario: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-medium placeholder:text-slate-700" placeholder="Acesso Master ou Revenda" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Senha de Segurança</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input type={showPassword ? "text" : "password"} value={loginInput.senha} onChange={(e) => setLoginInput({...loginInput, senha: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-14 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-mono placeholder:text-slate-700" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center py-4 rounded-2xl animate-shake">{loginError}</div>}
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase text-xs tracking-widest">
                Entrar no Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Navbar Premium */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-500 w-8 h-8" />
            <h1 className="text-xl font-black tracking-tighter uppercase">Orvex<span className="text-indigo-500">Pro</span></h1>
          </div>
          <div className="hidden lg:flex gap-8">
            <button onClick={() => setView('DASHBOARD')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'DASHBOARD' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
              <Terminal className="w-4 h-4" /> DASHBOARD
            </button>
            {user.role === 'ADMIN' ? (
              <>
                <button onClick={() => setView('RESELLERS')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'RESELLERS' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
                  <Users className="w-4 h-4" /> REVENDEDORES
                </button>
                <button onClick={() => setView('MONITORING')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'MONITORING' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
                  <Activity className="w-4 h-4" /> MONITOR GLOBAL
                </button>
                <button onClick={() => setView('API')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'API' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
                  <Code2 className="w-4 h-4" /> ENDPOINT API
                </button>
                <button onClick={() => setView('SQL')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'SQL' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
                  <Database className="w-4 h-4" /> SQL MASTER
                </button>
              </>
            ) : (
              <button onClick={() => setView('MY_LICENSES')} className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === 'MY_LICENSES' ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}>
                <Key className="w-4 h-4" /> MINHAS LICENÇAS
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{user.role}</p>
            <p className="text-xs font-bold text-white uppercase">{user.nome}</p>
          </div>
          <button onClick={() => setUser(null)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-rose-500 border border-white/5 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-8 py-12">
        {/* Dashboard View */}
        {view === 'DASHBOARD' && (
          <div className="animate-in fade-in duration-700">
             <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Visão <span className="text-indigo-500">Geral</span></h2>
                  <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">Resumo de ativações e status da plataforma.</p>
               </div>
               {user.role === 'REVENDEDOR' && (
                 <button onClick={() => setShowLicenseModal(true)} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                    <Plus className="w-5 h-5" /> Nova Licença
                 </button>
               )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] group">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Licenças Ativas</p>
                   <div className="text-6xl font-black text-white">{stats.ativas}</div>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] group">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Vencidas ou Bloqueadas</p>
                   <div className="text-6xl font-black text-white">{stats.vencidas}</div>
                </div>
                {user.role === 'ADMIN' ? (
                   <div className="bg-indigo-600 border border-indigo-400 p-8 rounded-[2.5rem] shadow-2xl">
                      <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-2">Revendedores Ativos</p>
                      <div className="text-6xl font-black text-white">{stats.revendedores}</div>
                   </div>
                ) : (
                  <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] group">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total de Clientes</p>
                    <div className="text-6xl font-black text-white">{stats.total}</div>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10">
                   <h3 className="text-xl font-black mb-6 uppercase flex items-center gap-3"><History className="text-indigo-500" /> Atividades Recentes</h3>
                   <div className="space-y-4">
                      {myLicenses.slice(0, 4).map(l => (
                        <div key={l.id} className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500"><UserIcon className="w-5 h-5" /></div>
                              <div>
                                 <p className="font-bold text-sm text-white">{l.nome || l.email}</p>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Vencimento: {l.validade}</p>
                              </div>
                           </div>
                           <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${l.status === 'ATIVO' ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-500 bg-rose-500/10 border border-rose-500/20'}`}>{l.status}</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] p-10 flex flex-col justify-center text-center items-center">
                   <div className="p-5 bg-indigo-500/10 rounded-3xl mb-6"><Monitor className="text-indigo-500 w-10 h-10" /></div>
                   <h3 className="text-2xl font-black mb-2 uppercase">Trava Single-PC</h3>
                   <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-6">A trava de HWID está ativa em todas as licenças. Cada chave só funciona em 1 computador por vez.</p>
                   <div className="flex gap-4">
                      <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-indigo-400">Anti-Piracy</div>
                      <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase text-indigo-400">Lock-ID</div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Resellers View (Admin Only) */}
        {view === 'RESELLERS' && user.role === 'ADMIN' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black tracking-tight uppercase">Gerenciar Parceiros</h2>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 shadow-xl shadow-indigo-600/20"><Plus className="w-5 h-5" /> Novo Revendedor</button>
             </div>
             <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <tr>
                         <th className="px-8 py-6">Parceiro</th>
                         <th className="px-8 py-6">WhatsApp</th>
                         <th className="px-8 py-6">Clientes Ativos</th>
                         <th className="px-8 py-6 text-right">Controle</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {resellers.map(r => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-8 font-bold text-lg text-white">{r.nome} <br/> <span className="text-[10px] font-mono text-indigo-400">@{r.usuario}</span></td>
                           <td className="px-8 py-8"><span className="text-xs font-medium text-slate-400">{r.telefone}</span></td>
                           <td className="px-8 py-8">
                              <span className="text-2xl font-black text-white">{licenses.filter(l => l.revendedorId === r.id).length}</span>
                           </td>
                           <td className="px-8 py-8 text-right space-x-3">
                              <button className="p-3 bg-white/5 rounded-xl hover:text-indigo-400 border border-white/5"><Pencil className="w-5 h-5" /></button>
                              <button className="p-3 bg-white/5 rounded-xl hover:text-rose-400 border border-white/5"><Ban className="w-5 h-5" /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* API View */}
        {view === 'API' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
             <div className="mb-10 flex justify-between items-center">
                <h2 className="text-4xl font-black tracking-tight uppercase">Integração <span className="text-indigo-500">API PHP</span></h2>
                <button onClick={() => copyToClipboard(phpCheckCode)} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl flex items-center gap-3 transition-all">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase">Copiar Script</span>
                </button>
             </div>
             
             <div className="grid grid-cols-1 gap-8">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
                   <div className="flex items-center gap-3 mb-6">
                      <FileCode className="text-emerald-500" />
                      <h3 className="font-black text-xl uppercase tracking-tighter">check.php (Estrutura de Verificação)</h3>
                   </div>
                   <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed bg-black/50 p-8 rounded-3xl overflow-x-auto h-[500px] border border-white/5">{phpCheckCode}</pre>
                </div>
                
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2.5rem]">
                   <h4 className="font-black text-sm uppercase mb-4 flex items-center gap-2"><Globe className="w-4 h-4" /> Endpoint de Teste</h4>
                   <code className="block bg-black/40 p-4 rounded-xl text-indigo-400 text-xs font-mono break-all mb-4">
                      GET: https://seusite.com/api/check.php?email=CLIENTE@EMAIL.COM&hwid=ID_DO_HARDWARE
                   </code>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Nota: O HWID é um identificador único da máquina (como Serial da Motherboard ou CPU). Seu software deve capturá-lo e enviá-lo via URL para validar a licença.</p>
                </div>
             </div>
          </div>
        )}

        {/* Monitoring & My Licenses View */}
        {(view === 'MY_LICENSES' || view === 'MONITORING') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black tracking-tight uppercase">{view === 'MONITORING' ? 'Controle Global HWID' : 'Gestão de Licenças'}</h2>
                {user.role === 'REVENDEDOR' && (
                  <button onClick={() => setShowLicenseModal(true)} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 shadow-xl shadow-indigo-600/20"><Plus className="w-5 h-5" /> Criar Chave</button>
                )}
             </div>
             <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <tr>
                         <th className="px-8 py-6">Cliente</th>
                         <th className="px-8 py-6">HWID Travado</th>
                         <th className="px-8 py-6">Validade / Plano</th>
                         <th className="px-8 py-6 text-right">Reset Lock</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {myLicenses.map(l => (
                        <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-8">
                              <div className="font-bold text-white text-md">{l.nome || 'Cliente Final'}</div>
                              <div className="text-[10px] font-medium text-slate-500">{l.email}</div>
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 w-fit">
                                 <Cpu className="w-4 h-4 text-indigo-500" /> {l.hwid || 'SISTEMA AGUARDANDO ACESSO'}
                              </div>
                           </td>
                           <td className="px-8 py-8">
                              <div className={`font-bold text-sm ${isExpired(l.validade) ? 'text-rose-500' : 'text-emerald-500'}`}>{l.validade} <br/> <span className="text-[10px] text-slate-500 uppercase font-black">{l.tipo}</span></div>
                           </td>
                           <td className="px-8 py-8 text-right">
                              <button onClick={() => handleResetHWID(l.id)} className="p-3 bg-white/5 rounded-xl hover:text-amber-500 border border-white/5 transition-all" title="Liberar novo PC"><RefreshCcw className="w-5 h-5" /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* SQL Tab */}
        {view === 'SQL' && user.role === 'ADMIN' && (
          <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
             <div className="mb-10 flex justify-between items-center">
                <h2 className="text-4xl font-black tracking-tight uppercase">Script <span className="text-indigo-500">MySQL</span></h2>
                <button onClick={() => copyToClipboard(sqlFinal)} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl flex items-center gap-3 transition-all">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase">Copiar SQL</span>
                </button>
             </div>
             <pre className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto shadow-2xl h-[600px] border border-white/5">{sqlFinal}</pre>
          </div>
        )}
      </main>

      {/* Modal: Novo Revendedor */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
             <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white"><X className="w-8 h-8" /></button>
             <h2 className="text-3xl font-black mb-10 flex items-center gap-4"><UserCheck className="text-indigo-500" /> Registrar Revendedor</h2>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Nome / Empresa</label>
                   <input type="text" value={newReseller.nome} onChange={e => setNewReseller({...newReseller, nome: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Ex: Revenda Premium" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">WhatsApp de Contato</label>
                   <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                      <input type="text" value={newReseller.telefone} onChange={e => setNewReseller({...newReseller, telefone: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-16 pr-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="(11) 99999-9999" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Usuário Login</label>
                     <input type="text" value={newReseller.usuario} onChange={e => setNewReseller({...newReseller, usuario: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" placeholder="revenda01" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Senha Inicial</label>
                     <input type="password" value={newReseller.senha} onChange={e => setNewReseller({...newReseller, senha: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" placeholder="••••••••" />
                  </div>
                </div>
                <button onClick={handleAddReseller} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 mt-6">Ativar Cadastro de Parceiro</button>
             </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Licença */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
             <button onClick={() => setShowLicenseModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white"><X className="w-8 h-8" /></button>
             <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase"><Key className="text-indigo-500" /> Emitir Nova Chave</h2>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">E-mail do Cliente</label>
                   <input type="email" value={newLicense.email} onChange={e => setNewLicense({...newLicense, email: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="cliente@provedor.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Modalidade</label>
                      <select value={newLicense.tipo} onChange={e => setNewLicense({...newLicense, tipo: e.target.value as Plan})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none font-bold text-xs uppercase">
                         <option value="MENSAL">Mensal</option>
                         <option value="ANUAL">Anual</option>
                         <option value="VITALICIO">Vitalício</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Expiração</label>
                      <input type="date" value={newLicense.validade} onChange={e => setNewLicense({...newLicense, validade: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold" />
                   </div>
                </div>
                <button onClick={handleAddLicense} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 mt-6 tracking-[0.2em]">Gerar e Salvar Licença</button>
             </div>
          </div>
        </div>
      )}

      <footer className="py-12 border-t border-white/5 bg-slate-950/30 text-center">
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em]">Sistema de Licenciamento Sênior &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;