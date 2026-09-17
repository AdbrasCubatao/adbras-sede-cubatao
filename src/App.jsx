import React from 'react';

export default function App() {
  const atalhos = [
    { id: 1, titulo: 'Início', icon: '🏠', link: '#' },
    { id: 2, titulo: 'Bíblia', icon: '📖', link: 'https://www.bibliaonline.com.br/' },
    { id: 3, titulo: 'Agenda', icon: '📅', link: '#agenda' },
    { id: 4, titulo: 'Cultos', icon: '📺', tag: 'AO VIVO', link: '#cultos' },
    { id: 5, titulo: 'Avisos', icon: '📢', link: '#avisos' },
    { id: 6, titulo: 'Pedidos de Oração', icon: '🙏', link: 'https://wa.me/' },
    { id: 7, titulo: 'Estudos / EBD', icon: '🎓', link: '#ebd' },
    { id: 8, titulo: 'Louvores', icon: '🎵', link: '#louvores' },
    { id: 9, titulo: 'Departamentos', icon: '👥', link: '#departamentos' },
    { id: 10, titulo: 'Localização', icon: '📍', link: 'https://maps.google.com' },
    { id: 11, titulo: 'Dízimos e Ofertas', icon: '💖', link: '#ofertas' },
    { id: 12, titulo: 'Contatos', icon: '📞', link: 'https://wa.me/' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 font-sans">
      
      {/* Cabeçalho da ADBrás Sede Cubatão */}
      <header className="bg-slate-900 text-white pt-8 pb-6 px-4 shadow-md rounded-b-3xl border-b-2 border-amber-500">
        <div className="max-w-md mx-auto text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Assembleia de Deus - Ministério de Madureira
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            ADBRÁS SEDE CUBATÃO
          </h1>
          <p className="text-xs text-slate-300">
            Um lugar de fé, comunhão e esperança
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Seção Acesso Rápido */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Acesso Rápido</h2>
              <div className="w-10 h-1 bg-amber-500 rounded-full mt-0.5"></div>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
              Menu
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {atalhos.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="relative flex flex-col items-center justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md min-h-[88px] active:scale-95 transition-all group"
              >
                {item.tag && (
                  <span className="absolute top-1.5 text-[8px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                    {item.tag}
                  </span>
                )}
                <span className={`text-2xl transition-transform group-hover:scale-110 ${item.tag ? 'mt-2' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight mt-1.5">
                  {item.titulo}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Card de Horários dos Cultos */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-100">
            <span className="text-xl">🏛️</span>
            <h3 className="font-bold text-slate-900 text-sm">Horários dos Cultos</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p className="font-bold text-amber-600">Quarta-feira</p>
              <p className="text-slate-600 font-medium">19h30 • Culto da Família</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p className="font-bold text-amber-600">Domingo</p>
              <p className="text-slate-600 font-medium">09h00 • EBD</p>
              <p className="text-slate-600 font-medium">18h00 • Culto da Família</p>
            </div>
          </div>
        </section>

        {/* Card do Versículo em Destaque */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-md text-center relative overflow-hidden border border-amber-500/20">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
          <p className="text-base font-serif italic mb-3 text-slate-100 leading-relaxed">
            "Eu e a minha casa serviremos ao Senhor."
          </p>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full inline-block">
            Josué 24:15
          </span>
        </section>

        {/* Redes Sociais / Conecte-se Conosco */}
        <section className="text-center pt-2 pb-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Conecte-se com a ADBrás Cubatão
          </h3>
          <div className="flex justify-center items-center gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-90 transition-all"
              title="WhatsApp"
            >
              💬
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-90 transition-all"
              title="Instagram"
            >
              📷
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-90 transition-all"
              title="YouTube"
            >
              ▶️
            </a>
            {/* Google Maps */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md hover:opacity-90 active:scale-90 transition-all"
              title="Localização"
            >
              📍
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
