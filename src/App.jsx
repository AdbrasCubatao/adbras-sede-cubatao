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

    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">

        

        {/* Seção Acesso Rápido */}

        <section>

          <div className="mb-4">

            <h2 className="text-xl font-bold text-slate-900">Acesso Rápido</h2>

            <div className="w-10 h-1 bg-amber-500 rounded-full mt-1"></div>

          </div>



          <div className="grid grid-cols-4 gap-2.5">

            {atalhos.map((item) => (

              <button

                key={item.id}

                className="relative flex flex-col items-center justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[85px] active:scale-95 transition-all"

              >

                {item.tag && (

                  <span className="absolute top-1 text-[8px] font-extrabold bg-amber-100 text-amber-700 px-1 py-0.2 rounded-full uppercase">

                    {item.tag}

                  </span>

                )}

                <span className={`text-2xl ${item.tag ? 'mt-2' : ''}`}>{item.icon}</span>

                <span className="text-[10px] font-medium text-slate-700 text-center leading-tight mt-1">

                  {item.titulo}

                </span>

              </button>

            ))}

          </div>

        </section>



        {/* Card do Versículo */}

        <section className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg text-center">

          <p className="text-base font-serif italic mb-2">

            "Eu e a minha casa serviremos ao Senhor."

          </p>

          <span className="text-xs font-semibold text-amber-400">

            Josué 24:15

          </span>

        </section>



        {/* Seção Redes Sociais / Rodapé */}

        <section className="text-center pt-2 pb-6">

          <h3 className="text-sm font-semibold text-slate-700 mb-3">

            Conecte-se conosco

          </h3>

          <div className="flex justify-center items-center gap-3">

            <span className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg shadow">💬</span>

            <span className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center text-lg shadow">📷</span>

            <span className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-lg shadow">▶️</span>

            <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg shadow">🌐</span>

          </div>

        </section>



      </main>

    </div>

  );

}
