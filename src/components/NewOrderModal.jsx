import React, { useState } from 'react';
import { X, Package, Hash, PlusCircle, DollarSign } from 'lucide-react';

const NewOrderModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    content: '',
    qtdInicial: '',
    valorUnitario: '' // Campo para o valor da peça
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novoPedido = {
      id: `task-${Date.now()}`,
      content: formData.content,
      qtdInicial: Number(formData.qtdInicial),
      qtdAtual: Number(formData.qtdInicial),
      valorUnitario: Number(formData.valorUnitario) || 0, // Salva o valor financeiro
      priority: 'normal',
      createdAt: Date.now(),
      timeLogs: {}, // Iniciará vazio para o rastreio de etapas
      perdas: {}
    };

    onSave(novoPedido);
    setFormData({ content: '', qtdInicial: '', valorUnitario: '' }); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <PlusCircle size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Novo Pedido</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
              <Package size={12} /> Produto / Referência
            </label>
            <input 
              required
              type="text" 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Ex: Camiseta G"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Hash size={12} /> Quantidade
              </label>
              <input 
                required
                type="number" 
                value={formData.qtdInicial}
                onChange={(e) => setFormData({...formData, qtdInicial: e.target.value})}
                placeholder="0"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <DollarSign size={12} /> Valor Unit. (R$)
              </label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.valorUnitario}
                onChange={(e) => setFormData({...formData, valorUnitario: e.target.value})}
                placeholder="0,00"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
              Lançar na Produção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ESSA LINHA ABAIXO É A MAIS IMPORTANTE PARA RESOLVER O SEU ERRO!
export default NewOrderModal;