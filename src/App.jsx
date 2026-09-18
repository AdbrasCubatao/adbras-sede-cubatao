import React, { useState } from 'react';

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState('localizacao'); // Direto em localização para testarmos

  // Lista de Congregações (Estado dinâmico gerenciável pelo Admin)
  const [congregacoes, setCongregacoes] = useState([
    {
      id: 1,
      nome: 'Congregação Vila Nova',
      endereco: 'Rua Exemplo da Vila, nº 100 - Vila Nova, Cubatão - SP',
      pastor: 'Pr. João Silva',
      foto: 'https://images.unsplash.com/photo-1548625361-181512c021c1?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      nome: 'Congregação Jardim Casqueiro',
      endereco: 'Av. Brasil, nº 250 - Jd. Casqueiro, Cubatão - SP',
      pastor: 'Pr. Carlos Eduardo',
      foto: 'https://images.unsplash.com/photo-1510519138161-58446231f11c?auto=format&fit=crop&q=80&w=400',
    },
  ]);

  // Estados para o Admin cadastrar novas congregações
  const [novaNome, setNovaNome] = useState('');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [novoPastor, setNovoPastor] = useState('');
  const [novaFoto, setNovaFoto] = useState('');

  // Função para o Admin salvar nova congregação
  const handleAdicionarCongregacao = (e) => {
    e.preventDefault();
    if (!novaNome || !novoEndereco) return;

    const novaCong = {
      id: Date.now(),
      nome: novaNome,
      endereco: novoEndereco,
      pastor: novoPastor || 'A definir',
      foto: novaFoto || 'https://via.placeholder.com/400x200?text=Fachada+Congregacao',
    };

    setCongregacoes([...congregacoes, novaCong]);
    setNovaNome('');
    setNovoEndereco('');
    setNovoPastor('');
    setNovaFoto('');
    alert('Nova congregação cadastrada com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Botão Voltar */}
        <button 
          onClick={() => setPaginaAtual('home')} 
          className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 flex items-center gap-1 active:scale-95 transition-all"
        >
          ← Voltar ao Menu Principal
        </button>

        {/* Header da Página */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Nossas Igrejas</h1>
          <p className="text-xs text-slate-500">Sede e Congregações no município de Cubatão - SP</p>
          <div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div>
        </div>

        {/* 1. CARD DA IGREJA SEDE (EM DESTAQUE) */}
        <section className="bg-white rounded-3xl shadow-md border-2 border-amber-400 overflow-hidden relative">
          <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            IGREJA SEDE
          </span>

          <div className="h-44 bg-slate-200 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1548625361-00021c181512?auto=format&fit=crop&q=80&w=600" 
              alt="Fachada ADBrás Sede Cubatão" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 space-y-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ADBrás Sede Cubatão</h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Rua Agostinho Lourenço Vilete, nº 125 - Jd. Nvª República, Cubatão - SP
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase">Pastores Presidentes</p>
                <p className="text-xs font-bold text-slate-800">Pr. Edson Carlos da Silva & Missª. Solange</p>
              </div>
            </div>

            <a 
              href="https://maps.google.com/?q=Rua+Agostinho+Lourenco+Vilete+125+Jardim+Nova+Republica+Cubatao+SP" 
              target="_blank" 
              rel="noreferrer"
              className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              📍 Ver Rota no Google Maps
            </a>
          </div>
        </section>

        {/* 2. LISTA DAS CONGREGAÇÕES (18 UNIDADES) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Congregações ({congregacoes.length} de 18)
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold">Cubatão e Região</span>
          </div>

          <div className="space-y-4">
            {congregacoes.map((cong) => (
              <div key={cong.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-32 bg-slate-100 overflow-hidden">
                  <img src={cong.foto} alt={cong.nome} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">{cong.nome}</h3>
                  <p className="text-xs text-slate-600">📍 {cong.endereco}</p>
                  <p className="text-xs text-slate-700 font-semibold pt-1 border-t border-slate-50">
                    Pastor Dirigente: <span className="text-amber-700">{cong.pastor}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FORMULÁRIO DE CADASTRO PARA O ADMIN */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="border-b pb-2 border-slate-100">
            <span className="text-[9px] font-black text-amber-600 uppercase">Área Administrativa</span>
            <h3 className="text-sm font-bold text-slate-900">Cadastrar Nova Congregação</h3>
          </div>

          <form onSubmit={handleAdicionarCongregacao} className="space-y-2.5">
            <input 
              type="text" 
              placeholder="Nome da Congregação (Ex: Vila Natal)" 
              value={novaNome}
              onChange={(e) => setNovaNome(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              required
            />
            <input 
              type="text" 
              placeholder="Endereço completo (Rua, Nº, Bairro)" 
              value={novoEndereco}
              onChange={(e) => setNovoEndereco(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              required
            />
            <input 
              type="text" 
              placeholder="Nome do Pastor Dirigente" 
              value={novoPastor}
              onChange={(e) => setNovoPastor(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <input 
              type="text" 
              placeholder="URL da Imagem/Foto da Fachada" 
              value={novaFoto}
              onChange={(e) => setNovaFoto(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
            >
              + Adicionar Congregação
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}
