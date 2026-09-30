import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useRef, useState } from 'react';
import './HomeBanners.css';

export function HomeBanners({ supabase }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const start = useRef(null);
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const { data, error } = await supabase.from('home_banners').select('*').eq('active', true).order('display_order').order('created_at').order('id');
      if (alive && !error) { setItems(data || []); setIndex(i => Math.min(i, Math.max(0, (data || []).length - 1))); }
    };
    refresh();
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, 60000);
    const focus = () => { if (!document.hidden) refresh(); };
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('focus', focus); document.removeEventListener('visibilitychange', focus); };
  }, [supabase]);
  useEffect(() => {
    if (items.length < 2 || paused || manualPause) return;
    const timer = setInterval(() => { if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIndex(i => (i + 1) % items.length); }, 6000);
    return () => clearInterval(timer);
  }, [items.length, paused, manualPause, index]);
  const move = delta => setIndex(i => (i + delta + items.length) % items.length);
  if (!items.length) return null;
  return <section className="hb-carousel" aria-label="Divulgações da igreja" aria-roledescription="carrossel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
    <div className="hb-window" onTouchStart={e => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; setPaused(true); }} onTouchCancel={() => { start.current = null; setPaused(false); }} onTouchEnd={e => { const point = start.current; start.current = null; setPaused(false); if (!point || items.length < 2) return; const dx = e.changedTouches[0].clientX - point.x; const dy = e.changedTouches[0].clientY - point.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1); }}>
      <div className="hb-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items.map((item, i) => <div className="hb-slide" key={item.id} aria-hidden={i !== index}><img src={item.image_url} alt={item.description ? `${item.title} — ${item.description}` : item.title} draggable="false" onError={() => setItems(rows => { const next = rows.filter(row => row.id !== item.id); setIndex(n => Math.min(n, Math.max(0, next.length - 1))); return next; })} /></div>)}
      </div>
    </div>
    {items.length > 1 && <div className="hb-controls"><button type="button" aria-label="Banner anterior" onClick={() => move(-1)}>‹</button><div className="hb-dots">{items.map((item, i) => <button type="button" key={item.id} aria-label={`Mostrar banner ${i + 1}: ${item.title}`} aria-current={index === i ? 'true' : undefined} onClick={() => setIndex(i)}><span /></button>)}</div><button type="button" aria-label="Próximo banner" onClick={() => move(1)}>›</button><button type="button" aria-label={manualPause ? 'Retomar avanço automático' : 'Pausar avanço automático'} onClick={() => setManualPause(p => !p)}>{manualPause ? '▶' : 'Ⅱ'}</button></div>}
  </section>;
}

const blank = () => ({ title: '', description: '', display_order: 1, active: true, image_url: '', image_path: null });
const BUCKET = 'home-banners';
export function AdminHomeBanners({ supabase }) {
  const [rows, setRows] = useState([]), [form, setForm] = useState(blank), [id, setId] = useState(null);
  const [file, setFile] = useState(null), [preview, setPreview] = useState(''), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [ready, setReady] = useState(false);
  const input = useRef(null);
  const refresh = async () => {
    const { data, error } = await supabase.from('home_banners').select('*').order('display_order').order('created_at').order('id');
    if (error) throw error;
    setRows(data || []); setReady(true);
  };
  useEffect(() => { refresh().catch(error => setMessage(`Não foi possível carregar os banners: ${error.message}`)); }, [supabase]);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  const reset = () => { setId(null); setForm(blank()); setFile(null); if (input.current) input.current.value = ''; };
  const cleanup = async path => { if (!path) return; const { error } = await supabase.storage.from(BUCKET).remove([path]); if (error) throw new Error(`Registro salvo, mas não foi possível remover uma imagem antiga do Storage: ${error.message}`); };
  const run = async action => { if (busy) return; setBusy(true); setMessage(''); try { await action(); await refresh(); setMessage('Banners atualizados!'); } catch (error) { setMessage(error.message); await refresh().catch(() => {}); } finally { setBusy(false); } };
  const save = e => { e.preventDefault(); run(async () => {
    if (!form.title.trim()) throw new Error('Informe o título.');
    if (!id && !file) throw new Error('Selecione a imagem do banner.');
    let image_url = form.image_url, image_path = form.image_path, uploaded = null;
    if (file) {
      const types = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
      if (!types[file.type] || file.size > 10 * 1024 * 1024) throw new Error('Use JPG, PNG ou WebP de até 10 MB.');
      uploaded = `${crypto.randomUUID()}.${types[file.type]}`;
      const { error } = await supabase.storage.from(BUCKET).upload(uploaded, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      image_path = uploaded; image_url = supabase.storage.from(BUCKET).getPublicUrl(uploaded).data.publicUrl;
    }
    const payload = { title: form.title.trim(), description: form.description.trim(), display_order: Number(form.display_order), active: form.active, image_url, image_path };
    const query = id ? supabase.from('home_banners').update(payload).eq('id', id) : supabase.from('home_banners').insert(payload);
    const { data, error } = await query.select('id').single();
    if (error || !data) { if (uploaded) await cleanup(uploaded); throw error || new Error('Não foi possível salvar.'); }
    const old = form.image_path; reset(); if (uploaded && old) await cleanup(old);
  }); };
  const swap = (index, delta) => run(async () => { const next = [...rows]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; const { error } = await supabase.rpc('reorder_home_banners', { ordered_ids: next.map(row => row.id) }); if (error) throw error; });
  return <section className="hb-admin"><h3>📢 Banners da Home</h3><p>Envie a arte pronta. JPG, PNG ou WebP, até 10 MB. A imagem será exibida inteira.</p><p role="status">{message}</p>
    <form onSubmit={save}><fieldset disabled={busy || !ready}>
      <label>Título<input required maxLength={160} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
      <label>Descrição (opcional)<textarea maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
      <label>Imagem<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
      {(preview || form.image_url) && <img className="hb-preview" src={preview || form.image_url} alt="Prévia do banner" />}
      <label>Ordem<input type="number" min="0" max="2147483647" step="1" required value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} /></label>
      <label className="hb-check"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />Ativo na Home</label>
      <div className="hb-actions"><button type="submit">{busy ? 'Salvando…' : id ? 'Salvar alterações' : 'Adicionar banner'}</button><button type="button" onClick={reset}>Cancelar / limpar</button></div>
    </fieldset></form>
    {!ready && <button type="button" disabled={busy} onClick={() => run(async () => {})}>Tentar carregar novamente</button>}
    {ready && !rows.length && <p>Nenhum banner cadastrado.</p>}
    {rows.map((row, i) => <article key={row.id} className="hb-row"><img className="hb-preview" src={row.image_url} alt={row.title} /><strong>{row.title}</strong><p>Ordem {row.display_order} · {row.active ? 'Ativo' : 'Desativado'}</p><div className="hb-actions">
      <button disabled={busy} onClick={() => { setId(row.id); setForm({ ...row, description: row.description || '' }); setFile(null); if (input.current) input.current.value = ''; }}>Editar</button>
      <button disabled={busy} onClick={() => run(async () => { const { error } = await supabase.from('home_banners').update({ active: !row.active }).eq('id', row.id).select('id').single(); if (error) throw error; if (id === row.id) setForm(f => ({ ...f, active: !row.active })); })}>{row.active ? 'Desativar' : 'Ativar'}</button>
      <button disabled={busy || i === 0} aria-label={`Subir ${row.title}`} onClick={() => swap(i, -1)}>↑ Subir</button><button disabled={busy || i === rows.length - 1} aria-label={`Descer ${row.title}`} onClick={() => swap(i, 1)}>↓ Descer</button>
      <button disabled={busy} onClick={() => { if (window.confirm(`Excluir o banner “${row.title}”?`)) run(async () => { const { error } = await supabase.from('home_banners').delete().eq('id', row.id).select('id').single(); if (error) throw error; if (id === row.id) reset(); await cleanup(row.image_path); }); }}>Excluir</button>
    </div></article>)}
  </section>;
}

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
      <p className="text-xs text-slate-500">O endereço do YouTube também é usado em Cultos e transmissões. Prefira o link do canal, como https://www.youtube.com/@adbrascubatao. Para transmitir um vídeo específico, você também pode usar o link dele.</p>
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
  const [listaAberta,setListaAberta]=useState(false), [igrejaSelecionada,setIgrejaSelecionada]=useState(null), [opcaoAtiva,setOpcaoAtiva]=useState(-1);
  const buscaId=admin?'busca-igrejas-admin':'busca-igrejas-publica';
  function selecionarIgreja(igreja){
    setIgrejaSelecionada(igreja.id);setBusca(igreja.nome);setListaAberta(false);setOpcaoAtiva(-1);
  }
  function verTodas(){setBusca('');setIgrejaSelecionada(null);setListaAberta(false);setOpcaoAtiva(-1);}
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
  const sugestoes=lista.filter(v=>normalizar([v.nome,v.endereco,v.bairro,v.cidade].filter(Boolean).join(' ')).includes(normalizar(igrejaSelecionada?'':busca.trim())));
  const encontrados=igrejaSelecionada?lista.filter(v=>v.id===igrejaSelecionada):sugestoes;
  useEffect(()=>{setOpcaoAtiva(-1);},[lista]);
  useEffect(()=>{
    if(listaAberta && opcaoAtiva>=0)document.getElementById(buscaId+'-opcao-'+opcaoAtiva)?.scrollIntoView({block:'nearest'});
  },[listaAberta,opcaoAtiva,buscaId]);
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
    <div className="relative" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)){setListaAberta(false);setOpcaoAtiva(-1);}}}>
      <label htmlFor={buscaId} className="block text-sm">Buscar por igreja, bairro ou cidade</label>
      <div className="relative mt-2">
        <input id={buscaId} role="combobox" aria-autocomplete="list" aria-expanded={listaAberta} aria-controls={buscaId+'-lista'} aria-activedescendant={listaAberta && opcaoAtiva>=0?buscaId+'-opcao-'+opcaoAtiva:undefined}
          autoComplete="off" value={busca} placeholder="Selecione uma igreja ou digite para buscar"
          onFocus={()=>{setListaAberta(true);setOpcaoAtiva(-1);}}
          onClick={()=>setListaAberta(true)}
          onChange={e=>{setBusca(e.target.value);setIgrejaSelecionada(null);setListaAberta(true);setOpcaoAtiva(-1);}}
          onKeyDown={e=>{
            if(e.key==='ArrowDown' || e.key==='ArrowUp'){
              e.preventDefault();setListaAberta(true);
              setOpcaoAtiva(atual=>!sugestoes.length?-1:!listaAberta?(e.key==='ArrowDown'?0:sugestoes.length-1):e.key==='ArrowDown'?Math.min(atual+1,sugestoes.length-1):atual<0?sugestoes.length-1:Math.max(0,atual-1));
            }else if(e.key==='Enter' && listaAberta && opcaoAtiva>=0 && sugestoes[opcaoAtiva]){
              e.preventDefault();selecionarIgreja(sugestoes[opcaoAtiva]);
            }else if(e.key==='Escape'){setListaAberta(false);setOpcaoAtiva(-1);}
          }} className="block w-full border rounded-xl p-3 pr-10 bg-white text-sm" />
        <span aria-hidden="true" className="absolute right-4 top-3 pointer-events-none text-slate-500">▾</span>
      </div>
      {listaAberta && <div className="absolute left-0 right-0 z-30 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <ul id={buscaId+'-lista'} role="listbox" aria-label="Igrejas cadastradas" className="max-h-64 overflow-y-auto m-0 p-1 list-none">
          {sugestoes.map((v,i)=><li key={v.id} id={buscaId+'-opcao-'+i} role="option" aria-selected={opcaoAtiva===i}
            onMouseDown={e=>e.preventDefault()} onClick={()=>selecionarIgreja(v)}
            className={'cursor-pointer rounded-lg p-3 text-sm '+(opcaoAtiva===i?'bg-blue-50 text-[#0B1E3B]':'hover:bg-slate-50')}>
            <span className="block font-bold">{v.nome}{v.sede?' · Sede':''}</span>
            <span className="block text-xs text-slate-500 mt-1">{[v.bairro,v.cidade,v.uf].filter(Boolean).join(' · ')}</span>
          </li>)}
        </ul>
        {!sugestoes.length && <p role="status" className="p-3 text-sm text-slate-500">{carregando?'Carregando igrejas…':'Nenhuma igreja encontrada.'}</p>}
        <button type="button" onClick={verTodas} className="w-full border-t p-3 text-sm font-bold text-[#0B1E3B] text-left">Ver todas as igrejas</button>
      </div>}
      {(busca || igrejaSelecionada) && <button type="button" onClick={verTodas} className="mt-2 text-sm underline text-[#0B1E3B]">Ver todas as igrejas</button>}
    </div>
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

const CURSO_PADRAO = {
  titulo:'Curso Introdutório de Teologia Sistemática',
  descricao:'Acesse as aulas e os materiais de estudo. Cresça no conhecimento da Palavra de Deus!',
  url:'https://sites.google.com/view/adbrascubatao/home',
  ativo:true
};
function linkCursoValido(valor){
  try{const u=new URL(valor);return u.protocol==='https:' && !u.username && !u.password;}catch{return false;}
}
function MateriaisEstudo({admin=false}){
  const [curso,setCurso]=useState(CURSO_PADRAO), [carregando,setCarregando]=useState(true), [erro,setErro]=useState(''), [mensagem,setMensagem]=useState(''), [salvando,setSalvando]=useState(false);
  async function carregar(){
    setCarregando(true);setErro('');
    try{
      const {data,error}=await supabase.from('estudos_portal').select('titulo,descricao,url,ativo').eq('id',1).maybeSingle();
      if(error)throw error;
      if(!data)throw new Error('Cadastro do portal não encontrado.');
      setCurso(data);
    }catch(e){setErro('Não foi possível carregar a configuração dos materiais. Confira o SQL e tente novamente.');}
    finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[]);
  async function salvar(e){
    e.preventDefault();setSalvando(true);setMensagem('');
    try{
      const valores={titulo:curso.titulo.trim(),descricao:curso.descricao.trim(),url:curso.url.trim(),ativo:curso.ativo};
      if(!valores.titulo || !linkCursoValido(valores.url))throw new Error('Preencha o título e um link completo iniciado por https://.');
      const {data,error}=await supabase.from('estudos_portal').update(valores).eq('id',1).select('id');
      if(error)throw error;
      if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      setCurso(valores);setMensagem('Salvo! O card será atualizado quando a página de Estudos for aberta novamente.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  if(admin)return <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-3">
    <h3 className="font-bold text-slate-900">Portal de materiais — Estudos / EBD</h3>
    <p className="text-xs text-slate-500">Este card abre seu site de aulas. Publique novas apostilas no mesmo site e mantenha o link. Os arquivos devem estar liberados para leitura pelo público.</p>
    {erro && <p role="alert" className="text-sm text-red-700">{erro}<button type="button" onClick={carregar} className="block underline">Tentar novamente</button></p>}
    <form onSubmit={salvar}>
      <fieldset disabled={carregando || salvando || !!erro} className="space-y-3">
        <label className="block text-xs">Título<input required maxLength={160} value={curso.titulo} onChange={e=>setCurso({...curso,titulo:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Descrição<textarea rows={3} maxLength={600} value={curso.descricao} onChange={e=>setCurso({...curso,descricao:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Link dos materiais<input required type="url" value={curso.url} onChange={e=>setCurso({...curso,url:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-sm"><input type="checkbox" checked={curso.ativo} onChange={e=>setCurso({...curso,ativo:e.target.checked})} /> Mostrar card em Estudos / EBD</label>
        <button className="bg-[#0B1E3B] text-white px-4 py-3 rounded-xl text-sm font-bold">{carregando?'Carregando…':salvando?'Salvando…':'Salvar portal de materiais'}</button>
      </fieldset>
    </form><p role="status" className="text-sm">{mensagem}</p>
  </section>;
  if(carregando)return <p role="status" className="text-sm text-slate-500">Carregando materiais…</p>;
  if(erro)return <div role="alert" className="bg-white p-4 rounded-xl text-sm">Não foi possível carregar os materiais.<button type="button" onClick={carregar} className="block underline mt-2">Tentar novamente</button></div>;
  if(!curso.ativo || !linkCursoValido(curso.url))return null;
  return <section className="bg-[#0B1E3B] text-white p-6 rounded-3xl shadow-sm space-y-3">
    <span aria-hidden="true" className="text-3xl">📖</span>
    <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Aulas e apostilas</p>
    <h2 className="text-xl font-bold leading-snug">{curso.titulo}</h2>
    <p className="text-sm leading-relaxed whitespace-pre-line">{curso.descricao}</p>
    <a href={curso.url} target="_blank" rel="noopener noreferrer" className="block bg-amber-400 text-slate-900 p-3 rounded-xl text-sm font-bold text-center">Ver todos os materiais ↗</a>
    <p className="text-xs text-slate-300">Abre o site de materiais em uma nova aba.</p>
  </section>;
}

function Apostilas({admin=false}){
  const novo=()=>({titulo:'',descricao:'',url:'',ordem:0,ativo:true});
  const [itens,setItens]=useState([]),[form,setForm]=useState(novo),[id,setId]=useState(null),[carregando,setCarregando]=useState(true),[salvando,setSalvando]=useState(false),[erro,setErro]=useState(''),[mensagem,setMensagem]=useState('');
  const formRef=React.useRef(null);
  async function carregar(){
    setCarregando(true);setErro('');
    try{
      let q=supabase.from('estudos_apostilas').select('*').order('ordem').order('created_at');
      if(!admin)q=q.eq('ativo',true);
      const {data,error}=await q;if(error)throw error;setItens(data||[]);
    }catch(e){setErro('Não foi possível carregar as apostilas. Tente novamente.');}
    finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[admin]);
  function limpar(){setForm(novo());setId(null);}
  async function salvar(e){
    e.preventDefault();setSalvando(true);setMensagem('');
    try{
      const dados={...form,titulo:form.titulo.trim(),descricao:form.descricao.trim(),url:form.url.trim(),ordem:Number(form.ordem)};
      if(!dados.titulo || !linkCursoValido(dados.url))throw new Error('Preencha o título e um link iniciado por https://.');
      if(!Number.isInteger(dados.ordem)||dados.ordem<0||dados.ordem>9999)throw new Error('A ordem deve ser um número inteiro de 0 a 9999.');
      const {data,error}=id?await supabase.from('estudos_apostilas').update(dados).eq('id',id).select('id'):await supabase.from('estudos_apostilas').insert(dados).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      limpar();await carregar();setMensagem('Apostila salva! Abra novamente Estudos / EBD para ver a atualização.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  async function excluir(item){
    if(!window.confirm('Excluir o card “'+item.titulo+'”? O arquivo no Drive não será apagado.'))return;
    setSalvando(true);setMensagem('');
    try{
      const {data,error}=await supabase.from('estudos_apostilas').delete().eq('id',item.id).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Nada foi excluído. Confira sua permissão.');
      if(id===item.id)limpar();await carregar();setMensagem('Card excluído. O arquivo original foi mantido.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(false);}
  }
  return <section className="space-y-4">
    {admin && <div ref={formRef} className="bg-white p-5 rounded-3xl border space-y-3">
      <h3 className="font-bold">Apostilas — Estudos / EBD</h3>
      <p className="text-xs text-slate-500">Cada card abre um material. Cole o link direto do arquivo e libere o acesso de leitura no Drive. A ordem menor aparece primeiro.</p>
      <form onSubmit={salvar}><fieldset disabled={salvando || carregando || !!erro} className="space-y-3">
        <label className="block text-xs">Título<input required maxLength={160} value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-xs">Descrição<textarea maxLength={1000} rows={3} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-xs">Link direto da apostila<input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-xs">Ordem de exibição<input required type="number" min={0} max={9999} step={1} value={form.ordem} onChange={e=>setForm({...form,ordem:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-sm"><input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})} /> Mostrar no app</label>
        <button className="bg-[#0B1E3B] text-white rounded-xl p-3 text-sm font-bold">{salvando?'Salvando…':id?'Salvar alterações':'Cadastrar apostila'}</button>
        {id && <button type="button" onClick={limpar} className="ml-3 underline text-sm">Cancelar edição</button>}
      </fieldset></form><p role="status" className="text-sm">{mensagem}</p>
    </div>}
    {carregando && <p role="status" className="text-sm">Carregando apostilas…</p>}
    {erro && <div role="alert" className="bg-amber-50 p-4 rounded-xl text-sm">{erro}<button type="button" onClick={carregar} className="block underline mt-2">Tentar novamente</button></div>}
    {!carregando && !erro && !itens.length && <p className="text-sm text-slate-500">{admin?'Cadastre sua primeira apostila acima.':'Em breve, novos materiais de estudo estarão disponíveis aqui.'}</p>}
    {!carregando && !erro && itens.map(item=><article key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <span aria-hidden="true" className="text-3xl">📖</span>
      <h2 className="font-bold text-lg text-[#0B1E3B]">{item.titulo}</h2>
      {item.descricao && <p className="text-sm text-slate-600 whitespace-pre-line">{item.descricao}</p>}
      {linkCursoValido(item.url) && <a href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-[#0B1E3B] text-white text-center p-3 rounded-xl text-sm font-bold">Abrir material ↗</a>}
      {admin && <div className="flex flex-wrap gap-3 items-center text-xs"><span>{item.ativo?'Visível':'Oculta'} · Ordem {item.ordem}</span><button disabled={salvando} className="underline" onClick={()=>{setId(item.id);setForm({titulo:item.titulo,descricao:item.descricao,url:item.url,ordem:item.ordem,ativo:item.ativo});setMensagem('Editando '+item.titulo);formRef.current?.scrollIntoView({behavior:'smooth',block:'start'});}}>Editar</button><button disabled={salvando} onClick={()=>excluir(item)} className="text-red-700 underline">Excluir</button></div>}
    </article>)}
  </section>;
}

function AgendaCampo({gestao=false,departamentos=[],aoSalvar}){
  const novo=()=>({origem:'campo',titulo:'',data:diaBrasilia(),horario:'',local:'',descricao:'',cancelado:false});
  const [itens,setItens]=useState([]),[origem,setOrigem]=useState('todos'),[mes,setMes]=useState(''),[passados,setPassados]=useState(false),[erro,setErro]=useState(''),[carregando,setCarregando]=useState(true),[form,setForm]=useState(novo),[id,setId]=useState(null),[ocupado,setOcupado]=useState(false),[mensagem,setMensagem]=useState('');
  const ref=React.useRef(null);
  async function carregar(){
    setCarregando(true);setErro('');
    try{
      const [campo,depts]=await Promise.all([supabase.from('agenda_campo').select('*').order('data'),supabase.from('departamento_eventos').select('*').eq('ativo',true).order('data')]);
      if(campo.error || depts.error)throw new Error('Não foi possível carregar toda a agenda.');
      setItens([...(campo.data||[]).map(v=>({...v,origem:'campo',chave:'campo-'+v.id})),...(depts.data||[]).map(v=>({...v,origem:v.departamento_id,chave:'dept-'+v.id,cancelado:!!v.cancelado}))].sort((a,b)=>(a.data+' '+(a.horario||'')).localeCompare(b.data+' '+(b.horario||''))));
    }catch(e){setErro(e.message);}finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[]);
  function limpar(){setId(null);setForm(novo());}
  async function salvar(e){
    e.preventDefault();setOcupado(true);setMensagem('');
    try{
      const {origem:destino,...campos}=form;
      if(destino!=='campo'&&!departamentos.some(d=>d.id===destino))throw new Error('Selecione um departamento válido.');
      const tabela=destino==='campo'?'agenda_campo':'departamento_eventos';
      const dados={...campos,titulo:form.titulo.trim(),local:form.local.trim(),descricao:form.descricao.trim(),horario:form.horario||null};
      if(destino!=='campo')dados.departamento_id=destino;
      if(!dados.titulo || !dados.data)throw new Error('Preencha título e data.');
      const {data,error}=id?await supabase.from(tabela).update(dados).eq('id',id).select('id'):await supabase.from(tabela).insert(dados).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Sem permissão para salvar.');
      limpar();await carregar();if(aoSalvar)await aoSalvar();setMensagem('Evento salvo. A Agenda Geral e o cadastro do departamento usam a mesma informação.');
    }catch(e){setMensagem(e.message);}finally{setOcupado(false);}
  }
  const nomeOrigem=o=>o==='campo'?'Campo':departamentos.find(d=>d.id===o)?.nome||o;
  const visiveis=itens.filter(v=>(origem==='todos'||v.origem===origem)&&(!mes||v.data?.startsWith(mes))&&(passados||v.data>=diaBrasilia()));
  return <section className="space-y-4">
    <div className="bg-[#061d3b] text-white rounded-3xl p-6 space-y-2"><span className="text-3xl">📅</span><h1 className="text-2xl font-bold">Agenda Geral do Campo</h1><p className="text-sm">Caminhe com a gente! Confira a programação do campo e dos nossos departamentos.</p></div>
    {gestao && <div ref={ref} className="bg-white p-5 rounded-3xl space-y-3"><h2 className="font-bold">{id?'Editar evento':'Cadastrar evento'}</h2><p className="text-xs text-slate-500">Selecione Campo ou um departamento. As alterações são feitas no cadastro original. Para cancelar, use Editar e marque Evento cancelado; desmarque para reativar.</p>
      <form onSubmit={salvar}><fieldset disabled={ocupado} className="space-y-3">
        <label className="block text-xs">Responsável pelo evento<select disabled={!!id} value={form.origem} onChange={e=>setForm({...form,origem:e.target.value})} className="block w-full border p-3 rounded-xl"><option value="campo">Campo</option>{departamentos.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</select></label>
        <label className="block text-xs">Título<input required maxLength={160} value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs">Data<input required type="date" value={form.data} onChange={e=>setForm({...form,data:e.target.value})} className="block w-full border p-3 rounded-xl" /></label><label className="text-xs">Horário<input type="time" value={form.horario} onChange={e=>setForm({...form,horario:e.target.value})} className="block w-full border p-3 rounded-xl" /></label></div>
        <label className="block text-xs">Local<input maxLength={300} value={form.local} onChange={e=>setForm({...form,local:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-xs">Descrição<textarea maxLength={2000} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-sm"><input type="checkbox" checked={form.cancelado} onChange={e=>setForm({...form,cancelado:e.target.checked})} /> Evento cancelado (continua visível com aviso)</label>
        <button className="bg-[#061d3b] text-white p-3 rounded-xl text-sm">{ocupado?'Salvando…':id?'Salvar alterações':'Publicar evento'}</button>{id && <button type="button" onClick={limpar} className="ml-3 underline text-sm">Cancelar edição</button>}
      </fieldset></form><p role="status" className="text-sm">{mensagem}</p>
    </div>}
    <div className="bg-white rounded-2xl p-4 space-y-3"><label className="block text-sm">Programação<select value={origem} onChange={e=>setOrigem(e.target.value)} className="block w-full border p-3 rounded-xl"><option value="todos">Todos</option><option value="campo">Campo</option>{departamentos.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}</select></label>
      <label className="block text-sm">Filtrar por mês<input type="month" value={mes} onChange={e=>setMes(e.target.value)} className="block w-full border p-3 rounded-xl" /></label>
      <label className="block text-sm"><input type="checkbox" checked={passados} onChange={e=>setPassados(e.target.checked)} /> Incluir eventos anteriores</label>
      <div className="flex gap-4 text-sm"><button onClick={()=>{setOrigem('todos');setMes('');setPassados(false);}} className="underline">Limpar filtros</button><button onClick={carregar} disabled={carregando} className="underline">Atualizar agenda</button></div>
    </div>
    {carregando?<p role="status">Carregando agenda…</p>:erro?<p role="alert" className="bg-amber-50 p-4 rounded-xl">{erro} Use “Atualizar agenda” para tentar novamente.</p>:!visiveis.length?<p className="bg-white p-5 rounded-2xl text-sm">Nenhum evento para estes filtros.</p>:visiveis.map(v=><article key={v.chave} className="bg-white p-5 rounded-3xl border border-slate-100 space-y-2">
      <span className="text-xs font-bold text-amber-700">{nomeOrigem(v.origem)}</span>{v.cancelado && <p className="text-red-700 font-bold">EVENTO CANCELADO</p>}
      <h2 className="text-lg font-bold">{v.titulo}</h2><p className="text-sm">📅 {v.data?.split('-').reverse().join('/')} · {v.horario?v.horario.slice(0,5):'Horário a confirmar'}</p><p className="text-sm">📍 {v.local||'Local a confirmar'}</p>{v.descricao && <p className="text-sm whitespace-pre-line text-slate-600">{v.descricao}</p>}
      {gestao && <button disabled={ocupado} className="underline text-sm" onClick={()=>{setId(v.id);setForm({origem:v.origem,titulo:v.titulo,data:v.data,horario:v.horario?.slice(0,5)||'',local:v.local||'',descricao:v.descricao||'',cancelado:!!v.cancelado});ref.current?.scrollIntoView({behavior:'smooth'});}}>Editar evento</button>}
    </article>)}
  </section>;
}
function AcessoSecretaria(){
  const [email,setEmail]=useState(''),[lista,setLista]=useState([]),[mensagem,setMensagem]=useState(''),[ocupado,setOcupado]=useState(false);
  async function carregar(){const {data,error}=await supabase.from('secretaria_users').select('user_id,email');if(error)setMensagem('Execute o SQL da agenda para configurar os acessos.');else setLista(data||[]);}
  useEffect(()=>{carregar();},[]);
  async function alterar(alvo,permitir){
    if(!permitir && !window.confirm('Remover o acesso da secretaria de '+alvo+'?'))return;
    setOcupado(true);setMensagem('');
    const {error}=await supabase.rpc('gerenciar_secretaria',{email_alvo:alvo.trim(),permitir});
    if(error)setMensagem(error.message);else{setEmail('');await carregar();setMensagem(permitir?'Acesso liberado.':'Acesso removido.');}setOcupado(false);
  }
  return <section className="bg-white rounded-3xl p-5 space-y-3"><h3 className="font-bold">Acesso da secretaria</h3><p className="text-xs text-slate-500">Primeiro crie a conta em Supabase → Authentication → Users. Depois informe o e-mail aqui. Essa permissão libera a gestão dos eventos do campo e dos departamentos, sem acesso às demais configurações.</p><form onSubmit={e=>{e.preventDefault();alterar(email,true);}} className="space-y-3"><input aria-label="E-mail da secretaria" required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-3 rounded-xl w-full" placeholder="E-mail da secretaria"/><button disabled={ocupado} className="bg-[#061d3b] text-white p-3 rounded-xl">Liberar acesso</button></form><p role="status" className="text-sm">{mensagem}</p>{lista.map(v=><div key={v.user_id} className="text-sm flex justify-between gap-2"><span className="break-all">{v.email}</span><button disabled={ocupado} className="text-red-700 underline" onClick={()=>alterar(v.email,false)}>Remover</button></div>)}</section>;
}

const CATEGORIAS_MURAL=[['achados','🔎','Achados e perdidos'],['emprego','💼','Vagas de emprego'],['doacoes','🎁','Doações'],['ajuda','🤝','Pedidos de ajuda'],['comunicados','📢','Comunicados']];
function MuralComunidade({admin=false}){
  const novo=()=>({titulo:'',categoria:'comunicados',conteudo:'',contato:'',link:'',publicado_em:diaBrasilia(),ativo:true,resolvido:false});
  const [itens,setItens]=useState([]),[form,setForm]=useState(novo),[id,setId]=useState(null),[filtro,setFiltro]=useState('todos'),[busca,setBusca]=useState(''),[carregando,setCarregando]=useState(true),[ocupado,setOcupado]=useState(false),[erro,setErro]=useState(''),[mensagem,setMensagem]=useState('');
  const ref=React.useRef(null);
  async function carregar(){
    setCarregando(true);setErro('');
    try{
      let q=supabase.from('mural_comunidade').select('*').order('publicado_em',{ascending:false}).order('created_at',{ascending:false});
      if(!admin)q=q.eq('ativo',true).lte('publicado_em',diaBrasilia());
      const {data,error}=await q;if(error)throw error;setItens(data||[]);
    }catch{setErro('Não foi possível carregar o mural. Tente novamente.');}finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[admin]);
  function limpar(){setId(null);setForm(novo());}
  async function salvar(e){
    e.preventDefault();setOcupado(true);setMensagem('');
    try{
      const dados={...form,titulo:form.titulo.trim(),conteudo:form.conteudo.trim(),contato:form.contato.trim(),link:form.link.trim()};
      if(!dados.titulo||!dados.conteudo||!dados.publicado_em)throw new Error('Preencha título, mensagem e data.');
      if(dados.link && !linkCursoValido(dados.link))throw new Error('Use um link completo iniciado por https://.');
      const {data,error}=id?await supabase.from('mural_comunidade').update(dados).eq('id',id).select('id'):await supabase.from('mural_comunidade').insert(dados).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      limpar();await carregar();setMensagem('Aviso salvo! Abra novamente o mural para ver a atualização.');
    }catch(e){setMensagem(e.message);}finally{setOcupado(false);}
  }
  async function acao(item,tipo){
    if(tipo==='excluir'&&!window.confirm('Excluir definitivamente o aviso “'+item.titulo+'”?'))return;
    setOcupado(true);setMensagem('');
    try{
      const q=tipo==='excluir'?supabase.from('mural_comunidade').delete().eq('id',item.id):supabase.from('mural_comunidade').update(tipo==='visibilidade'?{ativo:!item.ativo}:{resolvido:!item.resolvido}).eq('id',item.id);
      const {data,error}=await q.select('id');if(error)throw error;if(!data?.length)throw new Error('Não foi possível alterar este aviso. Confira sua permissão.');
      if(id===item.id)limpar();await carregar();setMensagem(tipo==='excluir'?'Aviso excluído.':'Aviso atualizado.');
    }catch(e){setMensagem(e.message);}finally{setOcupado(false);}
  }
  const normalizar=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const visiveis=itens.filter(v=>(filtro==='todos'||v.categoria===filtro)&&normalizar(v.titulo+' '+v.conteudo).includes(normalizar(busca.trim())));
  return <section className="space-y-4">
    {!admin && <><div className="bg-[#061d3b] text-white p-6 rounded-3xl space-y-3"><span aria-hidden="true" className="text-4xl">🤝</span><p className="text-xs uppercase tracking-wider text-amber-300 font-bold">Nossa comunidade</p><h1 className="text-2xl font-bold">Cuidar também é compartilhar</h1><p className="text-sm leading-relaxed">Encontrou algo na igreja? Tem uma oportunidade de trabalho ou algo para doar? Este é o nosso espaço de cuidado, ajuda e boas notícias.</p></div><div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-slate-700">Quer compartilhar um aviso? Procure a secretaria da igreja para encaminhá-lo à equipe responsável pelo mural. 💛</div></>}
    {admin && <div ref={ref} className="bg-white p-5 rounded-3xl border space-y-3"><h2 className="font-bold text-lg">Mural da comunidade</h2><p className="text-xs text-slate-500">Publique oportunidades, doações e avisos. Use apenas contatos autorizados para divulgação. Datas futuras deixam o aviso agendado.</p><h3 className="font-bold text-sm">{id?'Editar aviso':'Novo aviso'}</h3>
      <form onSubmit={salvar}><fieldset disabled={ocupado||carregando||!!erro} className="space-y-3">
        <label className="block text-xs">Categoria<select value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} className="block w-full border rounded-xl p-3">{CATEGORIAS_MURAL.map(([v,icone,nome])=><option key={v} value={v}>{icone} {nome}</option>)}</select></label>
        <label className="block text-xs">Título<input required maxLength={160} value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} className="block w-full border rounded-xl p-3" placeholder="Ex.: Encontramos uma Bíblia após o culto" /></label>
        <label className="block text-xs">Mensagem<textarea required rows={4} maxLength={4000} value={form.conteudo} onChange={e=>setForm({...form,conteudo:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Data da publicação<input required type="date" value={form.publicado_em} onChange={e=>setForm({...form,publicado_em:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Contato ou orientação (opcional)<input maxLength={300} value={form.contato} onChange={e=>setForm({...form,contato:e.target.value})} className="block w-full border rounded-xl p-3" placeholder="Ex.: Procure a secretaria após o culto" /></label>
        <label className="block text-xs">Link para contato ou detalhes (opcional)<input type="url" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} className="block w-full border rounded-xl p-3" placeholder="https://..." /></label>
        <label className="block text-sm"><input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})} /> Mostrar no mural</label>
        <label className="block text-sm"><input type="checkbox" checked={form.resolvido} onChange={e=>setForm({...form,resolvido:e.target.checked})} /> Resolvido / encerrado</label>
        <button className="bg-[#061d3b] text-white p-3 rounded-xl text-sm font-bold">{ocupado?'Salvando…':id?'Salvar alterações':'Salvar aviso'}</button>{id && <button type="button" onClick={limpar} className="ml-3 underline text-sm">Cancelar edição</button>}
      </fieldset></form><p role="status" className="text-sm">{mensagem}</p>
    </div>}
    <div className="bg-white p-4 rounded-2xl space-y-3"><label className="block text-sm">O que você procura?<select value={filtro} onChange={e=>setFiltro(e.target.value)} className="block w-full border rounded-xl p-3"><option value="todos">Todos os avisos</option>{CATEGORIAS_MURAL.map(([v,i,n])=><option key={v} value={v}>{i} {n}</option>)}</select></label><input aria-label="Buscar no mural" value={busca} onChange={e=>setBusca(e.target.value)} className="w-full border rounded-xl p-3 text-sm" placeholder="Buscar um aviso…" /><button onClick={carregar} disabled={carregando||ocupado} className="underline text-sm">Atualizar mural</button></div>
    {carregando?<p role="status">Carregando avisos…</p>:erro?<div role="alert" className="bg-amber-50 rounded-xl p-4 text-sm">{erro}</div>:!visiveis.length?<div className="bg-white rounded-3xl p-6 text-center space-y-2"><span className="text-3xl">💛</span><h2 className="font-bold">{busca||filtro!=='todos'?'Nenhum aviso encontrado':'Nosso mural está de portas abertas'}</h2><p className="text-sm text-slate-500">{busca||filtro!=='todos'?'Experimente outro termo ou categoria.':'Assim que houver novidades, elas aparecerão aqui. Juntos, cuidamos uns dos outros.'}</p></div>:visiveis.map(item=>{
      const cat=CATEGORIAS_MURAL.find(c=>c[0]===item.categoria);
      return <article key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3 break-words"><div className="flex flex-wrap gap-2"><span className="bg-amber-50 text-amber-800 rounded-full px-3 py-1 text-xs font-bold">{cat?.[1]} {cat?.[2]}</span>{item.resolvido&&<span className="bg-emerald-50 text-emerald-800 rounded-full px-3 py-1 text-xs font-bold">Resolvido / encerrado</span>}{admin&&<span className="text-xs text-slate-500">{!item.ativo?'Oculto':item.publicado_em>diaBrasilia()?'Agendado':'Visível'}</span>}</div><h2 className="font-bold text-lg text-[#061d3b]">{item.titulo}</h2><p className="text-xs text-slate-500">{item.publicado_em>diaBrasilia()?'Publicação prevista para':'Publicado em'} {item.publicado_em.split('-').reverse().join('/')}</p><p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{item.conteudo}</p>{item.contato&&<p className="bg-slate-50 rounded-xl p-3 text-sm whitespace-pre-line">💬 {item.contato}</p>}{!item.resolvido&&item.link&&linkCursoValido(item.link)&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="block bg-[#061d3b] text-white rounded-xl p-3 text-center text-sm font-bold">Contato / mais informações ↗</a>}
      {admin&&<div className="flex flex-wrap gap-3 border-t pt-3 text-sm"><button disabled={ocupado} className="underline" onClick={()=>{setId(item.id);setForm({titulo:item.titulo,categoria:item.categoria,conteudo:item.conteudo,contato:item.contato,link:item.link,publicado_em:item.publicado_em,ativo:item.ativo,resolvido:item.resolvido});setMensagem('Editando '+item.titulo);ref.current?.scrollIntoView({behavior:'smooth'});}}>Editar</button><button disabled={ocupado} className="underline" onClick={()=>acao(item,'visibilidade')}>{item.ativo?'Ocultar':'Mostrar'}</button><button disabled={ocupado} className="underline" onClick={()=>acao(item,'resolver')}>{item.resolvido?'Reabrir':'Marcar resolvido'}</button><button disabled={ocupado} className="text-red-700 underline" onClick={()=>acao(item,'excluir')}>Excluir</button></div>}
      </article>;
    })}
  </section>;
}

function destinoCultoYoutube(valor){
  const config=REDES_IGREJA_CAMPOS.find(r=>r.campo==='youtube_url');
  if(!valor || !redeIgrejaValida(valor,config))return null;
  const url=new URL(valor);
  const partes=url.pathname.split('/').filter(Boolean);
  const canal=partes[0]?.startsWith('@')?'/'+partes[0]:['channel','c','user'].includes(partes[0]) && partes[1]?'/'+partes[0]+'/'+partes[1]:null;
  if(canal){url.pathname=canal+'/live';url.search='';url.hash='';}
  return url.toString();
}
function CultosYoutube(){
  const [url,setUrl]=useState(''),[carregando,setCarregando]=useState(true),[erro,setErro]=useState('');
  async function carregar(){
    setCarregando(true);setErro('');
    try{
      const {data,error}=await supabase.from('redes_igreja').select('youtube_url').eq('id',1).maybeSingle();
      if(error || !data)throw new Error();
      setUrl(data.youtube_url||'');
    }catch{setErro('Não foi possível carregar o link da transmissão. Tente novamente.');}finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[]);
  const destino=destinoCultoYoutube(url);
  return <section className="space-y-4">
    <div className="bg-[#061d3b] text-white rounded-3xl p-6 space-y-3"><span aria-hidden="true" className="text-4xl">📺</span><h1 className="text-2xl font-bold">Cultos e transmissões</h1><p className="text-sm leading-relaxed">Mesmo à distância, vamos adorar juntos. Acompanhe os cultos da AD Brás Cubatão pelo YouTube.</p></div>
    <div className="bg-white rounded-3xl p-6 space-y-4 shadow-sm">
      {carregando?<p role="status" className="text-sm">Carregando transmissão…</p>:erro?<div role="alert" className="text-sm"><p>{erro}</p><button onClick={carregar} className="underline mt-3">Tentar novamente</button></div>:destino?<>
        <a href={destino} target="_blank" rel="noopener noreferrer" className="block bg-red-600 text-white rounded-xl p-4 text-sm font-bold text-center">▶ Acessar transmissão no YouTube</a>
        <p className="text-sm text-slate-600 leading-relaxed">As transmissões acontecem nos horários dos cultos. Este botão abre o YouTube; a disponibilidade da live é exibida lá.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="block border border-slate-200 rounded-xl p-3 text-sm text-center font-bold text-[#061d3b]">Visitar nosso YouTube</a>
      </>:<p className="text-sm text-slate-600">Em breve, o link das nossas transmissões estará disponível aqui. Será uma alegria ter você com a gente!</p>}
    </div>
  </section>;
}

function AtalhoPodcast({abrir}){
  const [visivel,setVisivel]=useState(false);
  useEffect(()=>{let ativo=true;supabase.from('podcast_episodios').select('id').eq('publicado',true).lte('data_publicacao',diaBrasilia()).limit(1).then(({data,error})=>{if(ativo)setVisivel(!error&&!!data?.length);});return()=>{ativo=false;};},[]);
  return visivel?<button onClick={abrir} className="quick-item"><span className="quick-icon" aria-hidden="true">🎙️</span><span className="quick-label">Podcast</span></button>:null;
}
function PodcastIgreja({admin=false}){
  const novo=()=>({titulo:'',descricao:'',tipo:'video',url:'',capa_url:'',data_publicacao:diaBrasilia(),publicado:false});
  const [itens,setItens]=useState([]),[form,setForm]=useState(novo),[id,setId]=useState(null),[carregando,setCarregando]=useState(true),[ocupado,setOcupado]=useState(false),[erro,setErro]=useState(''),[mensagem,setMensagem]=useState('');
  const ref=React.useRef(null);
  async function carregar(){
    setCarregando(true);setErro('');
    try{let q=supabase.from('podcast_episodios').select('*').order('data_publicacao',{ascending:false}).order('created_at',{ascending:false});if(!admin)q=q.eq('publicado',true).lte('data_publicacao',diaBrasilia());const {data,error}=await q;if(error)throw error;setItens(data||[]);}catch{setErro('Não foi possível carregar os episódios. Tente novamente.');}finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[admin]);
  function limpar(){setId(null);setForm(novo());}
  async function salvar(e){
    e.preventDefault();setOcupado(true);setMensagem('');
    try{
      const dados={...form,titulo:form.titulo.trim(),descricao:form.descricao.trim(),url:form.url.trim(),capa_url:form.capa_url.trim()};
      if(!dados.titulo||!dados.data_publicacao||!linkCursoValido(dados.url))throw new Error('Preencha título, data e o link completo do episódio, iniciado por https://.');
      if(dados.capa_url&&!linkCursoValido(dados.capa_url))throw new Error('A capa deve ter um link iniciado por https://.');
      const {data,error}=id?await supabase.from('podcast_episodios').update(dados).eq('id',id).select('id'):await supabase.from('podcast_episodios').insert(dados).select('id');
      if(error)throw error;if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      limpar();await carregar();setMensagem('Episódio salvo. Ao voltar à Home, o botão aparece se houver um episódio publicado com data de hoje ou anterior.');
    }catch(e){setMensagem(e.message);}finally{setOcupado(false);}
  }
  async function alterar(item,excluir=false){
    if(excluir&&!window.confirm('Excluir o episódio “'+item.titulo+'” do app? O conteúdo na plataforma original será mantido.'))return;
    setOcupado(true);setMensagem('');
    try{const q=excluir?supabase.from('podcast_episodios').delete().eq('id',item.id):supabase.from('podcast_episodios').update({publicado:!item.publicado}).eq('id',item.id);const {data,error}=await q.select('id');if(error)throw error;if(!data?.length)throw new Error('Sem permissão para alterar o episódio.');if(id===item.id)limpar();await carregar();setMensagem(excluir?'Episódio excluído do app.':'Publicação atualizada.');}catch(e){setMensagem(e.message);}finally{setOcupado(false);}
  }
  return <section className="space-y-4">
    {!admin&&<div className="bg-[#061d3b] text-white p-6 rounded-3xl space-y-3"><span aria-hidden="true" className="text-4xl">🎙️</span><p className="text-amber-300 text-xs font-bold uppercase tracking-wider">AD Brás Cubatão</p><h1 className="text-2xl font-bold">Podcast</h1><p className="text-sm leading-relaxed">Conversas que aproximam, mensagens que fortalecem. Separe um momento e venha compartilhar essa caminhada de fé com a gente.</p></div>}
    {admin&&<div ref={ref} className="bg-white p-5 rounded-3xl border space-y-3"><h2 className="text-lg font-bold">Podcast — episódios</h2><p className="text-xs text-slate-500">Cadastre o link de um episódio em áudio ou vídeo. O público abre o conteúdo na plataforma escolhida. O botão na Home aparece somente quando houver um episódio publicado. Você pode começar salvando como rascunho.</p>
      <form onSubmit={salvar}><fieldset disabled={ocupado||carregando||!!erro} className="space-y-3">
        <label className="block text-xs">Título<input required maxLength={160} value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Descrição<textarea maxLength={2000} rows={3} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Formato<select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} className="block w-full border rounded-xl p-3"><option value="video">Vídeo</option><option value="audio">Áudio</option></select></label>
        <label className="block text-xs">Link do episódio<input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Link da imagem de capa (opcional)<input type="url" value={form.capa_url} onChange={e=>setForm({...form,capa_url:e.target.value})} placeholder="https://..." className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-xs">Data de publicação<input required type="date" value={form.data_publicacao} onChange={e=>setForm({...form,data_publicacao:e.target.value})} className="block w-full border rounded-xl p-3" /></label>
        <label className="block text-sm"><input type="checkbox" checked={form.publicado} onChange={e=>setForm({...form,publicado:e.target.checked})} /> Publicar no app (data futura agenda a publicação)</label>
        <button className="bg-[#061d3b] text-white rounded-xl p-3 text-sm font-bold">{ocupado?'Salvando…':id?'Salvar alterações':'Salvar episódio'}</button>{id&&<button type="button" onClick={limpar} className="ml-3 underline text-sm">Cancelar edição</button>}
      </fieldset></form><p role="status" className="text-sm">{mensagem}</p>
    </div>}
    {carregando?<p role="status">Carregando episódios…</p>:erro?<div role="alert" className="bg-amber-50 p-4 rounded-xl text-sm">{erro}<button onClick={carregar} className="block underline mt-2">Tentar novamente</button></div>:!itens.length?<div className="bg-white p-6 rounded-3xl text-center space-y-2"><span className="text-3xl">🎙️</span><h2 className="font-bold">{admin?'Tudo pronto para o primeiro episódio':'Novas conversas vêm por aí'}</h2><p className="text-sm text-slate-500">{admin?'Quando tiver o material, cadastre acima. Até lá, o botão Podcast ficará oculto na Home.':'Em breve, teremos conteúdo para compartilhar com você.'}</p></div>:itens.map(item=><article key={item.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-[#061d3b] h-40 flex items-center justify-center relative"><span aria-hidden="true" className="text-5xl">🎙️</span>{item.capa_url&&linkCursoValido(item.capa_url)&&<img key={item.capa_url} src={item.capa_url} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none';}} className="absolute inset-0 w-full h-full object-cover" />}</div>
      <div className="p-5 space-y-3"><p className="text-xs text-slate-500">{item.tipo==='audio'?'🎧 Áudio':'▶ Vídeo'} · {item.data_publicacao.split('-').reverse().join('/')}{admin?' · '+(!item.publicado?'Rascunho / oculto':item.data_publicacao>diaBrasilia()?'Agendado':'Publicado'):''}</p><h2 className="text-lg font-bold text-[#061d3b] break-words">{item.titulo}</h2><p className="text-sm text-slate-600 whitespace-pre-line break-words">{item.descricao}</p>
      {linkCursoValido(item.url)&&<a href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-[#061d3b] text-white rounded-xl p-3 text-center text-sm font-bold">{item.tipo==='audio'?'Ouvir episódio':'Assistir episódio'} ↗</a>}
      {admin&&<div className="flex flex-wrap gap-4 text-sm border-t pt-3"><button disabled={ocupado} className="underline" onClick={()=>{setId(item.id);setForm({titulo:item.titulo,descricao:item.descricao,tipo:item.tipo,url:item.url,capa_url:item.capa_url,data_publicacao:item.data_publicacao,publicado:item.publicado});setMensagem('Editando '+item.titulo);ref.current?.scrollIntoView({behavior:'smooth'});}}>Editar</button><button disabled={ocupado} className="underline" onClick={()=>alterar(item)}>{item.publicado?'Ocultar':'Publicar'}</button><button disabled={ocupado} className="text-red-700 underline" onClick={()=>alterar(item,true)}>Excluir</button></div>}
      </div></article>)}
  </section>;
}

function LouvoresRadio({admin=false}){
  const [itens,setItens]=useState([]),[carregando,setCarregando]=useState(true),[erro,setErro]=useState(''),[salvando,setSalvando]=useState(null),[mensagem,setMensagem]=useState('');
  async function carregar(){
    setCarregando(true);setErro('');
    try{const {data,error}=await supabase.from('louvores_links').select('*').order('id');if(error)throw error;setItens(data||[]);}catch{setErro('Não foi possível carregar esta área. Tente novamente.');}finally{setCarregando(false);}
  }
  useEffect(()=>{carregar();},[]);
  function editar(id,campo,valor){setItens(atual=>atual.map(v=>v.id===id?{...v,[campo]:valor}:v));}
  async function salvar(e,item){
    e.preventDefault();setSalvando(item.id);setMensagem('');
    try{
      const dados={titulo:item.titulo.trim(),descricao:item.descricao.trim(),url:item.url.trim()};
      if(!dados.titulo)throw new Error('Preencha o título.');
      if(dados.url&&!linkCursoValido(dados.url))throw new Error('Use um link completo iniciado por https://.');
      const {data,error}=await supabase.from('louvores_links').update(dados).eq('id',item.id).select('id');if(error)throw error;if(!data?.length)throw new Error('Nada foi salvo. Confira sua permissão de administrador.');
      setItens(atual=>atual.map(v=>v.id===item.id?{...v,...dados}:v));setMensagem('Salvo! Abra Louvores novamente para conferir.');
    }catch(e){setMensagem(e.message);}finally{setSalvando(null);}
  }
  return <section className="space-y-4">
    {admin?<div className="bg-white p-5 rounded-3xl space-y-2"><h2 className="font-bold text-lg">Louvores e rádio</h2><p className="text-xs text-slate-500">Cadastre a página do Brás Adoração e a página da rádio. Sem link, o card aparece como “Em breve”. Os links abrem em uma nova aba.</p><p role="status" className="text-sm">{mensagem}</p></div>:<div className="bg-[#061d3b] text-white p-6 rounded-3xl space-y-3"><span aria-hidden="true" className="text-4xl">🎶</span><h1 className="text-2xl font-bold">Louvores e rádio</h1><p className="text-sm leading-relaxed">Uma canção, uma palavra, um momento com Deus. Encontre aqui companhia para seus momentos de fé e adoração.</p></div>}
    {carregando?<p role="status">Carregando…</p>:erro?<div role="alert" className="bg-amber-50 p-4 rounded-xl text-sm">{erro}<button onClick={carregar} className="block underline mt-2">Tentar novamente</button></div>:itens.map(item=><article key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3"><span aria-hidden="true" className="text-4xl">{item.id==='adoracao'?'🎵':'📻'}</span>
      {admin?<form onSubmit={e=>salvar(e,item)}><fieldset disabled={salvando!==null} className="space-y-3"><p className="text-xs font-bold text-amber-700">{item.id==='adoracao'?'BRÁS ADORAÇÃO':'RÁDIO'}</p><label className="block text-xs">Título<input required maxLength={120} value={item.titulo} onChange={e=>editar(item.id,'titulo',e.target.value)} className="block w-full border rounded-xl p-3" /></label><label className="block text-xs">Descrição<textarea rows={3} maxLength={600} value={item.descricao} onChange={e=>editar(item.id,'descricao',e.target.value)} className="block w-full border rounded-xl p-3" /></label><label className="block text-xs">Link (pode deixar vazio por enquanto)<input type="url" value={item.url} onChange={e=>editar(item.id,'url',e.target.value)} placeholder="https://..." className="block w-full border rounded-xl p-3" /></label><button className="bg-[#061d3b] text-white rounded-xl p-3 text-sm font-bold">{salvando===item.id?'Salvando…':'Salvar'}</button></fieldset></form>:<><h2 className="text-xl font-bold text-[#061d3b] break-words">{item.titulo}</h2><p className="text-sm text-slate-600 whitespace-pre-line break-words">{item.descricao}</p>{item.url&&linkCursoValido(item.url)?<a href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-[#061d3b] text-white p-3 rounded-xl text-center text-sm font-bold">{item.id==='adoracao'?'Acessar Brás Adoração':'Acessar rádio'} ↗</a>:<div className="bg-amber-50 text-amber-800 rounded-xl p-3 text-sm text-center">Em breve 💛</div>}</>}
    </article>)}
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
  const [secretariaLogada,setSecretariaLogada]=useState(false);
  const [acessoCarregando,setAcessoCarregando]=useState(true);
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
  }, [paginaAtual]);

  useEffect(() => {
    let ativo=true,versao=0;
    async function verificar(sessao){
      const atual=++versao;
      if(ativo){setAcessoCarregando(true);setAdminLogado(false);setSecretariaLogada(false);}
      if(!sessao){if(ativo)setAcessoCarregando(false);return;}
      try{
        const [adm,sec]=await Promise.all([
          supabase.from('admin_users').select('user_id').eq('user_id',sessao.user.id).maybeSingle(),
          supabase.from('secretaria_users').select('user_id').eq('user_id',sessao.user.id).maybeSingle()
        ]);
        if(ativo && atual===versao){setAdminLogado(!adm.error && !!adm.data);setSecretariaLogada(!sec.error && !!sec.data);}
      }finally{if(ativo && atual===versao)setAcessoCarregando(false);}
    }
    supabase.auth.getSession().then(({data})=>{if(ativo)verificar(data.session);});
    const {data:listener}=supabase.auth.onAuthStateChange((_evento,sessao)=>{setTimeout(()=>{if(ativo)verificar(sessao);},0);});
    return ()=>{ativo=false;listener.subscription.unsubscribe();};
  }, []);

  // 4. OUTROS ESTADOS DA APLICAÇÃO
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

    const [adm,sec]=await Promise.all([
      supabase.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle(),
      supabase.from('secretaria_users').select('user_id').eq('user_id',data.user.id).maybeSingle()
    ]);
    if(!adm.data && !sec.data){await supabase.auth.signOut();return alert('Esta conta ainda não possui acesso ao painel. Peça ao administrador para liberar a permissão.');}
    setAdminLogado(!!adm.data && !adm.error);setSecretariaLogada(!!sec.data && !sec.error);
    setSenhaAdmin('');
  };

  const handleLogoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminLogado(false);setSecretariaLogada(false);
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
              <AtalhoPodcast abrir={()=>setPaginaAtual('podcast')} />
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

          <Apostilas />
          <MateriaisEstudo />
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

          {acessoCarregando ? <p role="status">Verificando acesso…</p> : !adminLogado && !secretariaLogada ? (
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 text-center">
              <span className="text-4xl">🔐</span>
              <h2 className="text-lg font-bold text-slate-900">Acesso administrativo / Secretaria</h2>
              <form onSubmit={handleLoginAdmin} className="space-y-3 pt-2">
                <input type="email" placeholder="E-mail de acesso" value={emailAdmin} onChange={(e) => setEmailAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" required />
                <input type="password" placeholder="Digite a senha de acesso" value={senhaAdmin} onChange={(e) => setSenhaAdmin(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" />
                <button type="submit" className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-xs shadow-md">Entrar no Painel</button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{adminLogado?'Painel de Controle':'Painel da Secretaria'}</h2>
                  <span className="text-[10px] text-emerald-600 font-bold">● SUPABASE CONECTADO</span>
                </div>
                <button onClick={handleLogoutAdmin} className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg">Sair</button>
              </div>

              <AgendaCampo gestao departamentos={departamentos} aoSalvar={carregarDepartamentos} />
              {adminLogado && <>
              <LouvoresRadio admin />
              <PodcastIgreja admin />
              <MuralComunidade admin />
              <AcessoSecretaria />
              <MateriaisEstudo admin />
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

              <Apostilas admin />
              </>}
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
          <AgendaCampo departamentos={departamentos} />
          <button onClick={()=>setPaginaAtual('admin')} className="text-sm underline">Acesso da secretaria</button>
        </main>
      )}

      {/* ================= 7. CULTOS ================= */}
      {paginaAtual === 'podcast' && <main className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-5"><button onClick={()=>setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button><PodcastIgreja /></main>}
      {paginaAtual === 'cultos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <CultosYoutube />
        </main>
      )}

      {/* ================= 8. AVISOS ================= */}
      {paginaAtual === 'avisos' && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-5">
          <button onClick={() => setPaginaAtual('home')} className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm">← Voltar ao Menu Principal</button>
          <MuralComunidade />
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
                ) : dept.id === 'minidemc' ? (
                  <img src="/logo-minidemc.png" alt="MINIDEMC — Ministério Infantil" className="h-24 w-24 mx-auto object-contain" />
                ) : dept.id === 'geracaoteen' ? (
                  <img src="/logo-geracao-teen.png" alt="Geração Teen — Departamento de Adolescentes" className="h-24 w-24 mx-auto object-contain" />
                ) : dept.id === 'missoes' ? (
                  <img src="/logo-missoes.png" alt="Departamento de Missões — Eu sou parceiro de Missões" className="h-24 w-full object-contain bg-white rounded-2xl p-1" />
                ) : dept.id === 'diaconal' ? (
                  <img src="/logo-diaconal.png" alt="Diáconos e Diaconisas — AD Brás Cubatão" className="h-24 w-full object-contain bg-white rounded-2xl p-1" />
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
            ) : departamentoSelecionado.id === 'minidemc' ? (
              <img src="/logo-minidemc.png" alt="MINIDEMC — Ministério Infantil" className="h-44 w-44 mx-auto object-contain" />
            ) : departamentoSelecionado.id === 'geracaoteen' ? (
                  <img src="/logo-geracao-teen.png" alt="Geração Teen — Departamento de Adolescentes" className="h-44 w-44 mx-auto object-contain" />
                ) : departamentoSelecionado.id === 'missoes' ? (
                  <img src="/logo-missoes.png" alt="Departamento de Missões — Eu sou parceiro de Missões" className="w-full h-auto mx-auto object-contain bg-white rounded-2xl p-2" />
                ) : departamentoSelecionado.id === 'diaconal' ? (
                  <img src="/logo-diaconal.png" alt="Diáconos e Diaconisas — AD Brás Cubatão" className="w-full h-auto mx-auto object-contain bg-white rounded-2xl p-3" />
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
              <div key={evento.id} className="border-l-4 border-amber-400 pl-3 space-y-1">{evento.cancelado && <p className="text-xs font-bold text-red-700">EVENTO CANCELADO</p>}<p className="text-sm font-bold">{evento.titulo}</p><p className="text-xs text-slate-500">{evento.data} • {evento.horario || 'Horário a confirmar'}</p>{evento.local && <p className="text-xs text-slate-600">📍 {evento.local}</p>}{evento.descricao && <p className="text-xs text-slate-600 whitespace-pre-line">{evento.descricao}</p>}</div>
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
          <LouvoresRadio />
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
