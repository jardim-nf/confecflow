export const initialData = {
  columns: {
    'col-1': { id: 'col-1', title: 'Corte ✂️', taskIds: ['task-1', 'task-2'] },
    'col-2': { id: 'col-2', title: 'Costura 🧵', taskIds: ['task-3'] },
    'col-3': { id: 'col-3', title: 'Acabamento 👕', taskIds: [] },
    'col-4': { id: 'col-4', title: 'Expedição 📦', taskIds: ['task-4'] },
  },
  tasks: {
    'task-1': { id: 'task-1', content: '50 Camisetas Polo - Azul', client: 'Cliente', priority: 'high' },
    'task-2': { id: 'task-2', content: '30 Calças Jeans', client: 'Lava Jato', priority: 'normal' },
    'task-3': { id: 'task-3', content: '100 Uniformes Escolares', client: 'Colégio X', priority: 'urgent' },
    'task-4': { id: 'task-4', content: '20 Aventais', client: 'Brocou System', priority: 'low' },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4'],
};