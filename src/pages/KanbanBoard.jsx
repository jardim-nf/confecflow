import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, User, Scissors, Shirt, Package, CheckCircle2, Hash, AlertCircle, DollarSign, History, Search, Archive } from 'lucide-react';
import NewOrderModal from '../components/NewOrderModal';
import LossModal from '../components/LossModal';
import { useProducao } from '../context/ProducaoContext';

const KanbanBoard = () => {
  const { data, setData } = useProducao();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // NOVO: Estado para a barra de pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatarRelatorioTempos = (timeLogs) => {
    return Object.entries(timeLogs || {}).map(([colId, log]) => {
      const totalMs = log.duration || (currentTime - log.entryTime);
      const min = Math.floor(totalMs / 60000);
      const horas = Math.floor(min / 60);
      return {
        etapa: data.columns[colId]?.title || 'Etapa',
        tempo: horas > 0 ? `${horas}h ${min % 60}m` : `${min}m`,
        isAtual: !log.exitTime
      };
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    setPendingMove(result);
    setIsLossModalOpen(true);
  };

  const handleConfirmMove = (qtdPerda) => {
    if (!pendingMove) return;
    const { destination, source, draggableId } = pendingMove;
    const now = Date.now();
    const task = data.tasks[draggableId];
    const startColId = source.droppableId;
    const endColId = destination.droppableId;
    const entryTime = task.timeLogs?.[startColId]?.entryTime || task.createdAt;
    const duration = now - entryTime;

    const updatedTimeLogs = {
      ...task.timeLogs,
      [startColId]: { ...task.timeLogs?.[startColId], entryTime: entryTime, exitTime: now, duration: duration },
      [endColId]: { entryTime: now, exitTime: null }
    };

    const updatedTask = {
      ...task,
      qtdAtual: Math.max(0, (task.qtdAtual || task.qtdInicial) - qtdPerda),
      timeLogs: updatedTimeLogs,
      perdas: { ...task.perdas, [startColId]: (task.perdas?.[startColId] || 0) + qtdPerda }
    };

    setData({
      ...data,
      tasks: { ...data.tasks, [draggableId]: updatedTask },
      columns: {
        ...data.columns,
        [startColId]: { ...data.columns[startColId], taskIds: data.columns[startColId].taskIds.filter(id => id !== draggableId) },
        [endColId]: { ...data.columns[endColId], taskIds: [...data.columns[endColId].taskIds, draggableId] }
      }
    });

    setIsLossModalOpen(false);
    setPendingMove(null);
  };

  // NOVO: Função para Arquivar o Pedido
  const handleArchive = (taskId, colId) => {
    if(!window.confirm("Deseja arquivar este pedido? Ele sairá do quadro, mas continuará nos relatórios.")) return;

    setData(prev => {
      const newTaskIds = prev.columns[colId].taskIds.filter(id => id !== taskId);
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...prev.tasks[taskId], isArchived: true } // Marca como arquivado
        },
        columns: {
          ...prev.columns,
          [colId]: { ...prev.columns[colId], taskIds: newTaskIds } // Remove da coluna
        }
      };
    });
  };

  const getColumnStyle = (colId) => {
    const styles = {
      'col-1': { icon: Scissors, color: 'text-pink-500', bg: 'bg-pink-50', bar: 'bg-pink-500' },
      'col-2': { icon: Shirt, color: 'text-indigo-500', bg: 'bg-indigo-50', bar: 'bg-indigo-500' },
      'col-3': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
      'col-4': { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-500' }
    };
    return styles[colId] || { icon: User, color: 'text-gray-500', bg: 'bg-gray-50', bar: 'bg-gray-500' };
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(order) => {
        const firstCol = data.columns['col-1'];
        setData({
          ...data,
          tasks: { ...data.tasks, [order.id]: { ...order, isArchived: false, timeLogs: { 'col-1': { entryTime: Date.now() } } } },
          columns: { ...data.columns, 'col-1': { ...firstCol, taskIds: [...firstCol.taskIds, order.id] } }
        });
      }} />

      <LossModal isOpen={isLossModalOpen} onClose={() => { setIsLossModalOpen(false); setPendingMove(null); }} onConfirm={handleConfirmMove} taskName={pendingMove ? data.tasks[pendingMove.draggableId]?.content : ''} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-2 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fluxo de Produção</h2>
          <p className="text-slate-500 mt-1 font-medium">Controlo financeiro e histórico de tempo</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* NOVO: Barra de Pesquisa */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pedido ou cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition-all"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 whitespace-nowrap text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all">+ Novo Pedido</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 items-start h-full">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(id => data.tasks[id]).filter(Boolean);
            const style = getColumnStyle(columnId);

            return (
              <div key={column.id} className={`w-80 flex-shrink-0 flex flex-col max-h-full rounded-2xl ${style.bg} border border-slate-200 shadow-sm`}>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <style.icon size={18} className={style.color} />
                    <h3 className="font-bold text-slate-700">{column.title}</h3>
                  </div>
                  <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{tasks.length}</span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-3 min-h-[200px]">
                      {tasks.map((task, index) => {
                        const valorTotal = (task.qtdAtual || 0) * (task.valorUnitario || 0);
                        const valorPerdido = (task.qtdInicial - task.qtdAtual) * (task.valorUnitario || 0);
                        const historico = formatarRelatorioTempos(task.timeLogs);

                        // AQUI ESTÁ A CORREÇÃO DE SEGURANÇA 👇
                        const searchLower = searchTerm.toLowerCase();
                        const matchSearch = searchTerm === '' || 
                          (task.content || '').toLowerCase().includes(searchLower) || 
                          (task.client || '').toLowerCase().includes(searchLower) ||
                          (task.id || '').includes(searchTerm);

                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                                // Se não bater com a busca, fica transparente para não quebrar o Drag and Drop
                                className={`bg-white p-4 mb-4 rounded-xl shadow-sm border-l-4 relative transition-all duration-300 ${matchSearch ? 'opacity-100 scale-100' : 'opacity-30 scale-95 grayscale'}`} 
                                style={{ borderLeftColor: style.bar.replace('bg-', ''), ...provided.draggableProps.style }}>
                                
                                <div className="flex justify-between items-start mb-3">
                                  <span className="text-[10px] font-bold uppercase text-slate-400">#{task.id.slice(-4)}</span>
                                  <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                                       <Hash size={10} /> {task.qtdAtual} / {task.qtdInicial} un
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                                       <DollarSign size={10} /> {formatCurrency(valorTotal)}
                                    </div>
                                  </div>
                                </div>

                                <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{task.content}</h4>
                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-3"><User size={12}/> {task.client}</p>

                                <div className="bg-slate-50/50 rounded-lg p-2 mb-3 border border-slate-100">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1.5">
                                    <History size={10} /> Tempo por Etapa
                                  </p>
                                  <div className="space-y-1">
                                    {historico.map((h, i) => (
                                      <div key={i} className={`flex justify-between items-center text-[10px] ${h.isAtual ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                                        <span className="flex items-center gap-1">
                                          <div className={`w-1 h-1 rounded-full ${h.isAtual ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
                                          {h.etapa}
                                        </span>
                                        <span className="font-mono">{h.tempo}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                  <span className="text-[10px] font-medium text-slate-400">Tempo total em produção</span>
                                  
                                  {/* NOVO: Botão de Arquivar visível apenas na última coluna (Expedição/Finalizados) */}
                                  {column.id === 'col-4' ? (
                                    <button onClick={() => handleArchive(task.id, column.id)} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                      <Archive size={12} /> Arquivar
                                    </button>
                                  ) : (
                                    task.qtdAtual < task.qtdInicial && (
                                      <div className="text-[10px] font-bold text-red-500 text-right leading-tight">
                                        <div className="flex items-center justify-end gap-1">
                                          <AlertCircle size={10} /> -{task.qtdInicial - task.qtdAtual} peças
                                        </div>
                                        <span>({formatCurrency(valorPerdido)})</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;