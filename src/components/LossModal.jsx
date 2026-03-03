import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const LossModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [perda, setPerda] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(Number(perda) || 0);
    setPerda(''); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Registrar Etapa
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Movendo: <span className="font-bold text-slate-900">{taskName}</span>
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Houve perda de peças?
            </label>
            <input 
              type="number" 
              min="0"
              value={perda}
              onChange={(e) => setPerda(e.target.value)}
              placeholder="Ex: 2"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" 
            />
            <p className="text-xs text-slate-400">Deixe vazio ou 0 se todas as peças passaram.</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 mt-2"
          >
            Confirmar e Mover
          </button>
        </form>
      </div>
    </div>
  );
};

export default LossModal;