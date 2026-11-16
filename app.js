const en=new URLSearchParams(location.search).get('lang')==='en';
const T=en?{brand:'World Map Classroom',eyebrow:'GEOGRAPHY · LOCATION & TERRITORY',title:'Put the world in place',intro:'Place the seven continents and four oceans. Drag a label, or select it and tap a numbered position.',progressText:'labels placed',nameLabel:'Name',classLabel:'Class / No.',identityHint:'Optional · your work stays in this browser.',mapTitle:'Your world map',mapHint:'',zoom:'Zoom map',unzoom:'Normal size',source:'',trayTitle:'Choose a label',continentsTitle:'SEVEN CONTINENTS',oceansTitle:'FOUR OCEANS',check:'Check answers',result:'Homework image',reset:'Start again',footnote:'Drag placed labels to move them, swap two occupied positions, or return them to the name box. You can still tap a label to take it back.',resultTitle:'Your homework record',saveHint:'Download the image, take a screenshot, or press and hold the image to save it on your phone. Send it to your teacher yourself.',download:'Download image',share:'Share image',waiting:'Choose a name below to begin.',selected:'Selected: ',pick:'Now tap a numbered map position.',incomplete:'Place all 11 labels before creating your homework image.',allcorrect:'Well done! All 11 labels are correct.',correct:' correct. Adjust the orange labels and try again.',confirm:'Clear all placements and start again?',placed:'Placed',score:'Correct',time:'Created',blank:'Not provided',record:'Seven continents · Four oceans',imageAlt:'Completed map and answer record',saved:'Image ready. If no download appears, press and hold the image to save.',shareFail:'Sharing is unavailable here. Download or save the image instead.'}:{brand:'世界地圖學習室',eyebrow:'地理 · 區位與疆域',title:'把世界放回正確位置',intro:'標示七大洲、四大洋。拖放名稱，或先點選名稱，再點地圖上的編號位置。',progressText:'已放置名稱',nameLabel:'姓名',classLabel:'班別／學號',identityHint:'可選填 · 作答只保留在這個瀏覽器。',mapTitle:'你的世界地圖',mapHint:'',zoom:'放大地圖',unzoom:'正常大小',source:'',trayTitle:'選一個名稱',continentsTitle:'七大洲',oceansTitle:'四大洋',check:'檢查答案',result:'作業圖片',reset:'重新開始',footnote:'地圖標籤可直接拖到另一位置；已有標籤便互換，拖回下方名稱框便取回。也可點選取回。',resultTitle:'你的作業記錄',saveHint:'下載圖片、直接截圖，或在手機長按圖片儲存，再自行傳送給老師。',download:'下載作業圖片',share:'分享圖片',waiting:'先從下面選一個名稱。',selected:'已選：',pick:'接着點選地圖上的編號位置。',incomplete:'請先放好全部 11 個名稱，再製作作業圖片。',allcorrect:'做得好！11 個名稱全部正確。',correct:' 個正確。可調整橙色標籤後再試。',confirm:'清除所有標示並重新開始？',placed:'已放置',score:'答對',time:'製作時間',blank:'未填寫',record:'七大洲 · 四大洋',imageAlt:'已完成的地圖與作答記錄',saved:'圖片已準備好。如未出現下載，可長按圖片儲存。',shareFail:'這個瀏覽器暫不支援分享，請下載或長按儲存圖片。'};
const mapCredits=['地圖資料來源：中華人民共和國自然資源部 審圖號：GS(2016)1633號', "Map Data Source: Ministry of Natural Resources of the People's Republic of China. Map Approval Numbers: GS(2016)1633"];
const items=[['asia','亞洲','Asia',.38,.28],['europe','歐洲','Europe',.16,.255],['africa','非洲','Africa',.16,.50],['north-america','北美洲','North America',.79,.28],['south-america','南美洲','South America',.88,.59],['oceania','大洋洲','Oceania',.47,.64],['antarctica','南極洲','Antarctica',.48,.89],['pacific','太平洋','Pacific Ocean',.64,.49],['indian','印度洋','Indian Ocean',.32,.59],['atlantic','大西洋','Atlantic Ocean',.065,.62],['arctic','北冰洋','Arctic Ocean',.49,.075]].map((a,i)=>({id:a[0],label:a[en?2:1],x:a[3],y:a[4],n:i+1}));
const $=s=>document.getElementById(s);let placements={},selected=null,checked=false,ghost=null,drag=null,resultBlob=null,resultURL=null;
try{let s=JSON.parse(localStorage.getItem('world-map-v1')||'{}');let used=new Set();for(const [k,v] of Object.entries(s.placements||{})){if(items.some(i=>i.id===k)&&items.some(i=>i.id===v)&&!used.has(v)){placements[k]=v;used.add(v)}}$('studentName').value=typeof s.name==='string'?s.name.slice(0,32):'';$('studentClass').value=typeof s.className==='string'?s.className.slice(0,24):'';}catch{}
document.documentElement.lang=en?'en':'zh-Hant';document.title=T.brand;Object.keys(T).forEach(k=>{if($(k))$(k).textContent=T[k]});$('baseMap').alt=en?'Teacher-supplied world base map':'教師提供的世界底圖';$('resultImage').alt=T.imageAlt;document.querySelector(`nav a[href="?lang=${en?'en':'zh'}"]`).classList.add('active');
$('source').replaceChildren(...mapCredits.map(text=>{const line=document.createElement('span');line.textContent=text;return line}).filter((line,index)=>index===(en?1:0)));
function save(){try{localStorage.setItem('world-map-v1',JSON.stringify({placements,name:$('studentName').value,className:$('studentClass').value}))}catch{}}
function score(){return items.filter(i=>placements[i.id]===i.id).length}
function invalidate(){checked=false;$('feedback').textContent=''}
function select(id){selected=id;render()}
function place(target,id){placements=moveMapLabel(placements,target,id);selected=null;invalidate();save();render()}
function render(){const used=Object.values(placements);$('count').textContent=used.length+' / 11';$('selected').textContent=selected?T.selected+items.find(i=>i.id===selected).label+' · '+T.pick:T.waiting;for(const i of items){const c=$('chip-'+i.id),p=$('target-'+i.id),value=placements[i.id];c.className='chip'+(i.n>7?' ocean':'')+(used.includes(i.id)?' used':'')+(selected===i.id?' selected':'');c.setAttribute('aria-pressed',String(selected===i.id));p.replaceChildren();if(value){const num=document.createElement('small');num.textContent=i.n;p.append(num,document.createTextNode(items.find(v=>v.id===value).label));}else p.textContent=i.n;p.className='target'+(value?' filled':'')+(checked&&value?(value===i.id?' good':' bad'):'');p.setAttribute('aria-label',(en?'Position ':'位置 ')+i.n+(value?' '+items.find(v=>v.id===value).label:''));}}
function cleanDrag(){
  if(drag?.frame)cancelAnimationFrame(drag.frame);
  drag?.element.classList.remove('dragging');
  document.querySelectorAll('.drop-ready').forEach(el=>el.classList.remove('drop-ready'));
  ghost?.remove();ghost=null;drag=null;
}
function dragFrame(){
  if(!drag?.moved)return;
  const d=drag,edge=55;
  if(!matchMedia('(max-width:700px), (max-height:500px) and (pointer:coarse)').matches){if(d.cy<edge)window.scrollBy(0,-12);else if(d.cy>innerHeight-edge)window.scrollBy(0,12);}
  const sc=$('mapScroll'),r=sc.getBoundingClientRect();
  if(d.cy>r.top&&d.cy<r.bottom&&d.cx>r.left&&d.cx<r.right){if(d.cx<r.left+edge)sc.scrollLeft-=12;else if(d.cx>r.right-edge)sc.scrollLeft+=12;if(d.cy<r.top+35)sc.scrollTop-=8;else if(d.cy>r.bottom-35)sc.scrollTop+=8;}
  document.querySelectorAll('.drop-ready').forEach(el=>el.classList.remove('drop-ready'));
  document.elementFromPoint(d.cx,d.cy)?.closest('[data-target],.tray')?.classList.add('drop-ready');
  d.frame=requestAnimationFrame(dragFrame);
}
function enableDrag(element,getId){
  let suppressClickUntil=0;
  element.addEventListener('click',e=>{if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
  element.addEventListener('pointerdown',e=>{
    const id=getId();if(!id||e.button!==0||drag)return;
    drag={id,element,x:e.clientX,y:e.clientY,cx:e.clientX,cy:e.clientY,moved:false,pointer:e.pointerId};
    element.setPointerCapture(e.pointerId);
  });
  element.addEventListener('pointermove',e=>{
    if(!drag||drag.element!==element||drag.pointer!==e.pointerId)return;
    drag.cx=e.clientX;drag.cy=e.clientY;
    if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6){
      drag.moved=true;element.classList.add('dragging');
      ghost=document.createElement('div');ghost.className='ghost';ghost.textContent=items.find(i=>i.id===drag.id).label;document.body.append(ghost);
      drag.frame=requestAnimationFrame(dragFrame);
    }
    if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';}
  });
  element.addEventListener('pointerup',e=>{
    if(!drag||drag.element!==element||drag.pointer!==e.pointerId)return;
    const {id,moved}=drag;
    const drop=moved?document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-target],.tray'):null;
    if(moved)suppressClickUntil=performance.now()+600;
    cleanDrag();
    if(drop?.dataset.target)place(drop.dataset.target,id);
    else if(drop?.classList.contains('tray'))place(null,id);
    // Releasing outside a valid destination keeps the existing placement.
  });
  element.addEventListener('pointercancel',()=>{if(drag?.element===element){suppressClickUntil=performance.now()+600;cleanDrag();}});
  element.addEventListener('lostpointercapture',()=>{if(drag?.element===element)cleanDrag();});
}
for(const i of items){
  const p=document.createElement('button');p.id='target-'+i.id;p.style.left=i.x*100+'%';p.style.top=i.y*100+'%';p.dataset.target=i.id;
  p.onclick=()=>{if(selected)place(i.id,selected);else if(placements[i.id]){const v=placements[i.id];delete placements[i.id];invalidate();save();select(v)}};
  enableDrag(p,()=>placements[i.id]);$('targets').append(p);
  const c=document.createElement('button');c.id='chip-'+i.id;c.textContent=i.label;c.onclick=()=>select(i.id);
  enableDrag(c,()=>i.id);$(i.n<=7?'continents':'oceans').append(c);
}
for(const bank of ['continents','oceans']){const children=Array.from($(bank).children);for(let k=children.length-1;k>0;k--){let j=Math.floor(Math.random()*(k+1));[children[k],children[j]]=[children[j],children[k]]}children.forEach(c=>$(bank).append(c))}
$('studentName').oninput=save;$('studentClass').oninput=save;$('zoom').onclick=()=>{const z=$('map').classList.toggle('zoomed');$('zoom').textContent=z?T.unzoom:T.zoom};
$('check').onclick=()=>{checked=true;render();const n=score();$('feedback').textContent=n===11?T.allcorrect:n+' / 11'+T.correct};$('reset').onclick=()=>{if(confirm(T.confirm)){placements={};selected=null;invalidate();save();render()}};
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke()}
async function makeRecord(){if(Object.keys(placements).length<11){$('feedback').textContent=T.incomplete;return}await $('baseMap').decode();if(document.fonts?.ready)await document.fonts.ready;checked=true;render();$('feedback').textContent=score()===11?T.allcorrect:score()+' / 11'+T.correct;const c=document.createElement('canvas');c.width=1800;c.height=1420;const g=c.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,c.width,c.height);g.fillStyle='#194b50';g.font='bold 36px Arial,"Microsoft JhengHei",sans-serif';g.fillText(T.brand+' — '+T.record,45,60);g.font='24px Arial,"Microsoft JhengHei",sans-serif';g.fillText(T.nameLabel+': '+($('studentName').value||T.blank)+'     '+T.classLabel+': '+($('studentClass').value||T.blank),45,105);g.fillText(T.score+': '+score()+' / 11     '+T.time+': '+new Date().toLocaleString(en?'en-GB':'zh-HK'),45,145);const mx=30,my=180,mw=1740,mh=mw*$('baseMap').naturalHeight/$('baseMap').naturalWidth;const image=$('baseMap'),top=.045,bottom=.048;g.drawImage(image,0,image.naturalHeight*top,image.naturalWidth,image.naturalHeight*(1-top-bottom),mx,my+mh*top,mw,mh*(1-top-bottom));for(const i of items){const value=items.find(v=>v.id===placements[i.id]);const text=i.n+'. '+value.label;g.font='bold 20px Arial,"Microsoft JhengHei",sans-serif';const w=g.measureText(text).width+22,x=mx+i.x*mw-w/2,y=my+i.y*mh-19;g.fillStyle='#ffffff';g.strokeStyle=value.id===i.id?'#287548':'#b56034';g.lineWidth=2;roundRect(g,x,y,w,38,7);g.fillStyle='#163d44';g.fillText(text,x+11,y+26)}const by=my+mh+35;g.font='22px Arial,"Microsoft JhengHei",sans-serif';items.forEach((i,k)=>{const v=items.find(v=>v.id===placements[i.id]),col=k%4,row=Math.floor(k/4);g.fillStyle=v.id===i.id?'#287548':'#a34d2d';g.fillText(i.n+'. '+v.label+' '+(v.id===i.id?'✓':'×'),45+col*435,by+row*39)});g.fillStyle='#667970';g.font='18px Arial,"Microsoft JhengHei",sans-serif';g.fillText(mapCredits[en?1:0],45,1370);resultBlob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(resultURL)URL.revokeObjectURL(resultURL);resultURL=URL.createObjectURL(resultBlob);$('resultImage').src=resultURL;$('saveStatus').textContent='';$('resultDialog').showModal()}
$('result').onclick=()=>makeRecord().catch(()=>{$('feedback').textContent=en?'The image is still loading. Please try again.':'圖片仍在載入，請稍後再試。'});$('closeResult').onclick=()=>$('resultDialog').close();$('download').onclick=()=>{const a=document.createElement('a');a.href=resultURL;a.download='world-map-homework-'+(en?'en':'zh')+'.png';a.click();$('saveStatus').textContent=T.saved};$('share').onclick=async()=>{try{const file=new File([resultBlob],'world-map-homework.png',{type:'image/png'});if(!navigator.canShare?.({files:[file]}))throw Error();await navigator.share({files:[file],title:T.record})}catch(e){if(e.name!=='AbortError')$('saveStatus').textContent=T.shareFail}};render();

// Size the map to its own panel so the label bank remains on screen.
const compactScreen=matchMedia('(max-width:700px), (max-height:500px) and (pointer:coarse)');
function fitMapPanel(){
 if(compactScreen.matches){
  $('map').style.setProperty('--panel-map-width',Math.max(560,$('mapScroll').clientWidth,($('mapScroll').clientHeight-2)*4655/2444)+'px');
  $('mapHint').textContent='';
 }else{$('map').style.removeProperty('--panel-map-width');$('mapHint').textContent=T.mapHint;}
}
new ResizeObserver(fitMapPanel).observe($('mapScroll'));
compactScreen.addEventListener('change',fitMapPanel);fitMapPanel();
