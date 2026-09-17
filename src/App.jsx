import React from 'react';

export default function App() {
  const atalhos = [
    { id: 1, titulo: 'Início', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 2, titulo: 'Bíblia', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: 3, titulo: 'Agenda', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 4, titulo: 'Cultos', tag: 'AO VIVO', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
    { id: 5, titulo: 'Avisos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> },
    { id: 6, titulo: 'Pedidos de Oração', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { id: 7, titulo: 'Estudos / EBD', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: 8, titulo: 'Louvores', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" /> },
    { id: 9, titulo: 'Departamentos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { id: 10, titulo: 'Localização', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
    { id: 11, titulo: 'Dízimos e Ofertas', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
    { id: 12, titulo: 'Contatos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-900 pb-16 font-sans">
      
      {/* Topo Azul Marinho Escuro */}
      <header className="bg-[#0b1b3d] text-white pt-6 pb-20 px-6">
        <p className="text-sm font-serif text-slate-200 tracking-wide max-w-md mx-auto">
          Uma Igreja que Ama, Serve e Anuncia Jesus!
        </p>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-8 -mt-14">
        
        {/* Card de Boas-Vindas dos Pastores */}
        <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 flex items-start gap-4">
          {/* Circulo com Foto do Pastor */}
          <div className="w-20 h-20 rounded-full border-2 border-amber-400 p-0.5 flex-shrink-0 overflow-hidden bg-slate-100">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Pastores" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Mensagem e Nome */}
          <div className="space-y-2">
            <h1 className="text-xl font-serif font-bold text-slate-900">
              Bem-vindo!
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Que sua vida seja edificada pela Palavra de Deus e pela comunhão com a nossa igreja.
            </p>
            <div className="pt-1">
              <p className="text-xs font-serif italic text-slate-800 font-medium">
                Pr. Edson Carlos da Silva e<br />
                Missª. Solange da Silva
              </p>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mt-1">
                PASTORES PRESIDENTES
              </span>
            </div>
          </div>
        </section>

        {/* Seção Acesso Rápido */}
        <section className="pt-2">
          <div className="mb-4">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Acesso Rápido
            </h2>
            <div className="w-10 h-0.5 bg-amber-400 rounded-full mt-1"></div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="flex flex-col items-center justify-between p-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80 hover:shadow-md active:scale-95 transition-all min-h-[96px] relative"
              >
                {/* Ícone */}
                <div className="text-slate-800 mt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </div>

                {/* Texto */}
                <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mb-1">
                  {item.titulo}
                </span>

                {/* Tag Ao Vivo */}
                {item.tag && (
                  <span className="text-[8px] font-bold bg-[#D9A354] text-white px-2 py-0.5 rounded-full uppercase tracking-tight">
                    {item.tag}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
