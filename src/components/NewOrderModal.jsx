import React, { useState } from 'react';
import { X, Camera, Image as ImageIcon, Save } from 'lucide-react';

const NewOrderModal = ({ isOpen, onClose, onSave }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  
  if (!isOpen) return null;

  // Lógica para ler a foto tirada
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pegaria os dados do form
    alert("Pedido Salvo! (Simulação)");
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Novo Pedido de Produção</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Campo de Foto (Mobile Friendly) */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Isso força abrir a câmera no celular
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            
            {photoPreview ? (
              <div className="relative h-48 w-full">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Trocar Foto
                </div>
              </div>
            ) : (
              <div className="py-8 text-slate-500">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Camera size={32} />
                </div>
                <p className="font-medium">Toque para tirar foto</p>
                <p className="text-xs text-slate-400 mt-1">Ou escolha da galeria</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Peças</label>
              <input type="number" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Modelo</label>
            <textarea className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="2" placeholder="Ex: Camiseta Gola V..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
            <div className="flex gap-2">
              {['Normal', 'Alta', 'Urgente'].map((p) => (
                <label key={p} className="flex-1 cursor-pointer">
                  <input type="radio" name="prioridade" className="peer sr-only" />
                  <div className="text-center py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-all">
                    {p}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-transform active:scale-95">
            <Save size={20} /> Salvar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;