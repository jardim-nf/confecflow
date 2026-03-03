import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Scissors, Settings, LogOut, BarChart3 } from 'lucide-react';

// Importação das páginas e dados iniciais
import KanbanBoard from './pages/KanbanBoard';
import OrderTracker from './pages/OrderTracker';
import Reports from './pages/Reports';
import { initialData } from './data'; // Importe os dados iniciais aqui

// Componente de Link Ativo
const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

// Layout Principal
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors size={24} className="text-white" />
            </div>
            <span>Confec<span className="text-blue-500">Flow</span></span>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-10">Sistema de Produção v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal</p>
          <NavLink to="/" icon={LayoutDashboard}>Quadro Kanban</NavLink>
          <NavLink to="/tracker" icon={ListChecks}>Rastreio & Tempo</NavLink>
          
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">Gerenciamento</p>
          <NavLink to="/reports" icon={BarChart3}>Relatórios</NavLink>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-4 text-sm">
            <LogOut size={16} /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  // 1. ESTADO GLOBAL: Criamos o estado aqui para que todas as páginas compartilhem os mesmos dados
  const [data, setData] = useState(initialData);

  // 2. FUNÇÃO DE SALVAR: Esta função será chamada pelo modal para adicionar o produto no Kanban
  const handleSaveOrder = (newOrder) => {
    const taskId = newOrder.id;
    
    // Adiciona a nova tarefa ao objeto de tarefas e insere o ID na coluna "Corte" (col-1)
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          id: taskId,
          content: newOrder.content,
          client: "Novo Pedido", // Você pode adicionar um campo de cliente no modal depois
          priority: "normal",
          qtdInicial: newOrder.qtdInicial,
          valorUnitario: newOrder.valorUnitario,
          foto: newOrder.foto,
          perdas: {}
        }
      },
      columns: {
        ...prev.columns,
        'col-1': {
          ...prev.columns['col-1'],
          taskIds: [...prev.columns['col-1'].taskIds, taskId]
        }
      }
    }));
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 3. PASSANDO DADOS: Enviamos o estado 'data' e a função 'onSave' para o Kanban */}
          <Route 
            path="/" 
            element={<KanbanBoard data={data} setData={setData} onSave={handleSaveOrder} />} 
          />
          <Route 
            path="/tracker" 
            element={<OrderTracker data={data} />} 
          />
          <Route 
            path="/reports" 
            element={<Reports data={data} />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;