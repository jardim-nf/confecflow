import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const LossModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [perda, setPerda] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Se estiver vazio, assume 0. Aceita 0 normalmente.
    const valorFinal = perda === '' ? 0 : Number(perda);
    onConfirm(valorFinal);
    setPerda(''); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><AlertTriangle className="text-orange-500" size={20}/> Registrar Saída</h2>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm">Movendo: <strong>{taskName}</strong></p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Houve perda de peças?</label>
            <input 
              type="number" min="0" placeholder="0"
              value={perda} onChange={(e) => setPerda(e.target.value)}
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95">
            Confirmar e Mover
          </button>
        </form>
      </div>
    </div>
  );
};

export default LossModal;