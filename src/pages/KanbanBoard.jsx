import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { initialData } from '../data';
import { MoreHorizontal, Calendar, Clock, User, Scissors, Shirt, Package, CheckCircle2 } from 'lucide-react';
// 1. Importando o Modal
import NewOrderModal from '../components/NewOrderModal';

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  // 2. Estado para controlar se o modal está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish },
    });
  };

  // Ícones e Cores por Coluna
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
      {/* 3. Componente do Modal (Fica invisível até clicar no botão) */}
      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
            // Aqui futuramente vamos salvar no Firebase
            console.log("Salvo!");
        }}
      />

      {/* Header da Página */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fluxo de Produção</h2>
          <p className="text-slate-500 mt-1 font-medium">Visualização geral do chão de fábrica</p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                U{i}
              </div>
            ))}
          </div>
          
          {/* 4. Botão com ação onClick para abrir o modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
          >
            + Novo Pedido
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 items-start h-full">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            const style = getColumnStyle(columnId);
            const Icon = style.icon;

            return (
              <div key={column.id} className={`w-80 flex-shrink-0 flex flex-col max-h-full rounded-2xl ${style.bg} border ${style.border}`}>
                {/* Header da Coluna */}
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

                {/* Área Droppable */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto p-3 transition-colors min-h-[150px] ${
                        snapshot.isDraggingOver ? 'bg-white/40' : ''
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-white p-4 mb-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 overflow-hidden ${
                                snapshot.isDragging ? 'shadow-2xl ring-2 ring-slate-400 rotate-2 z-50' : ''
                              }`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              {/* Indicador Lateral Colorido */}
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />

                              {/* Topo do Card: Prioridade e ID */}
                              <div className="flex justify-between items-start mb-3 pl-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  task.priority === 'urgent' ? 'bg-red-50 text-red-600' : 
                                  task.priority === 'high' ? 'bg-orange-50 text-orange-600' : 
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {task.priority === 'urgent' ? '🔥 Urgente' : task.priority}
                                </span>
                                <span className="text-xs font-mono text-slate-300">#{task.id}</span>
                              </div>

                              {/* Conteúdo Principal */}
                              <div className="pl-2 mb-4">
                                <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{task.content}</h4>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <User size={12} />
                                  <span className="text-xs font-medium">{task.client}</span>
                                </div>
                              </div>

                              {/* Footer do Card */}
                              <div className="pl-2 flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                                  <Clock size={12} />
                                  <span>2h 30m</span>
                                </div>
                                
                                {/* Avatar Stack (Simulado) */}
                                <div className="flex -space-x-1.5">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[9px] font-bold text-blue-600">JP</div>
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