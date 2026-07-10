import { Client, ClientStatus } from '../types';
import { User, Phone, Calendar } from 'lucide-react';

interface ClientTableProps {
  clients: Client[];
  onStatusChange: (id: string, newStatus: ClientStatus) => void;
}

const statuses: ClientStatus[] = ['Новый', 'В работе', 'Закрыт'];

export function ClientTable({ clients, onStatusChange }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <User className="text-zinc-500" size={32} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Нет клиентов</h3>
        <p className="text-zinc-400">Добавьте первого клиента, чтобы начать работу.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Клиент</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Контакты</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Дата</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                      <User size={18} className="text-zinc-400" />
                    </div>
                    <span className="font-medium text-white">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone size={14} className="text-zinc-500" />
                    {client.phone || '—'}
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zinc-500" />
                    {new Date(client.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="inline-flex bg-black/50 border border-white/10 rounded-full p-1 gap-1">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => onStatusChange(client.id, s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          client.status === s
                            ? s === 'Новый' ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                            : s === 'В работе' ? 'bg-lime-500/20 text-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.2)]'
                            : 'bg-zinc-500/20 text-zinc-300'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
