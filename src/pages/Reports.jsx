import React, { useRef, useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Download, Loader2 } from 'lucide-react';
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

const Reports = () => {
  const reportRef = useRef(); // Referência para capturar o elemento
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    setIsGenerating(true);
    const element = reportRef.current;
    
    try {
      // 1. Captura o elemento como Canvas (Print)
      const canvas = await html2canvas(element, {
        scale: 2, // Melhora a resolução
        useCORS: true, // Permite carregar imagens externas se tiver
      });

      // 2. Configurações do PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Ajusta o tamanho da imagem para caber no A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // 3. Baixa o arquivo
      pdf.save('Relatorio-Producao-ConfecFlow.pdf');
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-2 md:p-0 animate-in fade-in duration-500">
      
      {/* Cabeçalho com Botão de Download (Fica FORA do PDF) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Relatórios de Desempenho</h2>
          <p className="text-slate-500">Análise semanal da produção</p>
        </div>
        
        <button 
          onClick={downloadPDF}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          {isGenerating ? "Gerando PDF..." : "Baixar PDF"}
        </button>
      </div>

      {/* Área que será impressa no PDF (Ref) */}
      <div ref={reportRef} className="bg-slate-50 p-4 rounded-xl">
        
        {/* Cabeçalho interno para sair no PDF */}
        <div className="mb-6 pb-4 border-b border-slate-200 md:hidden">
            <h1 className="text-xl font-bold text-slate-700">Relatório ConfecFlow</h1>
            <p className="text-xs text-slate-500">Gerado em: {new Date().toLocaleDateString()}</p>
        </div>

        {/* KPIs (Indicadores) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Peças Produzidas" 
            value="1.240" 
            subtitle="+12% essa semana" 
            icon={CheckCircle} 
            color={{ bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-600' }} 
          />
          <KPICard 
            title="Eficiência Média" 
            value="85%" 
            subtitle="Dentro da meta" 
            icon={TrendingUp} 
            color={{ bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-600' }} 
          />
          <KPICard 
            title="Gargalos (Atrasos)" 
            value="3" 
            subtitle="Setor: Costura" 
            icon={AlertTriangle} 
            color={{ bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-600' }} 
          />
          <KPICard 
            title="Volume Atual" 
            value="R$ 45k" 
            subtitle="Em produção" 
            icon={BarChart3} 
            color={{ bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-600' }} 
          />
        </div>

        {/* Gráfico Simulado (Visual Clean) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Barras CSS */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Produção por Dia (Peças)</h3>
            <div className="flex items-end gap-4 h-64 w-full px-2">
              {[45, 60, 35, 70, 80, 50, 65].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full bg-blue-100 rounded-t-lg transition-all duration-300 group-hover:bg-blue-500 overflow-hidden" style={{ height: `${h}%` }}>
                    {/* Barra */}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Melhores Clientes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Top Clientes</h3>
            <div className="space-y-4">
              {[
                { nome: 'Teste Modas', pecas: 450, valor: 'R$ 12k' },
                { nome: 'Lava Jato', pecas: 320, valor: 'R$ 8k' },
                { nome: 'Colégio X', pecas: 150, valor: 'R$ 5k' },
              ].map((cliente, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">{cliente.nome}</p>
                      <p className="text-xs text-slate-400">{cliente.pecas} peças</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{cliente.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;