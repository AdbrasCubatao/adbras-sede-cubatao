import React from 'react';

export default function App() {
  const atalhos = [
    { id: 1, titulo: 'Início', icon: '🏠' },
    { id: 2, titulo: 'Bíblia', icon: '📖' },
    { id: 3, titulo: 'Agenda', icon: '📅' },
    { id: 4, titulo: 'Cultos', icon: '📺', tag: 'AO VIVO' },
    { id: 5, titulo: 'Avisos', icon: '📢' },
    { id: 6, titulo: 'Pedidos de Oração', icon: '🙏' },
    { id: 7, titulo: 'Estudos / EBD', icon: '🎓' },
    { id: 8, titulo: 'Louvores', icon: '🎵' },
    { id: 9, titulo: 'Departamentos', icon: '👥' },
    { id: 10, titulo: 'Localização', icon: '📍' },
    { id: 11, titulo: 'Dízimos e Ofertas', icon: '💖' },
    { id: 12, titulo: 'Contatos', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 pb-20 font-sans">
      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Título Acesso Rápido */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Acesso Rápido</h2>
            <div className="w-10 h-1 bg-amber-400 rounded-full mt-1"></div>
          </div>

          {/* Grid de 12 Botões */}
          <div className="grid grid-cols-4 gap-2.5">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href="#"
                className="flex flex-col items-center justify-between p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all min-h-[92px] relative"
              >
                {/* Ícone grande */}
                <span className="text-2xl mt-1">{item.icon}</span>

                {/* Texto do botão */}
                <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
                  {item.titulo}
                </span>

                {/* Badge Amarela 'AO VIVO' (se houver) */}
                {item.tag && (
                  <span className="mt-1 text-[8px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {item.tag}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Card de Versículo Escuro */}
        <section className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-md text-center">
          <p className="text-base font-serif italic mb-3 leading-relaxed">
            "Eu e a minha casa serviremos ao Senhor."
          </p>
          <span className="text-xs font-semibold text-slate-300">
            Josué 24:15
          </span>
        </section>

        {/* Redes Sociais */}
        <section className="text-center pt-2 pb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Conecte-se conosco
          </h3>
          <div className="flex justify-center items-center gap-3">
            {/* WhatsApp */}
            <a href="#" className="w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-95">
              💬
            </a>
            {/* Instagram */}
            <a href="#" className="w-11 h-11 bg-[#E1306C] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-95">
              📷
            </a>
            {/* YouTube */}
            <a href="#" className="w-11 h-11 bg-[#FF0000] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-95">
              ▶️
            </a>
            {/* Facebook */}
            <a href="#" className="w-11 h-11 bg-[#1877F2] text-white rounded-full flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-95">
              🌐
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
