import { useState } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { ClientStatus } from '../types';

const clientSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,20}$/, 'Неверный формат телефона (пример: +7 999 000-00-00)')
});

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: { name: string; phone: string; status: ClientStatus }) => void;
}

export function ClientModal({ isOpen, onClose, onAdd }: ClientModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Новый');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = clientSchema.safeParse({ name, phone });
    if (!result.success) {
      const formatted = result.error.format();
      if (formatted.phone) {
        setPhoneError(formatted.phone._errors[0]);
        return;
      }
    }
    
    onAdd({ name, phone, status });
    setName('');
    setPhone('');
    setStatus('Новый');
    setPhoneError('');
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Автоматическая замена первой '8' на '+7'
    if (val === '8') {
      val = '+7 ';
    } else if (val.startsWith('8')) {
      val = '+7' + val.substring(1);
    }
    
    setPhone(val);
    if (phoneError) setPhoneError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-50" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Новый клиент</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Имя клиента</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all"
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-black/50 border ${phoneError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-lime-400/50 focus:ring-lime-400/50'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all`}
                  placeholder="+7 (999) 000-00-00"
                />
                {phoneError && (
                  <p className="text-red-400 text-xs mt-2">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Статус</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all appearance-none"
                >
                  <option value="Новый">Новый</option>
                  <option value="В работе">В работе</option>
                  <option value="Закрыт">Закрыт</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl px-4 py-3 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] cursor-pointer"
                >
                  Добавить клиента
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
