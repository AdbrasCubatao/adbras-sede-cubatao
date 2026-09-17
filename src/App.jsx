import React, { useState } from 'react';

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState('home');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const [pixCopiado, setPixCopiado] = useState(false);

  // Estados da Área do Admin
  const [adminLogado, setAdminLogado] = useState(false);
  const [senhaAdmin, setSenhaAdmin] = useState('');

  // Lista dos Departamentos Oficiais
  const departamentos = [
    { id: 'ujademc', nome: 'UJADEMC', sigla: 'Jovens', icon: '🔥', descricao: 'União de Jovens da Assembléia de Deus em Cubatão' },
    { id: 'minidemc', nome: 'MINIDEMC', sigla: 'Crianças', icon: '🎨', descricao: 'Ministério Infantil da Assembléia de Deus em Cubatão' },
    { id: 'geracaoteen', nome: 'GERAÇÃO TEEN', sigla: 'Adolescentes', icon: '⚡', descricao: 'Departamento de Adolescentes' },
    { id: 'cibec', nome: 'CIBEC', sigla: 'Mulheres', icon: '🌸', descricao: 'Congresso e Círculo de Oração Feminino' },
    { id: 'univadem', nome: 'UNIVADEM', sigla: 'Homens', icon: '🛡️', descricao: 'União dos Varões da Assembléia de Deus em Cubatão' },
    { id: 'diaconal', nome: 'DIACONAL', sigla: 'Corpo Diaconal', icon: '🤝', descricao: 'Corpo Diaconal e Serviço da Igreja' },
    { id: 'missoes', nome: 'MISSÕES', sigla: 'Secretaria de Missões', icon: '🌍', descricao: 'Evangelismo e Projetos Missionários' },
  ];

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

  const copiarPix = () => {
    navigator.clipboard.writeText("00.000.000/0001-00");
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  const handleLoginAdmin = (e) => {
    e.preventDefault();
    // Senha padrão temporária (pode alterar conforme necessário)
    if (senhaAdmin === 'adbras123') {
      setAdminLogado(true);
    } else {
      alert('Senha incorreta! Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      
      {/* 1. TELA PRINCIPAL (HOME) */}
      {paginaAtual === 'home' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          {/* Card de Boas-Vindas dos Pastores */}
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
                  onClick={() => {
                    setPaginaAtual(item.id);
                    setDepartamentoSelecionado(null);
                  }}
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

          {/* Card Versículo */}
          <section className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center">
            <p className="text-base font-serif italic mb-2">
              "Eu e a minha casa serviremos ao Senhor."
            </p>
            <span className="text-xs font-semibold text-amber-400">Josué 24:15</span>
          </section>
        </main>
      )}

      {/* 2. LISTA DE DEPARTAMENTOS */}
      {paginaAtual === 'departamentos' && !departamentoSelecionado && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
            ← Voltar ao Menu
          </button>

          <div className="space-y-3">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-slate-900">Departamentos</h2>
              <p className="text-xs text-slate-500">Conheça os ministérios da ADBrás Sede Cubatão</p>
            </div>

            {departamentos.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setDepartamentoSelecionado(dept)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-slate-50 p-2 rounded-xl">{dept.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{dept.nome}</h3>
                    <p className="text-xs text-slate-500">{dept.sigla}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">➔</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. TELA INDIVIDUAL DO DEPARTAMENTO */}
      {paginaAtual === 'departamentos' && departamentoSelecionado && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button 
            onClick={() => setDepartamentoSelecionado(null)} 
            className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm"
          >
            ← Voltar para Departamentos
          </button>

          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="text-center space-y-2 border-b pb-4 border-slate-100">
              <span className="text-5xl">{departamentoSelecionado.icon}</span>
              <h2 className="text-xl font-bold text-slate-900">{departamentoSelecionado.nome}</h2>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
                {departamentoSelecionado.sigla}
              </span>
              <p className="text-xs text-slate-600 pt-1">{departamentoSelecionado.descricao}</p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Programação e Ensaios</h3>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-800">Reuniões / Cultos do Departamento</p>
                <p className="text-slate-600">Acompanhe na agenda mensal os dias dos cultos festivos.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TELA DA ÁREA ADMINISTRATIVA (ADMIN) */}
      {paginaAtual === 'admin' && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
            ← Voltar ao Menu
          </button>

          {!adminLogado ? (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 text-center">
              <span className="text-4xl">🔐</span>
              <h2 className="text-lg font-bold text-slate-900">Painel do Administrador</h2>
              <p className="text-xs text-slate-600">Acesso restrito para a liderança da igreja.</p>

              <form onSubmit={handleLoginAdmin} className="space-y-3 pt-2">
                <input
                  type="password"
                  placeholder="Digite a senha de acesso"
                  value={senhaAdmin}
                  onChange={(e) => setSenhaAdmin(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-center font-bold"
                />
                <button type="submit" className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md">
                  Entrar no Painel
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Painel de Controle</h2>
                  <span className="text-[10px] text-emerald-600 font-bold">● SESSÃO ATIVA</span>
                </div>
                <button 
                  onClick={() => setAdminLogado(false)} 
                  className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg"
                >
                  Sair
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 text-left hover:bg-slate-100">
                  📢 Gerenciar Avisos
                </button>
                <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 text-left hover:bg-slate-100">
                  📅 Editar Agenda
                </button>
                <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 text-left hover:bg-slate-100">
                  🙏 Ver Pedidos de Oração
                </button>
                <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 text-left hover:bg-slate-100">
                  🎥 Link da Live
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DEMAIS PÁGINAS (CULTOS, ORAÇÃO, OFERTAS) */}
      {paginaAtual === 'cultos' && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
            ← Voltar ao Menu
          </button>
          <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Cultos e Transmissões</h2>
            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
                ▶ Assistir no YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {paginaAtual === 'ofertas' && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
            ← Voltar ao Menu
          </button>
          <div className="bg-white p-5 rounded-3xl shadow-sm text-center space-y-4">
            <span className="text-4xl">💖</span>
            <h2 className="text-lg font-bold text-slate-900">Dízimos e Ofertas</h2>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Chave PIX (CNPJ)</span>
              <p className="text-sm font-mono font-bold text-slate-800">00.000.000/0001-00</p>
              <button onClick={copiarPix} className="w-full bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold">
                {pixCopiado ? '✓ Chave Pix Copiada!' : '📋 Copiar Chave Pix'}
              </button>
            </div>
          </div>
        </div>
      )}

      {['biblia', 'agenda', 'avisos', 'oracao', 'ebd', 'louvores', 'localizacao'].includes(paginaAtual) && (
        <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
            ← Voltar ao Menu
          </button>
          <div className="bg-white p-6 rounded-3xl shadow-sm text-center space-y-3">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              {atalhos.find(a => a.id === paginaAtual)?.titulo}
            </h2>
            <p className="text-xs text-slate-500">Conteúdo em atualização para a ADBrás Sede Cubatão.</p>
          </div>
        </div>
      )}

    </div>
  );
}
