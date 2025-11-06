const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target)} })
},{threshold:0.15});
document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));
