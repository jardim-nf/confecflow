export const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Teste Sistema',
      client: 'Sistema',
      qtdInicial: 10,
      qtdAtual: 10,
      priority: 'normal',
      createdAt: Date.now(),
      perdas: {}
    }
  },
  columns: {
    'col-1': { id: 'col-1', title: 'Corte', taskIds: ['task-1'] },
    'col-2': { id: 'col-2', title: 'Costura', taskIds: [] },
    'col-3': { id: 'col-3', title: 'Acabamento', taskIds: [] },
    'col-4': { id: 'col-4', title: 'Expedição', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4'],
};