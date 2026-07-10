import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Client, ClientStatus } from './types';
import { StatCard } from './components/StatCard';
import { ClientTable } from './components/ClientTable';
import { ClientModal } from './components/ClientModal';
import { supabase } from './lib/supabase';

function MissingKeysScreen() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Требуется настройка</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          Для работы CRM необходимо подключить Supabase. Пожалуйста, выполните следующие шаги:
        </p>
        <ol className="list-decimal list-inside space-y-4 text-sm text-zinc-300 mb-8">
          <li>Создайте проект на <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-lime-400 hover:underline">Supabase</a>.</li>
          <li>Выполните SQL-скрипт <code>supabase_schema.sql</code> (находится в корне проекта) в разделе SQL Editor.</li>
          <li>Скопируйте <strong>Project URL</strong> и <strong>Project API Key (anon)</strong> из настроек (Project Settings -&gt; API).</li>
          <li>Добавьте их в <strong>Secrets</strong> на панели AI Studio как <code className="bg-black/50 px-2 py-1 rounded text-lime-400">VITE_SUPABASE_URL</code> и <code className="bg-black/50 px-2 py-1 rounded text-lime-400">VITE_SUPABASE_ANON_KEY</code>.</li>
        </ol>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-400 text-sm">
            Дополнительно добавьте ключи для email-уведомлений: <br />
            <code className="text-xs">SMTP_HOST</code>, <code className="text-xs">SMTP_PORT</code>, <code className="text-xs">SMTP_USER</code>, <code className="text-xs">SMTP_PASS</code>, <code className="text-xs">SMTP_FROM</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!supabase) {
    return <MissingKeysScreen />;
  }

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('law_clients').select('*').order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setClients(data.map(item => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          status: item.status as ClientStatus,
          createdAt: item.created_at
        })));
      }
    } catch (err) {
      console.error('Ошибка загрузки клиентов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (data: { name: string; phone: string; status: ClientStatus }) => {
    try {
      // 1. Сохраняем в БД
      const { data: insertedData, error } = await supabase
        .from('law_clients')
        .insert([{ name: data.name, phone: data.phone, status: data.status }])
        .select()
        .single();
        
      if (error) throw error;

      if (insertedData) {
        const newClient: Client = {
          id: insertedData.id,
          name: insertedData.name,
          phone: insertedData.phone,
          status: insertedData.status as ClientStatus,
          createdAt: insertedData.created_at
        };
        setClients([newClient, ...clients]);

        // 2. Отправляем уведомления (Telegram + Email)
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(err => console.error('Ошибка отправки уведомлений:', err));
      }
    } catch (err) {
      console.error('Ошибка добавления клиента:', err);
      alert('Не удалось добавить клиента. Проверьте консоль.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: ClientStatus) => {
    try {
      const { error } = await supabase
        .from('law_clients')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить клиента?')) return;
    
    try {
      const { error } = await supabase
        .from('law_clients')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Ошибка удаления клиента:', err);
    }
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
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ClientTable clients={clients} onStatusChange={handleStatusChange} onDelete={handleDeleteClient} />
          )}
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
