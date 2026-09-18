import React, { useState } from 'react';

export default function App() {
  // Estado de Navegação Central
  const [paginaAtual, setPaginaAtual] = useState('home');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const [pixCopiado, setPixCopiado] = useState(false);

  // Dados Oficiais do PIX da Igreja
  const dadosPix = {
    cnpj: "50.317.711/0001-62",
    banco: "Banco Cora SCD S.A.",
    favorecido: "Igreja Evangélica Assembléia de Deus - Ministério de Madureira Em Cubatão - Sp"
  };

  // Estados do Admin
  const [adminLogado, setAdminLogado] = useState(false);
  const [senhaAdmin, setSenhaAdmin] = useState('');

  // 1. LISTA DOS 12 BOTÕES DE ATALHO DO MENU
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
    { id: 'admin', titulo: 'Área Admin', icon: '🔒' },
  ];

  // 2. LISTA DOS 7 DEPARTAMENTOS OFICIAIS
  const departamentos = [
    { id: 'ujademc', nome: 'UJADEMC', sigla: 'Jovens', icon: '🔥', descricao: 'União de Jovens da Assembléia de Deus em Cubatão' },
    { id: 'minidemc', nome: 'MINIDEMC', sigla: 'Crianças', icon: '🎨', descricao: 'Ministério Infantil da Assembléia de Deus em Cubatão' },
    { id: 'geracaoteen', nome: 'GERAÇÃO TEEN', sigla: 'Adolescentes', icon: '⚡', descricao: 'Departamento de Adolescentes' },
    { id: 'cibec', nome: 'CIBEC', sigla: 'Mulheres', icon: '🌸', descricao: 'Congresso e Círculo de Oração Feminino' },
    { id: 'univadem', nome: 'UNIVADEM', sigla: 'Homens', icon: '🛡️', descricao: 'União dos Varões da Assembléia de Deus em Cubatão' },
    { id: 'diaconal', nome: 'DIACONAL', sigla: 'Corpo Diaconal', icon: '🤝', descricao: 'Corpo Diaconal e Serviço da Igreja' },
    { id: 'missoes', nome: 'MISSÕES', sigla: 'Secretaria de Missões', icon: '🌍', descricao: 'Evangelismo e Projetos Missionários' },
  ];

  // 3. ESTADO DOS AVISOS OFICIAIS
  const [avisos, setAvisos] = useState([
    {
      id: 1,
      titulo: 'Ensaio Geral do Louvor',
      categoria: 'Geral',
      data: '22/10/2026',
      conteudo: 'Convocamos todos os instrumentistas e vocais para o ensaio geral neste sábado às 16h no Templo Sede.',
    },
    {
      id: 2,
      titulo: 'Consagração do Círculo de Oração',
      categoria: 'CIBEC',
      data: '20/10/2026',
      conteudo: 'Toda terça-feira pela manhã, às 08:30, temos nossa consagração de mulheres na Sede.',
    },
  ]);

  // Form de criação de Aviso (Admin)
  const [tituloAv, setTituloAv] = useState('');
  const [categoriaAv, setCategoriaAv] = useState('Geral');
  const [conteudoAv, setConteudoAv] = useState('');

  // 4. ESTADO DA AGENDA
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nome: 'Culto de Ensino e Doutrina',
      data: 'Toda Quarta-feira',
      horario: '19:30',
      local: 'Igreja Sede (Templo Principal)',
    },
  ]);
  const [nomeEv, setNomeEv] = useState('');
  const [dataEv, setDataEv] = useState('');
  const [horarioEv, setHorarioEv] = useState('');
  const [localEv, setLocalEv] = useState('');

  // 5. ESTADO DOS PEDIDOS DE ORAÇÃO
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      pedido: 'Peço oração pela saúde da minha mãe e pela libertação da minha família.',
      data: 'Hoje às 14:30',
      oracoesCount: 12,
      orou: false,
    },
  ]);
  const [novoNome, setNovoNome] = useState('');
  const [novoPedido, setNovoPedido] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);

  // 6. ESTADO DAS CONGREGAÇÕES
  const [congregacoes, setCongregacoes] = useState([
    {
      id: 1,
      nome: 'Congregação Vila Nova',
      endereco: 'Rua Exemplo da Vila, nº 100 - Vila Nova, Cubatão - SP',
      pastor: 'Pr. João Silva',
      foto: 'https://images.unsplash.com/photo-1548625361-181512c021c1?auto=format&fit=crop&q=80&w=400',
    },
  ]);
  const [novaNome, setNovaNome] = useState('');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [novoPastor, setNovoPastor] = useState('');
  const [novaFoto, setNovaFoto] = useState('');

  // Funções Auxiliares
  const copiarPix = () => {
    navigator.clipboard.writeText(dadosPix.cnpj);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  const handleLoginAdmin = (e) => {
    e.preventDefault();
    if (senhaAdmin === 'adbras123') {
      setAdminLogado(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  // Cadastrar e Remover Avisos
  const handleAdicionarAviso = (e) => {
    e.preventDefault();
    if (!tituloAv || !conteudoAv) return;

    const novoAvisoObj = {
      id: Date.now(),
      titulo: tituloAv,
      categoria: categoriaAv,
      data: new Date().toLocaleDateString('pt-BR'),
      conteudo: conteudoAv,
    };

    setAvisos([novoAvisoObj, ...avisos]);
    setTituloAv('');
    setCategoriaAv('Geral');
    setConteudoAv('');
    alert('Aviso publicado com sucesso!');
  };

  const handleRemoverAviso = (id) => {
    setAvisos(avisos.filter((a) => a.id !== id));
  };

  // Cadastrar e Remover Agenda
  const handleAdicionarEvento = (e) => {
    e.preventDefault();
    if (!nomeEv || !dataEv || !horarioEv || !localEv) return;
    const novoEventoObj = { id: Date.now(), nome: nomeEv, data: dataEv, horario: horarioEv, local: localEv };
    setEventos([...eventos, novoEventoObj]);
    setNomeEv(''); setDataEv(''); setHorarioEv(''); setLocalEv('');
    alert('Evento adicionado à agenda!');
  };

  const handleRemoverEvento = (id) => {
    setEventos(eventos.filter((ev) => ev.id !== id));
  };

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
    setNovoNome(''); setNovoPedido(''); setIsAnonimo(false);
    alert('Seu pedido de oração foi publicado!');
  };

  const toggleOracao = (id) => {
    setPedidos(pedidos.map((item) => item.id === id ? { ...item, oracoesCount: item.orou ? item.oracoesCount - 1 : item.oracoesCount + 1, orou: !item.orou } : item));
  };

  const handleAdicionarCongregacao = (e) => {
    e.preventDefault();
    if (!novaNome || !novoEndereco) return;
    const novaCong = { id: Date.now(), nome: novaNome, endereco: novoEndereco, pastor: novoPastor || 'A definir', foto: novaFoto || 'https://via.placeholder.com/400x200?text=Fachada+Congregacao' };
    setCongregacoes([...congregacoes, novaCong]);
    setNovaNome(''); setNovoEndereco(''); setNovoPastor(''); setNovaFoto('');
    alert('Congregação cadastrada!');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      
      {/* ================= 1. HOME ================= */}
      {paginaAtual === 'home' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-amber-400 p-0.5 flex-shrink-0 overflow-hidden bg-slate-100">
              <img src="https://via.placeholder.com/150" alt="Pastores" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Bem-vindo!</h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">Que sua vida seja edificada pela Palavra de Deus e pela comunhão com a nossa igreja.</p>
              <p className="text-xs font-semibold text-slate-800 mt-2">Pr. Edson Carlos e Missª. Solange</p>
              <span className="text-[9px] font-bold text-amber-600 uppercase">PASTORES PRESIDENTES</span>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Acesso Rápido</h2>
              <div className="w-10 h-1 bg-amber-400 rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {atalhos.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPaginaAtual(item.id);
                    setDepartamentoSelecionado(null);
                  }}
                  className="flex flex-col items-center justify-between p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all min-h-[92px] relative active:scale-95"
                >
                  <span className="text-2xl mt-1">{item.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">{item.titulo}</span>
                  {item.tag && <span className="mt-1 text-[8px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">{item.tag}</span>}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center">
            <p className="text-base font-serif italic mb-2">"Eu e a minha casa serviremos ao Senhor."</p>
            <span className="text-xs font-semibold text-amber-400">Josué 24:15</span>
          </section>
        </main>
      )}

      {/* ================= 2. PÁGINA AVISOS (MEMBROS) ================= */}
      {paginaAtual === 'avisos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Mural de Avisos</h1>
            <p className="text-xs text-slate-500">Comunicados importantes da ADBrás Sede Cubatão</p>
            <div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div>
          </div>

          <div className="space-y-3">
            {avisos.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl text-center space-y-2">
                <span className="text-3xl">📢</span>
                <p className="text-xs text-slate-500 font-semibold">Nenhum aviso publicado recentemente.</p>
              </div>
            ) : (
              avisos.map((av) => (
                <div key={av.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-50">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase">
                      {av.categoria}
                    </span>
                    <span className="text-[10px] text-slate-400">{av.data}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{av.titulo}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{av.conteudo}</p>
                </div>
              ))
            )}
          </div>
        </main>
      )}

      {/* ================= 3. PÁGINA AGENDA ================= */}
      {paginaAtual === 'agenda' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Agenda Oficial</h1>
            <p className="text-xs text-slate-500">Acompanhe nossos cultos, conferências e eventos</p>
            <div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div>
          </div>

          <div className="space-y-3">
            {eventos.map((ev) => (
              <div key={ev.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                <div className="flex items-start justify-between border-b pb-2 border-slate-50">
                  <h3 className="font-bold text-sm text-slate-900">{ev.nome}</h3>
                  <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">AGENDA</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>📅 <span className="font-semibold">{ev.data}</span></div>
                  <div>⏰ <span className="font-semibold">{ev.horario}</span></div>
                </div>
                <div className="text-xs text-slate-600 pt-1 border-t border-slate-50">📍 <span className="font-medium">{ev.local}</span></div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================= 4. DÍZIMOS E OFERTAS ================= */}
      {paginaAtual === 'ofertas' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center space-y-2">
            <span className="text-4xl">💖</span>
            <h1 className="text-xl font-bold">Dízimos e Ofertas</h1>
            <p className="text-xs text-slate-200 leading-relaxed italic">"Cada um contribua segundo proferiu no seu coração..." — 2 Co 9:7</p>
          </div>
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-5">
            <div className="w-48 h-48 mx-auto p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner flex items-center justify-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${dadosPix.cnpj}`} alt="QR Code Pix" className="w-full h-full object-contain" />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
              <div><span className="text-[10px] font-bold text-amber-600 uppercase block">Chave PIX (CNPJ)</span><p className="text-base font-mono font-bold text-slate-900">{dadosPix.cnpj}</p></div>
              <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Favorecido</span><p className="text-xs font-semibold text-slate-800">{dadosPix.favorecido}</p></div>
              <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Banco</span><p className="text-xs font-semibold text-slate-800">{dadosPix.banco}</p></div>
            </div>
            <button onClick={copiarPix} className={`w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all ${pixCopiado ? 'bg-emerald-600 text-white' : 'bg-[#0B1E3B] text-white'}`}>
              {pixCopiado ? '✓ Chave CNPJ Copiada com Sucesso!' : '📋 Copiar Chave PIX (CNPJ)'}
            </button>
          </section>
        </main>
      )}

      {/* ================= 5. PEDIDOS DE ORAÇÃO ================= */}
      {paginaAtual === 'oracao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center space-y-2">
            <span className="text-4xl">🙏</span>
            <h1 className="text-xl font-bold">Mural de Pedidos de Oração</h1>
          </div>
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <form onSubmit={handleAdicionarPedido} className="space-y-3">
              <input type="text" placeholder="Seu Nome (Opcional)" disabled={isAnonimo} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <textarea rows="3" required placeholder="Descreva seu pedido aqui..." value={novoPedido} onChange={(e) => setNovoPedido(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              <button type="submit" className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md">Publicar Pedido de Oração</button>
            </form>
          </section>
          <section className="space-y-3">
            {pedidos.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <p className="text-xs text-slate-700 italic">"{item.pedido}"</p>
                <button onClick={() => toggleOracao(item.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.orou ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                  🙏 {item.orou ? 'Estou Orando' : 'Apoiar em Oração'} ({item.oracoesCount})
                </button>
              </div>
            ))}
          </section>
        </main>
      )}

      {/* ================= 6. LOCALIZAÇÃO ================= */}
      {paginaAtual === 'localizacao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>
          <div className="mb-2"><h1 className="text-2xl font-bold text-slate-900">Nossas Igrejas</h1></div>
          <section className="bg-white rounded-3xl shadow-md border-2 border-amber-400 overflow-hidden relative p-5 space-y-3">
            <h2 className="text-lg font-bold text-slate-900">ADBrás Sede Cubatão</h2>
            <p className="text-xs text-slate-600">Rua Agostinho Lourenço Vilete, nº 125 - Jd. Nvª República, Cubatão - SP</p>
            <a href="https://maps.google.com/?q=Rua+Agostinho+Lourenco+Vilete+125+Jardim+Nova+Republica+Cubatao+SP" target="_blank" rel="noreferrer" className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl text-xs font-bold block text-center">📍 Ver Rota no Google Maps</a>
          </section>
        </main>
      )}

      {/* ================= 7. DEPARTAMENTOS ================= */}
      {paginaAtual === 'departamentos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">
            ← Voltar ao Menu Principal
          </button>
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Departamentos</h2>
            {departamentos.map((dept) => (
              <div key={dept.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div><h3 className="font-bold text-sm text-slate-900">{dept.nome}</h3><p className="text-xs text-slate-500">{dept.sigla}</p></div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================= 8. ÁREA ADMIN (GERENCIAMENTO COMPLETO) ================= */}
      {paginaAtual === 'admin' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">
            ← Voltar ao Menu Principal
          </button>

          {!adminLogado ? (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 text-center">
              <span className="text-4xl">🔐</span>
              <h2 className="text-lg font-bold text-slate-900">Painel do Administrador</h2>
              <form onSubmit={handleLoginAdmin} className="space-y-3 pt-2">
                <input type="password" placeholder="Digite a senha de acesso" value={senhaAdmin} onChange={(e) => setSenhaAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" />
                <button type="submit" className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md">Entrar no Painel</button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Painel de Controle</h2>
                  <span className="text-[10px] text-emerald-600 font-bold">● SESSÃO ATIVA</span>
                </div>
                <button onClick={() => setAdminLogado(false)} className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg">Sair</button>
              </div>

              {/* PAINEL: GERENCIAR AVISOS */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Avisos Oficiais</span>
                  <h3 className="text-sm font-bold text-slate-900">Publicar Novo Aviso</h3>
                </div>

                <form onSubmit={handleAdicionarAviso} className="space-y-2.5">
                  <input type="text" placeholder="Título do Aviso (Ex: Ensaio de Louvor)" value={tituloAv} onChange={(e) => setTituloAv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  
                  <select value={categoriaAv} onChange={(e) => setCategoriaAv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700">
                    <option value="Geral">Geral (Toda a Igreja)</option>
                    <option value="UJADEMC">UJADEMC (Jovens)</option>
                    <option value="MINIDEMC">MINIDEMC (Crianças)</option>
                    <option value="GERAÇÃO TEEN">GERAÇÃO TEEN (Adolescentes)</option>
                    <option value="CIBEC">CIBEC (Mulheres)</option>
                    <option value="UNIVADEM">UNIVADEM (Homens)</option>
                    <option value="DIACONAL">DIACONAL</option>
                    <option value="MISSÕES">MISSÕES</option>
                  </select>

                  <textarea rows="3" placeholder="Escreva o comunicado completo..." value={conteudoAv} onChange={(e) => setConteudoAv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required></textarea>
                  
                  <button type="submit" className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all">+ Publicar Aviso</button>
                </form>

                {/* Exclusão de Avisos */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Avisos Ativos ({avisos.length})</span>
                  {avisos.map((av) => (
                    <div key={av.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div className="truncate pr-2">
                        <p className="font-bold text-slate-900 truncate">{av.titulo}</p>
                        <span className="text-[9px] text-amber-700 font-bold">{av.categoria}</span>
                      </div>
                      <button onClick={() => handleRemoverAviso(av.id)} className="text-red-600 font-bold text-[10px] bg-red-50 px-2 py-1 rounded-lg flex-shrink-0">
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* PAINEL: GERENCIAR AGENDA */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Agenda Oficial</span>
                  <h3 className="text-sm font-bold text-slate-900">Adicionar Evento na Agenda</h3>
                </div>
                <form onSubmit={handleAdicionarEvento} className="space-y-2.5">
                  <input type="text" placeholder="Nome do Evento" value={nomeEv} onChange={(e) => setNomeEv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Data" value={dataEv} onChange={(e) => setDataEv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                    <input type="text" placeholder="Horário" value={horarioEv} onChange={(e) => setHorarioEv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  </div>
                  <input type="text" placeholder="Local" value={localEv} onChange={(e) => setLocalEv(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <button type="submit" className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm">+ Publicar Evento</button>
                </form>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {eventos.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div><p className="font-bold text-slate-900">{ev.nome}</p></div>
                      <button onClick={() => handleRemoverEvento(ev.id)} className="text-red-600 font-bold text-[10px] bg-red-50 px-2 py-1 rounded-lg">Excluir</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* PAINEL: GERENCIAR CONGREGAÇÕES */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Gestão de Igrejas</span>
                  <h3 className="text-sm font-bold text-slate-900">Cadastrar Nova Congregação</h3>
                </div>
                <form onSubmit={handleAdicionarCongregacao} className="space-y-2.5">
                  <input type="text" placeholder="Nome da Congregação" value={novaNome} onChange={(e) => setNovaNome(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <input type="text" placeholder="Endereço completo" value={novoEndereco} onChange={(e) => setNovoEndereco(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <input type="text" placeholder="Pastor Dirigente" value={novoPastor} onChange={(e) => setNovoPastor(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  <input type="text" placeholder="URL da Foto" value={novaFoto} onChange={(e) => setNovaFoto(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm">+ Adicionar Congregação</button>
                </form>
              </section>

            </div>
          )}
        </main>
      )}

      {/* ================= 9. CULTOS E DEMAIS ================= */}
      {paginaAtual === 'cultos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Cultos e Transmissões</h2>
            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold">▶ Assistir no YouTube</a>
            </div>
          </div>
        </main>
      )}

      {['biblia', 'ebd', 'louvores', 'contatos'].includes(paginaAtual) && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center space-y-3">
            <h2 className="text-lg font-bold text-slate-900 uppercase">{atalhos.find(a => a.id === paginaAtual)?.titulo}</h2>
            <p className="text-xs text-slate-500">Conteúdo em atualização para a ADBrás Sede Cubatão.</p>
          </div>
        </main>
      )}

    </div>
  );
}
