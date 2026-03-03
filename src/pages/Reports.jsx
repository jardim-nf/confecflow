import React, { useRef, useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Download, Loader2, DollarSign, Package } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Componente do Card (KPI)
const KPICard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${color.text}`}>{subtitle}</p>
    </div>
    <div className={`p-3 rounded-xl ${color.bg} ${color.icon}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Reports = ({ data }) => {
  const reportRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);

  // --- CÁLCULOS DOS INDICADORES REAIS ---
  const tasksArray = Object.values(data.tasks || {});
  
  const faturamentoTotal = tasksArray.reduce((acc, t) => acc + ((t.qtdAtual || 0) * (t.valorUnitario || 0)), 0);
  const totalPecasProduzidas = tasksArray.reduce((acc, t) => acc + (t.qtdAtual || 0), 0);
  const totalPerdaFinanceira = tasksArray.reduce((acc, t) => acc + (((t.qtdInicial || 0) - (t.qtdAtual || 0)) * (t.valorUnitario || 0)), 0);
  
  // Eficiência Global: (Qtd Atual / Qtd Inicial) * 100
  const qtdInicialTotal = tasksArray.reduce((acc, t) => acc + (t.qtdInicial || 0), 0);
  const eficienciaGlobal = qtdInicialTotal > 0 ? Math.round((totalPecasProduzidas / qtdInicialTotal) * 100) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const downloadPDF = async () => {
    setIsGenerating(true);
    const element = reportRef.current;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio-Producao-${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Cabeçalho de Controle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Relatórios de Desempenho</h2>
          <p className="text-slate-500">Análise financeira e produtiva do Brocou System</p>
        </div>
        
        <button 
          onClick={downloadPDF}
          disabled={isGenerating}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-70"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          {isGenerating ? "Processando..." : "Exportar PDF"}
        </button>
      </div>

      <div ref={reportRef} className="space-y-8 p-4 bg-slate-50 rounded-2xl">
        
        {/* KPIs Dinâmicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Produção Total" 
            value={formatCurrency(faturamentoTotal)} 
            subtitle="Valor em mercadoria" 
            icon={DollarSign} 
            color={{ bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-600' }} 
          />
          <KPICard 
            title="Peças Produzidas" 
            value={totalPecasProduzidas.toLocaleString()} 
            subtitle={`${tasksArray.length} pedidos ativos`} 
            icon={Package} 
            color={{ bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-600' }} 
          />
          <KPICard 
            title="Prejuízo por Perdas" 
            value={formatCurrency(totalPerdaFinanceira)} 
            subtitle="Corte e Costura" 
            icon={AlertTriangle} 
            color={{ bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-600' }} 
          />
          <KPICard 
            title="Eficiência Média" 
            value={`${eficienciaGlobal}%`} 
            subtitle="Aproveitamento de matéria" 
            icon={TrendingUp} 
            color={{ bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-600' }} 
          />
        </div>

        {/* Tabela Detalhada de Pedidos */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-800">Detalhamento por Pedido</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Qtd Final</th>
                  <th className="px-6 py-4">Valor Produzido</th>
                  <th className="px-6 py-4">Perda Financeira</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasksArray.map((task) => {
                  const valorProduzido = (task.qtdAtual || 0) * (task.valorUnitario || 0);
                  const perdaFin = ((task.qtdInicial || 0) - (task.qtdAtual || 0)) * (task.valorUnitario || 0);
                  
                  return (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 text-sm">{task.content}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{task.client}</td>
                      <td className="px-6 py-4 text-sm font-mono">{task.qtdAtual} un</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(valorProduzido)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">{formatCurrency(perdaFin)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;