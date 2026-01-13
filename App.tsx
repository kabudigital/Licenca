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
  Check
} from 'lucide-react';

// --- Tipagens ---
type Role = 'ADMIN' | 'REVENDEDOR';
type Plan = 'MENSAL' | 'ANUAL' | 'VITALICIO';
type View = 'DASHBOARD' | 'RESELLERS' | 'MONITORING' | 'API' | 'SQL';

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
  const [copied, setCopied] = useState(false);

  // --- Estados de Cadastro ---
  const [newReseller, setNewReseller] = useState({ nome: '', usuario: '', senha: '', telefone: '' });

  // --- Dados Simulados (Representando o Banco de Dados) ---
  const [resellers, setResellers] = useState<Reseller[]>([
    { id: 1, nome: 'Premium Digital', usuario: 'premium_user', telefone: '(11) 98877-6655', status: 'ATIVO' },
    { id: 2, nome: 'Revenda Elite', usuario: 'elite_soft', telefone: '(21) 91122-3344', status: 'ATIVO' },
  ]);

  const [licenses, setLicenses] = useState<License[]>([
    { id: 1, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Carlos Developer', email: 'carlos@work.com', validade: '2025-12-31', hwid: 'DESKTOP-8899-AX', tipo: 'VITALICIO', status: 'ATIVO' },
    { id: 2, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Beatriz Silva', email: 'beatriz@gmail.com', validade: '2025-06-15', hwid: null, tipo: 'MENSAL', status: 'ATIVO' },
    { id: 3, revendedorId: 2, revendedorNome: 'Revenda Elite', nome: 'Marcos Paulo', email: 'marcos@teste.com', validade: '2023-01-01', hwid: 'HWID-OLD-99', tipo: 'ANUAL', status: 'ATIVO' },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.usuario === 'admin' && loginInput.senha === 'admin123') {
      setUser({ id: 1, usuario: 'admin', nome: 'Administrador Master', role: 'ADMIN' });
    } else {
      setLoginError('Acesso Negado. Credenciais Master inválidas.');
    }
  };

  const handleAddReseller = () => {
    if (!newReseller.nome || !newReseller.usuario || !newReseller.senha) {
      alert("Por favor, preencha nome, usuário e senha.");
      return;
    }
    const id = resellers.length + 1;
    setResellers([...resellers, { ...newReseller, id, status: 'ATIVO' }]);
    setShowModal(false);
    setNewReseller({ nome: '', usuario: '', senha: '', telefone: '' });
  };

  const handleResetHWID = (id: number) => {
    if (confirm("Deseja realmente resetar o HWID desta licença? O cliente poderá vincular um novo PC.")) {
      setLicenses(licenses.map(l => l.id === id ? { ...l, hwid: null } : l));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = (date: string) => new Date(date) < new Date();
  
  const getActiveCountForReseller = (resellerId: number) => {
    return licenses.filter(l => l.revendedorId === resellerId && l.status === 'ATIVO' && !isExpired(l.validade)).length;
  };

  const stats = {
    ativas: licenses.filter(l => l.status === 'ATIVO' && !isExpired(l.validade)).length,
    totalClientes: licenses.length,
    totalRevendedores: resellers.length
  };

  const sqlCompleteCode = `-- ORVEX PRO - BANCO DE DADOS COMPLETO
-- Lógica: 1 Licença vinculada a 1 PC (HWID)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- Tabela de Revendedores
CREATE TABLE IF NOT EXISTS \`revendedores\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nome\` varchar(100) NOT NULL,
  \`usuario\` varchar(50) NOT NULL UNIQUE,
  \`senha\` varchar(255) NOT NULL,
  \`telefone\` varchar(20) DEFAULT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') DEFAULT 'ATIVO',
  \`criado_em\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Licenças (Com Trava de Hardware)
CREATE TABLE IF NOT EXISTS \`licencas\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`revendedor_id\` int(11) NOT NULL,
  \`nome\` varchar(100) DEFAULT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`validade\` date NOT NULL,
  \`hwid\` varchar(255) DEFAULT NULL COMMENT 'ID Unico do PC',
  \`tipo\` enum('MENSAL','ANUAL','VITALICIO') NOT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') DEFAULT 'ATIVO',
  \`criado_em\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_hwid\` (\`hwid\`),
  CONSTRAINT \`fk_revenda\` FOREIGN KEY (\`revendedor_id\`) REFERENCES \`revendedores\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;`;

  const phpCheckCode = `<?php
/**
 * check.php - O cérebro do seu licenciamento
 * Proteção: Single PC (HWID Lock)
 */
header('Content-Type: application/json');
require 'config.php'; // Arquivo de conexão PDO

$email = filter_input(INPUT_GET, 'email', FILTER_SANITIZE_EMAIL);
$hwid  = filter_input(INPUT_GET, 'hwid', FILTER_SANITIZE_STRING);

if (!$email || !$hwid) {
    echo json_encode(['status' => 'error', 'message' => 'Parametros insuficientes']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM licencas WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$lic = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lic) {
    echo json_encode(['status' => 'invalid', 'message' => 'Licenca nao encontrada']);
    exit;
}

if ($lic['status'] !== 'ATIVO') {
    echo json_encode(['status' => 'blocked', 'message' => 'Esta licenca foi suspensa']);
    exit;
}

// Verifica data de validade
if (strtotime($lic['validade']) < time()) {
    echo json_encode(['status' => 'expired', 'message' => 'Licenca expirada em ' . $lic['validade']]);
    exit;
}

// LOGICA DE TRAVA DE PC (HWID)
if (empty($lic['hwid'])) {
    // Primeiro acesso do cliente: salvamos o HWID dele para sempre
    $update = $pdo->prepare("UPDATE licencas SET hwid = ? WHERE id = ?");
    $update->execute([$hwid, $lic['id']]);
    echo json_encode(['status' => 'success', 'message' => 'PC Vinculado com sucesso!', 'validade' => $lic['validade']]);
} else {
    // Acessos seguintes: o HWID deve ser IDENTICO
    if ($lic['hwid'] !== $hwid) {
        echo json_encode(['status' => 'hwid_error', 'message' => 'Acesso negado: Licenca vinculada a outro PC']);
        exit;
    }
    echo json_encode(['status' => 'success', 'message' => 'Acesso autorizado', 'validade' => $lic['validade']]);
}
?>`;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 mb-4 animate-bounce">
              <Shield className="text-indigo-500 w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Orvex<span className="text-indigo-500">Pro</span></h1>
            <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">Advanced Licensing Infrastructure</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Usuário Master</label>
                <input type="text" value={loginInput.usuario} onChange={(e) => setLoginInput({...loginInput, usuario: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-medium" placeholder="admin" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Senha de Acesso</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={loginInput.senha} onChange={(e) => setLoginInput({...loginInput, senha: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-mono" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {loginError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center py-3 rounded-xl">{loginError}</div>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">ENTRAR NO PAINEL MASTER</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header / Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-500 w-8 h-8" />
            <h1 className="text-xl font-black tracking-tighter uppercase">Orvex<span className="text-indigo-500">Pro</span></h1>
          </div>
          <div className="hidden lg:flex gap-8">
            {[
              { id: 'DASHBOARD', icon: <Terminal className="w-4 h-4" />, label: 'DASHBOARD' },
              { id: 'RESELLERS', icon: <Users className="w-4 h-4" />, label: 'REVENDEDORES' },
              { id: 'MONITORING', icon: <Monitor className="w-4 h-4" />, label: 'MONITORAMENTO 1-PC' },
              { id: 'API', icon: <Code2 className="w-4 h-4" />, label: 'API PHP' },
              { id: 'SQL', icon: <Database className="w-4 h-4" />, label: 'BANCO DE DADOS' },
            ].map(nav => (
              <button 
                key={nav.id} 
                onClick={() => setView(nav.id as View)} 
                className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 transition-all ${view === nav.id ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-500 hover:text-white pb-1'}`}
              >
                {nav.icon} {nav.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setUser(null)} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5">
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <main className="flex-1 container mx-auto px-8 py-12">
        {/* Dashboard View */}
        {view === 'DASHBOARD' && (
          <div className="animate-in fade-in duration-700">
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Status do Ecossistema</h2>
                <p className="text-slate-500 font-medium">Controle total sobre as ativações e revendas.</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servidores Ativos</span>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total de Revendedores</p>
                <div className="text-4xl font-black">{stats.totalRevendedores}</div>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Clientes Cadastrados</p>
                <div className="text-4xl font-black">{stats.totalClientes}</div>
              </div>
              <div className="bg-indigo-600 border border-indigo-400 p-8 rounded-[2rem] shadow-xl shadow-indigo-600/30">
                 <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-1">Licenças Ativas (PC Lock)</p>
                 <div className="text-5xl font-black text-white">{stats.ativas}</div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1">
                  <h3 className="text-2xl font-black mb-4 uppercase">Tecnologia Single-PC <span className="text-indigo-500">Orvex</span></h3>
                  <p className="text-slate-400 leading-relaxed mb-6 font-medium">Seu licenciamento está configurado para travar automaticamente no primeiro computador que o cliente utilizar. Caso o cliente mude de PC, você ou o revendedor podem fazer o "Reset HWID" no painel de monitoramento.</p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2">
                       <Cpu className="w-4 h-4 text-indigo-500" />
                       <span className="text-[10px] font-black uppercase">HWID Security</span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                       <LockKeyhole className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase">Anti-Leakage</span>
                    </div>
                  </div>
               </div>
               <div className="w-full md:w-fit p-8 bg-slate-950 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <Activity className="text-indigo-500" />
                    <span className="font-bold">Tempo de Resposta API</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-500">12ms</div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mt-2 tracking-widest">Latência Ultra-Baixa</p>
               </div>
            </div>
          </div>
        )}

        {/* Resellers View */}
        {view === 'RESELLERS' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black tracking-tight uppercase">Revendedores</h2>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Cadastrar Parceiro
              </button>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-8 py-6">Parceiro / Usuário</th>
                    <th className="px-8 py-6">Clientes em 1-PC</th>
                    <th className="px-8 py-6">WhatsApp</th>
                    <th className="px-8 py-6 text-right">Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {resellers.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-lg">{r.nome}</div>
                        <div className="text-[10px] text-indigo-400 font-mono">@{r.usuario}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-black text-white">{getActiveCountForReseller(r.id)}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase leading-tight">Vendas<br/>Ativas</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-slate-400">{r.telefone || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-3">
                        <button className="p-3 bg-white/5 rounded-xl hover:text-indigo-400 transition-all border border-white/5"><Pencil className="w-5 h-5" /></button>
                        <button className="p-3 bg-white/5 rounded-xl hover:text-rose-400 transition-all border border-white/5"><Ban className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monitoring HWID View */}
        {view === 'MONITORING' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="mb-10">
                <h2 className="text-4xl font-black tracking-tight uppercase">Monitoramento 1-PC (HWID)</h2>
                <p className="text-slate-500 font-medium">Controle central de travas de hardware por licença.</p>
             </div>
             
             <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-8 py-6">Cliente Final</th>
                      <th className="px-8 py-6">Origem (Revenda)</th>
                      <th className="px-8 py-6">Hardware ID Lock</th>
                      <th className="px-8 py-6">Expiração</th>
                      <th className="px-8 py-6 text-right">Reset HWID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {licenses.map(l => (
                      <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6 font-bold text-white">{l.nome} <br/> <span className="text-[10px] font-normal text-slate-500">{l.email}</span></td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-lg text-indigo-400 uppercase tracking-tighter">@{l.revendedorNome}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5 w-fit">
                             <Cpu className="w-3 h-3 text-indigo-500" /> {l.hwid || 'AGUARDANDO 1º ACESSO'}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`font-bold text-sm ${isExpired(l.validade) ? 'text-rose-500' : 'text-emerald-500'}`}>{l.validade}</div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => handleResetHWID(l.id)} className="p-3 bg-white/5 rounded-xl hover:text-amber-500 transition-colors border border-white/5" title="Resetar Trava de PC"><RefreshCcw className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* SQL Tab */}
        {view === 'SQL' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="mb-10 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black tracking-tight uppercase">Banco de Dados</h2>
                <p className="text-slate-500 font-medium">Estrutura completa MySQL com suporte a HWID.</p>
              </div>
              <button 
                onClick={() => copyToClipboard(sqlCompleteCode)}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase">Copiar SQL</span>
              </button>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
              <pre className="text-xs font-mono text-indigo-300 whitespace-pre-wrap leading-relaxed bg-black/40 p-10 rounded-3xl overflow-x-auto">{sqlCompleteCode}</pre>
            </div>
          </div>
        )}

        {/* API PHP Tab */}
        {view === 'API' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-4xl font-black tracking-tight uppercase">Integração API</h2>
              <p className="text-slate-500 font-medium">Capture o HWID e proteja seu software com estas linhas.</p>
            </div>
            <div className="space-y-12">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <FileCode className="text-emerald-500" />
                    <h3 className="font-black text-xl uppercase">check.php</h3>
                  </div>
                  <button onClick={() => copyToClipboard(phpCheckCode)} className="text-slate-500 hover:text-white"><Copy className="w-5 h-5" /></button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed bg-black/40 p-10 rounded-3xl overflow-x-auto">{phpCheckCode}</pre>
              </div>
              
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2rem] flex items-start gap-5">
                 <AlertTriangle className="text-indigo-500 w-8 h-8 flex-shrink-0" />
                 <div className="text-xs text-slate-400 font-medium space-y-3">
                    <p><strong className="text-white">DICA SÊNIOR:</strong> O HWID deve ser gerado pelo seu software capturando o número de série da Placa-Mãe ou do Processador.</p>
                    <p>Exemplo de requisição no software: <code className="text-indigo-400 font-bold">GET https://seusite.com/api/check.php?email=...&hwid=...</code></p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal - Cadastro de Revendedor */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] p-12 relative animate-in zoom-in-95 duration-300 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <X className="w-10 h-10" />
            </button>
            
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl mb-4"><Users className="text-indigo-500 w-8 h-8" /></div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Nova Revenda</h2>
              <p className="text-slate-500 text-sm font-medium">Cadastre um parceiro para vender suas licenças.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nome da Empresa / Parceiro</label>
                <input type="text" placeholder="Ex: Elite Softwares" value={newReseller.nome} onChange={e => setNewReseller({...newReseller, nome: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Usuário de Login</label>
                   <input type="text" placeholder="elite_user" value={newReseller.usuario} onChange={e => setNewReseller({...newReseller, usuario: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Senha Inicial</label>
                   <input type="password" placeholder="••••••••" value={newReseller.senha} onChange={e => setNewReseller({...newReseller, senha: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Contato (WhatsApp)</label>
                <input type="text" placeholder="(11) 99999-9999" value={newReseller.telefone} onChange={e => setNewReseller({...newReseller, telefone: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              </div>
              
              <button 
                onClick={handleAddReseller} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                EFETIVAR CADASTRO DE REVENDA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/30 text-center">
        <div className="flex justify-center items-center gap-3 mb-4 opacity-50 text-indigo-500">
          <Shield className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">OrvexAI Master Protocol - 1 PC Per License</span>
        </div>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">High Performance Licensing Suite &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;