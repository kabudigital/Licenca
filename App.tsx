
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  MoreVertical, 
  Trash2, 
  RefreshCw, 
  Ban, 
  LogOut,
  Code,
  Check,
  Cpu
} from 'lucide-react';

// --- Types ---
interface License {
  id: number;
  nome: string;
  email: string;
  validade: string;
  hwid: string | null;
  status: 'ATIVO' | 'BLOQUEADO';
}

// --- Components ---

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-purple-500/50 transition-all group">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [licenses, setLicenses] = useState<License[]>([
    { id: 1, nome: 'Alice Developer', email: 'alice@dev.com', validade: '2025-12-31', hwid: 'UUID-9988-7766-5544', status: 'ATIVO' },
    { id: 2, nome: 'Bob Admin', email: 'bob@server.com', validade: '2024-05-20', hwid: null, status: 'ATIVO' },
    { id: 3, nome: 'Carlos Malware', email: 'hacker@mal.com', validade: '2023-01-01', hwid: 'FAKE-ID-123', status: 'BLOQUEADO' },
  ]);
  const [showModal, setShowModal] = useState(false);

  // Stats calculation
  const total = licenses.length;
  const active = licenses.filter(l => l.status === 'ATIVO').length;
  const expired = licenses.filter(l => new Date(l.validade) < new Date()).length;

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]" />
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Shield className="text-purple-500 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Sentinel <span className="text-purple-500">Admin</span></h1>
            <p className="text-slate-400 mt-2">Sistema de Gerenciamento Anti-Pirataria</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Usuário</label>
              <input 
                type="text" 
                defaultValue="admin"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Senha</label>
              <input 
                type="password" 
                defaultValue="admin123"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsLogged(true)}
              className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              Entrar no Painel <Check className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-8 text-center text-xs text-slate-500 uppercase tracking-widest">Acesso Restrito &copy; 2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SENTINEL <span className="text-indigo-400 text-xs font-mono">v2.1</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sistema Online
            </span>
            <button 
              onClick={() => setIsLogged(false)}
              className="flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors bg-rose-400/10 px-4 py-2 rounded-lg border border-rose-400/20"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total de Licenças" value={total} icon={<Users className="text-indigo-500" />} color="bg-indigo-500" />
          <StatCard title="Licenças Ativas" value={active} icon={<CheckCircle className="text-green-500" />} color="bg-green-500" />
          <StatCard title="Expiradas/Riscos" value={expired} icon={<Clock className="text-rose-500" />} color="bg-rose-500" />
        </div>

        {/* Action Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Gerenciamento de Clientes</h2>
            <p className="text-slate-400">Visualize e controle os acessos em tempo real.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-5 h-5" /> Nova Licença
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Validade</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Hardware ID (HWID)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {licenses.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold">
                          {l.nome.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{l.nome}</div>
                          <div className="text-xs text-slate-500">{l.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {new Date(l.validade).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      {l.hwid ? (
                        <div className="flex items-center gap-2 text-xs font-mono bg-indigo-500/10 text-indigo-400 py-1 px-2 rounded border border-indigo-500/20 w-fit">
                          <Cpu className="w-3 h-3" /> {l.hwid.substring(0, 16)}...
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-bold uppercase italic">Virgem</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        l.status === 'ATIVO' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all" title="Resetar HWID">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-400 transition-all" title="Bloquear">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-all" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Info Section */}
        <div className="mt-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-indigo-500 w-6 h-6" />
            <h3 className="text-xl font-bold">Integração da API</h3>
          </div>
          <p className="text-slate-400 mb-6 max-w-2xl">
            O backend deste sistema foi projetado para ser robusto. O arquivo <code className="text-indigo-400">api.php</code> utiliza PDO para prevenir injeção de SQL e implementa uma trava de HWID que impede que a mesma licença seja usada em máquinas diferentes sem autorização.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-2">Endpoint de Verificação</span>
              <code className="text-green-400 text-sm break-all">GET /api.php?email=cliente@email.com&hwid=UNIQUE_PC_ID</code>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-2">Resposta JSON</span>
              <code className="text-indigo-300 text-sm">{"{ \"sucesso\": true, \"mensagem\": \"Acesso autorizado\" }"}</code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-slate-600 text-sm">
        Sentinel License Manager &copy; 2024 - Desenvolvido por Fullstack Senior
      </footer>

      {/* New License Modal Simulation */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-2">Emitir Nova Licença</h2>
            <p className="text-slate-400 mb-8">Preencha os dados do cliente para gerar o acesso.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="Ex: Rodrigo Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" placeholder="rodrigo@gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Expiração</label>
                  <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" defaultValue="2024-12-31" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Lote</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                    <option>Vitalício</option>
                    <option>Anual</option>
                    <option>Mensal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Gerar Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
