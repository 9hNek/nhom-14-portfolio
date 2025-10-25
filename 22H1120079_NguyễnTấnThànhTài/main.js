
function hexRGBA(h, a){ h=h.replace('#',''); if(h.length===3) h=h.split('').map(s=>s+s).join(''); const v=parseInt(h,16), R=(v>>16)&255,G=(v>>8)&255,B=v&255; return `rgba(${R},${G},${B},${a})`; }

// Projects rings
(()=>{
  const c=document.getElementById('projectsRings'); if(!c) return;
  const x=c.getContext('2d'); let w,h,dpr=Math.min(2,window.devicePixelRatio||1);
  const PAL=['#e6cfaa','#d6b889','#86d1c1'];
  function resize(){ w=c.clientWidth; h=c.clientHeight; c.width=w*dpr; c.height=h*dpr; x.setTransform(dpr,0,0,dpr,0,0); }
  window.addEventListener('resize', resize); resize();
  const R=26;
  function draw(t){
    x.clearRect(0,0,w,h);
    const cx=w*0.5, cy=h*0.88;
    for(let i=0;i<R;i++){
      const p=i/R;
      const ry=(34+i*18)+Math.sin(t/700+i*.25)*3, rx=ry*2.6;
      const rot=-Math.PI/2+Math.sin(t/1800+i*.07)*0.03;
      const col=PAL[i%PAL.length];
      x.save(); x.translate(cx, cy - i*6.2); x.rotate(rot);
      x.lineWidth=2+(1-p)*2.2; x.strokeStyle=hexRGBA(col,.25+.55*(1-p)); x.shadowColor=hexRGBA(col,.7); x.shadowBlur=10;
      x.beginPath(); for(let a=0;a<Math.PI*2;a+=0.01){ const X=Math.cos(a)*rx, Y=Math.sin(a)*ry; if(a===0) x.moveTo(X,Y); else x.lineTo(X,Y); } x.closePath(); x.stroke();
      x.restore();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// Dragon realistic
(()=>{
  const c=document.getElementById('dragonCanvas'); if(!c) return;
  const g=c.getContext('2d'); let w,h,dpr=Math.min(2,window.devicePixelRatio||1);
  const GOLD=['#e6cfaa','#d6b889','#b79267'];
  function resize(){ w=c.clientWidth; h=c.clientHeight; c.width=w*dpr; c.height=h*dpr; g.setTransform(dpr,0,0,dpr,0,0); }
  window.addEventListener('resize', resize); resize();

  const N=42; const pts=Array.from({length:N}, ()=>({x:w*0.2,y:h*0.5}));
  let target={x:w*0.8,y:h*0.5}, idle=true;
  c.addEventListener('mousemove', e=>{ const r=c.getBoundingClientRect(); target.x=e.clientX-r.left; target.y=e.clientY-r.top; idle=false; });
  c.addEventListener('mouseleave', ()=> idle=true);

  function step(t){
    const hx = idle ? w*0.5 + Math.cos(t*0.5)*(w*0.35) : target.x;
    const hy = idle ? h*0.55 + Math.sin(t*0.9)*(h*0.25) : target.y;
    pts[0].x += (hx-pts[0].x)*0.18; pts[0].y += (hy-pts[0].y)*0.18;
    for(let i=1;i<N;i++){
      const p=pts[i-1], s=pts[i]; const dx=p.x-s.x, dy=p.y-s.y; const d=Math.hypot(dx,dy)||1; const len=18 - i*0.3;
      s.x += (p.x - dx/d*len - s.x)*0.32; s.y += (p.y - dy/d*len - s.y)*0.32;
    }
  }
  function pathCR(ctx, A){
    ctx.beginPath();
    for(let i=0;i<A.length-1;i++){
      const p0=A[Math.max(0,i-1)]; const p1=A[i]; const p2=A[i+1]; const p3=A[Math.min(A.length-1,i+2)];
      const cp1x = p1.x + (p2.x - p0.x)/6, cp1y = p1.y + (p2.y - p0.y)/6;
      const cp2x = p2.x - (p3.x - p1.x)/6, cp2y = p2.y - (p3.y - p1.y)/6;
      if(i===0) ctx.moveTo(p1.x,p1.y); ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,p2.x,p2.y);
    }
  }
  function draw(tms){
    const t=tms/1000; g.clearRect(0,0,w,h);
    // light columns
    for(let i=0;i<6;i++){ const cx=(i/5)*w; const grd=g.createRadialGradient(cx,h*0.3,10,cx,h*0.6,h*0.9); grd.addColorStop(0,'rgba(214,184,137,0.06)'); grd.addColorStop(1,'rgba(214,184,137,0)'); g.fillStyle=grd; g.fillRect(0,0,w,h); }
    step(t);
    const col=GOLD[0];
    [0.25,0.5,0.85].forEach((a,idx)=>{ g.strokeStyle=hexRGBA(col,a*(1-idx*0.15)); g.lineWidth=14-idx*4; g.shadowColor=hexRGBA(col,.6); g.shadowBlur=12-idx*3; pathCR(g,pts); g.stroke(); });
    g.strokeStyle=hexRGBA('#fff',.22); g.lineWidth=1.6; g.shadowBlur=4; g.shadowColor=hexRGBA('#fff',.2); pathCR(g,pts); g.stroke();
    // head
    const p0=pts[0], p1=pts[1]; const ang=Math.atan2(p1.y-p0.y,p1.x-p0.x); g.save(); g.translate(p0.x,p0.y); g.rotate(ang);
    g.fillStyle=hexRGBA('#e6cfaa',.9); g.shadowColor=hexRGBA('#e6cfaa',.7); g.shadowBlur=12; g.beginPath(); g.moveTo(14,0); g.lineTo(-10,7); g.lineTo(-10,-7); g.closePath(); g.fill();
    g.strokeStyle=hexRGBA('#d6b889',.9); g.lineWidth=2; g.shadowBlur=6; g.beginPath(); g.moveTo(0,-6); g.lineTo(-12,-16); g.moveTo(0,6); g.lineTo(-12,16); g.stroke();
    g.strokeStyle=hexRGBA('#e6cfaa',.7); g.lineWidth=1.2; g.shadowBlur=4; g.beginPath(); g.moveTo(10,-2); g.bezierCurveTo(26,-10, 38,-14, 50,-10); g.moveTo(10,2); g.bezierCurveTo(26,10, 38,14, 50,10); g.stroke();
    g.restore();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
