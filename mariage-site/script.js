const $=s=>document.querySelector(s),red=matchMedia('(prefers-reduced-motion:reduce)').matches,sl=ms=>new Promise(r=>setTimeout(r,red?0:ms));
document.querySelectorAll('.ini').forEach(e=>e.textContent=C.ini.replace('&',' & '));
if(C.vitrineUrl){const a=$('#vit');a.href=C.vitrineUrl;a.hidden=false}
/* Intro */
const T=new Date(C.date).getTime(),ok=!isNaN(T);
$('#introDate').textContent=ok?C.dateLabel.toUpperCase():'UNE INVITATION';
const leave=()=>{$('#intro').classList.add('out');document.body.style.overflow='';setTimeout(()=>$('#intro').style.display='none',1500)};
document.body.style.overflow='hidden';let opened=false;
const open=()=>{if(opened)return;opened=true;$('#stage').classList.add('open');setTimeout(leave,red?200:3600)};
$('#sealI').onclick=$('#openBtn').onclick=open;$('#skipBtn').onclick=leave;
/* Contenu */
if(C.hero)$('#hero').style.background=`linear-gradient(#08152ec4,#08152eb0),url("${C.hero}") center/cover`;
$('#quote').textContent="« "+C.quote+" »";$('#dl').textContent=ok?C.dateLabel:"Date à confirmer";$('#pl').textContent=C.place;$('#pn').textContent=C.place;
$('#pa').textContent=C.address||"Adresse à confirmer";$('#demoNote').textContent=C.demo?"Date, lieu et horaires de démonstration : à confirmer.":"";
function tick(){const e=$('#cd');if(!ok){e.innerHTML='';return}let s=Math.floor((T-Date.now())/1e3);if(s<=0){e.innerHTML='<span>Le grand jour est arrivé ✦</span>';return}
 e.innerHTML=[[86400,'jours'],[3600,'heures'],[60,'min'],[1,'sec']].map(([u,l])=>{const x=Math.floor(s/u);s%=u;return`<div>${x}<small>${l}</small></div>`}).join('')}tick();setInterval(tick,1000);
$('#story').innerHTML=C.story.map(s=>`<div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
$('#pg').innerHTML=C.prog.map(p=>`<li><b>${p[0]}</b><i>${p[1]}</i><span><b style="font:500 1rem var(--ji)">${p[2]}</b><br><small>${p[3]}</small></span></li>`).join('');
const hues=['#2d4a7a,#c9a98a','#142B50,#AAB8CC','#3b5b8f,#e6c9a8','#C5CBD6,#142B50'];
$('#gal').innerHTML=C.gallery.map((g,i)=>`<button data-g="${i}" aria-label="Agrandir : ${C.gnames[i]}" style="background-image:${g[0]?`url(${g[0]})`:`linear-gradient(140deg,${hues[i%4]})`}"><span>${C.gnames[i]}</span></button>`).join('');
let gi=0;const dlg=$('#dlg');
function showG(){const g=C.gallery[gi];$('#dlb').innerHTML=`<button class="x" aria-label="Fermer" onclick="dlg.close()">×</button><div class="ph" style="background-image:${g[0]?`url(${g[0]})`:`linear-gradient(140deg,${hues[gi%4]})`}">${g[0]?'':'Image d\'illustration'}</div><p>${C.gnames[gi]} (${gi+1}/${C.gallery.length})</p><button class="btn" data-n="-1" aria-label="Précédente">←</button> <button class="btn" data-n="1" aria-label="Suivante">→</button>`;if(!dlg.open)dlg.showModal()}
document.addEventListener('click',e=>{const g=e.target.closest('[data-g]'),n=e.target.closest('[data-n]');if(g){gi=+g.dataset.g;showG()}if(n){gi=(gi+ +n.dataset.n+C.gallery.length)%C.gallery.length;showG()}});
document.addEventListener('keydown',e=>{if(dlg.open&&$('#dlb [data-n]')){if(e.key==='ArrowRight'){gi=(gi+1)%C.gallery.length;showG()}if(e.key==='ArrowLeft'){gi=(gi+C.gallery.length-1)%C.gallery.length;showG()}}});
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('v')),{threshold:.2});document.querySelectorAll('.tl div').forEach(x=>io.observe(x));
/* Itinéraire & agenda */
const r=$('#route');if(C.address){r.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(C.address+' '+'')}else{r.removeAttribute('href');r.setAttribute('aria-disabled','true');r.style.opacity=.45;r.style.pointerEvents='none';$('#rn').textContent="L'itinéraire s'activera quand l'adresse sera renseignée (CONFIG.address)."}
$('#ics').onclick=()=>{if(!ok){alert("Date non définie.");return}const f=d=>d.toISOString().slice(0,19).replace(/[-:]/g,''),s=new Date(T),e=new Date(T+3*36e5);
 const loc=(C.address||C.place).replace(/,/g,'\\,');const t=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitation//FR','BEGIN:VEVENT','UID:'+T+'@invitation','DTSTAMP:'+f(new Date())+'Z','DTSTART:'+f(s)+'Z','DTEND:'+f(e)+'Z','SUMMARY:Mariage de Jean-Michel et Christina','LOCATION:'+loc,'END:VEVENT','END:VCALENDAR'].join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download='mariage.ics';a.click()};
/* ===== RSVP : enregistrement réel via C.endpoint (sinon mode démonstration explicite) ===== */
$('#mode').textContent=C.endpoint?"Votre réponse sera enregistrée pour les mariés.":"Mode démonstration : aucune réponse n'est enregistrée sur un serveur ni transmise aux mariés.";
let G={},rid=null,busy=false;const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(16).slice(2);
async function save(p){if(!C.endpoint){await new Promise(r=>setTimeout(r,700));return{demo:true}}
 const ac=new AbortController(),t=setTimeout(()=>ac.abort(),12000);
 try{const r=await fetch(C.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p),signal:ac.signal});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok!==true)throw 0;return j}finally{clearTimeout(t)}}
$('#f').onsubmit=async e=>{e.preventDefault();if(busy)return;const nom=$('#nom').value.trim();$('#e1').textContent='';$('#thx').textContent='';
 if(nom.length<2){$('#e1').textContent='Merci de saisir votre nom et prénom.';$('#nom').focus();return}
 const nb=Math.max(1,Math.min(10,parseInt($('#nb').value)||1));
 G={civ:$('#civ').value,nom,pr:$('#pr').value,nb,regime:$('#rg').value.trim(),ms:$('#ms').value.trim()};rid=rid||uid();
 const b=$('#sub');busy=true;b.disabled=true;b.textContent='Enregistrement…';
 try{await save({id:rid,...G,hp:$('#hp').value,at:new Date().toISOString()})}
 catch(_){busy=false;b.disabled=false;b.textContent='Réessayer';$('#thx').textContent="Nous n'avons pas pu enregistrer votre réponse. Vérifiez votre connexion puis réessayez : aucun doublon ne sera créé.";return}
 busy=false;b.disabled=false;b.textContent='Confirmer ma réponse';
 if(G.pr==='non'){$('#thx').textContent="Merci, "+nom+", d'avoir répondu. Vous nous manquerez, et nous pensons à vous.";rid=null;return}
 play()};
/* ===== SCÈNE : parchemin, plume, signature, sceau ===== */
const sc=$('#scene'),pr=$('#parch'),pa=$('#txt'),q=$('#quill'),fin=$('#fin');let tok=0;
(()=>{let d='';for(let t=.1;t<.97;t+=.04){const x=5+90*t,y=252-249*t,w=3+30*Math.sin(Math.PI*Math.pow(t,.8));d+=`M${x} ${y}l${(-.94*w+.2*w).toFixed(1)} ${(-.34*w-.56*w).toFixed(1)}M${x} ${y}l${(.75*w+.17*w).toFixed(1)} ${(.27*w-.47*w).toFixed(1)}`}$('#barbs').setAttribute('d',d)})();
const lines=()=>[["h","ACTE DE PRÉSENCE"],["o","✦ ✦ ✦"],["p",`Moi, ${G.civ?G.civ+' ':''}${G.nom}, confirme avec joie ma présence au mariage de`],["n",(C.g+' & '+C.b).toUpperCase()],["p",`le ${C.dateLabel}, à ${C.place}.`],["p","Fait en ce jour de confirmation."]];
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const sp=t=>[...t].map(ch=>ch===' '?'<span class="ch s"> </span>':`<span class="ch">${esc(ch)}</span>`).join('');
const mk=(el,full)=>{el.innerHTML=lines().map(l=>l[0]==='h'?`<h3>${sp(l[1])}</h3>`:l[0]==='o'?`<div class="o">${l[1]}</div>`:`<p${l[0]==='n'?' class="nm"':''}>${sp(l[1])}</p>`).join('')+`<div class="sgb"><div class="sgl">SIGNATURE</div><div class="sg">${sp(G.nom)}</div></div>`;if(full)el.querySelectorAll('.ch').forEach(c=>c.classList.add('f'))};
/* La plume trace chaque lettre : elle voyage jusqu'au début de la ligne (pointe levée), se pose, avance lettre par lettre, se lève entre les mots */
async function writeChars(root,ms,my){let prev=null,i=0;const dx=q.offsetWidth*.04;
 for(const s of root.querySelectorAll('.ch')){if(my!==tok)return false;i++;let r=s.getBoundingClientRect();
  if(r.bottom>innerHeight*.8){sc.scrollTop+=r.bottom-innerHeight*.55;r=s.getBoundingClientRect()}
  const o=pr.getBoundingClientRect(),X=r.right-dx-o.left,base=r.bottom-7-q.offsetHeight-o.top;
  if(prev===null||Math.abs(r.bottom-prev)>8){q.style.transition='left .6s ease-in-out,top .6s ease-in-out';q.style.left=(r.left-dx-o.left)+'px';q.style.top=(base-16)+'px';await sl(680);q.style.transition=''}
  q.style.left=X+'px';
  if(s.classList.contains('s')){q.style.top=(base-12)+'px';q.style.transform='rotate(19deg)';s.classList.add('f');await sl(ms*.8)}
  else{q.style.top=(base+Math.sin(i*1.9)*1.6)+'px';q.style.transform=`rotate(${15+Math.sin(i*1.3)*2}deg)`;s.classList.add('w');await sl(ms)}
  prev=r.bottom}
 return true}
async function play(){const my=++tok,pw=$('#pw'),wx=$('#wax'),stack=$('#stack');pw.classList.remove('rolled');pw.style.transform='';stack.style.height='';
 sc.classList.add('on');document.body.style.overflow='hidden';sc.scrollTop=0;fin.classList.remove('on');wx.className='wax';q.style.display='none';q.classList.remove('go');
 pr.style.minHeight='';mk(pa,true);const H=pr.offsetHeight;
 const k=Math.max(.06,Math.min(.14,78/H));const roll=()=>{pw.classList.add('rolled');pw.style.transform=`translateY(-50%) scaleY(${k}) scaleX(.92)`;stack.style.height='170px'};
 if(red){roll();sc.classList.add('vis');wx.classList.add('on');fin.classList.add('on');$('#b2').focus({preventScroll:true});return}
 stack.style.height=H+'px';
 mk(pa,false);pr.style.minHeight=H+'px';pw.classList.add('rolled');requestAnimationFrame(()=>sc.classList.add('vis'));
 await sl(2000);if(my!==tok)return;pw.classList.remove('rolled');await sl(3300);if(my!==tok)return;  /* le parchemin se déroule */
 const els=[...pa.querySelectorAll('h3,p')],txt=lines().filter(l=>l[0]!=='o').map(l=>l[1]);
 const o0=pr.getBoundingClientRect();q.style.display='block';q.style.left=(pr.offsetWidth+60)+'px';q.style.top='40px';await sl(50);q.classList.add('go');
 const b0=els[0].getBoundingClientRect();q.style.left=(b0.left-o0.left+b0.width/2-40)+'px';q.style.top=(b0.bottom-o0.top-6-q.offsetHeight)+'px';await sl(1700);q.classList.remove('go');
 for(const el of els){if(!await writeChars(el,38,my))return;await sl(420)}
 const sg=pa.querySelector('.sg');sg.scrollIntoView({block:'center',behavior:'smooth'});await sl(900);if(my!==tok)return;
 if(!await writeChars(sg,110,my))return;await sl(500);q.style.transform='rotate(15deg)';
 q.classList.add('go');q.style.left=(parseFloat(q.style.left)+50)+'px';await sl(900);q.style.left=(pr.offsetWidth+160)+'px';q.style.top='-80px';await sl(1800);q.style.display='none';if(my!==tok)return;
 await sl(700);sc.scrollTo({top:stack.offsetTop+H/2-innerHeight/2,behavior:'smooth'});await sl(600);roll();await sl(3800);if(my!==tok)return;  /* le parchemin s'enroule */
 wx.classList.add('on');await sl(2200);if(my!==tok)return;fin.classList.add('on');fin.scrollIntoView({block:'end',behavior:'smooth'});$('#b2').focus({preventScroll:true})}
const closeScene=()=>{tok++;q.style.display='none';sc.classList.remove('vis');setTimeout(()=>sc.classList.remove('on'),1000);document.body.style.overflow='';$('#rsvp').scrollIntoView({block:'center'})};
$('#b2').onclick=closeScene;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sc.classList.contains('on')&&!dlg.open)closeScene()});
/* PDF artistique : l'acte est peint sur un canvas (papier ancien, ornements, calligraphie, sceau) puis placé dans un vrai PDF A4 */
async function acteImage(){
 await Promise.all(['600 80px Cinzel','80px "Pinyon Script"'].map(f=>document.fonts.load(f)));
 const W=1654,H=2339,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 let sd=7;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;let g;
 g=x.createRadialGradient(W/2,H*.45,100,W/2,H/2,H*.75);g.addColorStop(0,'#f3e6bf');g.addColorStop(.6,'#ead7a4');g.addColorStop(1,'#cfae6f');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(let i=0;i<26000;i++){x.fillStyle=`rgba(${90+R()*40|0},${60+R()*30|0},30,${R()*.07})`;x.fillRect(R()*W,R()*H,1+R()*2.5,1+R()*2.5)}
 for(let i=0;i<500;i++){x.strokeStyle=`rgba(120,90,45,${R()*.1})`;x.lineWidth=1;x.beginPath();const a=R()*W,b=R()*H,n=R()*6.28,l=10+R()*40;x.moveTo(a,b);x.lineTo(a+Math.cos(n)*l,b+Math.sin(n)*l);x.stroke()}
 for(let i=0;i<22;i++){const a=R()*W,b=R()*H,r=8+R()*50;g=x.createRadialGradient(a,b,0,a,b,r);g.addColorStop(0,`rgba(140,90,35,${.1+R()*.2})`);g.addColorStop(1,'rgba(140,90,35,0)');x.fillStyle=g;x.fillRect(a-r,b-r,2*r,2*r)}
 for(const f of[H/3,H*2/3]){x.fillStyle='rgba(70,45,15,.18)';x.fillRect(0,f-1,W,2);x.fillStyle='rgba(255,250,235,.45)';x.fillRect(0,f+1,W,3)}
 g=x.createRadialGradient(W/2,H/2,H*.38,W/2,H/2,H*.78);g.addColorStop(0,'rgba(90,55,20,0)');g.addColorStop(1,'rgba(90,55,20,.55)');x.fillStyle=g;x.fillRect(0,0,W,H);
 const B='#4a3519';x.strokeStyle=B;x.fillStyle=B;x.lineWidth=7;x.strokeRect(95,95,W-190,H-190);x.lineWidth=2;x.strokeRect(120,120,W-240,H-240);
 for(const[a,b,sx,sy]of[[135,135,1,1],[W-135,135,-1,1],[135,H-135,1,-1],[W-135,H-135,-1,-1]]){x.save();x.translate(a,b);x.scale(sx,sy);x.lineWidth=3;x.beginPath();x.moveTo(0,0);x.bezierCurveTo(60,10,110,50,100,110);x.bezierCurveTo(95,150,50,150,50,110);x.bezierCurveTo(50,85,80,80,85,100);x.stroke();x.beginPath();x.arc(22,22,8,0,6.3);x.fill();x.restore()}
 const P=new Path2D('M200 25C185 5 160 5 150 20C142 32 156 40 164 32C170 26 162 20 157 24M150 20C130 38 100 40 70 25C55 18 40 20 20 25');
 const orn=(cy,fl)=>{x.save();x.translate(W/2-440,cy);x.scale(2.2,fl?-2.2:2.2);x.lineWidth=1.8;x.lineCap='round';x.stroke(P);x.save();x.translate(400,0);x.scale(-1,1);x.stroke(P);x.restore();x.beginPath();x.moveTo(200,17);x.lineTo(208,25);x.lineTo(200,33);x.lineTo(192,25);x.fill();x.restore()};
 orn(205,false);orn(H-205,true);
 const ink='#0b1430';x.fillStyle=ink;x.textAlign='center';x.textBaseline='alphabetic';x.shadowColor='rgba(11,20,48,.35)';x.shadowBlur=2;
 const sp=(t,y,gap)=>{const w=[...t].map(c=>x.measureText(c).width),T=w.reduce((a,b)=>a+b,0)+gap*(t.length-1);let p=W/2-T/2;x.textAlign='left';[...t].forEach((c,i)=>{x.fillText(c,p,y);p+=w[i]+gap});x.textAlign='center'};
 const wrap=(t,w)=>{let l='',o=[];for(const s of t.split(' ')){const n=l?l+' '+s:s;if(x.measureText(n).width>w&&l){o.push(l);l=s}else l=n}o.push(l);return o};
 x.font='600 80px Cinzel';sp('ACTE DE PRÉSENCE',480,14);
 x.shadowBlur=0;x.fillRect(W/2-300,530,600,3);x.beginPath();x.moveTo(W/2,512);x.lineTo(W/2+16,531);x.lineTo(W/2,550);x.lineTo(W/2-16,531);x.fill();x.shadowBlur=2;
 const L=lines().filter(l=>l[0]==='p');let y=670;
 x.font='600 46px Georgia';for(const t of wrap(L[0][1],1000)){x.fillText(t,W/2,y);y+=70}
 x.font='150px "Pinyon Script"';x.fillText(C.g.replace(' Diom',''),W/2,y+130);x.font='600 52px Cinzel';x.fillText('&',W/2,y+215);x.font='150px "Pinyon Script"';x.fillText(C.b.replace(' Malmels',''),W/2,y+365);
 y+=440;x.font='600 28px Cinzel';sp((C.g+'  &  '+C.b).toUpperCase(),y,6);y+=90;
 x.font='600 46px Georgia';for(const t of wrap(L[1][1],1000)){x.fillText(t,W/2,y);y+=70}
 x.font='italic 600 44px Georgia';x.fillText(L[2][1],W/2,y+40);
 const sy=1735;x.font='150px "Pinyon Script"';x.fillStyle='#0a2466';x.shadowColor='rgba(10,36,102,.4)';x.fillText(G.nom,W/2-90,sy-10);
 x.shadowBlur=0;x.strokeStyle='#0a2466';x.lineWidth=4;x.beginPath();x.moveTo(W/2-420,sy+25);x.bezierCurveTo(W/2-250,sy+5,W/2-100,sy+50,W/2+150,sy+22);x.stroke();
 x.strokeStyle=B;x.lineWidth=2;x.beginPath();x.moveTo(W/2-420,sy+60);x.lineTo(W/2+240,sy+60);x.stroke();x.fillStyle=B;x.font='600 26px Cinzel';sp('SIGNATURE',sy+105,10);
 x.font='italic 30px Georgia';x.fillText('Signature décorative sans valeur juridique · Document de démonstration',W/2,H-165);
 /* sceau de cire */
 const cx=W-330,cy=1880,r=150,pts=[];for(let i=0;i<24;i++){const a=i/24*6.2832,k=1+(R()-.5)*.1;pts.push([cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k])}
 x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=34;x.shadowOffsetX=10;x.shadowOffsetY=16;x.beginPath();pts.forEach((p,i)=>{const n=pts[(i+1)%24],m=[(p[0]+n[0])/2,(p[1]+n[1])/2];i?x.quadraticCurveTo(p[0],p[1],m[0],m[1]):x.moveTo(m[0],m[1])});x.closePath();
 g=x.createRadialGradient(cx-50,cy-60,10,cx,cy,r);g.addColorStop(0,'#4a76bd');g.addColorStop(.55,'#142B50');g.addColorStop(1,'#08152E');x.fillStyle=g;x.fill();x.restore();
 x.lineWidth=8;x.strokeStyle='rgba(0,0,0,.45)';x.beginPath();x.arc(cx,cy,r*.8,0,6.3);x.stroke();x.lineWidth=4;x.strokeStyle='rgba(197,203,214,.35)';x.beginPath();x.arc(cx,cy,r*.84,0,6.3);x.stroke();
 x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=9;x.lineCap='round';x.beginPath();x.arc(cx,cy,r*.9,3.5,4.6);x.stroke();
 x.font='600 92px Cinzel';x.textAlign='center';x.textBaseline='middle';const ini=C.ini.replace('&',' & ');
 x.fillStyle='rgba(0,0,0,.65)';x.fillText(ini,cx+4,cy+5);x.fillStyle='rgba(255,255,255,.35)';x.fillText(ini,cx-2,cy-2);x.fillStyle='#C5CBD6';x.fillText(ini,cx,cy+1);
 return cv.toDataURL('image/jpeg',.93)}
setInterval(()=>{if(window.jspdf)$('#b3').hidden=false},800);
$('#b3').onclick=async()=>{const b=$('#b3'),t=b.textContent;b.disabled=true;b.textContent='Création de votre acte…';
 try{const{jsPDF}=window.jspdf,img=await acteImage(),d=new jsPDF({unit:'mm',format:'a4'});d.addImage(img,'JPEG',0,0,210,297,undefined,'FAST');d.setProperties({title:'Acte de présence – '+G.nom});d.save('acte-de-presence.pdf')}
 catch(e){alert("Le PDF n'a pas pu être généré.")}b.disabled=false;b.textContent=t};
