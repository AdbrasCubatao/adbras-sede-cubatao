import React from 'react';

export default function App() {
  const atalhos = [
    { id: 1, titulo: 'Início', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 2, titulo: 'Bíblia', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: 3, titulo: 'Agenda', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 4, titulo: 'Cultos', tag: 'AO VIVO', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
    { id: 5, titulo: 'Avisos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> },
    { id: 6, titulo: 'Pedidos de Oração', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { id: 7, titulo: 'Estudos / EBD', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { id: 8, titulo: 'Louvores', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 .895-2 3-2 3 .895 3 2zM9 10l12-3" /> },
    { id: 9, titulo: 'Departamentos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { id: 10, titulo: 'Localização', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
    { id: 11, titulo: 'Dízimos e Ofertas', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
    { id: 12, titulo: 'Contatos', link: '#', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20 font-sans">
      <main className="max-w-md mx-auto px-4 pt-8 space-y-8">
        
        {/* Seção Acesso Rápido */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 tracking-tight">
              Acesso Rápido
            </h2>
            <div className="w-12 h-1 bg-amber-400 rounded-full mt-1.5"></div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="relative flex flex-col items-center justify-between p-3.5 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-md active:scale-95 transition-all min-h-[96px]"
              >
                {/* Ícone */}
                <div className="text-slate-800 mt-1">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.svg}
                  </svg>
                </div>

                {/* Título */}
                <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight mb-1">
                  {item.titulo}
                </span>

                {/* Badge Ao Vivo */}
                {item.tag && (
                  <span className="absolute bottom-1 text-[8px] font-bold bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full uppercase tracking-tight">
                    {item.tag}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Card do Versículo */}
        <section className="bg-[#0B1E3D] text-white p-7 rounded-[28px] shadow-lg">
          <p className="text-lg font-serif italic mb-4 leading-snug tracking-wide">
            "Eu e a minha casa serviremos ao Senhor."
          </p>
          <span className="text-sm font-semibold text-slate-300 block">
            Josué 24:15
          </span>
        </section>

        {/* Redes Sociais */}
        <section className="text-center pt-2 space-y-4">
          <h3 className="text-base font-medium text-slate-800">
            Conecte-se conosco
          </h3>
          <div className="flex justify-center items-center gap-4">
            {/* WhatsApp */}
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="w-13 h-13 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#E1306C] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FF0000] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 active:scale-90 transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
