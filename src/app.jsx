import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialização do Supabase com suas credenciais
const SUPABASE_URL = 'https://vhffaeepsivfydethxqv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nu3gRFHZ_hEOIeQmI0a5Ag_oTjOTcp_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZmZhZWVwc2l2ZnlkZXRoeHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2OTM0ODAsImV4cCI6MjEwNTI2OTQ4MH0.5N040l1f4XJc2TZjd74H6UUCOBrRYuakctFKNLqalz0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const [emailAdmin, setEmailAdmin] = useState('');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [departamentoAdmin, setDepartamentoAdmin] = useState('ujademc');
  const [tipoCadastroDept, setTipoCadastroDept] = useState('lideranca');
  const [salvandoDept, setSalvandoDept] = useState(false);
  const [nomeLider, setNomeLider] = useState('');
  const [cargoLider, setCargoLider] = useState('');
  const [fotoLider, setFotoLider] = useState('');
  const [tituloEventoDept, setTituloEventoDept] = useState('');
  const [dataEventoDept, setDataEventoDept] = useState('');
  const [horarioEventoDept, setHorarioEventoDept] = useState('');
  const [localEventoDept, setLocalEventoDept] = useState('');
  const [tituloAvisoDept, setTituloAvisoDept] = useState('');
  const [conteudoAvisoDept, setConteudoAvisoDept] = useState('');
  const [urlMidiaDept, setUrlMidiaDept] = useState('');
  const [legendaMidiaDept, setLegendaMidiaDept] = useState('');
  const [tipoMidiaDept, setTipoMidiaDept] = useState('foto');

  // 1. LISTA DOS 11 BOTÕES DE ATALHO DO MENU
  const atalhos = [
    { id: 'home', titulo: 'Início', icon: '⌂' },
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
    { id: 'contatos', titulo: 'Contatos', icon: '☎' },
  ];

  // 2. LISTA DOS 7 DEPARTAMENTOS OFICIAIS
  // Os campos de liderança, agenda, avisos e galeria serão alimentados pelo Supabase.
  const departamentosBase = [
    { id: 'ujademc', nome: 'UJADEMC', sigla: 'Jovens', icon: '🔥', descricao: 'União de Jovens da Assembléia de Deus em Cubatão', gradiente: 'linear-gradient(135deg, #071a36, #b7791f)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'minidemc', nome: 'MINIDEMC', sigla: 'Crianças', icon: '🎨', descricao: 'Ministério Infantil da Assembléia de Deus em Cubatão', gradiente: 'linear-gradient(135deg, #0f4c5c, #d7a83c)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'geracaoteen', nome: 'GERAÇÃO TEEN', sigla: 'Adolescentes', icon: '⚡', descricao: 'Departamento de Adolescentes', gradiente: 'linear-gradient(135deg, #312e81, #d7a83c)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'cibec', nome: 'CIBEC', sigla: 'Mulheres', icon: '🌸', descricao: 'Congresso e Círculo de Oração Feminino', gradiente: 'linear-gradient(135deg, #701a75, #d7a83c)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'univadem', nome: 'UNIVADEM', sigla: 'Homens', icon: '🛡️', descricao: 'União dos Varões da Assembléia de Deus em Cubatão', gradiente: 'linear-gradient(135deg, #172554, #9a7b2f)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'diaconal', nome: 'DIACONAL', sigla: 'Corpo Diaconal', icon: '🤝', descricao: 'Corpo Diaconal e Serviço da Igreja', gradiente: 'linear-gradient(135deg, #1f2937, #b58b2d)', lideres: [], eventos: [], avisos: [], galeria: [] },
    { id: 'missoes', nome: 'MISSÕES', sigla: 'Secretaria de Missões', icon: '🌍', descricao: 'Evangelismo e Projetos Missionários', gradiente: 'linear-gradient(135deg, #064e3b, #d7a83c)', lideres: [], eventos: [], avisos: [], galeria: [] },
  ];

  const [departamentos, setDepartamentos] = useState(departamentosBase);

  const carregarDepartamentos = async () => {
      const { data: dadosDepartamentos, error: erroDepartamentos } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (erroDepartamentos || !dadosDepartamentos?.length) {
        if (erroDepartamentos) console.log('Departamentos ainda não configurados no Supabase:', erroDepartamentos.message);
        return;
      }

      const [lideresResp, eventosResp, avisosResp, midiasResp] = await Promise.all([
        supabase.from('departamento_lideres').select('*').eq('ativo', true).order('ordem', { ascending: true }),
        supabase.from('departamento_eventos').select('*').eq('ativo', true).order('data', { ascending: true }),
        supabase.from('departamento_avisos').select('*').eq('ativo', true).order('created_at', { ascending: false }),
        supabase.from('departamento_midias').select('*').eq('ativo', true).order('ordem', { ascending: true }),
      ]);

      const agruparPorDepartamento = (itens = []) => itens.reduce((grupos, item) => {
        grupos[item.departamento_id] = [...(grupos[item.departamento_id] || []), item];
        return grupos;
      }, {});

      const lideres = agruparPorDepartamento(lideresResp.data);
      const eventos = agruparPorDepartamento(eventosResp.data);
      const avisos = agruparPorDepartamento(avisosResp.data);
      const midias = agruparPorDepartamento(midiasResp.data);

      const departamentosCompletos = dadosDepartamentos.map((dept) => ({
        id: dept.id,
        nome: dept.nome,
        sigla: dept.sigla,
        icon: dept.icone,
        descricao: dept.descricao,
        gradiente: dept.gradiente,
        lideres: lideres[dept.id] || [],
        eventos: (eventos[dept.id] || []).map((evento) => ({
          ...evento,
          data: evento.data ? new Date(`${evento.data}T12:00:00`).toLocaleDateString('pt-BR') : '',
          horario: evento.horario?.slice(0, 5) || '',
        })),
        avisos: avisos[dept.id] || [],
        galeria: (midias[dept.id] || []).map((midia) => ({ ...midia, url: midia.arquivo_url })),
      }));

      setDepartamentos(departamentosCompletos);
  };

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAdminLogado(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, sessao) => setAdminLogado(Boolean(sessao)));
    return () => listener.subscription.unsubscribe();
  }, []);

  // 3. ESTADO DOS ESTUDOS / EBD COM SUPABASE
  const [estudos, setEstudos] = useState([
    {
      id: 1,
      titulo: 'Lição EBD: O Fruto do Espírito na Vida Cristã',
      subtitulo: 'Escola Bíblica Dominical',
      link: 'https://www.bibliaonline.com.br/',
      foto: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=600',
      relato: 'Um estudo aprofundado sobre Gálatas 5, abordando o desenvolvimento do caráter cristão no dia a dia do crente.',
      data: '17/09/2026',
      downloadsCount: 0,
    },
  ]);

  // Função para incrementar contador de acessos/downloads no Supabase
  const registrarDownload = async (estudoId) => {
    setEstudos(prevEstudos =>
      prevEstudos.map(est => {
        if (est.id === estudoId) {
          const novoCount = (est.downloadsCount || 0) + 1;
          
          // Sincronização em segundo plano com o Supabase
          supabase
            .from('estudos')
            .update({ downloadsCount: novoCount })
            .eq('id', estudoId)
            .then(({ error }) => {
              if (error) console.log('Aviso Supabase (Criar tabela "estudos" se ainda não existir):', error.message);
            });

          return { ...est, downloadsCount: novoCount };
        }
        return est;
      })
    );
  };

  // Form de criação de Estudo (Admin)
  const [tituloEst, setTituloEst] = useState('');
  const [subtituloEst, setSubtituloEst] = useState('Escola Bíblica Dominical');
  const [linkEst, setLinkEst] = useState('');
  const [fotoEst, setFotoEst] = useState('');
  const [relatoEst, setRelatoEst] = useState('');

  // 4. OUTROS ESTADOS DA APLICAÇÃO
  const [avisos, setAvisos] = useState([]);
  const [tituloAv, setTituloAv] = useState('');
  const [categoriaAv, setCategoriaAv] = useState('Geral');
  const [conteudoAv, setConteudoAv] = useState('');

  const [eventos, setEventos] = useState([]);
  const [nomeEv, setNomeEv] = useState('');
  const [dataEv, setDataEv] = useState('');
  const [horarioEv, setHorarioEv] = useState('');
  const [localEv, setLocalEv] = useState('');

  const [pedidos, setPedidos] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoPedido, setNovoPedido] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);

  const [congregacoes, setCongregacoes] = useState([]);
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

  const handleLoginAdmin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailAdmin, password: senhaAdmin });
    if (error) return alert('E-mail ou senha incorretos.');

    const { data: administrador } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (!administrador) {
      await supabase.auth.signOut();
      return alert('Este usuário não possui permissão de administrador.');
    }
    setAdminLogado(true);
    setSenhaAdmin('');
  };

  const handleLogoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminLogado(false);
  };

  const handleCadastroDepartamento = async (e) => {
    e.preventDefault();
    setSalvandoDept(true);

    let tabela;
    let registro;

    if (tipoCadastroDept === 'lideranca') {
      tabela = 'departamento_lideres';
      registro = { departamento_id: departamentoAdmin, nome: nomeLider, cargo: cargoLider || 'Liderança', foto_url: fotoLider || null };
    } else if (tipoCadastroDept === 'evento') {
      tabela = 'departamento_eventos';
      registro = { departamento_id: departamentoAdmin, titulo: tituloEventoDept, data: dataEventoDept, horario: horarioEventoDept || null, local: localEventoDept || null };
    } else if (tipoCadastroDept === 'aviso') {
      tabela = 'departamento_avisos';
      registro = { departamento_id: departamentoAdmin, titulo: tituloAvisoDept, conteudo: conteudoAvisoDept };
    } else {
      tabela = 'departamento_midias';
      registro = { departamento_id: departamentoAdmin, tipo: tipoMidiaDept, arquivo_url: urlMidiaDept, legenda: legendaMidiaDept || null };
    }

    const { error } = await supabase.from(tabela).insert(registro);
    setSalvandoDept(false);
    if (error) return alert(`Não foi possível salvar: ${error.message}`);

    setNomeLider(''); setCargoLider(''); setFotoLider('');
    setTituloEventoDept(''); setDataEventoDept(''); setHorarioEventoDept(''); setLocalEventoDept('');
    setTituloAvisoDept(''); setConteudoAvisoDept('');
    setUrlMidiaDept(''); setLegendaMidiaDept('');
    await carregarDepartamentos();
    alert('Conteúdo publicado com sucesso!');
  };

  const handleAdicionarEstudo = (e) => {
    e.preventDefault();
    if (!tituloEst || !linkEst || !relatoEst) return;

    const novoEstudoObj = {
      id: Date.now(),
      titulo: tituloEst,
      subtitulo: subtituloEst || 'Estudo Bíblico',
      link: linkEst,
      foto: fotoEst || 'https://via.placeholder.com/600x300?text=Banner+Estudo+EBD',
      relato: relatoEst,
      data: new Date().toLocaleDateString('pt-BR'),
      downloadsCount: 0,
    };

    setEstudos([novoEstudoObj, ...estudos]);
    setTituloEst('');
    setSubtituloEst('Escola Bíblica Dominical');
    setLinkEst('');
    setFotoEst('');
    setRelatoEst('');
    alert('Estudo / EBD publicado com sucesso!');
  };

  const handleRemoverEstudo = (id) => {
    setEstudos(estudos.filter((e) => e.id !== id));
  };

  const handleAdicionarPedido = (e) => {
    e.preventDefault();
    if (!novoPedido.trim()) return;
    const pedido = {
      id: Date.now(),
      nome: isAnonimo || !novoNome.trim() ? 'Membro Anônimo' : novoNome,
      pedido: novoPedido,
      data: 'Agora mesmo',
      oracoesCount: 0,
      orou: false,
    };
    setPedidos([pedido, ...pedidos]);
    setNovoNome('');
    setNovoPedido('');
    setIsAnonimo(false);
  };

  const toggleOracao = (id) => {
    setPedidos(pedidos.map((item) => item.id === id ? {
      ...item,
      oracoesCount: item.orou ? item.oracoesCount - 1 : item.oracoesCount + 1,
      orou: !item.orou,
    } : item));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      
      {/* ================= 1. HOME ================= */}
      {paginaAtual === 'home' && (
        <main className="church-home">
          <header className="church-hero">
            <div className="brand-lockup">
              <img src="/logo-adbras-cubatao-refinado.png" alt="AD Brás Cubatão" className="official-logo" />
              <p>Uma Igreja que Ama,<br />Serve e Anuncia Jesus!</p>
            </div>
          </header>

          <section className="welcome-card">
            <img src="/pastores-edson-solange.jpg" alt="Pr. Edson Carlos da Silva e Missª. Solange Silva" />
            <div className="welcome-copy"><h1>Bem-vindo!</h1><p>Que sua vida seja edificada pela Palavra de Deus e pela comunhão com a nossa igreja.</p><em>Pr. Edson e Missª. Solange</em><strong>PRESIDENTES DO CAMPO</strong></div>
            <div className="cross-art">✝</div>
          </section>

          <section className="quick-section">
            <div className="quick-title"><h2>Acesso Rápido</h2><span></span></div>
            <div className="quick-grid">
              {atalhos.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPaginaAtual(item.id);
                    setDepartamentoSelecionado(null);
                  }}
                  className="quick-item"
                >
                  <span className="quick-icon">{item.icon}</span>
                  <span className="quick-label">{item.titulo}</span>
                  {item.tag && <span className="live-tag">{item.tag}</span>}
                </button>
              ))}
            </div>
          </section>

          <section className="verse-banner"><div><p>❝ Eu e a minha casa serviremos<br />ao Senhor.❞</p><strong>Josué 24:15</strong></div><span>✝</span></section>
          <section className="social-section"><h2>Conecte-se conosco</h2><div><a href="#whatsapp" aria-label="WhatsApp">◉</a><a href="#instagram" aria-label="Instagram">◎</a><a href="https://youtube.com" aria-label="YouTube">▶</a><a href="#facebook" aria-label="Facebook">f</a></div></section>
          <nav className="bottom-nav">
            <button onClick={() => setPaginaAtual('home')}><span>⌂</span>Início</button>
            <button onClick={() => setPaginaAtual('biblia')}><span>▤</span>Bíblia</button>
            <button onClick={() => setPaginaAtual('agenda')}><span>▦</span>Agenda</button>
            <button onClick={() => setPaginaAtual('avisos')}><span>⚑</span>Avisos</button>
            <button onClick={() => setPaginaAtual('admin')}><span>•••</span>Mais</button>
          </nav>
        </main>
      )}

      {/* ================= 2. PÁGINA ESTUDOS / EBD (MEMBROS COM CONTADOR) ================= */}
      {paginaAtual === 'ebd' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>

          <div className="mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Estudos & EBD</h1>
            <p className="text-xs text-slate-500">Cresça no conhecimento da Palavra de Deus</p>
            <div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div>
          </div>

          <div className="space-y-4">
            {estudos.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden space-y-3">
                <div className="h-40 bg-slate-100 overflow-hidden relative">
                  <img src={item.foto} alt={item.titulo} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#0B1E3B] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.subtitulo}
                  </span>
                </div>

                <div className="p-4 pt-1 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Publicado em {item.data}</span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      📥 {item.downloadsCount || 0} acessos
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">{item.titulo}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.relato}</p>

                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => registrarDownload(item.id)}
                    className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-sm active:scale-95 transition-all hover:bg-slate-800"
                  >
                    📖 Ler / Baixar Estudo Completo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================= 3. DÍZIMOS E OFERTAS ================= */}
      {paginaAtual === 'ofertas' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-100 active:scale-95 transition-all">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center space-y-2">
            <span className="text-4xl">💖</span>
            <h1 className="text-xl font-bold">Dízimos e Ofertas</h1>
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
            <button onClick={copiarPix} className={`w-full py-3.5 rounded-xl text-xs font-bold ${pixCopiado ? 'bg-emerald-600 text-white' : 'bg-[#0B1E3B] text-white'}`}>
              {pixCopiado ? '✓ Chave CNPJ Copiada com Sucesso!' : '📋 Copiar Chave PIX (CNPJ)'}
            </button>
          </section>
        </main>
      )}

      {/* ================= 4. ÁREA ADMIN ================= */}
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
                <input type="email" placeholder="E-mail do administrador" value={emailAdmin} onChange={(e) => setEmailAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" required />
                <input type="password" placeholder="Digite a senha de acesso" value={senhaAdmin} onChange={(e) => setSenhaAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" />
                <button type="submit" className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md">Entrar no Painel</button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Painel de Controle</h2>
                  <span className="text-[10px] text-emerald-600 font-bold">● SUPABASE CONECTADO</span>
                </div>
                <button onClick={handleLogoutAdmin} className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg">Sair</button>
              </div>

              {/* PAINEL: GERENCIAR DEPARTAMENTOS */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Departamentos</span>
                  <h3 className="text-sm font-bold text-slate-900">Cadastrar conteúdo</h3>
                </div>

                <select value={departamentoAdmin} onChange={(e) => setDepartamentoAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                  {departamentos.map((dept) => <option key={dept.id} value={dept.id}>{dept.nome} — {dept.sigla}</option>)}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  {[['lideranca', '👤 Liderança'], ['evento', '📅 Evento'], ['aviso', '📢 Aviso'], ['midia', '📸 Galeria']].map(([tipo, label]) => (
                    <button key={tipo} type="button" onClick={() => setTipoCadastroDept(tipo)} className={`p-2.5 rounded-xl text-[11px] font-bold ${tipoCadastroDept === tipo ? 'bg-[#0B1E3B] text-white' : 'bg-slate-100 text-slate-600'}`}>{label}</button>
                  ))}
                </div>

                <form onSubmit={handleCadastroDepartamento} className="space-y-2.5">
                  {tipoCadastroDept === 'lideranca' && <>
                    <input value={nomeLider} onChange={(e) => setNomeLider(e.target.value)} placeholder="Nome do líder" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required />
                    <input value={cargoLider} onChange={(e) => setCargoLider(e.target.value)} placeholder="Cargo ou função" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" />
                    <input type="url" value={fotoLider} onChange={(e) => setFotoLider(e.target.value)} placeholder="URL da foto (opcional)" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" />
                  </>}

                  {tipoCadastroDept === 'evento' && <>
                    <input value={tituloEventoDept} onChange={(e) => setTituloEventoDept(e.target.value)} placeholder="Nome do evento" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required />
                    <div className="grid grid-cols-2 gap-2"><input type="date" value={dataEventoDept} onChange={(e) => setDataEventoDept(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required /><input type="time" value={horarioEventoDept} onChange={(e) => setHorarioEventoDept(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl" /></div>
                    <input value={localEventoDept} onChange={(e) => setLocalEventoDept(e.target.value)} placeholder="Local do evento" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" />
                  </>}

                  {tipoCadastroDept === 'aviso' && <>
                    <input value={tituloAvisoDept} onChange={(e) => setTituloAvisoDept(e.target.value)} placeholder="Título do aviso" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required />
                    <textarea rows="3" value={conteudoAvisoDept} onChange={(e) => setConteudoAvisoDept(e.target.value)} placeholder="Conteúdo do aviso" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required />
                  </>}

                  {tipoCadastroDept === 'midia' && <>
                    <select value={tipoMidiaDept} onChange={(e) => setTipoMidiaDept(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl"><option value="foto">Foto</option><option value="video">Vídeo</option></select>
                    <input type="url" value={urlMidiaDept} onChange={(e) => setUrlMidiaDept(e.target.value)} placeholder="URL da foto ou vídeo" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" required />
                    <input value={legendaMidiaDept} onChange={(e) => setLegendaMidiaDept(e.target.value)} placeholder="Legenda (opcional)" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" />
                  </>}

                  <button disabled={salvandoDept} className="w-full bg-amber-400 text-slate-900 py-3 rounded-xl font-extrabold text-xs disabled:opacity-60">{salvandoDept ? 'Salvando...' : '+ Publicar no Departamento'}</button>
                </form>
              </section>

              {/* PAINEL: PUBLICAR ESTUDO */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Estudos Bíblicos & EBD</span>
                  <h3 className="text-sm font-bold text-slate-900">Publicar Novo Estudo</h3>
                </div>

                <form onSubmit={handleAdicionarEstudo} className="space-y-2.5">
                  <input type="text" placeholder="Título do Estudo" value={tituloEst} onChange={(e) => setTituloEst(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <input type="text" placeholder="Subtítulo ou Categoria" value={subtituloEst} onChange={(e) => setSubtituloEst(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  <input type="url" placeholder="Link para direcionar ao Estudo completo" value={linkEst} onChange={(e) => setLinkEst(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                  <input type="url" placeholder="URL da Foto ou Banner" value={fotoEst} onChange={(e) => setFotoEst(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                  <textarea rows="3" placeholder="Breve relato ou resumo..." value={relatoEst} onChange={(e) => setRelatoEst(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required></textarea>

                  <button type="submit" className="w-full bg-[#0B1E3B] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all">+ Publicar Estudo / EBD</button>
                </form>

                {/* Exclusão e Métrica de Downloads */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estudos Publicados ({estudos.length})</span>
                  {estudos.map((e) => (
                    <div key={e.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div className="truncate pr-2">
                        <p className="font-bold text-slate-900 truncate">{e.titulo}</p>
                        <span className="text-[10px] text-emerald-700 font-bold">📥 {e.downloadsCount || 0} acessos</span>
                      </div>
                      <button onClick={() => handleRemoverEstudo(e.id)} className="text-red-600 font-bold text-[10px] bg-red-50 px-2 py-1 rounded-lg flex-shrink-0">
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      )}

      {/* ================= 5. BÍBLIA ================= */}
      {paginaAtual === 'biblia' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">
            ← Voltar ao Menu Principal
          </button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl text-center space-y-2">
            <span className="text-4xl">📖</span>
            <h1 className="text-xl font-bold">Bíblia Sagrada</h1>
            <p className="text-xs text-slate-200">Leia e medite na Palavra de Deus</p>
          </div>
          <a href="https://www.bibliaonline.com.br/" target="_blank" rel="noreferrer" className="block bg-white p-5 rounded-3xl shadow-sm text-center font-bold text-sm text-slate-900">Abrir Bíblia Online →</a>
        </main>
      )}

      {/* ================= 6. AGENDA ================= */}
      {paginaAtual === 'agenda' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div><h1 className="text-2xl font-bold text-slate-900">Agenda Oficial</h1><div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div></div>
          {eventos.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center text-xs text-slate-500">Nenhum evento publicado no momento.</div>
          ) : eventos.map((ev) => (
            <div key={ev.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
              <h2 className="font-bold text-sm">{ev.nome}</h2>
              <p className="text-xs text-slate-600">📅 {ev.data} às {ev.horario}</p>
              <p className="text-xs text-slate-600">📍 {ev.local}</p>
            </div>
          ))}
        </main>
      )}

      {/* ================= 7. CULTOS ================= */}
      {paginaAtual === 'cultos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h1 className="text-lg font-bold">Cultos e Transmissões</h1>
            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">▶ Assistir no YouTube</a>
            </div>
          </div>
        </main>
      )}

      {/* ================= 8. AVISOS ================= */}
      {paginaAtual === 'avisos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <h1 className="text-2xl font-bold">Mural de Avisos</h1>
          {avisos.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl text-center text-xs text-slate-500">Nenhum aviso publicado no momento.</div>
          ) : avisos.map((aviso) => (
            <div key={aviso.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase">{aviso.categoria}</span>
              <h2 className="font-bold text-sm">{aviso.titulo}</h2>
              <p className="text-xs text-slate-600">{aviso.conteudo}</p>
            </div>
          ))}
        </main>
      )}

      {/* ================= 9. ORAÇÃO ================= */}
      {paginaAtual === 'oracao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl text-center"><span className="text-4xl">🙏</span><h1 className="text-xl font-bold mt-2">Pedidos de Oração</h1></div>
          <form onSubmit={handleAdicionarPedido} className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <input disabled={isAnonimo} value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Seu nome (opcional)" className="w-full text-xs p-3 bg-slate-50 border rounded-xl" />
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={isAnonimo} onChange={(e) => setIsAnonimo(e.target.checked)} /> Publicar anonimamente</label>
            <textarea required rows="4" value={novoPedido} onChange={(e) => setNovoPedido(e.target.value)} placeholder="Escreva seu pedido..." className="w-full text-xs p-3 bg-slate-50 border rounded-xl"></textarea>
            <button className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl text-xs font-bold">Publicar Pedido</button>
          </form>
          {pedidos.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
              <div><p className="text-xs font-bold">{item.nome}</p><span className="text-[10px] text-slate-400">{item.data}</span></div>
              <p className="text-xs text-slate-700 italic">“{item.pedido}”</p>
              <button onClick={() => toggleOracao(item.id)} className={`px-3 py-2 rounded-full text-xs font-bold ${item.orou ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>🙏 {item.orou ? 'Estou Orando' : 'Apoiar em Oração'} ({item.oracoesCount})</button>
            </div>
          ))}
        </main>
      )}

      {/* ================= 10. DEPARTAMENTOS ================= */}
      {paginaAtual === 'departamentos' && !departamentoSelecionado && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div><h1 className="text-2xl font-bold">Departamentos</h1><p className="text-xs text-slate-500">Conheça os ministérios da nossa igreja</p></div>
          <div className="grid grid-cols-2 gap-3">
            {departamentos.map((dept) => (
              <button key={dept.id} onClick={() => setDepartamentoSelecionado(dept)} className="min-h-36 p-4 rounded-3xl shadow-sm text-left text-white active:scale-95 transition-all flex flex-col justify-between" style={{ background: dept.gradiente }}>
                <span className="text-4xl">{dept.icon}</span>
                <div><h2 className="font-extrabold text-sm tracking-wide">{dept.nome}</h2><p className="text-[11px] text-white/80 mt-1">{dept.sigla}</p></div>
              </button>
            ))}
          </div>
        </main>
      )}

      {paginaAtual === 'departamentos' && departamentoSelecionado && (
        <main className="max-w-md mx-auto px-4 pt-6 pb-8 space-y-5">
          <button onClick={() => setDepartamentoSelecionado(null)} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar aos Departamentos</button>
          <div className="text-white p-8 rounded-3xl text-center space-y-3 shadow-lg" style={{ background: departamentoSelecionado.gradiente }}>
            <span className="text-6xl">{departamentoSelecionado.icon}</span>
            <div><h1 className="text-2xl font-extrabold tracking-wide">{departamentoSelecionado.nome}</h1><p className="text-sm text-white/80 mt-1">{departamentoSelecionado.sigla}</p></div>
          </div>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-2">
            <h2 className="font-extrabold text-base">Nosso propósito</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{departamentoSelecionado.descricao}</p>
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Liderança</h2><span className="text-xl">👤</span></div>
            {departamentoSelecionado.lideres.length > 0 ? departamentoSelecionado.lideres.map((lider) => (
              <div key={lider.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl"><div className="w-11 h-11 rounded-full bg-[#0B1E3B] text-white grid place-items-center font-bold">{lider.nome.charAt(0)}</div><div><p className="text-sm font-bold">{lider.nome}</p><p className="text-xs text-slate-500">{lider.cargo}</p></div></div>
            )) : <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl">A liderança será adicionada em breve.</p>}
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Próximos eventos</h2><span className="text-xl">📅</span></div>
            {departamentoSelecionado.eventos.length > 0 ? departamentoSelecionado.eventos.map((evento) => (
              <div key={evento.id} className="border-l-4 border-amber-400 pl-3"><p className="text-sm font-bold">{evento.titulo}</p><p className="text-xs text-slate-500">{evento.data} • {evento.horario}</p></div>
            )) : <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl">Nenhum evento publicado no momento.</p>}
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Avisos e novidades</h2><span className="text-xl">📢</span></div>
            {departamentoSelecionado.avisos.length > 0 ? departamentoSelecionado.avisos.map((aviso) => (
              <div key={aviso.id} className="bg-amber-50 border border-amber-100 p-3 rounded-2xl"><p className="text-sm font-bold">{aviso.titulo}</p><p className="text-xs text-slate-600 mt-1">{aviso.conteudo}</p></div>
            )) : <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl">Os avisos deste departamento aparecerão aqui.</p>}
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Galeria</h2><span className="text-xl">📸</span></div>
            {departamentoSelecionado.galeria.length > 0 ? <div className="grid grid-cols-3 gap-2">{departamentoSelecionado.galeria.map((foto) => <img key={foto.id} src={foto.url} alt={foto.legenda || departamentoSelecionado.nome} className="w-full aspect-square object-cover rounded-xl" />)}</div> : <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl">As fotos e vídeos serão publicados aqui.</p>}
          </section>

          <button onClick={() => setPaginaAtual('contatos')} className="w-full bg-[#0B1E3B] text-white py-4 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-all">Quero participar 💛</button>
        </main>
      )}

      {/* ================= 11. LOCALIZAÇÃO ================= */}
      {paginaAtual === 'localizacao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <h1 className="text-2xl font-bold">Nossas Igrejas</h1>
          <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-amber-400 space-y-3">
            <h2 className="text-lg font-bold">ADBrás Sede Cubatão</h2>
            <p className="text-xs text-slate-600">Rua Agostinho Lourenço Vilete, nº 125 – Jardim Nova República, Cubatão – SP</p>
            <a href="https://maps.google.com/?q=Rua+Agostinho+Lourenco+Vilete+125+Cubatao+SP" target="_blank" rel="noreferrer" className="block bg-[#0B1E3B] text-white py-3 rounded-xl text-xs font-bold text-center">📍 Ver rota no Google Maps</a>
          </div>
          {congregacoes.map((cong) => (
            <div key={cong.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {cong.foto && <img src={cong.foto} alt={cong.nome} className="w-full h-36 object-cover" />}
              <div className="p-4 space-y-1"><h2 className="font-bold text-sm">{cong.nome}</h2><p className="text-xs text-slate-600">{cong.endereco}</p><p className="text-xs text-slate-500">Dirigente: {cong.pastor}</p></div>
            </div>
          ))}
        </main>
      )}

      {/* ================= 12. LOUVORES ================= */}
      {paginaAtual === 'louvores' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl text-center"><span className="text-4xl">🎵</span><h1 className="text-xl font-bold mt-2">Louvores</h1></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center"><p className="text-xs text-slate-500">Os louvores, playlists e apresentações da igreja serão publicados aqui.</p><a href="https://youtube.com" target="_blank" rel="noreferrer" className="block mt-4 bg-red-600 text-white py-3 rounded-xl text-xs font-bold">Abrir canal no YouTube</a></div>
        </main>
      )}

      {paginaAtual === 'contatos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl text-center"><span className="text-4xl">☎</span><h1 className="text-xl font-bold mt-2">Contatos</h1></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-3 text-sm"><p><strong>ADBrás Sede Cubatão</strong></p><p>📍 Rua Agostinho Lourenço Vilete, nº 125</p><p>As redes sociais e telefones oficiais poderão ser adicionados aqui.</p></div>
        </main>
      )}

    </div>
  );
}
