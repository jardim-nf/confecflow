import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { initialData } from '../data';
import { Clock, User, Scissors, Shirt, Package, CheckCircle2, Hash } from 'lucide-react';
import NewOrderModal from '../components/NewOrderModal';
import LossModal from '../components/LossModal';

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTempoDecorrido = (startTime) => {
    if (!startTime) return "0m";
    const diffMs = currentTime - startTime;
    const diffMinutos = Math.max(0, Math.floor(diffMs / (1000 * 60))); // Garante que não fique negativo
    
    if (diffMinutos < 60) return `${diffMinutos}m`;
    
    const horas = Math.floor(diffMinutos / 60);
    const minutos = diffMinutos % 60;
    return `${horas}h ${minutos}m`;
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    setPendingMove(result);
    setIsLossModalOpen(true);
  };

  const handleConfirmMove = (qtdPerda) => {
    if (!pendingMove) return;

    const { destination, source, draggableId } = pendingMove;
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    const task = data.tasks[draggableId];
    if (!task) return; // Trava de segurança

    const qtdAtual = task.qtdAtual !== undefined ? task.qtdAtual : task.qtdInicial;
    const novaQtdAtual = Math.max(0, qtdAtual - qtdPerda); // Garante que a quantidade não fique negativa

    const updatedTask = {
      ...task,
      qtdAtual: novaQtdAtual,
      perdas: {
        ...task.perdas,
        [start.id]: (task.perdas?.[start.id] || 0) + qtdPerda
      }
    };

    setData({
      ...data,
      tasks: { ...data.tasks, [draggableId]: updatedTask },
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });

    setIsLossModalOpen(false);
    setPendingMove(null);
  };

  const handleCancelMove = () => {
    setIsLossModalOpen(false);
    setPendingMove(null);
  };

  const getColumnStyle = (colId) => {
    switch(colId) {
      case 'col-1': return { icon: Scissors, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200', bar: 'bg-pink-500' };
      case 'col-2': return { icon: Shirt, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', bar: 'bg-indigo-500' };
      case 'col-3': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
      case 'col-4': return { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500' };
      default: return { icon: User, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', bar: 'bg-gray-500' };
    }
  };

  return (
    <div className="h-full flex flex-col">
      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={(novoPedido) => {
            if (!novoPedido || !novoPedido.id) return; // Segurança caso o modal envie algo vazio

            const novasTasks = {
              ...data.tasks,
              [novoPedido.id]: {
                ...novoPedido,
                qtdAtual: novoPedido.qtdInicial || 0,
                priority: 'normal', 
                client: 'Cliente Balcão',
                createdAt: Date.now()
              }
            };

            const colunaInicial = data.columns['col-1'];
            // Segurança: Garante que taskIds existe e é um array
            const taskIdsSeguros = colunaInicial?.taskIds || [];
            const novosTaskIds = [...taskIdsSeguros, novoPedido.id];
            
            const novaColuna = { ...colunaInicial, taskIds: novosTaskIds };

            setData({
              ...data,
              tasks: novasTasks,
              columns: { ...data.columns, 'col-1': novaColuna }
            });
        }}
      />

      {/* Trava de segurança no envio do taskName para evitar undefined */}
      <LossModal 
        isOpen={isLossModalOpen}
        onClose={handleCancelMove}
        onConfirm={handleConfirmMove}
        taskName={pendingMove && data.tasks[pendingMove.draggableId] ? data.tasks[pendingMove.draggableId].content : 'Tarefa'}
      />

      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fluxo de Produção</h2>
          <p className="text-slate-500 mt-1 font-medium">Visualização geral do chão de fábrica</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
        >
          + Novo Pedido
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 items-start h-full">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            if (!column) return null; // Segurança caso a coluna suma

            // SEGURANÇA MÁXIMA AQUI: filter(Boolean) remove qualquer task corrompida ou undefined
            const tasks = (column.taskIds || []).map((taskId) => data.tasks[taskId]).filter(Boolean);
            const style = getColumnStyle(columnId);
            const Icon = style.icon;

            return (
              <div key={column.id} className={`w-80 flex-shrink-0 flex flex-col max-h-full rounded-2xl ${style.bg} border ${style.border}`}>
                <div className="p-4 pb-2 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${style.color}`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-slate-700">{column.title}</h3>
                  </div>
                  <span className="bg-white/60 text-slate-600 text-xs font-bold px-2 py-1 rounded-md border border-black/5">
                    {tasks.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto p-3 transition-colors min-h-[150px] ${snapshot.isDraggingOver ? 'bg-white/40' : ''}`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-white p-4 mb-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 overflow-hidden ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-slate-400 rotate-2 z-50' : ''}`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />

                              <div className="flex justify-between items-start mb-3 pl-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${task.priority === 'urgent' ? 'bg-red-50 text-red-600' : task.priority === 'high' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {task.priority === 'urgent' ? '🔥 Urgente' : task.priority || 'Normal'}
                                </span>
                                {/* Segurança: garante que id é string antes de cortar */}
                                <span className="text-xs font-mono text-slate-300">
                                  #{String(task.id).slice(-4)}
                                </span>
                              </div>

                              <div className="pl-2 mb-4">
                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{task.content || 'Sem nome'}</h4>
                                <div className="flex flex-col gap-1 mt-2">
                                  <div className="flex items-center gap-1.5 text-slate-500">
                                    <User size={12} />
                                    <span className="text-xs font-medium">{task.client || 'Sem cliente'}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1.5 text-blue-600 mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded">
                                    <Hash size={12} />
                                    <span className="text-xs font-bold">
                                      Qtd: {task.qtdAtual !== undefined ? task.qtdAtual : (task.qtdInicial || 0)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="pl-2 flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                                  <Clock size={12} />
                                  <span>{getTempoDecorrido(task.createdAt)}</span>
                                </div>
                                
                                <div className="flex -space-x-1.5">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-400">
                                    <User size={12}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
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