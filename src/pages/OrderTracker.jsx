// src/pages/OrderTracker.jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { initialData } from '../data';

// Componente Interno do Timer para não renderizar a lista toda a cada segundo
const TimerControl = ({ taskId }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="font-mono text-xl text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300">
        {formatTime(seconds)}
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-white transition-all ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
            : 'bg-green-600 hover:bg-green-700 shadow-green-200'
        } shadow-lg`}
      >
        {isActive ? <><Pause size={18} /> Pausar</> : <><Play size={18} /> Iniciar</>}
      </button>
    </div>
  );
};

const OrderTracker = () => {
  // Transforma o objeto de tasks em array para listar
const tasksList = Object.values(data.tasks); // Usa os dados do estado global
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Rastreio de Produção</h2>
          <p className="text-gray-500">Controle de tempo real por pedido</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 flex items-center gap-2">
          <Clock size={20} />
          <span className="font-bold">Turno Atual: Tarde</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-semibold text-gray-600 text-sm">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Detalhes do Pedido</div>
          <div className="col-span-2">Cliente</div>
          <div className="col-span-2 text-center">Etapa Atual</div>
          <div className="col-span-3 text-center">Controle de Tempo</div>
        </div>

        {/* Lista de Pedidos */}
        <div className="divide-y divide-gray-100">
          {tasksList.map((task) => (
            <div key={task.id} className="grid grid-cols-12 p-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-1 font-mono text-gray-400 text-xs">#{task.id}</div>
              
              <div className="col-span-4 pr-4">
                <p className="font-bold text-gray-800 text-lg">{task.content}</p>
                <div className="flex gap-2 mt-1">
                  {task.priority === 'urgent' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-bold">Urgente</span>}
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">Pólo</span>
                </div>
              </div>

              <div className="col-span-2 text-gray-600 font-medium">
                {task.client}
              </div>

              <div className="col-span-2 flex justify-center">
                {/* Aqui seria dinâmico baseado na coluna que ele está no Kanban */}
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  Em Produção
                </span>
              </div>

              <div className="col-span-3 flex justify-center">
                <TimerControl taskId={task.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;