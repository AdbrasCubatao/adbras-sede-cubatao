import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialização do Supabase com suas credenciais
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const diaBrasilia = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const CACHE_VERSOS = 'adbras-versiculos-v1';
function CreditosBiblia() {
  return <details className="text-xs mt-3"><summary className="cursor-pointer">Sobre a tradução BLIVRE</summary><p className="mt-2">Bíblia Livre (BLIVRE), © 2018 Diego Santos, Mario Sérgio e Marco Teles. <a href="https://sites.google.com/site/biblialivre/" target="_blank" rel="noopener noreferrer" className="underline">Fonte e autores</a>. <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">Licença CC BY 4.0</a>. Textos consultados no eBible.org. Ao editar um texto, indique qualquer adaptação.</p></details>;
}
function VersiculoDoDia() {
  const [lista, setLista] = useState([]);
  const [dia, setDia] = useState(diaBrasilia);
  useEffect(() => {
    let vivo = true;
    let buscando = false;
    let ultimoDia = '';
    let ultimaTentativa = 0;
    const atualizar = async () => {
      if (document.hidden || buscando) return;
      const hoje = diaBrasilia();
      setDia(hoje);
      try {
        const salvo = JSON.parse(localStorage.getItem(CACHE_VERSOS) || 'null');
        if (Array.isArray(salvo?.lista)) {
          setLista(salvo.lista);
          if (salvo.dia === hoje) return;
        }
      } catch { /* armazenamento indisponível */ }
      if (ultimoDia === hoje || Date.now() - ultimaTentativa < 60000) return;
      buscando = true; ultimaTentativa = Date.now();
      try {
        const { data, error } = await supabase.from('versiculos').select('id,texto,referencia,data,versao,fonte_url').eq('ativo', true).order('data').limit(1000);
        if (error) throw error;
        if (!vivo) return;
        ultimoDia = hoje; setLista(data || []);
        try { localStorage.setItem(CACHE_VERSOS, JSON.stringify({dia: hoje, lista: data || []})); } catch {}
      } catch { /* mantém a cópia local em caso de falha */ }
      finally { buscando = false; }
    };
    atualizar();
    const timer = setInterval(atualizar, 60000);
    document.addEventListener('visibilitychange', atualizar);
    window.addEventListener('adbras-versiculos', atualizar);
    return () => { vivo = false; clearInterval(timer); document.removeEventListener('visibilitychange', atualizar); window.removeEventListener('adbras-versiculos', atualizar); };
  }, []);
  const anteriores = lista.filter(v => v.data <= dia);
  const indice = anteriores.length ? Math.floor((Date.parse(dia+'T00:00:00Z') - Date.parse(anteriores[0].data+'T00:00:00Z')) / 86400000) % anteriores.length : 0;
  const verso = lista.find(v => v.data === dia) || anteriores[indice];
  return <section className="verse-banner" style={{height:'auto', minHeight:138, display:'block'}}>
    <h2 className="text-sm font-bold mb-3">Versículo do dia</h2>
    {verso ? <><p>“{verso.texto}”</p><strong>{verso.referencia} · {verso.versao}</strong><a href={verso.fonte_url} target="_blank" rel="noopener noreferrer" className="text-xs underline">Ler na fonte</a></> : <p className="text-sm">O versículo do dia estará disponível em breve.</p>}
    <CreditosBiblia />
  </section>;
}
function AdminVersiculos() {
  const vazio = {texto:'', referencia:'', data:diaBrasilia(), ativo:true, versao:'BLIVRE', fonte_url:'https://ebible.org/porbr2018/'};
  const [lista,setLista] = useState([]), [form,setForm] = useState(vazio), [id,setId] = useState(null), [ocupado,setOcupado] = useState(false), [mensagem,setMensagem] = useState(''), [busca,setBusca] = useState('');
  const carregar = async () => {
    const {data,error} = await supabase.from('versiculos').select('*').order('data').limit(1000);
    if(error) setMensagem('Não foi possível carregar. Execute o SQL dos versículos e confira sua permissão.');
    else setLista(data || []);
  };
  useEffect(() => {carregar();}, []);
  const limpar = () => {setId(null);setForm({...vazio});};
  const salvar = async e => {
    e.preventDefault();setOcupado(true);setMensagem('');
    try {
      const payload = {...form,texto:form.texto.trim(),referencia:form.referencia.trim()};
      if(!payload.texto || !payload.referencia) throw new Error('Preencha o texto e a referência.');
      const url = new URL(payload.fonte_url); if(url.protocol !== 'https:') throw new Error('Use uma fonte com https://.');
      const resposta = id ? await supabase.from('versiculos').update(payload).eq('id',id).select('id') : await supabase.from('versiculos').insert(payload).select('id');
      if(resposta.error) throw new Error(resposta.error.code==='23505' ? 'Já existe um versículo nessa data. Edite o registro existente ou escolha outra data.' : resposta.error.message);
      if(!resposta.data?.length) throw new Error('Registro não salvo. Confira a permissão de administrador.');
      try {localStorage.removeItem(CACHE_VERSOS);} catch {}
      limpar(); await carregar();setMensagem('Versículo salvo!');
    } catch(e) {setMensagem(e.message);} finally {setOcupado(false);}
  };
  const excluir = async v => {
    if(!window.confirm('Excluir '+v.referencia+' da data '+v.data+'?')) return;
    setOcupado(true);
    try {
      const {data,error} = await supabase.from('versiculos').delete().eq('id',v.id).select('id');
      if(error || !data?.length) throw new Error(error?.message || 'Registro não excluído.');
      try {localStorage.removeItem(CACHE_VERSOS);} catch {}
      if(id===v.id) limpar(); await carregar();setMensagem('Versículo excluído.');
    } catch(e) {setMensagem(e.message);} finally {setOcupado(false);}
  };
  return <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
    <h3 className="font-bold">Versículo do dia</h3>
    <p className="text-xs text-slate-500">Cadastre um texto por data (horário de Brasília). Dias sem cadastro usam novamente os textos anteriores ativos. Os visitantes recebem alterações na próxima atualização diária.</p>
    <form onSubmit={salvar} className="space-y-3">
      <label className="block text-xs">Data<input required type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})} className="block w-full border rounded-xl p-2" /></label>
      <label className="block text-xs">Referência<input required value={form.referencia} onChange={e=>setForm({...form,referencia:e.target.value})} className="block w-full border rounded-xl p-2" /></label>
      <label className="block text-xs">Texto<textarea required rows={4} value={form.texto} onChange={e=>setForm({...form,texto:e.target.value})} className="block w-full border rounded-xl p-2" /></label>
      <label className="block text-xs">Versão<input required value={form.versao} onChange={e=>setForm({...form,versao:e.target.value})} className="block w-full border rounded-xl p-2" /></label>
      <label className="block text-xs">Link da fonte<input required type="url" value={form.fonte_url} onChange={e=>setForm({...form,fonte_url:e.target.value})} className="block w-full border rounded-xl p-2" /></label>
      <label className="block text-xs"><input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})} /> Ativo</label>
      <button disabled={ocupado} className="bg-[#0B1E3B] text-white rounded-xl px-4 py-2 text-sm">{ocupado?'Aguarde…':id?'Salvar alteração':'Cadastrar'}</button>
      {id && <button type="button" onClick={limpar} className="ml-3 text-sm">Cancelar edição</button>}
    </form>
    <p role="status" className="text-xs">{mensagem}</p>
    <input placeholder="Buscar referência ou data" value={busca} onChange={e=>setBusca(e.target.value)} className="w-full border p-2 rounded-xl text-xs" />
    <p className="text-xs">{lista.length} versículos cadastrados</p>
    <div className="max-h-80 overflow-y-auto space-y-2">{lista.filter(v=>(v.referencia+' '+v.data).toLowerCase().includes(busca.toLowerCase())).map(v=><div key={v.id} className="bg-slate-50 rounded-xl p-3 text-xs"><b>{v.data} · {v.referencia}</b><p>{v.ativo?'Ativo':'Inativo'}</p><button disabled={ocupado} onClick={()=>{setId(v.id);setForm({texto:v.texto,referencia:v.referencia,data:v.data,ativo:v.ativo,versao:v.versao,fonte_url:v.fonte_url});}} className="mr-4 underline">Editar</button><button disabled={ocupado} onClick={()=>excluir(v)} className="text-red-600 underline">Excluir</button></div>)}</div>
    <CreditosBiblia />
  </section>;
}

const REDES_IGREJA_PADRAO = { instagram_url: 'https://www.instagram.com/adbras.cubatao/', facebook_url: 'https://www.facebook.com/share/p/14tK88qf5Tj/', youtube_url: 'https://www.youtube.com/@adbrascubatao', whatsapp_url: '' };
const REDES_IGREJA_CAMPOS = [
  {campo:'whatsapp_url',nome:'WhatsApp',icone:'◉',cor:'#25d366',hosts:['wa.me','whatsapp.com']},
  {campo:'instagram_url',nome:'Instagram',icone:'◎',cor:'linear-gradient(135deg,#6b3ad4,#e43576,#f7b43b)',hosts:['instagram.com']},
  {campo:'youtube_url',nome:'YouTube',icone:'▶',cor:'#f10e16',hosts:['youtube.com','youtu.be']},
  {campo:'facebook_url',nome:'Facebook',icone:'f',cor:'#2475df',hosts:['facebook.com','fb.com','fb.me']}
];
function redeIgrejaValida(valor, rede) {
  if (!valor) return true;
  try { const u=new URL(valor);return u.protocol==='https:' && !u.username && !u.password && rede.hosts.some(h=>u.hostname===h || u.hostname.endsWith('.'+h)); } catch {return false;}
}
function RedesIgreja({admin=false}) {
  const [links,setLinks]=useState({...REDES_IGREJA_PADRAO});
  const [carregando,setCarregando]=useState(true), [salvando,setSalvando]=useState(false), [erroCarga,setErroCarga]=useState(false), [mensagem,setMensagem]=useState('');
  useEffect(()=>{
    let ativo=true;
    (async()=>{
      try {
        const {data,error}=await supabase.from('redes_igreja').select('instagram_url,facebook_url,youtube_url,whatsapp_url').eq('id',1).maybeSingle();
        if(error || !data) throw new Error('Configuração não encontrada. Execute o SQL das redes da igreja.');
        if(ativo) setLinks(data);
      } catch(e) {if(ativo){setErroCarga(true);setMensagem(e.message);}}
      finally {if(ativo)setCarregando(false);}
    })();
    return ()=>{ativo=false;};
  },[]);
  async function salvar(e) {
    e.preventDefault();setMensagem('');
    const valores=Object.fromEntries(REDES_IGREJA_CAMPOS.map(r=>[r.campo,(links[r.campo]||'').trim()]));
    const invalida=REDES_IGREJA_CAMPOS.find(r=>!redeIgrejaValida(valores[r.campo],r));
    if(invalida){setMensagem('Informe um link HTTPS válido de '+invalida.nome+'.');return;}
    setSalvando(true);
    try {
      const {data,error}=await supabase.from('redes_igreja').update(valores).eq('id',1).select('id');
      if(error)throw error;
      if(!data?.length)throw new Error('Não foi possível salvar. Confira sua permissão de administrador.');
      setLinks(valores);setMensagem('Links salvos! Volte à home para conferir.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  if(admin)return <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
    <h3 className="font-bold">Redes sociais da igreja — Home</h3>
    <p className="text-xs text-slate-500">Cole o link completo. Deixe vazio para ocultar o botão. Para WhatsApp, use o link do contato, grupo ou canal.</p>
    <form onSubmit={salvar} className="space-y-3">
      {REDES_IGREJA_CAMPOS.map(r=><label key={r.campo} className="block text-xs">{r.nome}<input type="url" placeholder="https://" value={links[r.campo]||''} disabled={carregando || salvando || erroCarga} onChange={e=>setLinks({...links,[r.campo]:e.target.value})} className="block w-full border rounded-xl p-2" /></label>)}
      <button disabled={carregando || salvando || erroCarga} className="bg-[#0B1E3B] text-white rounded-xl px-4 py-2 text-sm">{carregando?'Carregando…':salvando?'Salvando…':'Salvar redes da igreja'}</button>
    </form><p role="status" className="text-xs">{mensagem}</p>
  </section>;
  const visiveis=REDES_IGREJA_CAMPOS.filter(r=>links[r.campo] && redeIgrejaValida(links[r.campo],r));
  if(!visiveis.length)return null;
  return <section className="social-section"><h2>Conecte-se conosco</h2><div>{visiveis.map(r=><a key={r.campo} href={links[r.campo]} aria-label={'Abrir '+r.nome+' da igreja'} title={r.nome} target="_blank" rel="noopener noreferrer" style={{background:r.cor}}>{r.icone}</a>)}</div></section>;
}

const SEDE_LOCAL = {id:'sede-local', nome:'AD Brás Sede Cubatão', endereco:'Rua Agostinho Lourenço Vilete, nº 125 – Jardim Nova República, Cubatão – SP', sede:true, ativo:true};
function LocaisIgrejas({admin=false}) {
  const novo = () => ({nome:'',endereco:'',bairro:'',cidade:'Cubatão',uf:'SP',horarios:'',sede:false,ativo:true});
  const [lista,setLista]=useState([]), [form,setForm]=useState(novo), [id,setId]=useState(null), [busca,setBusca]=useState(''), [carregando,setCarregando]=useState(true), [erro,setErro]=useState(''), [mensagem,setMensagem]=useState(''), [salvando,setSalvando]=useState(false);
  async function carregar() {
    setCarregando(true);setErro('');
    try {
      let consulta=supabase.from('igrejas_locais').select('*').order('sede',{ascending:false}).order('nome');
      if(!admin)consulta=consulta.eq('ativo',true);
      const {data,error}=await consulta;
      if(error)throw error;
      setLista(data || []);
    }catch(e){setErro(admin?'Não foi possível carregar os endereços. Confira se executou o SQL e tente novamente.':'Não foi possível atualizar a lista de congregações. Tente novamente.');if(!admin)setLista([SEDE_LOCAL]);}
    finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[admin]);
  function limpar(){setId(null);setForm(novo());}
  async function salvar(e){
    e.preventDefault();setSalvando(true);setMensagem('');
    try{
      const valores={...form,nome:form.nome.trim(),endereco:form.endereco.trim(),bairro:form.bairro.trim(),cidade:form.cidade.trim(),uf:form.uf.trim().toUpperCase(),horarios:form.horarios.trim()};
      if(!valores.nome || !valores.endereco || !valores.cidade || !/^[A-Z]{2}$/.test(valores.uf))throw new Error('Preencha nome, endereço, cidade e UF com duas letras.');
      const {data,error}=id ? await supabase.from('igrejas_locais').update(valores).eq('id',id).select('id') : await supabase.from('igrejas_locais').insert(valores).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      limpar();await carregar();setMensagem('Endereço salvo! A página de localização será atualizada ao abri-la novamente.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  async function excluir(item){
    if(!window.confirm('Excluir '+item.nome+'? Você também pode apenas desativar o cadastro em Editar.'))return;
    setSalvando(true);setMensagem('');
    try{const {data,error}=await supabase.from('igrejas_locais').delete().eq('id',item.id).select('id');if(error)throw error;if(!data?.length)throw new Error('Nada foi excluído. Confira sua permissão.');if(id===item.id)limpar();await carregar();setMensagem('Cadastro excluído.');}catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  const normalizar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const encontrados=lista.filter(v=>normalizar([v.nome,v.endereco,v.bairro,v.cidade].filter(Boolean).join(' ')).includes(normalizar(busca)));
  const enderecoCompleto=v=>[v.endereco,v.bairro,v.cidade,v.uf].filter(Boolean).join(', ');
  return <section className="space-y-4">
    {admin ? <div className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
      <h3 className="font-bold">Endereços das igrejas</h3><p className="text-xs text-slate-500">Cadastre a sede e as congregações. Mudou de endereço? Use Editar. Desative um local para ocultá-lo da página pública.</p>
      <form onSubmit={salvar} className="space-y-3">
        <fieldset disabled={salvando || carregando || !!erro} className="space-y-3">
          {[['nome','Nome da igreja',true],['endereco','Rua, número e complemento',true],['bairro','Bairro',false],['cidade','Cidade',true],['uf','UF',true],['horarios','Dias e horários dos cultos (opcional)',false]].map(([campo,label,obrigatorio])=><label key={campo} className="block text-xs">{label}<input required={obrigatorio} maxLength={campo==='uf'?2:300} value={form[campo]} onChange={e=>setForm({...form,[campo]:e.target.value})} className="block w-full border p-2 rounded-xl" /></label>)}
          <label className="block text-xs"><input type="checkbox" checked={form.sede} onChange={e=>setForm({...form,sede:e.target.checked})} /> Identificar como sede</label>
          <label className="block text-xs"><input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})} /> Mostrar na página de localização</label>
          <button className="bg-[#0B1E3B] text-white rounded-xl px-4 py-2 text-sm">{salvando?'Salvando…':id?'Salvar alteração':'Cadastrar igreja'}</button>
          {id && <button type="button" onClick={limpar} className="ml-3 text-sm">Cancelar edição</button>}
        </fieldset>
      </form><p role="status" className="text-xs">{mensagem}</p>
    </div> : <div className="bg-[#0B1E3B] text-white p-6 rounded-3xl space-y-3"><span className="text-3xl" aria-hidden="true">📍</span><h1 className="text-2xl font-bold">Uma igreja perto de você</h1><p className="text-sm leading-relaxed">Há um lugar para você e sua família aqui. Conheça nossas igrejas e encontre uma congregação para adorar a Deus e caminhar conosco. Será uma alegria receber você!</p></div>}
    <label className="block text-sm">Buscar por igreja, bairro ou cidade<input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Digite o nome ou o bairro" className="mt-2 block w-full border rounded-xl p-3 bg-white text-sm" /></label>
    {carregando && <p role="status" className="text-sm">Carregando endereços…</p>}
    {erro && <div role="alert" className="text-sm bg-amber-50 p-3 rounded-xl">{erro}<button onClick={carregar} className="block underline mt-2">Tentar novamente</button></div>}
    {!carregando && !erro && !encontrados.length && <p className="bg-white p-4 rounded-xl text-sm">{busca?'Nenhuma igreja encontrada. Tente outro bairro ou nome.':admin?'Cadastre a primeira igreja acima.':'Em breve, os endereços das nossas igrejas estarão disponíveis aqui.'}</p>}
    <div className={admin?'max-h-96 overflow-y-auto space-y-3':'space-y-4'}>{encontrados.map(v=><article key={v.id} className={'bg-white p-5 rounded-3xl shadow-sm space-y-3 border '+(v.sede?'border-amber-400':'border-slate-100')}>
      {v.sede && <span className="text-xs font-bold text-amber-700">SEDE</span>}
      <h2 className="font-bold text-lg">{v.nome}</h2><p className="text-sm text-slate-600">{enderecoCompleto(v)}</p>
      {v.horarios && <p className="text-sm text-slate-600">Cultos: {v.horarios}</p>}
      <a href={'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(enderecoCompleto(v))} target="_blank" rel="noopener noreferrer" aria-label={'Como chegar a '+v.nome} className="block bg-[#0B1E3B] text-white py-3 rounded-xl text-sm font-bold text-center">📍 Como chegar</a>
      {admin && <div className="text-xs space-x-4"><span>{v.ativo?'Visível':'Oculta'}</span><button disabled={salvando} className="underline" onClick={()=>{setId(v.id);setForm({nome:v.nome,endereco:v.endereco,bairro:v.bairro,cidade:v.cidade,uf:v.uf,horarios:v.horarios,sede:v.sede,ativo:v.ativo});setMensagem('Editando '+v.nome+'. O formulário está acima.');}}>Editar</button><button disabled={salvando} onClick={()=>excluir(v)} className="text-red-600 underline">Excluir</button></div>}
    </article>)}</div>
  </section>;
}

const cacheLivros = new Map();
function BibliaInterna() {
  const lerPreferencias = () => {try {return JSON.parse(localStorage.getItem('adbras-leitura') || '{}');}catch{return {};}};
  const [preferencias] = useState(lerPreferencias);
  const [indice,setIndice]=useState([]), [livro,setLivro]=useState(preferencias.livro || 'JHN'), [capitulo,setCapitulo]=useState(Number.isInteger(preferencias.capitulo)?preferencias.capitulo:1);
  const [tamanho,setTamanho]=useState(Math.min(28,Math.max(16,Number(preferencias.tamanho)||20))), [escuro,setEscuro]=useState(!!preferencias.escuro);
  const [conteudo,setConteudo]=useState(null), [erro,setErro]=useState(''), [tentativa,setTentativa]=useState(0);
  useEffect(()=>{
    let vivo=true;
    fetch('/indice.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
      if(!vivo)return;setIndice(data);
      const atual=data.find(b=>b.id===livro);
      if(!atual){setLivro('JHN');setCapitulo(1);}else setCapitulo(c=>Math.max(1,Math.min(c,atual.capitulos)));
    }).catch(()=>{if(vivo)setErro('Não foi possível carregar os livros. Confira sua conexão e tente novamente.');});
    return()=>{vivo=false;};
  },[tentativa]);
  useEffect(()=>{
    if(!indice.some(b=>b.id===livro))return;
    let vivo=true;setErro('');setConteudo(null);
    if(cacheLivros.has(livro)){setConteudo(cacheLivros.get(livro));return;}
    fetch('/'+livro+'.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{cacheLivros.set(livro,data);if(vivo)setConteudo(data);}).catch(()=>{if(vivo)setErro('Não foi possível carregar este livro. Confira sua conexão e tente novamente.');});
    return()=>{vivo=false;};
  },[livro,indice,tentativa]);
  useEffect(()=>{try{localStorage.setItem('adbras-leitura',JSON.stringify({livro,capitulo,tamanho,escuro}));}catch{}},[livro,capitulo,tamanho,escuro]);
  const pos=indice.findIndex(b=>b.id===livro), atual=indice[pos];
  function navegar(passo){
    if(!atual)return;
    if(capitulo+passo<1 && pos>0){setLivro(indice[pos-1].id);setCapitulo(indice[pos-1].capitulos);}
    else if(capitulo+passo>atual.capitulos && pos<indice.length-1){setLivro(indice[pos+1].id);setCapitulo(1);}
    else setCapitulo(c=>Math.max(1,Math.min(atual.capitulos,c+passo)));
    document.getElementById('leitor-biblia')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  const controles=<div className="flex justify-between gap-3"><button disabled={!atual || (pos===0 && capitulo===1)} onClick={()=>navegar(-1)} className="border rounded-xl px-3 py-3 text-sm disabled:opacity-40">← Anterior</button><button disabled={!atual || (pos===indice.length-1 && capitulo===atual.capitulos)} onClick={()=>navegar(1)} className="border rounded-xl px-3 py-3 text-sm disabled:opacity-40">Próximo →</button></div>;
  return <section id="leitor-biblia" className="rounded-3xl p-5 space-y-5 shadow-sm" style={{background:escuro?'#101c2c':'#fffdf7',color:escuro?'#eef2f7':'#182638'}}>
    <header><h1 className="text-2xl font-bold">Bíblia Sagrada</h1><p className="text-xs mt-1">Bíblia Livre · Sua leitura, sem anúncios</p></header>
    <div className="flex gap-3"><label className="text-xs flex-1 min-w-0">Livro<select aria-label="Livro da Bíblia" value={livro} onChange={e=>{setLivro(e.target.value);setCapitulo(1);}} className="block w-full mt-1 p-3 border rounded-xl bg-white text-slate-900">{indice.map(b=><option key={b.id} value={b.id}>{b.nome}</option>)}</select></label><label className="text-xs">Capítulo<select aria-label="Capítulo" value={capitulo} onChange={e=>setCapitulo(Number(e.target.value))} className="block mt-1 p-3 border rounded-xl bg-white text-slate-900">{Array.from({length:atual?.capitulos||1},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label></div>
    <div className="flex flex-wrap gap-2"><button aria-label="Diminuir letras" disabled={tamanho<=16} onClick={()=>setTamanho(v=>v-2)} className="border px-3 py-2 rounded-xl">A−</button><button aria-label="Aumentar letras" disabled={tamanho>=28} onClick={()=>setTamanho(v=>v+2)} className="border px-3 py-2 rounded-xl">A+</button><button aria-pressed={escuro} onClick={()=>setEscuro(v=>!v)} className="border px-3 py-2 rounded-xl text-sm">{escuro?'☀ Modo claro':'☾ Modo escuro'}</button></div>
    {controles}
    {erro ? <div role="alert"><p>{erro}</p><button onClick={()=>setTentativa(v=>v+1)} className="underline mt-2">Tentar novamente</button></div> : !conteudo ? <p role="status">Carregando leitura…</p> : <article aria-label={(atual?.nome||'')+' '+capitulo}><h2 className="text-xl font-bold mb-4">{atual?.nome} {capitulo}</h2><div style={{fontSize:tamanho,lineHeight:1.85,fontFamily:'Georgia, serif'}}>{conteudo[capitulo-1]?.map(v=><p key={v.numero} className="mb-3"><sup style={{color:escuro?'#edc36e':'#8a6419',fontSize:'0.65em',marginRight:8}}>{v.numero}</sup>{v.texto}</p>)}</div></article>}
    {controles}<p className="text-xs opacity-70">Livro, capítulo e preferências ficam salvos neste navegador.</p><CreditosBiblia />
  </section>;
}

function CompartilharApp() {
  const url='https://adbras-sede-cubatao.vercel.app/';
  const [mensagem,setMensagem]=useState(''), [manual,setManual]=useState(false);
  async function copiar(){
    try{await navigator.clipboard.writeText(url);setMensagem('Link copiado! Cole na conversa de quem você quer convidar.');setManual(false);}
    catch{setManual(true);setMensagem('Selecione o link abaixo para copiar.');}
  }
  async function compartilhar(){
    if(navigator.share){
      try{await navigator.share({title:'AD Brás Cubatão',text:'Nossa igreja mais perto de você! Acesse a Bíblia, os departamentos, a agenda e encontre uma de nossas igrejas.',url});setMensagem('');return;}
      catch(e){if(e.name==='AbortError')return;}
    }
    await copiar();
  }
  return <section className="mx-5 mt-6 mb-4 p-5 rounded-3xl text-center" style={{background:'#eaf0f6',color:'#061d3b'}}>
    <h2 className="text-lg font-bold">Compartilhe com alguém</h2>
    <p className="text-sm mt-2 mb-4">Leve nossa igreja com você e convide alguém para fazer parte!</p>
    <button onClick={compartilhar} className="w-full rounded-xl p-3 font-bold" style={{background:'#061d3b',color:'white'}}>Compartilhar o app</button>
    <button onClick={copiar} className="text-sm underline mt-3">Copiar link</button>
    <p role="status" className="text-xs mt-2">{mensagem}</p>
    {manual && <input aria-label="Link do app para copiar" readOnly value={url} onFocus={e=>e.target.select()} className="w-full mt-2 p-2 border rounded-lg text-xs" />}
  </section>;
}

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
  const [liderEditando, setLiderEditando] = useState(null);
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
  const [redesForm, setRedesForm] = useState({ instagram_url: '', facebook_url: '', youtube_url: '' });
  const [tipoMidiaDept, setTipoMidiaDept] = useState('foto');

  // 1. LISTA DOS 11 BOTÕES DE ATALHO DO MENU
  const atalhos = [
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
        instagram_url: dept.instagram_url || '',
        facebook_url: dept.facebook_url || '',
        youtube_url: dept.youtube_url || '',
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
      setDepartamentoSelecionado(atual => atual ? departamentosCompletos.find(dept => dept.id === atual.id) || atual : null);
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

  const cancelarEdicaoLider = () => {
    setLiderEditando(null);
    setNomeLider(''); setCargoLider(''); setFotoLider('');
  };

  const editarLider = (lider) => {
    setLiderEditando(lider.id);
    setNomeLider(lider.nome);
    setCargoLider(lider.cargo || '');
    setFotoLider(lider.foto_url || '');
  };

  const excluirLider = async (lider) => {
    if (!window.confirm(`Excluir o cadastro de ${lider.nome} deste departamento?`)) return;
    setSalvandoDept(true);
    try {
      const { data, error } = await supabase.from('departamento_lideres')
        .delete().eq('id', lider.id).eq('departamento_id', departamentoAdmin).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('O cadastro não foi excluído. Confira sua permissão de administrador.');
      if (liderEditando === lider.id) cancelarEdicaoLider();
      await carregarDepartamentos();
    } catch (error) {
      alert(`Não foi possível excluir: ${error.message}`);
    } finally { setSalvandoDept(false); }
  };

  useEffect(() => {
    const dept = departamentos.find(item => item.id === departamentoAdmin);
    setRedesForm({
      instagram_url: dept?.instagram_url || '',
      facebook_url: dept?.facebook_url || '',
      youtube_url: dept?.youtube_url || '',
    });
  }, [departamentoAdmin, departamentos]);

  const redesCampos = [
    { campo: 'instagram_url', nome: 'Instagram', dominios: ['instagram.com'], exemplo: 'https://www.instagram.com/seu.departamento/' },
    { campo: 'facebook_url', nome: 'Facebook', dominios: ['facebook.com', 'fb.com'], exemplo: 'https://www.facebook.com/seu.departamento' },
    { campo: 'youtube_url', nome: 'YouTube', dominios: ['youtube.com', 'youtu.be'], exemplo: 'https://www.youtube.com/@seu.departamento' },
  ];

  const linkRedeValido = (valor, dominios) => {
    try {
      const url = new URL(valor);
      return url.protocol === 'https:' && !url.username && !url.password &&
        dominios.some(dominio => url.hostname === dominio || url.hostname.endsWith('.' + dominio));
    } catch { return false; }
  };

  const salvarRedesDepartamento = async () => {
    const registro = {};
    for (const rede of redesCampos) {
      const valor = redesForm[rede.campo].trim();
      if (valor && !linkRedeValido(valor, rede.dominios)) {
        return alert('Confira o endereço do ' + rede.nome + '. Use um link HTTPS da própria rede.');
      }
      registro[rede.campo] = valor || null;
    }
    setSalvandoDept(true);
    try {
      const { data, error } = await supabase.from('departamentos').update(registro)
        .eq('id', departamentoAdmin).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Nenhum departamento foi atualizado. Confira sua permissão de administrador.');
      await carregarDepartamentos();
      alert('Redes sociais atualizadas!');
    } catch (error) {
      alert('Não foi possível salvar as redes: ' + error.message);
    } finally {
      setSalvandoDept(false);
    }
  };

  const handleCadastroDepartamento = async (e) => {
    e.preventDefault();
    if (tipoCadastroDept === 'midia') return salvarRedesDepartamento();
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

    const editando = tipoCadastroDept === 'lideranca' && liderEditando !== null;
    let resultado;
    try {
      resultado = editando
        ? await supabase.from(tabela).update(registro).eq('id', liderEditando).eq('departamento_id', departamentoAdmin).select('id')
        : await supabase.from(tabela).insert(registro).select('id');
    } catch (error) {
      setSalvandoDept(false);
      return alert(`Não foi possível salvar: ${error.message}`);
    }
    const { data: salvos, error } = resultado;
    setSalvandoDept(false);
    if (error) return alert(`Não foi possível salvar: ${error.message}`);

    if (!salvos?.length) return alert('Nenhum registro foi salvo. Confira sua permissão de administrador.');
    cancelarEdicaoLider();
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

          <VersiculoDoDia />
          <RedesIgreja />
          <CompartilharApp />
          <nav className="bottom-nav">
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

              <LocaisIgrejas admin />
              <RedesIgreja admin />
              <AdminVersiculos />
              {/* PAINEL: GERENCIAR DEPARTAMENTOS */}
              <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div className="border-b pb-2 border-slate-100">
                  <span className="text-[9px] font-black text-amber-600 uppercase">Departamentos</span>
                  <h3 className="text-sm font-bold text-slate-900">Cadastrar conteúdo</h3>
                </div>

                <select value={departamentoAdmin} disabled={salvandoDept} onChange={(e) => { cancelarEdicaoLider(); setDepartamentoAdmin(e.target.value); }} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                  {departamentos.map((dept) => <option key={dept.id} value={dept.id}>{dept.nome} — {dept.sigla}</option>)}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  {[['lideranca', '👤 Liderança'], ['evento', '📅 Evento'], ['aviso', '📢 Aviso'], ['midia', '📸 Fotos e Vídeos']].map(([tipo, label]) => (
                    <button key={tipo} type="button" disabled={salvandoDept} onClick={() => { cancelarEdicaoLider(); setTipoCadastroDept(tipo); }} className={`p-2.5 rounded-xl text-[11px] font-bold ${tipoCadastroDept === tipo ? 'bg-[#0B1E3B] text-white' : 'bg-slate-100 text-slate-600'}`}>{label}</button>
                  ))}
                </div>

                {tipoCadastroDept === 'lideranca' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Líderes cadastrados</h4>
                    {(departamentos.find(dept => dept.id === departamentoAdmin)?.lideres || []).map(lider => (
                      <div key={lider.id} className="p-3 rounded-xl bg-slate-50 space-y-2">
                        <div className="flex items-center gap-3">
                          {lider.foto_url && <img src={lider.foto_url} alt={lider.nome} className="w-12 h-12 rounded-full object-cover" />}
                          <div><p className="text-sm font-bold">{lider.nome}</p><p className="text-xs">{lider.cargo}</p></div>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" disabled={salvandoDept} onClick={() => editarLider(lider)} className="text-sm font-bold text-blue-700">Editar</button>
                          <button type="button" disabled={salvandoDept} onClick={() => excluirLider(lider)} className="text-sm font-bold text-red-700">Excluir</button>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs font-bold">{liderEditando !== null ? 'Editando líder selecionado' : 'Cadastrar novo líder'}</p>
                    {liderEditando !== null && <button type="button" disabled={salvandoDept} onClick={cancelarEdicaoLider} className="text-sm underline">Cancelar edição</button>}
                  </div>
                )}

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
                    <p className="text-xs text-slate-600">Cadastre as redes deste departamento. Deixe em branco para ocultar um botão. Para remover um link, apague o campo e salve.</p>
                    {redesCampos.map(rede => (
                      <label key={rede.campo} className="block text-xs font-bold">
                        {rede.nome}
                        <input type="url" disabled={salvandoDept}
                          value={redesForm[rede.campo]}
                          onChange={e => setRedesForm(atual => ({ ...atual, [rede.campo]: e.target.value }))}
                          placeholder={rede.exemplo}
                          className="mt-1 w-full text-xs p-3 bg-slate-50 border rounded-xl" />
                      </label>
                    ))}
                  </>}

                  <button disabled={salvandoDept} className="w-full bg-amber-400 text-slate-900 py-3 rounded-xl font-extrabold text-xs disabled:opacity-60">{salvandoDept ? 'Salvando...' : (tipoCadastroDept === 'midia' ? 'Salvar redes sociais' : tipoCadastroDept === 'lideranca' && liderEditando !== null ? 'Salvar alterações' : '+ Publicar no Departamento')}</button>
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
          <BibliaInterna />
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
                {dept.id === 'univadem' ? (
                  <img src="/logo-univadem.png" alt="UNIVADEM — Departamento de Homens" className="h-20 w-full object-contain bg-white rounded-2xl p-2" />
                ) : dept.id === 'ujademc' ? (
                  <img src="/logo-ujademc.png" alt="UJADEMC — Juventude AD Brás Cubatão" className="h-20 w-full object-contain bg-white rounded-2xl p-2" />
                ) : dept.id === 'cibec' ? (
                  <img src="/logo-cibec.png" alt="CIBEC — Departamento de Mulheres" className="h-20 w-20 object-contain bg-white rounded-2xl p-2" />
                ) : <span className="text-4xl">{dept.icon}</span>}
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
            {departamentoSelecionado.id === 'univadem' ? (
              <img src="/logo-univadem.png" alt="UNIVADEM — Fé que conecta, missão que transforma" className="w-full h-auto mx-auto object-contain bg-white rounded-3xl p-3" />
            ) : departamentoSelecionado.id === 'ujademc' ? (
              <img src="/logo-ujademc.png" alt="UJADEMC — Juventude AD Brás Cubatão" className="w-full h-auto mx-auto object-contain bg-white rounded-3xl p-3" />
            ) : departamentoSelecionado.id === 'cibec' ? (
              <img src="/logo-cibec.png" alt="CIBEC — Departamento de Mulheres" className="h-36 w-36 mx-auto object-contain bg-white rounded-3xl p-3" />
            ) : <span className="text-6xl">{departamentoSelecionado.icon}</span>}
            <div><h1 className="text-2xl font-extrabold tracking-wide">{departamentoSelecionado.nome}</h1><p className="text-sm text-white/80 mt-1">{departamentoSelecionado.sigla}</p></div>
          </div>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-2">
            <h2 className="font-extrabold text-base">Nosso propósito</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{departamentoSelecionado.descricao}</p>
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Liderança</h2><span className="text-xl">👤</span></div>
            {departamentoSelecionado.lideres.length > 0 ? departamentoSelecionado.lideres.map((lider) => (
              <div key={lider.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl"><div className="w-11 h-11 rounded-full bg-[#0B1E3B] text-white grid place-items-center font-bold">{lider.foto_url ? <img src={lider.foto_url} alt={lider.nome} className="w-11 h-11 rounded-full object-cover" /> : lider.nome.charAt(0)}</div><div><p className="text-sm font-bold">{lider.nome}</p><p className="text-xs text-slate-500">{lider.cargo}</p></div></div>
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
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-base">Fotos e Vídeos</h2><span className="text-xl">📸</span></div>
            {redesCampos.some(rede => linkRedeValido(departamentoSelecionado[rede.campo], rede.dominios)) ? (
              <>
                <p className="text-sm text-slate-600">Acompanhe os registros dos nossos encontros nas redes do departamento.</p>
                <div className="flex flex-col gap-3">
                  {redesCampos.filter(rede => linkRedeValido(departamentoSelecionado[rede.campo], rede.dominios)).map(rede => (
                    <a key={rede.campo} href={departamentoSelecionado[rede.campo]}
                      target="_blank" rel="noopener noreferrer"
                      className="block rounded-xl bg-[#0B1E3B] text-white p-4 text-sm font-bold text-center">
                      Abrir {rede.nome} ↗
                    </a>
                  ))}
                </div>
              </>
            ) : <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl">Em breve, os links das redes sociais estarão disponíveis aqui.</p>}
          </section>

          <button onClick={() => setPaginaAtual('contatos')} className="w-full bg-[#0B1E3B] text-white py-4 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-all">Quero participar 💛</button>
        </main>
      )}

      {/* ================= 11. LOCALIZAÇÃO ================= */}
      {paginaAtual === 'localizacao' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <LocaisIgrejas />
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
