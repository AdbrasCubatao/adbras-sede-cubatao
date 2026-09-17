import React from 'react';

export default function App() {
  const atalhos = [
    { 
      id: 1, 
      titulo: 'Início', 
      tag: null,
      link: '#',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> 
    },
    { 
      id: 2, 
      titulo: 'Bíblia', 
      tag: null,
      link: 'https://www.bibliaonline.com.br/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> 
    },
    { 
      id: 3, 
      titulo: 'Agenda', 
      tag: null,
      link: '#agenda',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> 
    },
    { 
      id: 4, 
      titulo: 'Cultos', 
      tag: 'AO VIVO',
      link: '#cultos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> 
    },
    { 
      id: 5, 
      titulo: 'Avisos', 
      tag: null,
      link: '#avisos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /> 
    },
    { 
      id: 6, 
      titulo: 'Oração', 
      tag: null,
      link: 'https://wa.me/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> 
    },
    { 
      id: 7, 
      titulo: 'EBD', 
      tag: null,
      link: '#ebd',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /> 
    },
    { 
      id: 8, 
      titulo: 'Louvores', 
      tag: null,
      link: '#louvores',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" /> 
    },
    { 
      id: 9, 
      titulo: 'Departamentos', 
      tag: null,
      link: '#departamentos',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> 
    },
    { 
      id: 10, 
      titulo: 'Localização', 
      tag: null,
      link: 'https://maps.google.com',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> 
    },
    { 
      id: 11, 
      titulo: 'Ofertas', 
      tag: null,
      link: '#ofertas',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
    },
    { 
      id: 12, 
      titulo: 'Contatos', 
      tag: null,
      link: 'https://wa.me/',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 font-sans">
      
      {/* Topo / Header do App */}
      <header className="bg-slate-900 text-white pt-8 pb-6 px-4 shadow-xl rounded-b-[32px] border-b-2 border-amber-500">
        <div className="max-w-md mx-auto text-center space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
            Assembleia de Deus • Madureira
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            ADBRÁS SEDE CUBATÃO
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Um lugar de fé, comunhão e esperança
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Seção Acesso Rápido com Botões de App */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Acesso Rápido</h2>
              <div className="w-8 h-1 bg-amber-500 rounded-full mt-0.5"></div>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
              Menu Principal
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="relative flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300 active:scale-95 transition-all duration-200 min-h-[92px] group"
              >
                {/* Tag Ao Vivo */}
                {item.tag && (
                  <span className="absolute -top-1 text-[8px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                    {item.tag}
                  </span>
                )}

                {/* Ícone Estilo App */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </div>

                {/* Rótulo do Botão */}
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight mt-2 group-hover:text-slate-900">
                  {item.titulo}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Card de Cultos */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 border-b pb-2.5 border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              📅
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Horários dos Cultos</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="font-bold text-amber-600">Quarta-feira</p>
              <p className="text-slate-600 font-medium mt-0.5">19h30 • Culto da Família</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="font-bold text-amber-600">Domingo</p>
              <p className="text-slate-600 font-medium mt-0.5">09h00 • EBD</p>
              <p className="text-slate-600 font-medium">18h00 • Culto da Família</p>
            </div>
          </div>
        </section>

        {/* Card do Versículo */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg text-center relative overflow-hidden border border-slate-800">
          <p className="text-base font-serif italic mb-3 text-slate-100 leading-relaxed">
            "Eu e a minha casa serviremos ao Senhor."
          </p>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full inline-block border border-amber-400/20">
            Josué 24:15
          </span>
        </section>

        {/* Redes Sociais */}
        <section className="text-center pt-2 pb-4 space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Conecte-se Conosco
          </h3>
          <div className="flex justify-center items-center gap-3">
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="w-11 h-11 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-md hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-11 h-11 bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-md hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-11 h-11 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-md hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
