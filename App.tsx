import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Pencil, 
  Ban, 
  LogOut,
  X,
  Eye,
  EyeOff,
  Database,
  Terminal,
  Key,
  UserCheck,
  Phone,
  Lock,
  User as UserIcon,
  Activity,
  Code2,
  Cpu,
  RefreshCcw,
  Copy,
  Check,
  Settings,
  FileCode,
  FolderTree,
  AlertTriangle,
  Calendar,
  Save,
  Monitor,
  Search,
  Laptop,
  Filter,
  ArrowRight
} from 'lucide-react';

// --- Tipos e Interfaces ---
type Role = 'ADMIN' | 'REVENDEDOR';
type Plan = 'MENSAL' | 'ANUAL' | 'VITALICIO';
type ResellerPlan = 'ANUAL' | 'VITALICIO'; // Novo tipo para revendedores
type View = 'DASHBOARD' | 'RESELLERS' | 'MY_LICENSES' | 'MONITORING' | 'API' | 'SQL';
type FilterType = 'ALL' | 'ACTIVE' | 'NON_ACTIVE';

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
  clientesCount: number;
  validade: string; // Nova validade do revendedor
  tipo: ResellerPlan; // Novo tipo de plano do revendedor
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
  // --- Estados Globais ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('DASHBOARD');
  const [loginInput, setLoginInput] = useState({ usuario: '', senha: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Estado de Busca e Filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('ALL');

  // --- Estados de Modais ---
  const [showModalReseller, setShowModalReseller] = useState(false);
  const [showModalLicense, setShowModalLicense] = useState(false);

  // --- Estados de Edição ---
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);

  // --- Estados de Formulários ---
  const [newReseller, setNewReseller] = useState({ 
    nome: '', 
    usuario: '', 
    senha: '', 
    telefone: '',
    tipo: 'ANUAL' as ResellerPlan,
    validade: '' 
  });
  const [newLicense, setNewLicense] = useState({ nome: '', email: '', validade: '', tipo: 'MENSAL' as Plan });

  // --- Funções Auxiliares (Movido para cima para uso no Mock) ---
  const isExpired = (date: string) => new Date(date) < new Date();

  // --- Dados Mockados (Simulando Banco de Dados) ---
  const [resellers, setResellers] = useState<Reseller[]>([
    { id: 1, nome: 'Premium Digital', usuario: 'premium', senha: '123', telefone: '(11) 98877-6655', status: 'ATIVO', clientesCount: 2, tipo: 'ANUAL', validade: '2025-12-31' },
    { id: 2, nome: 'Revenda Elite', usuario: 'elite', senha: '123', telefone: '(21) 91122-3344', status: 'BLOQUEADO', clientesCount: 0, tipo: 'VITALICIO', validade: '2099-12-31' },
    { id: 3, nome: 'Cyber Store', usuario: 'cyber', senha: '123', telefone: '(31) 99988-7766', status: 'ATIVO', clientesCount: 5, tipo: 'ANUAL', validade: '2024-10-01' }, // Expirado para teste
  ]);

  const [licenses, setLicenses] = useState<License[]>([
    { id: 1, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Carlos Developer', email: 'carlos@work.com', validade: '2025-12-31', hwid: 'DESKTOP-8899-AX', tipo: 'VITALICIO', status: 'ATIVO' },
    { id: 2, revendedorId: 1, revendedorNome: 'Premium Digital', nome: 'Beatriz Silva', email: 'beatriz@gmail.com', validade: '2025-06-15', hwid: null, tipo: 'MENSAL', status: 'ATIVO' },
    { id: 3, revendedorId: 0, revendedorNome: 'Administrador Master', nome: 'Teste Interno', email: 'admin@orvex.com', validade: '2030-01-01', hwid: 'SERVER-01', tipo: 'VITALICIO', status: 'ATIVO' },
    { id: 4, revendedorId: 3, revendedorNome: 'Cyber Store', nome: 'Lan House Central', email: 'lan@house.com', validade: '2024-12-01', hwid: 'LAN-MASTER-01', tipo: 'MENSAL', status: 'BLOQUEADO' },
  ]);

  // --- Strings de Documentação e Integração ---
  const sqlContent = `-- ORVEX PRO DATABASE SCRIPT v3.2 FINAL
-- Importe este arquivo no seu phpMyAdmin (Banco: u525090895_orvex)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Estrutura da tabela \`admins\` (Usuários Administrativos)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nome\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`usuario\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`senha\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`usuario\` (\`usuario\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estrutura da tabela \`revendedores\`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`revendedores\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nome\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`usuario\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`senha\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`telefone\` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`tipo\` enum('ANUAL','VITALICIO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ANUAL',
  \`validade\` date NOT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') COLLATE utf8mb4_unicode_ci DEFAULT 'ATIVO',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`usuario\` (\`usuario\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estrutura da tabela \`licencas\`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`licencas\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`revendedor_id\` int(11) NOT NULL DEFAULT 0,
  \`revendedor_nome\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Admin',
  \`nome\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`email\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`validade\` date NOT NULL,
  \`hwid\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`tipo\` enum('MENSAL','ANUAL','VITALICIO') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`status\` enum('ATIVO','BLOQUEADO') COLLATE utf8mb4_unicode_ci DEFAULT 'ATIVO',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DADOS INICIAIS
-- --------------------------------------------------------

-- Usuário Administrador Padrão
INSERT INTO \`admins\` (\`id\`, \`nome\`, \`usuario\`, \`senha\`) VALUES
(1, 'Administrador Master', 'admin', 'admin123');

-- Revendedores de Teste
INSERT INTO \`revendedores\` (\`id\`, \`nome\`, \`usuario\`, \`senha\`, \`telefone\`, \`tipo\`, \`validade\`, \`status\`) VALUES
(1, 'Premium Digital', 'premium', '123', '(11) 98877-6655', 'ANUAL', '2025-12-31', 'ATIVO'),
(2, 'Revenda Elite', 'elite', '123', '(21) 91122-3344', 'VITALICIO', '2099-12-31', 'BLOQUEADO'),
(3, 'Cyber Store', 'cyber', '123', '(31) 99988-7766', 'ANUAL', '2024-10-01', 'ATIVO');

-- Licenças de Teste
INSERT INTO \`licencas\` (\`id\`, \`revendedor_id\`, \`revendedor_nome\`, \`nome\`, \`email\`, \`validade\`, \`hwid\`, \`tipo\`, \`status\`) VALUES
(1, 1, 'Premium Digital', 'Carlos Developer', 'carlos@work.com', '2025-12-31', 'DESKTOP-8899-AX', 'VITALICIO', 'ATIVO'),
(2, 1, 'Premium Digital', 'Beatriz Silva', 'beatriz@gmail.com', '2025-06-15', NULL, 'MENSAL', 'ATIVO'),
(3, 0, 'Administrador Master', 'Teste Interno', 'admin@orvex.com', '2030-01-01', 'SERVER-01', 'VITALICIO', 'ATIVO'),
(4, 3, 'Cyber Store', 'Lan House Central', 'lan@house.com', '2024-12-01', 'LAN-MASTER-01', 'MENSAL', 'BLOQUEADO');

COMMIT;`;

  const phpConfig = `<?php
// Caminho: public_html/orvexai/api/config.php
$host = '127.0.0.1';
$db   = 'u525090895_orvex';
$user = 'u525090895_orvex';
$pass = '/uU=0i45S6M'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Erro Conexão DB']));
}
?>`;

  const phpCheck = `<?php
// Caminho: public_html/orvexai/api/check.php
// Esta API realiza o BLOQUEIO AUTOMÁTICO se a validade expirar.

require_once 'config.php';
header('Content-Type: application/json');

$email = filter_input(INPUT_GET, 'email', FILTER_SANITIZE_EMAIL);
$hwid  = filter_input(INPUT_GET, 'hwid', FILTER_SANITIZE_STRING);

if (!$email || !$hwid) die(json_encode(['status' => 'error', 'message' => 'Dados incompletos']));

$stmt = $pdo->prepare("SELECT id, validade, status, hwid FROM licencas WHERE email = ?");
$stmt->execute([$email]);
$lic = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$lic) die(json_encode(['status' => 'invalid', 'message' => 'Licença não encontrada']));

// Bloqueio Manual
if ($lic['status'] !== 'ATIVO') die(json_encode(['status' => 'blocked', 'message' => 'Licença Bloqueada']));

// Bloqueio Automático por Data (Vencimento)
if ($lic['validade'] < date('Y-m-d')) {
    die(json_encode(['status' => 'expired', 'message' => 'Licença Expirada']));
}

// Lógica HWID
if (empty($lic['hwid'])) {
    $pdo->prepare("UPDATE licencas SET hwid = ? WHERE id = ?")->execute([$hwid, $lic['id']]);
    echo json_encode(['status' => 'success', 'message' => 'Licença Ativada!']);
} elseif ($lic['hwid'] === $hwid) {
    echo json_encode(['status' => 'success', 'message' => 'Acesso Permitido']);
} else {
    echo json_encode(['status' => 'hwid_error', 'message' => 'HWID Inválido (Outro PC)']);
}
?>`;

  const csharpCode = `// --- INTEGRAÇÃO C# (Substitua o script do Google Sheets por isso) ---
using System;
using System.Net;
using System.Windows.Forms; // Ou sua biblioteca de UI

public class LicenseChecker
{
    public static bool CheckLicense(string userEmail, string userHwid)
    {
        // URL da sua API hospedada
        string apiUrl = $"https://seusite.com/orvexai/api/check.php?email={userEmail}&hwid={userHwid}";

        try
        {
            using (WebClient client = new WebClient())
            {
                // Faz a requisição para o PHP
                string response = client.DownloadString(apiUrl);
                
                // Verifica a resposta (JSON simples)
                if (response.Contains("success"))
                {
                    return true; // Acesso Liberado
                }
                else if (response.Contains("expired"))
                {
                    MessageBox.Show("Sua licença expirou! Entre em contato para renovar.");
                    return false;
                }
                else if (response.Contains("blocked"))
                {
                    MessageBox.Show("Licença bloqueada pelo administrador.");
                    return false;
                }
                else
                {
                    MessageBox.Show("Erro de licença: " + response);
                    return false;
                }
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show("Erro ao conectar ao servidor de licença: " + ex.Message);
            return false;
        }
    }
}
`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Função para mudar a view e resetar a busca
  const changeView = (newView: View) => {
      setSearchTerm('');
      setFilterType('ALL'); // Reseta o filtro ao trocar de tela pelo menu
      setView(newView);
  };

  const applyDashboardFilter = (filter: FilterType) => {
    setFilterType(filter);
    setView('MY_LICENSES');
  };

  // --- Lógica de Filtros e Busca ---
  
  const userLicenses = user?.role === 'ADMIN' ? licenses : licenses.filter(l => l.revendedorId === user?.id);

  // Busca Inteligente + Filtro de Status
  const filteredLicenses = useMemo(() => {
    let result = userLicenses;

    // 1. Aplicar Filtro do Dashboard (Cards)
    if (filterType === 'ACTIVE') {
      result = result.filter(l => l.status === 'ATIVO' && !isExpired(l.validade));
    } else if (filterType === 'NON_ACTIVE') {
      result = result.filter(l => l.status === 'BLOQUEADO' || isExpired(l.validade));
    }

    // 2. Aplicar Busca de Texto
    if (!searchTerm) return result;
    const lowerTerm = searchTerm.toLowerCase();
    return result.filter(l => 
        (l.nome && l.nome.toLowerCase().includes(lowerTerm)) ||
        (l.email && l.email.toLowerCase().includes(lowerTerm)) ||
        (l.hwid && l.hwid.toLowerCase().includes(lowerTerm)) ||
        (l.revendedorNome && l.revendedorNome.toLowerCase().includes(lowerTerm))
    );
  }, [userLicenses, searchTerm, filterType]);

  const filteredResellers = useMemo(() => {
    if (!searchTerm) return resellers;
    const lowerTerm = searchTerm.toLowerCase();
    return resellers.filter(r => 
        r.nome.toLowerCase().includes(lowerTerm) ||
        r.usuario.toLowerCase().includes(lowerTerm) ||
        r.telefone.includes(searchTerm)
    );
  }, [resellers, searchTerm]);


  // --- Autenticação ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { usuario, senha } = loginInput;

    if (usuario === 'admin' && senha === 'admin123') {
      setUser({ id: 0, usuario: 'admin', nome: 'Administrador Master', role: 'ADMIN' });
      setView('DASHBOARD');
      return;
    }

    const revendedor = resellers.find(r => r.usuario === usuario && r.senha === senha);
    if (revendedor) {
      if (revendedor.status === 'BLOQUEADO') {
        setLoginError('CONTA SUSPENSA. Contate o suporte.');
        return;
      }
      // Verifica se a conta do revendedor venceu
      if (isExpired(revendedor.validade)) {
        setLoginError('CONTA EXPIRADA. Renove seu plano.');
        return;
      }

      setUser({ id: revendedor.id, usuario: revendedor.usuario, nome: revendedor.nome, role: 'REVENDEDOR' });
      setView('DASHBOARD');
    } else {
      setLoginError('Acesso Negado.');
    }
  };

  // --- CRUD e Lógica de Interface ---
  const handleCreateReseller = () => {
    if (!newReseller.nome || !newReseller.usuario || !newReseller.senha || !newReseller.validade) return alert("Preencha todos os dados.");
    const novo: Reseller = {
      id: resellers.length + 1,
      ...newReseller,
      status: 'ATIVO',
      clientesCount: 0
    };
    setResellers([...resellers, novo]);
    setShowModalReseller(false);
    setNewReseller({ nome: '', usuario: '', senha: '', telefone: '', tipo: 'ANUAL', validade: '' });
  };

  const handleUpdateReseller = () => {
    if (!editingReseller) return;
    setResellers(resellers.map(r => r.id === editingReseller.id ? editingReseller : r));
    setEditingReseller(null);
  };

  const toggleResellerStatus = (id: number) => {
    setResellers(resellers.map(r => r.id === id ? { ...r, status: r.status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO' } : r));
  };

  const handleCreateLicense = () => {
    if (!newLicense.email || !newLicense.validade) return alert("Dados incompletos.");
    const nova: License = {
      id: licenses.length + 1,
      revendedorId: user?.id || 0,
      revendedorNome: user?.nome || 'Admin',
      hwid: null,
      status: 'ATIVO',
      ...newLicense
    };
    setLicenses([...licenses, nova]);
    setShowModalLicense(false);
    setNewLicense({ nome: '', email: '', validade: '', tipo: 'MENSAL' });
  };

  const handleUpdateLicense = () => {
    if (!editingLicense) return;
    setLicenses(licenses.map(l => l.id === editingLicense.id ? editingLicense : l));
    setEditingLicense(null);
  };

  const toggleLicenseStatus = (id: number) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, status: l.status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO' } : l));
  };

  const resetHWID = (id: number) => {
    if (confirm("Resetar HWID permitirá que o cliente use a licença em um NOVO computador. Confirmar?")) {
      setLicenses(licenses.map(l => l.id === id ? { ...l, hwid: null } : l));
    }
  };

  const stats = {
    total: userLicenses.length,
    ativas: userLicenses.filter(l => l.status === 'ATIVO' && !isExpired(l.validade)).length,
    vencidas: userLicenses.filter(l => isExpired(l.validade)).length,
    bloqueadas: userLicenses.filter(l => l.status === 'BLOQUEADO').length,
    revendedores: resellers.length,
    revendedoresAtivos: resellers.filter(r => r.status === 'ATIVO' && !isExpired(r.validade)).length
  };

  // --- Login Screen ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-slate-200 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-indigo-500/10 mb-4 border border-indigo-500/20 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
                 <Shield className="w-12 h-12 text-indigo-500" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Orvex<span className="text-indigo-500">AI</span></h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">License Manager v2.7</p>
           </div>
           
           <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Usuário</label>
                    <div className="relative">
                       <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input type="text" value={loginInput.usuario} onChange={e => setLoginInput({...loginInput, usuario: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none text-sm text-white placeholder:text-slate-700 transition-all" placeholder="Login" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Senha</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                       <input type={showPassword ? "text" : "password"} value={loginInput.senha} onChange={e => setLoginInput({...loginInput, senha: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none text-sm text-white placeholder:text-slate-700 transition-all font-mono" placeholder="Senha" />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>
                 {loginError && (<div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider p-3 rounded-lg text-center flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> {loginError}</div>)}
                 <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">Entrar</button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
       {/* Topbar */}
       <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-500" />
                <span className="font-black text-white text-lg tracking-tighter uppercase hidden sm:block">Orvex<span className="text-indigo-500">AI</span></span>
             </div>
             
             <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                <button onClick={() => changeView('DASHBOARD')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'DASHBOARD' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Dashboard</button>
                {user.role === 'ADMIN' && (
                   <button onClick={() => changeView('RESELLERS')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'RESELLERS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Revendedores</button>
                )}
                <button onClick={() => changeView('MY_LICENSES')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'MY_LICENSES' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Licenças</button>
                {user.role === 'ADMIN' && (
                   <>
                      <div className="w-px h-4 bg-white/10 mx-1"></div>
                      <button onClick={() => changeView('SQL')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'SQL' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>SQL</button>
                      <button onClick={() => changeView('API')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${view === 'API' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>API & Cliente</button>
                   </>
                )}
             </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest leading-none mb-1">{user.role}</div>
                <div className="text-xs font-bold text-white leading-none">{user.nome}</div>
             </div>
             <button onClick={() => setUser(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 text-slate-500 rounded-lg transition-all border border-transparent hover:border-red-500/20"><LogOut className="w-5 h-5" /></button>
          </div>
       </header>

       <main className="flex-1 p-6 md:p-10 container mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
          
          {/* VIEW: DASHBOARD */}
          {view === 'DASHBOARD' && (
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight">Visão Geral</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Status da Operação</p>
                   </div>
                   <button onClick={() => setShowModalLicense(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"><Plus className="w-4 h-4" /> Nova Licença</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {/* CARD TOTAL - FILTRO: ALL */}
                   <div 
                      onClick={() => applyDashboardFilter('ALL')}
                      className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer hover:bg-slate-800/50"
                   >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Key className="w-16 h-16 text-indigo-500" /></div>
                      <div className="flex items-center gap-2 text-indigo-500 mb-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Licenças</p>
                         <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <p className="text-4xl font-black text-white">{stats.total}</p>
                   </div>

                   {/* CARD ATIVAS - FILTRO: ACTIVE */}
                   <div 
                      onClick={() => applyDashboardFilter('ACTIVE')}
                      className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer hover:bg-slate-800/50"
                   >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Check className="w-16 h-16 text-emerald-500" /></div>
                      <div className="flex items-center gap-2 text-emerald-500 mb-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Ativas</p>
                         <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <p className="text-4xl font-black text-white">{stats.ativas}</p>
                   </div>

                   {/* CARD VENCIDAS - FILTRO: NON_ACTIVE */}
                   <div 
                      onClick={() => applyDashboardFilter('NON_ACTIVE')}
                      className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-all cursor-pointer hover:bg-slate-800/50"
                   >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Ban className="w-16 h-16 text-red-500" /></div>
                      <div className="flex items-center gap-2 text-red-500 mb-1">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Bloqueadas / Vencidas</p>
                         <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <p className="text-4xl font-black text-white">{stats.vencidas + stats.bloqueadas}</p>
                   </div>

                   {/* CARD REVENDEDORES (SEM FILTRO DE LICENÇA) */}
                   {user.role === 'ADMIN' && (
                     <div 
                        onClick={() => changeView('RESELLERS')}
                        className="bg-slate-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer hover:bg-slate-800/50"
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16 text-blue-500" /></div>
                        <div className="flex items-center gap-2 text-blue-500 mb-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Revendedores</p>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </div>
                        <p className="text-4xl font-black text-white">{stats.revendedores}</p>
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* VIEW: REVENDEDORES (ADMIN ONLY) */}
          {view === 'RESELLERS' && user.role === 'ADMIN' && (
             <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                   <h2 className="text-3xl font-black text-white uppercase tracking-tight">Gerenciar Revenda</h2>
                   
                   <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <input 
                           type="text" 
                           placeholder="Buscar nome ou usuário..." 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                         />
                         {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"><X className="w-3 h-3" /></button>}
                      </div>
                      <button onClick={() => setShowModalReseller(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all flex-shrink-0"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Adicionar</span></button>
                   </div>
                </div>
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                           <tr>
                              <th className="px-6 py-4">Nome</th>
                              <th className="px-6 py-4">Login</th>
                              <th className="px-6 py-4">Plano / Validade</th>
                              <th className="px-6 py-4">Contato</th>
                              <th className="px-6 py-4 text-center">Status</th>
                              <th className="px-6 py-4 text-right">Ação</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {filteredResellers.length > 0 ? filteredResellers.map(reseller => (
                              <tr key={reseller.id} className="hover:bg-white/[0.02] transition-colors">
                                 <td className="px-6 py-4 font-bold text-white text-sm">{reseller.nome}</td>
                                 <td className="px-6 py-4 text-xs font-mono text-indigo-400">@{reseller.usuario}</td>
                                 <td className="px-6 py-4">
                                    <div className={`text-sm font-bold ${isExpired(reseller.validade) ? 'text-red-500' : 'text-slate-200'}`}>{reseller.validade}</div>
                                    <div className="text-[10px] font-black uppercase text-blue-400">{reseller.tipo}</div>
                                 </td>
                                 <td className="px-6 py-4 text-xs text-slate-400">{reseller.telefone}</td>
                                 <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${isExpired(reseller.validade) ? 'bg-orange-500/10 text-orange-500' : reseller.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{isExpired(reseller.validade) ? 'EXPIRADO' : reseller.status}</span>
                                 </td>
                                 <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => setEditingReseller(reseller)} className="p-2 bg-white/5 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all border border-white/5"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => toggleResellerStatus(reseller.id)} className={`p-2 rounded-lg transition-all border ${reseller.status === 'ATIVO' ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>{reseller.status === 'ATIVO' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}</button>
                                 </td>
                              </tr>
                           )) : (
                              <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-sm">Nenhum revendedor encontrado para "{searchTerm}".</td></tr>
                           )}
                        </tbody>
                     </table>
                   </div>
                </div>
             </div>
          )}

          {/* VIEW: LICENÇAS */}
          {view === 'MY_LICENSES' && (
             <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                   <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight">Licenças</h2>
                      
                      {/* Badge de Filtro Ativo */}
                      {filterType === 'ACTIVE' && (
                          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-in fade-in zoom-in">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                              <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">Exibindo Apenas Ativas</span>
                              <button onClick={() => setFilterType('ALL')} className="ml-1 hover:text-white"><X className="w-3 h-3"/></button>
                          </div>
                      )}
                      {filterType === 'NON_ACTIVE' && (
                          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-in fade-in zoom-in">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              <span className="text-[10px] font-bold uppercase text-red-500 tracking-wider">Exibindo Problemas</span>
                              <button onClick={() => setFilterType('ALL')} className="ml-1 hover:text-white"><X className="w-3 h-3"/></button>
                          </div>
                      )}
                   </div>
                   
                   <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <input 
                           type="text" 
                           placeholder="Buscar cliente, email, HWID..." 
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                         />
                         {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"><X className="w-3 h-3" /></button>}
                      </div>
                      <button onClick={() => setShowModalLicense(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all flex-shrink-0"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nova Licença</span></button>
                   </div>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap">
                         <thead className="bg-black/20 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            <tr>
                               <th className="px-6 py-4">Cliente</th>
                               <th className="px-6 py-4">Validade / Plano</th>
                               <th className="px-6 py-4">HWID (PC Lock)</th>
                               {user.role === 'ADMIN' && <th className="px-6 py-4">Vendedor</th>}
                               <th className="px-6 py-4 text-center">Status</th>
                               <th className="px-6 py-4 text-right">Controles</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {filteredLicenses.length > 0 ? filteredLicenses.map(lic => (
                               <tr key={lic.id} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-6 py-4">
                                     <div className="font-bold text-white text-sm">{lic.nome}</div>
                                     <div className="text-[10px] text-slate-500">{lic.email}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className={`text-sm font-bold ${isExpired(lic.validade) ? 'text-red-500' : 'text-slate-200'}`}>{lic.validade}</div>
                                     <div className="text-[10px] font-black uppercase text-indigo-400">{lic.tipo}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                        <Monitor className={`w-4 h-4 ${lic.hwid ? 'text-emerald-500' : 'text-slate-600'}`} />
                                        <code className="text-[10px] bg-black/30 px-2 py-1 rounded border border-white/5 text-slate-400 font-mono">{lic.hwid || 'Nenhum PC vinculado'}</code>
                                     </div>
                                  </td>
                                  {user.role === 'ADMIN' && (
                                     <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{lic.revendedorNome}</td>
                                  )}
                                  <td className="px-6 py-4 text-center">
                                     {isExpired(lic.validade) ? (<span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-orange-500/10 text-orange-500">VENCIDO</span>) : lic.status === 'BLOQUEADO' ? (<span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-red-500/10 text-red-500">BLOQUEADO</span>) : (<span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500">ATIVO</span>)}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingLicense(lic)} className="p-2 bg-white/5 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all border border-white/5" title="Editar Licença"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => resetHWID(lic.id)} className="p-2 bg-white/5 hover:bg-amber-500/10 hover:text-amber-500 border border-white/5 hover:border-amber-500/20 rounded-lg transition-all" title="Resetar HWID (Troca de PC)"><RefreshCcw className="w-4 h-4" /></button>
                                        <button onClick={() => toggleLicenseStatus(lic.id)} className={`p-2 rounded-lg transition-all border ${lic.status === 'ATIVO' ? 'bg-white/5 hover:bg-red-500 hover:text-white border-white/5 hover:border-red-500' : 'bg-red-500/10 text-red-500 hover:bg-emerald-500 hover:text-white border-red-500/20 hover:border-emerald-500'}`} title="Bloquear/Desbloquear">{lic.status === 'ATIVO' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}</button>
                                     </div>
                                  </td>
                               </tr>
                            )) : (
                              <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-sm">Nenhum registro encontrado {filterType !== 'ALL' ? 'com este filtro' : ''} para "{searchTerm}".</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}

          {/* VIEW: SQL & API */}
          {view === 'SQL' && user.role === 'ADMIN' && (
             <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-between"><h2 className="text-3xl font-black uppercase text-white">SQL</h2><button onClick={() => copyToClipboard(sqlContent)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button></div>
                <div className="bg-[#0f172a] border border-indigo-500/20 rounded-2xl p-1 shadow-2xl">
                   <div className="bg-slate-950 rounded-xl p-6 overflow-x-auto">
                      <pre className="font-mono text-xs text-indigo-300 leading-relaxed selection:bg-indigo-500/30">{sqlContent}</pre>
                   </div>
                </div>
             </div>
          )}
          {view === 'API' && user.role === 'ADMIN' && (
             <div className="max-w-4xl mx-auto space-y-8 pb-10">
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                   <AlertTriangle className="text-amber-500 flex-shrink-0" />
                   <div>
                      <p className="text-amber-500 font-bold text-sm">Instalação Obrigatória</p>
                      <p className="text-slate-400 text-xs">Você deve criar a pasta <code className="text-white">api</code> dentro de <code className="text-white">public_html/orvexai/</code> e enviar os arquivos `config.php` e `check.php` com o conteúdo abaixo.</p>
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between"><h2 className="text-2xl font-black uppercase text-white flex items-center gap-2"><FileCode className="w-6 h-6 text-blue-500"/> Arquivo 1: config.php</h2><button onClick={() => copyToClipboard(phpConfig)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button></div>
                    <pre className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-xs font-mono text-blue-300 overflow-auto">{phpConfig}</pre>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between"><h2 className="text-2xl font-black uppercase text-white flex items-center gap-2"><FileCode className="w-6 h-6 text-emerald-500"/> Arquivo 2: check.php</h2><button onClick={() => copyToClipboard(phpCheck)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar</button></div>
                    <pre className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-xs font-mono text-emerald-300 overflow-auto">{phpCheck}</pre>
                </div>

                <div className="w-full h-px bg-white/10 my-8"></div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2"><Laptop className="w-6 h-6 text-indigo-500"/> Integração Cliente (C#)</h2>
                            <p className="text-slate-500 text-xs mt-1">Substitua seu script antigo (Google Sheets) por esta função no seu software.</p>
                        </div>
                        <button onClick={() => copyToClipboard(csharpCode)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 shadow-lg shadow-indigo-600/20"><Copy className="w-4 h-4" /> Copiar C#</button>
                    </div>
                    <pre className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/20 text-xs font-mono text-slate-300 overflow-auto leading-relaxed">{csharpCode}</pre>
                </div>
             </div>
          )}

       </main>

       {/* MODAIS DE CRIAÇÃO */}
       {showModalReseller && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between bg-black/20"><h3 className="font-bold text-white uppercase">Novo Revendedor</h3><button onClick={() => setShowModalReseller(false)}><X className="w-5 h-5 text-slate-500" /></button></div>
                <div className="p-6 space-y-4">
                   <input type="text" value={newReseller.nome} onChange={e => setNewReseller({...newReseller, nome: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Nome" />
                   <input type="text" value={newReseller.telefone} onChange={e => setNewReseller({...newReseller, telefone: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="WhatsApp" />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={newReseller.usuario} onChange={e => setNewReseller({...newReseller, usuario: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Login" />
                      <input type="text" value={newReseller.senha} onChange={e => setNewReseller({...newReseller, senha: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Senha" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <select value={newReseller.tipo} onChange={e => setNewReseller({...newReseller, tipo: e.target.value as ResellerPlan})} className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none"><option value="ANUAL">ANUAL</option><option value="VITALICIO">VITALICIO</option></select>
                      <input type="date" value={newReseller.validade} onChange={e => setNewReseller({...newReseller, validade: e.target.value})} className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
                   </div>
                   <button onClick={handleCreateReseller} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-wider">Criar</button>
                </div>
             </div>
          </div>
       )}

       {showModalLicense && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between bg-black/20"><h3 className="font-bold text-white uppercase">Nova Licença</h3><button onClick={() => setShowModalLicense(false)}><X className="w-5 h-5 text-slate-500" /></button></div>
                <div className="p-6 space-y-4">
                   <input type="text" value={newLicense.nome} onChange={e => setNewLicense({...newLicense, nome: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Nome Cliente" />
                   <input type="email" value={newLicense.email} onChange={e => setNewLicense({...newLicense, email: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Email" />
                   <div className="grid grid-cols-2 gap-4">
                      <select value={newLicense.tipo} onChange={e => setNewLicense({...newLicense, tipo: e.target.value as Plan})} className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none"><option value="MENSAL">MENSAL</option><option value="ANUAL">ANUAL</option><option value="VITALICIO">VITALICIO</option></select>
                      <input type="date" value={newLicense.validade} onChange={e => setNewLicense({...newLicense, validade: e.target.value})} className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" />
                   </div>
                   <button onClick={handleCreateLicense} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-wider">Gerar Chave</button>
                </div>
             </div>
          </div>
       )}

       {/* MODAIS DE EDIÇÃO */}
       {editingReseller && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between bg-black/20"><h3 className="font-bold text-white uppercase">Editar Revendedor</h3><button onClick={() => setEditingReseller(null)}><X className="w-5 h-5 text-slate-500" /></button></div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Nome</label><input type="text" value={editingReseller.nome} onChange={e => setEditingReseller({...editingReseller, nome: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">WhatsApp</label><input type="text" value={editingReseller.telefone} onChange={e => setEditingReseller({...editingReseller, telefone: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Plano</label><select value={editingReseller.tipo} onChange={e => setEditingReseller({...editingReseller, tipo: e.target.value as ResellerPlan})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none"><option value="ANUAL">ANUAL</option><option value="VITALICIO">VITALICIO</option></select></div>
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Validade</label><input type="date" value={editingReseller.validade} onChange={e => setEditingReseller({...editingReseller, validade: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   </div>
                   <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Nova Senha (Opcional)</label><input type="text" value={editingReseller.senha} onChange={e => setEditingReseller({...editingReseller, senha: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white font-mono focus:border-indigo-500 outline-none" /></div>
                   <button onClick={handleUpdateReseller} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-wider flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Salvar Alterações</button>
                </div>
             </div>
          </div>
       )}

       {editingLicense && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between bg-black/20"><h3 className="font-bold text-white uppercase">Editar Licença</h3><button onClick={() => setEditingLicense(null)}><X className="w-5 h-5 text-slate-500" /></button></div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Nome Cliente</label><input type="text" value={editingLicense.nome} onChange={e => setEditingLicense({...editingLicense, nome: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Email</label><input type="text" value={editingLicense.email} onChange={e => setEditingLicense({...editingLicense, email: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Plano</label><select value={editingLicense.tipo} onChange={e => setEditingLicense({...editingLicense, tipo: e.target.value as Plan})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none"><option value="MENSAL">MENSAL</option><option value="ANUAL">ANUAL</option><option value="VITALICIO">VITALICIO</option></select></div>
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-slate-500">Validade</label><input type="date" value={editingLicense.validade} onChange={e => setEditingLicense({...editingLicense, validade: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none" /></div>
                   </div>
                   <button onClick={handleUpdateLicense} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg uppercase text-xs tracking-wider flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Salvar Alterações</button>
                </div>
             </div>
          </div>
       )}

    </div>
  );
};

export default App;