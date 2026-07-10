import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Client, ClientStatus } from './types';
import { StatCard } from './components/StatCard';
import { ClientTable } from './components/ClientTable';
import { ClientModal } from './components/ClientModal';

export default function App() {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('kornai_clients');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kornai_clients', JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = (data: { name: string; phone: string; status: ClientStatus }) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setClients([newClient, ...clients]);
  };

  const handleStatusChange = (id: string, newStatus: ClientStatus) => {
    setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const stats = {
    total: clients.length,
    new: clients.filter(c => c.status === 'Новый').length,
    inProgress: clients.filter(c => c.status === 'В работе').length,
    closed: clients.filter(c => c.status === 'Закрыт').length,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 font-sans selection:bg-lime-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)]">
              <span className="text-black font-space font-bold text-2xl tracking-tighter">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">KORNAI</h1>
              <p className="text-zinc-500 text-sm font-medium">LegalTech CRM</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full font-medium transition-all hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(163,230,53,0.15)] cursor-pointer"
          >
            <Plus size={18} className="text-lime-400 group-hover:scale-110 transition-transform" />
            <span>Добавить клиента</span>
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Новые заявки" value={stats.new} />
          <StatCard title="В работе" value={stats.inProgress} accent={true} />
          <StatCard title="Успешно закрыты" value={stats.closed} />
        </div>

        {/* Main Table */}
        <main>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Список клиентов</h2>
            <p className="text-zinc-500 text-sm mt-1">Управление статусами и контактами</p>
          </div>
          
          <ClientTable clients={clients} onStatusChange={handleStatusChange} />
        </main>

      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddClient} 
      />
    </div>
  );
}
