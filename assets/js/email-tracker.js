
// Athenia Email Tracker — local (IndexedDB-like via localStorage demo)
const ET = (()=>{
  // Simple data store in localStorage (for demo). Upgrade to IndexedDB later.
  const KEY = 'athenia_et_store_v1';
  let store = { clients: [], contacts: [], emails: [], currentClient: null, selectedEmailId: null };

  function load(){
    try{ const s = JSON.parse(localStorage.getItem(KEY)||'{}'); Object.assign(store, {clients:[],contacts:[],emails:[],currentClient:null,selectedEmailId:null}, s); }
    catch(e){ /* ignore */ }
    renderClients(); renderContacts(); renderEmails(); clearPreview();
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(store)); }

  // Utils
  const uuid = ()=>'xxxxxxxx'.replace(/x/g, ()=>((Math.random()*36)|0).toString(36));
  function setClient(id){ store.currentClient = id; save(); renderContacts(); renderEmails(); clearPreview(); }
  function currentClient(){ return store.clients.find(c=>c.id===store.currentClient) || null; }
  function escape(s){ return (s||'').replace(/[&<>"]/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m])); }

  // Clients
  function addClient(){
    const name = (document.getElementById('clientName')||{}).value || '';
    if(!name.trim()) return;
    const id = uuid();
    store.clients.push({id, name, notes:'', tags:[]});
    store.currentClient = id;
    (document.getElementById('clientName')||{}).value = '';
    save(); renderClients(); renderContacts(); renderEmails();
  }
  function renderClients(){
    const box = document.getElementById('clientList'); if(!box) return;
    box.innerHTML = store.clients.map(c=>`<div class="client"><a href="#" onclick="ET._sel('${c.id}');return false" ${c.id===store.currentClient?'style="font-weight:700"':''}>${escape(c.name)}</a><a href="#" onclick="ET._delClient('${c.id}');return false" title="Delete">×</a></div>`).join('') || '<div class="small">No clients yet.</div>';
  }
  function _sel(id){ setClient(id); }
  function _delClient(id){
    if(!confirm('Remove client and all related emails/contacts?')) return;
    store.clients = store.clients.filter(c=>c.id!==id);
    store.contacts = store.contacts.filter(x=>x.client_id!==id);
    store.emails = store.emails.filter(x=>x.client_id!==id);
    if(store.currentClient===id) store.currentClient = null;
    save(); renderClients(); renderContacts(); renderEmails(); clearPreview();
  }

  // Contacts
  function addContact(){
    const c = currentClient(); if(!c) return alert('Select or create a client first.');
    const name = (document.getElementById('ctName')||{}).value||'';
    const role = (document.getElementById('ctRole')||{}).value||'';
    const email = (document.getElementById('ctEmail')||{}).value||'';
    const consent_m = !!(document.getElementById('ctConsentM')||{}).checked;
    const consent_p = !!(document.getElementById('ctConsentP')||{}).checked;
    const id = uuid();
    store.contacts.push({id, client_id:c.id, name, role, email, consent:{marketing:consent_m,processing:consent_p}, tags:[]});
    ['ctName','ctRole','ctEmail'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    (document.getElementById('ctConsentM')||{}).checked = false;
    (document.getElementById('ctConsentP')||{}).checked = false;
    save(); renderContacts();
  }
  function renderContacts(){
    const c = currentClient(); const box = document.getElementById('contactList'); if(!box) return;
    if(!c){ box.innerHTML='<div class="small">Select a client.</div>'; return; }
    const list = store.contacts.filter(x=>x.client_id===c.id);
    box.innerHTML = list.map(p=>`<div class="client"><div><strong>${escape(p.name||'')}</strong><br><span class="small">${escape(p.role||'')} — ${escape(p.email||'')}</span></div><span class="small">${p.consent.marketing?'M':''}${p.consent.processing?' P':''}</span></div>`).join('') || '<div class="small">No contacts yet.</div>';
  }

  // Emails
  function addEmail(){
    const c = currentClient(); if(!c) return alert('Select or create a client first.');
    const subject = (document.getElementById('emSubject')||{}).value||'';
    const from = (document.getElementById('emFrom')||{}).value||'';
    const to = (document.getElementById('emTo')||{}).value||'';
    const date = (document.getElementById('emDate')||{}).value||'';
    const body = (document.getElementById('emBody')||{}).value||'';
    const id = uuid();
    const thread_key = (subject||'').toLowerCase().replace(/^(re:|fw:)\s*/gi,'').slice(0,120) + '|' + (from.split('@')[0]||'');
    store.emails.push({id, client_id:c.id, subject, from, to:to.split(/[;,]\s*/).filter(Boolean), date, body, labels:[], thread_key});
    ['emSubject','emFrom','emTo','emDate','emBody'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    save(); renderEmails();
  }
  function renderEmails(){
    const c = currentClient(); const box = document.getElementById('emailList'); if(!box) return;
    if(!c){ box.innerHTML='<div class="small">Select a client.</div>'; return; }
    const list = store.emails.filter(e=>e.client_id===c.id).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    box.innerHTML = list.map(e=>`<div class="email" onclick="ET._open('${e.id}')"><strong>${escape(e.subject||'(no subject)')}</strong><br><span class="small">${escape(e.from||'')} → ${escape((e.to||[]).join(', '))} · ${escape(e.date||'')}</span></div>`).join('') || '<div class="small">No emails yet.</div>';
  }
  function _open(id){
    store.selectedEmailId = id; save();
    const e = store.emails.find(x=>x.id===id); if(!e) return;
    document.getElementById('previewMeta').innerHTML = `<strong>${escape(e.subject||'(no subject)')}</strong><br><span class="small">${escape(e.from||'')} → ${escape((e.to||[]).join(', '))} · ${escape(e.date||'')}</span>`;
    document.getElementById('previewBody').textContent = e.body || '';
  }
  function clearPreview(){
    const p1=document.getElementById('previewMeta'); if(p1) p1.innerHTML='';
    const p2=document.getElementById('previewBody'); if(p2) p2.textContent='';
  }

  // Bridges (open tool pages with seed text in URL param)
  function bridge(page){
    const e = store.emails.find(x=>x.id===store.selectedEmailId);
    const seed = encodeURIComponent((e && (e.subject + '\n\n' + e.body)) || '');
    window.open(`${page}?seed=${seed}`, '_blank');
  }

  // CSV helpers
  function exportEmailsCSV(){
    const c = currentClient(); if(!c) return alert('Select a client first.');
    const list = store.emails.filter(e=>e.client_id===c.id);
    const rows = [['client','subject','from','to','date','body','labels','thread_key']].concat(
      list.map(e=>[c.name, e.subject, e.from, (e.to||[]).join('; '), e.date, e.body, (e.labels||[]).join(';'), e.thread_key])
    );
    downloadCSV('emails.csv', rows);
  }
  function exportContactsCSV(){
    const c = currentClient(); if(!c) return alert('Select a client first.');
    const list = store.contacts.filter(x=>x.client_id===c.id);
    const rows = [['client','name','role','email','consent_marketing','consent_processing','tags']].concat(
      list.map(p=>[c.name, p.name, p.role, p.email, p.consent.marketing?'1':'0', p.consent.processing?'1':'0', (p.tags||[]).join(';')])
    );
    downloadCSV('contacts.csv', rows);
  }
  function downloadCSV(filename, rows){
    const csv = rows.map(r=>r.map(cell=>`"${String(cell||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  }
  function importEmails(ev){
    const c = currentClient(); if(!c) return alert('Select a client first.');
    const f = ev.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      const header = lines.shift().split(',');
      const idx = (name)=> header.findIndex(h=>h.trim().toLowerCase()===name);
      const ix = { client: idx('client'), subject: idx('subject'), from: idx('from'), to: idx('to'), date: idx('date'), body: idx('body'), labels: idx('labels'), thread_key: idx('thread_key') };
      lines.forEach(line=>{
        const cols = parseCSVLine(line);
        const clientName = cols[ix.client]||'';
        if(clientName && clientName!==c.name) return; // ignore other clients for safety
        const email = {
          id: uuid(), client_id:c.id,
          subject: cols[ix.subject]||'',
          from: cols[ix.from]||'',
          to: (cols[ix.to]||'').split(/;|\s*,\s*/).filter(Boolean),
          date: cols[ix.date]||'',
          body: cols[ix.body]||'',
          labels: (cols[ix.labels]||'').split(/;|\s*,\s*/).filter(Boolean),
          thread_key: cols[ix.thread_key]||''
        };
        // dedupe simple: by subject+from+date
        const dup = store.emails.find(e=>e.client_id===c.id && e.subject===email.subject && e.from===email.from && e.date===email.date);
        if(!dup) store.emails.push(email);
      });
      save(); renderEmails();
    };
    reader.readAsText(f);
    ev.target.value = '';
  }
  function importContacts(ev){
    const c = currentClient(); if(!c) return alert('Select a client first.');
    const f = ev.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      const header = lines.shift().split(',');
      const idx = (name)=> header.findIndex(h=>h.trim().toLowerCase()===name);
      const ix = { client: idx('client'), name: idx('name'), role: idx('role'), email: idx('email'), cm: idx('consent_marketing'), cp: idx('consent_processing'), tags: idx('tags') };
      lines.forEach(line=>{
        const cols = parseCSVLine(line);
        const clientName = cols[ix.client]||'';
        if(clientName && clientName!==c.name) return;
        const contact = {
          id: uuid(), client_id:c.id,
          name: cols[ix.name]||'', role: cols[ix.role]||'', email: cols[ix.email]||'',
          consent:{marketing: (cols[ix.cm]||'').trim()==='1', processing: (cols[ix.cp]||'').trim()==='1'},
          tags: (cols[ix.tags]||'').split(/;|\s*,\s*/).filter(Boolean)
        };
        const dup = store.contacts.find(p=>p.client_id===c.id && p.email===contact.email && p.name===contact.name);
        if(!dup) store.contacts.push(contact);
      });
      save(); renderContacts();
    };
    reader.readAsText(f);
    ev.target.value = '';
  }
  function parseCSVLine(line){
    // Split on commas not inside quotes
    const re = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
    return line.split(re).map(s=>s.replace(/^"|"$/g,'').replace(/""/g,'"'));
  }

  // Export selected email to PDF (print)
  function exportPDF(){
    const e = store.emails.find(x=>x.id===store.selectedEmailId);
    if(!e) return alert('Select an email first.');
    const client = currentClient();
    const doc = `
      <html><head><title>${escape(client?client.name:'Client')} — Email Export</title>
      <style>
        body{font-family:'Lora',serif}
        h1,h2{font-family:'Montserrat',sans-serif}
        .wrap{padding:24px} pre{white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:8px}
      </style></head>
      <body><div class="wrap">
        <h1>${escape(client?client.name:'Client')} — Email Record</h1>
        <h2>Metadata</h2>
        <pre>Subject: ${escape(e.subject||'')}
From: ${escape(e.from||'')}
To: ${escape((e.to||[]).join(', ')||'')}
Date: ${escape(e.date||'')}
Thread: ${escape(e.thread_key||'')}</pre>
        <h2>Body</h2>
        <pre>${escape(e.body||'')}</pre>
      </div><script>window.onload=()=>window.print()</script></body></html>
    `;
    const w = window.open('','_blank'); w.document.open(); w.document.write(doc); w.document.close();
  }

  return { load, addClient, _sel, _delClient, addContact, addEmail, _open, bridge, exportEmailsCSV, exportContactsCSV, importEmails, importContacts, exportPDF };
})();

window.addEventListener('DOMContentLoaded', ET.load);
