import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scissors, Settings, LogOut, BarChart3 } from 'lucide-react';

// Importação das páginas e dados iniciais
import KanbanBoard from './pages/KanbanBoard';
import Reports from './pages/Reports';
import { initialData } from './data'; 

// Componente de Link Ativo do Menu Lateral
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

// Layout Principal (Menu Lateral fixo e conteúdo do lado)
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Scissors size={24} className="text-white" />
            </div>
            <span>Brocou<span className="text-blue-500"> System</span></span>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-10">Sistema de Produção v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal</p>
          <NavLink to="/" icon={LayoutDashboard}>Quadro Kanban</NavLink>
          
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
  const [data, setData] = useState(initialData);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={<KanbanBoard data={data} setData={setData} />} 
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