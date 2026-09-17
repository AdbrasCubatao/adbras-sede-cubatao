import React, { useState } from 'react';

export default function App() {
  // Estado de navegação ('home' ou 'oracao')
  const [paginaAtual, setPaginaAtual] = useState('home');

  // Lista de Pedidos de Oração
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      pedido: 'Peço oração pela saúde da minha mãe e pela libertação da minha família.',
      data: 'Hoje às 14:30',
      oracoesCount: 12,
      orou: false,
    },
    {
      id: 2,
      nome: 'Irmão em Cristo (Anônimo)',
      pedido: 'Orem por uma porta de emprego na área de suprimentos e logística.',
      data: 'Ontem',
      oracoesCount: 8,
      orou: false,
    },
  ]);

  // Estados do Formulário de Pedidos
  const [novoNome, setNovoNome] = useState('');
  const [novoPedido, setNovoPedido] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);

  // Lista dos 12 Botões da Home
  const atalhos = [
    { id: 'inicio', titulo: 'Início', icon: '🏠' },
    { id: 'biblia', titulo: 'Bíblia', icon: '📖' },
    { id: 'agenda', titulo: 'Agenda', icon: '📅' },
    { id: 'cultos', titulo: 'Cultos', icon: '📺', tag: 'AO VIVO' },
    { id: 'avisos', titulo: 'Avisos', icon: '📢' },
    { id: 'oracao', titulo: 'Pedidos de Oração', icon: '🙏' },
    { id: 'ebd', titulo: 'Estudos / EBD', icon: '🎓' },
    { id: 'louvores', titulo: 'Louvores', icon: '🎵' },
    { id: 'departamentos', titulo: 'Departamentos', icon: '👥' },
    { id: 'localizacao', titulo: 'Localização', icon: '📍' },
    { id: 'ofertas', titulo: 'Dízimos e Ofertas', icon: '💖' },
    { id: 'contatos', titulo: 'Contatos', icon: '📞' },
  ];

  // Adicionar novo pedido
  const handleAdicionarPedido = (e) => {
    e.preventDefault();
    if (!novoPedido.trim()) return;

    const pedidoObjeto = {
      id: Date.now(),
      nome: isAnonimo || !novoNome.trim() ? 'Membro Anônimo' : novoNome,
      pedido: novoPedido,
      data: 'Agora mesmo',
      oracoesCount: 1,
      orou: true,
    };

    setPedidos([pedidoObjeto, ...pedidos]);
    setNovoNome('');
    setNovoPedido('');
    setIsAnonimo(false);
    alert('Seu pedido de oração foi publicado no mural!');
  };

  // Botão "Estou Orando"
  const toggleOracao = (id) => {
    setPedidos(
      pedidos.map((item) => {
        if (item.id === id) {
          const jaOrou = item.orou;
          return {
            ...item,
            oracoesCount: jaOrou ? item.oracoesCount - 1 : item.oracoesCount + 1,
            orou: !jaOrou,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      
      {/* ================= 1. TELA PRINCIPAL (HOME) ================= */}
      {paginaAtual === 'home' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          
          {/* Card de Boas-Vindas */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-amber-400 p-0.5 flex-shrink-0 overflow-hidden bg-slate-100">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Pastores Presidentes" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Bem-vindo!</h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Que sua vida seja edificada pela Palavra de Deus e pela comunhão com a nossa igreja.
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-2">
                Pr. Edson Carlos e Missª. Solange
              </p>
              <span className="text-[9px] font-bold text-amber-600 uppercase">PASTORES PRESIDENTES</span>
            </div>
          </section>

          {/* Grade de Acesso Rápido */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Acesso Rápido</h2>
              <div className="w-10 h-1 bg-amber-400 rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {atalhos.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPaginaAtual(item.id)}
                  className="flex flex-col items-center justify-between p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all min-h-[92px] relative active:scale-95"
                >
                  <span className="text-2xl mt-1">{item.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
                    {item.titulo}
                  </span>
                  {item.tag && (
                    <span className="mt-1 text-[8px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                      {item.tag}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Versículo */}
          <section className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center">
            <p className="text-base font-serif italic mb-2">
              "Eu e a minha casa serviremos ao Senhor."
            </p>
            <span className="text-xs font-semibold text-amber-400">Josué 24:15</span>
          </section>

        </main>
      )}

      {/* ================= 2. TELA MURAL DE ORAÇÃO ================= */}
      {paginaAtual === 'oracao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          
          {/* Botão de Voltar à Home */}
          <button 
            onClick={() => setPaginaAtual('home')} 
            className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 flex items-center gap-1 active:scale-95 transition-all"
          >
            ← Voltar ao Menu Principal
          </button>

          {/* Banner do Mural */}
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center space-y-2">
            <span className="text-4xl">🙏</span>
            <h1 className="text-xl font-bold">Mural de Pedidos de Oração</h1>
            <p className="text-xs text-slate-200 leading-relaxed">
              "Orai uns pelos outros para que sereis curados." — Tiago 5:16
            </p>
          </div>

          {/* Formulário */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2 border-slate-100">
              Deixe seu Pedido de Oração
            </h2>

            <form onSubmit={handleAdicionarPedido} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Seu Nome (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria Oliveira"
                  disabled={isAnonimo}
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonimo"
                  checked={isAnonimo}
                  onChange={(e) => setIsAnonimo(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="anonimo" className="text-xs text-slate-600 select-none">
                  Quero publicar como **Anônimo**
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Seu Motivo de Oração *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Descreva seu pedido aqui..."
                  value={novoPedido}
                  onChange={(e) => setNovoPedido(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all hover:bg-slate-800"
              >
                Publicar Pedido de Oração
              </button>
            </form>
          </section>

          {/* Lista de Pedidos */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900">
                Pedidos da Igreja ({pedidos.length})
              </h2>
            </div>

            <div className="space-y-3">
              {pedidos.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between border-b pb-2 border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                        {item.nome.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{item.nome}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.data}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{item.pedido}"
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => toggleOracao(item.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        item.orou
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>🙏</span>
                      <span>{item.orou ? 'Estou Orando' : 'Apoiar em Oração'}</span>
                    </button>

                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.oracoesCount} {item.oracoesCount === 1 ? 'irmão orando' : 'irmãos orando'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      )}

      {/* ================= 3. TELA GENÉRICA DEMAIS PÁGINAS ================= */}
      {paginaAtual !== 'home' && paginaAtual !== 'oracao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button 
            onClick={() => setPaginaAtual('home')} 
            className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 flex items-center gap-1 active:scale-95 transition-all"
          >
            ← Voltar ao Menu Principal
          </button>

          <div className="bg-white p-6 rounded-3xl shadow-sm text-center space-y-3">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              {atalhos.find(a => a.id === paginaAtual)?.titulo}
            </h2>
            <p className="text-xs text-slate-500">
              Página em atualização para a ADBrás Sede Cubatão.
            </p>
          </div>
        </main>
      )}

    </div>
  );
}
