/* ================== Athenia App Helpers ================== */
(function(){
  const params = new URLSearchParams(location.search);
  const seed = params.get('seed') || '';
  const demoMode = params.get('demo') === '1';

  // Smooth scroll for internal anchors
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });

  // Seed prefill: try common fields
  window.addEventListener('DOMContentLoaded', ()=>{
    if(seed){
      const ta = document.querySelector('textarea, .tool textarea');
      if(ta && !ta.value) ta.value = seed;
      // Known fields across your tools
      const known = ['naTheme','naAudience','repTopic','msgSample','aiUse','blogTopic','ttsText'];
      known.forEach(id=>{ const el=document.getElementById(id); if(el && !el.value) el.value = seed.split('\\n')[0].slice(0,120); });
    }

    if(demoMode){
      // Try to auto-generate outputs if known tool functions exist
      try{ if(window.EV){ EV.genArc(); EV.genReputation(); EV.genPlan(); EV.genHarmony(); } }catch(_){}
      try{ if(window.MS){ MS.genSovereignty(); MS.genTrustPack(); MS.genAICheck(); } }catch(_){}
      try{ if(window.Studio){ Studio.drawPoster(); Studio.blog(); Studio.copy(); } }catch(_){}
    }
  });
})();