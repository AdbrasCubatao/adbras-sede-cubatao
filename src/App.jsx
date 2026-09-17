import React, { useState } from 'react';

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState('oracao'); // Abrindo direto em Oração para testarmos

  // Lista de Pedidos de Oração (Armazenados no estado)
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

  // Estados do Formulário
  const [novoNome, setNovoNome] = useState('');
  const [novoPedido, setNovoPedido] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);

  // Função para adicionar novo pedido
  const handleAdicionarPedido = (e) => {
    e.preventDefault();
    if (!novoPedido.trim()) return;

    const pedidoObjeto = {
      id: Date.now(),
      nome: isAnonimo || !novoNome.trim() ? 'Membro Anônimo' : novoNome,
      pedido: novoPedido,
      data: 'Agora mesmo',
      oracoesCount: 1,
      orou: true, // Quem cria já conta como 1º orando
    };

    setPedidos([pedidoObjeto, ...pedidos]);
    setNovoNome('');
    setNovoPedido('');
    setIsAnonimo(false);
    alert('Seu pedido de oração foi publicado no mural!');
  };

  // Função para clicar no botão "Estou Orando"
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
      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Botão de Voltar */}
        <button 
          onClick={() => setPaginaAtual('home')} 
          className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-100"
        >
          ← Voltar ao Menu
        </button>

        {/* Cabeçalho da Seção */}
        <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center space-y-2">
          <span className="text-4xl">🙏</span>
          <h1 className="text-xl font-bold">Mural de Pedidos de Oração</h1>
          <p className="text-xs text-slate-200 leading-relaxed">
            "Orai uns pelos outros para que sereis curados. A oração feita por um justo pode muito em seus efeitos." — Tiago 5:16
          </p>
        </div>

        {/* 1. Formulário de Novo Pedido */}
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
                placeholder="Descreva seu pedido aqui para que os irmãos possam interceder por você..."
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

        {/* 2. Mural com Pedidos de Oração da Igreja */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900">
              Pedidos de Intercessão ({pedidos.length})
            </h2>
            <span className="text-[10px] text-slate-500">Clique para interceder</span>
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

                {/* Botão Estou Orando */}
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
    </div>
  );
}
