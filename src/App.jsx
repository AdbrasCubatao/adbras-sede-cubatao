import React from 'react';

export default function App() {
  const atalhos = [
    { 
      id: 1, 
      titulo: 'Início', 
      link: '#',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> 
    },
    { 
      id: 2, 
      titulo: 'Bíblia', 
      link: 'https://www.bibliaonline.com.br/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> 
    },
    { 
      id: 3, 
      titulo: 'Agenda', 
      link: '#agenda',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> 
    },
    { 
      id: 4, 
      titulo: 'Cultos', 
      tag: 'AO VIVO',
      link: '#cultos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> 
    },
    { 
      id: 5, 
      titulo: 'Avisos', 
      link: '#avisos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> 
    },
    { 
      id: 6, 
      titulo: 'Oração', 
      link: 'https://wa.me/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> 
    },
    { 
      id: 7, 
      titulo: 'EBD', 
      link: '#ebd',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" /> 
    },
    { 
      id: 8, 
      titulo: 'Louvores', 
      link: '#louvores',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" /> 
    },
    { 
      id: 9, 
      titulo: 'Departamentos', 
      link: '#departamentos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> 
    },
    { 
      id: 10, 
      titulo: 'Localização', 
      link: 'https://maps.google.com',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> 
    },
    { 
      id: 11, 
      titulo: 'Ofertas', 
      link: '#ofertas',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
    },
    { 
      id: 12, 
      titulo: 'Contatos', 
      link: 'https://wa.me/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans antialiased">
      
      {/* Topo Azul Marinho Profundo */}
      <header className="bg-gradient-to-b from-[#0B192C] to-[#1E293B] text-white pt-8 pb-24 px-6 shadow-xl relative overflow-hidden">
        <div className="max-w-md mx-auto text-center relative z-10 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            ADBrás Sede Cubatão
          </span>
          <p className="text-sm font-medium text-slate-300 pt-2">
            Uma Igreja que Ama, Serve e Anuncia Jesus!
          </p>
        </div>
        {/* Detalhe de iluminação de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-7 -mt-16 relative z-20">
        
        {/* Card Boas-Vindas dos Pastores */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-amber-400 overflow-hidden shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                alt="Pastores" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online"></span>
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Bem-vindo!
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Que sua vida seja edificada pela Palavra de Deus e pela comunhão.
            </p>
            <div className="pt-1 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-800">
                Pr. Edson Carlos & Missª. Solange
              </p>
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block">
                PASTORES PRESIDENTES
              </span>
            </div>
          </div>
        </section>

        {/* Grade de Acesso Rápido Modernizada */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Acesso Rápido
              </h2>
              <div className="w-8 h-1 bg-amber-500 rounded-full mt-0.5"></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="group relative flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-200/60 hover:border-amber-400 hover:shadow-lg active:scale-95 transition-all duration-200 min-h-[92px]"
              >
                {/* Tag Ao Vivo em Destaque */}
                {item.tag && (
                  <span className="absolute -top-1.5 text-[8px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-bounce">
                    {item.tag}
                  </span>
                )}

                {/* Ícone com Fundo Suave */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </div>

                {/* Título */}
                <span className="text-[10px] font-bold text-slate-700 text-center leading-tight mt-2 group-hover:text-slate-900">
                  {item.titulo}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Card Devocional / Versículo */}
        <section className="bg-gradient-to-br from-[#0B192C] via-[#1E293B] to-[#0B192C] text-white p-6 rounded-3xl shadow-xl text-center relative overflow-hidden border border-slate-700/50">
          <p className="text-base font-serif italic mb-3 text-slate-100 leading-relaxed">
            "Eu e a minha casa serviremos ao Senhor."
          </p>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full inline-block border border-amber-400/20">
            Josué 24:15
          </span>
        </section>

      </main>
    </div>
  );
}
