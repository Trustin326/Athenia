const MS = (()=>{
  const v = id => (document.getElementById(id)||{}).value||'';
  function genSovereignty(){
    const r=v('dsRegion'), d=v('dsData');
    const txt = `DIGITAL SOVEREIGNTY POLICY\nRegion: ${r}\nData Class: ${d}\n\nControls\n• Data residency: in‑region storage\n• Lawful access boundaries\n• Encryption at rest + in transit\n• Localized key management\n• Incident disclosure SLA\n\nAudit Cadence\n• Quarterly control validation\n• Annual third‑party review`;
    document.getElementById('dsOut').textContent = txt;
  }
  function genTrustPack(){
    const prod=v('tdProduct'), sec=v('tdSector');
    const txt = `TRUST DOCUMENTATION PACK\nWorkload: ${prod}\nSector: ${sec}\n\nArtifacts\n1) Data Flow Diagram\n2) DPIA/PIA Summary\n3) Access & Key Controls\n4) Monitoring & Alerting\n5) Business Continuity & DR\n\nAssurances\n• Control coverage map\n• Residual risk register`;
    document.getElementById('tdOut').textContent = txt;
  }
  function genAICheck(){
    const use=v('aiUse'), risk=v('aiRisk');
    const txt = `AI DEPLOYMENT SAFETY CHECKLIST\nUse Case: ${use}\nRisk: ${risk}\n\nPre‑Deployment\n□ Policy eligibility & risk class\n□ Dataset review & consent basis\n□ Bias evaluation plan\n\nRuntime\n□ Monitoring & red‑team hooks\n□ Human‑in‑the‑loop thresholds\n□ Incident channel & rollback`;
    document.getElementById('aiOut').textContent = txt;
  }
  function exportPDF(){
    const docHTML = `
    <html><head><title>Microsoft — Trust Pack</title>
    <style>body{font-family:'Lora',serif}h1,h2{font-family:'Montserrat',sans-serif}.wrap{padding:24px}pre{white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:8px}</style>
    </head><body><div class="wrap">
    <h1>Microsoft Division — Trust Toolkit</h1>
    <h2>Digital Sovereignty</h2><pre>${(document.getElementById('dsOut')||{}).textContent||''}</pre>
    <h2>Trust Documentation Pack</h2><pre>${(document.getElementById('tdOut')||{}).textContent||''}</pre>
    <h2>AI Deployment Safety</h2><pre>${(document.getElementById('aiOut')||{}).textContent||''}</pre>
    </div><script>window.onload=()=>window.print()</script></body></html>`;
    const w=window.open('','_blank'); w.document.open(); w.document.write(docHTML); w.document.close();
  }
  return {genSovereignty,genTrustPack,genAICheck,exportPDF};
})();
