const EV = (()=>{
  const v = id => (document.getElementById(id)||{}).value||'';
  function genArc(){
    const theme=v('naTheme'), aud=v('naAudience'), hor=v('naHorizon');
    const txt = `NARRATIVE ARC\nTheme: ${theme}\nAudience: ${aud}\nHorizon: ${hor}\n\nBeats\n1) Declare principle with calm authority\n2) Publish clarity doc + benchmarks\n3) Convene stakeholders (closed‑door)\n4) Public proof via case study\n5) Codify standard + invite peers\n\nRisks\n• Over‑promising on timelines\n• Misinterpretation by incumbents\n\nMitigations\n• Precise wording\n• Third‑party validators`;
    document.getElementById('naOut').textContent = txt;
  }
  function genReputation(){
    const topic=v('repTopic'), reg=v('repRegions');
    const txt = `REPUTATION ANGLES\nTopic: ${topic}\nRegions: ${reg}\n\nLikely Frames\n• Integrity over speed\n• Stewardship of complex systems\n\nAudiences\n• Press: narrative clarity\n• Policy: safety + sovereignty\n\nWatch‑outs\n• Over‑index on tech jargon\n• Mixed signals across regions`;
    document.getElementById('repOut').textContent = txt;
  }
  function genPlan(){
    const obj=v('infObjective'), ch=v('infChannels');
    const txt = `INFLUENCE STRATEGY\nObjective: ${obj}\nChannels: ${ch}\n\nPlan 0–90 days\n• Publish executive letter\n• 2x op‑eds + 1 keynote\n• Stakeholder briefings\n\nPlan 90–180 days\n• Launch coalition\n• Release standard draft\n• Thought‑leadership series`;
    document.getElementById('infOut').textContent = txt;
  }
  function genHarmony(){
    const text=v('msgSample'), tone=v('msgTone');
    const score = Math.min(100, 60 + (text.length%40));
    const txt = `HARMONY INDEX\nTone Target: ${tone}\nScore: ${score}/100\n\nNotes\n• Ensure verbs signal stewardship\n• Reduce superlatives; raise precision\n• Add 1 data point + 1 human impact`;
    document.getElementById('msgOut').textContent = txt;
  }
  function exportPDF(){
    const docHTML = `
    <html><head><title>Evoke — Narrative Report</title>
    <style>body{font-family:'Lora',serif}h1,h2{font-family:'Montserrat',sans-serif}.wrap{padding:24px}pre{white-space:pre-wrap;border:1px solid #ddd;padding:10px;border-radius:8px}</style>
    </head><body><div class="wrap">
    <h1>Evoke — Narrative Package</h1>
    <h2>Narrative Arc</h2><pre>${(document.getElementById('naOut')||{}).textContent||''}</pre>
    <h2>Reputation Angles</h2><pre>${(document.getElementById('repOut')||{}).textContent||''}</pre>
    <h2>Influence Strategy</h2><pre>${(document.getElementById('infOut')||{}).textContent||''}</pre>
    <h2>Messaging Harmony</h2><pre>${(document.getElementById('msgOut')||{}).textContent||''}</pre>
    </div><script>window.onload=()=>window.print()</script></body></html>`;
    const w=window.open('','_blank'); w.document.open(); w.document.write(docHTML); w.document.close();
  }
  return {genArc,genReputation,genPlan,genHarmony,exportPDF};
})();
