import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { useProducao } from '../context/ProducaoContext';

const TimerControl = ({ task, data, setData }) => {
  const tracker = task.tracker || { isActive: false, accumulatedSeconds: 0, lastStartTime: null };
  const [displaySeconds, setDisplaySeconds] = useState(tracker.accumulatedSeconds);

  useEffect(() => {
    let interval = null;
    if (tracker.isActive && tracker.lastStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - tracker.lastStartTime) / 1000);
        setDisplaySeconds(tracker.accumulatedSeconds + diffInSeconds);
      }, 1000);
    } else {
      setDisplaySeconds(tracker.accumulatedSeconds);
    }
    return () => clearInterval(interval);
  }, [tracker.isActive, tracker.lastStartTime, tracker.accumulatedSeconds]);

  const toggleTimer = () => {
    const now = Date.now();
    let newTracker = { ...tracker };

    if (!tracker.isActive) {
      newTracker.isActive = true;
      newTracker.lastStartTime = now;
    } else {
      const diffInSeconds = Math.floor((now - tracker.lastStartTime) / 1000);
      newTracker.isActive = false;
      newTracker.accumulatedSeconds += diffInSeconds;
      newTracker.lastStartTime = null;
    }

    setData({
      ...data,
      tasks: { ...data.tasks, [task.id]: { ...task, tracker: newTracker } }
    });
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="font-mono text-xl text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300">
        {formatTime(displaySeconds)}
      </div>
      <button
        onClick={toggleTimer}
        className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-white transition-all ${
          tracker.isActive 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
        } shadow-lg`}
      >
        {tracker.isActive ? <><Pause size={18} /> Pausar</> : <><Play size={18} /> Iniciar</>}
      </button>
    </div>
  );
};

const OrderTracker = () => {
  const { data, setData } = useProducao();
  
  // NOVO: Filtra as tarefas arquivadas para não aparecerem no rastreio ativo
  const activeTasks = Object.values(data.tasks || {}).filter(t => !t.isArchived); 

  // NOVO: Função para descobrir em qual coluna do Kanban o pedido está
  const getTaskStatus = (taskId) => {
    for (const [colId, col] of Object.entries(data.columns)) {
      if (col.taskIds.includes(taskId)) {
        return { name: col.title, id: colId };
      }
    }
    return { name: "Desconhecido", id: null };
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rastreio de Produção</h2>
          <p className="text-slate-500 mt-1 font-medium">Controle de tempo real por pedido</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200 flex items-center gap-2 shadow-sm">
          <Clock size={20} />
          <span className="font-bold">Turno Atual: Tarde</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-100 font-bold text-slate-400 text-xs uppercase tracking-widest">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Detalhes do Pedido</div>
          <div className="col-span-2">Cliente</div>
          <div className="col-span-2 text-center">Etapa Atual</div>
          <div className="col-span-3 text-center">Controle de Tempo</div>
        </div>

        <div className="divide-y divide-slate-50">
          {activeTasks.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-medium">Nenhum pedido ativo no momento.</div>
          )}
          
          {activeTasks.map((task) => {
            const status = getTaskStatus(task.id);
            
            return (
              <div key={task.id} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-1 font-mono text-slate-400 text-xs font-bold">
                  #{task.id.slice(-4)}
                </div>
                
                <div className="col-span-4 pr-4">
                  <p className="font-bold text-slate-800 text-sm">{task.content}</p>
                  <div className="flex gap-2 mt-1.5">
                    {task.priority === 'urgent' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold">Urgente</span>}
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">Pólo</span>
                  </div>
                </div>

                <div className="col-span-2 text-slate-600 font-medium text-sm flex items-center gap-2">
                  {task.client}
                </div>

                {/* NOVO: Mostrando a etapa real do Kanban */}
                <div className="col-span-2 flex justify-center">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-100">
                    {status.name}
                  </span>
                </div>

                <div className="col-span-3 flex justify-center">
                  <TimerControl task={task} data={data} setData={setData} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;