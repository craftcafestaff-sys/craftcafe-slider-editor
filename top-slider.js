(function(){'use strict';
const safeURL=value=>{try{const u=new URL(value,document.baseURI);return /^https?:$/.test(u.protocol)||(location.protocol==='file:'&&u.protocol==='file:')?u.href:null;}catch{return null;}};
window.CraftCafeSlider={mount(root,items){
if(root._ccDestroy)root._ccDestroy();root.replaceChildren();root.classList.add('cc-slider');root.setAttribute('role','region');root.setAttribute('aria-roledescription','カルーセル');root.setAttribute('aria-label','クラフトカフェ おすすめ特集');
const data=Array.isArray(items)?items.filter(s=>s&&safeURL(s.image)&&safeURL(s.link)):[];
if(!data.length){const e=document.createElement('p');e.className='cc-slider__empty';e.textContent='スライドがありません。データファイルを確認してください。';root.append(e);return;}
let index=0,timer,hover=false,focused=false,gesture=null,suppressClick=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage=document.createElement('div');stage.className='cc-slider__stage';root.append(stage);
const track=document.createElement('div');track.className='cc-slider__track';stage.append(track);
const slides=data.map((s,i)=>{const a=document.createElement('a');a.href=safeURL(s.link);a.target='_top';a.draggable=false;a.className='cc-slider__slide';a.setAttribute('aria-label',s.title||`特集 ${i+1}`);const img=document.createElement('img');img.src=safeURL(s.image);img.alt=s.title||`おすすめ特集 ${i+1}`;img.draggable=false;img.decoding='async';if(!i)img.fetchPriority='high';img.addEventListener('error',()=>{img.hidden=true;const e=document.createElement('span');e.className='cc-slider__error';e.textContent=`画像を読み込めません：${s.title||'特集'}`;a.append(e);},{once:true});a.append(img);track.append(a);return a;});
const controls=document.createElement('div');controls.className='cc-slider__controls';root.append(controls);
function button(label,cls,txt,fn,parent){const el=document.createElement('button');el.type='button';el.className=cls;el.setAttribute('aria-label',label);el.textContent=txt;el.onclick=fn;parent.append(el);return el;}
const dots=data.map((_,i)=>button(`${i+1}枚目を表示`,'cc-slider__dot','',()=>show(i),controls));
const status=document.createElement('span');status.className='cc-slider__status';status.setAttribute('aria-live','polite');root.append(status);
function schedule(){clearTimeout(timer);if(data.length>1&&!reduced&&!hover&&!focused&&!gesture&&!document.hidden)timer=setTimeout(()=>show(index+1,false),5000);}
function position(dx=0,animate=true){track.style.transition=animate&&!reduced?'transform .32s ease':'none';track.style.transform=`translate3d(calc(${-index*100}% + ${dx}px),0,0)`;}
function show(n,announce=true){index=(n+data.length)%data.length;slides.forEach((a,i)=>{a.tabIndex=i===index?0:-1;a.setAttribute('aria-hidden',String(i!==index));dots[i].setAttribute('aria-current',String(i===index));});position();if(announce)status.textContent=`${data.length}枚中${index+1}枚目`;schedule();}
if(data.length>1){button('前のスライド','cc-slider__arrow cc-slider__prev','‹',()=>show(index-1),stage);button('次のスライド','cc-slider__arrow cc-slider__next','›',()=>show(index+1),stage);}else controls.hidden=true;
root.onmouseenter=()=>{hover=true;schedule();};root.onmouseleave=()=>{hover=false;schedule();};root.onfocusin=()=>{focused=true;schedule();};root.onfocusout=e=>{focused=root.contains(e.relatedTarget);schedule();};root.onkeydown=e=>{suppressClick=false;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowLeft'?-1:1));}};
stage.addEventListener('dragstart',e=>e.preventDefault());
stage.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='mouse'||!e.isPrimary||e.button!==0||e.target.closest('button'))return;
 suppressClick=false;
 if(data.length<2)return;
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,drag:false};schedule();
});
const move=e=>{
 if(!gesture||e.pointerId!==gesture.id)return;
 const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
 if(!gesture.drag){
  if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture=null;schedule();return;}
  if(Math.abs(dx)<8||Math.abs(dx)<=Math.abs(dy)*1.2)return;
  gesture.drag=true;suppressClick=true;stage.classList.add('is-dragging');
  try{stage.setPointerCapture(e.pointerId);}catch{}
 }
 e.preventDefault();gesture.dx=dx;
 let visual=dx;
 if((index===0&&dx>0)||(index===data.length-1&&dx<0))visual=dx*.25;
 position(visual,false);
};
const end=e=>{
 if(!gesture||e.pointerId!==gesture.id)return;
 const g=gesture;gesture=null;stage.classList.remove('is-dragging');
 if(g.drag){
  suppressClick=true;e.preventDefault();
  const threshold=Math.min(90,stage.clientWidth*.16);
  if(Math.abs(g.dx)>=threshold){const next=index+(g.dx<0?1:-1);show(Math.max(0,Math.min(data.length-1,next)));}else{position();schedule();}
 }else schedule();
 try{if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);}catch{}
};
const cancel=()=>{if(gesture&&gesture.drag)suppressClick=true;gesture=null;stage.classList.remove('is-dragging');position();schedule();};
// Block the synthesized click after a drag until a fresh deliberate pointerdown.
root.addEventListener('click',e=>{if(suppressClick&&e.target.closest('a')){e.preventDefault();e.stopImmediatePropagation();}},true);
window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',end,{passive:false});const pointerCancel=e=>{if(gesture&&gesture.id===e.pointerId)cancel();};window.addEventListener('pointercancel',pointerCancel);window.addEventListener('blur',cancel);
// Native touch events avoid iOS pointer cancellation while swiping.
let touchStart=null;
stage.addEventListener('touchstart',e=>{
 if(e.touches.length!==1){touchStart=null;cancel();return;}
 if(e.target.closest('button'))return;
 suppressClick=false;
 if(data.length<2)return;
 const t=e.touches[0];touchStart={id:t.identifier,x:t.clientX,y:t.clientY};
 gesture={id:'touch',x:t.clientX,y:t.clientY,dx:0,drag:false};schedule();
},{passive:true});
stage.addEventListener('touchmove',e=>{
 if(!touchStart||!gesture||gesture.id!=='touch')return;
 if(e.touches.length!==1){touchStart=null;cancel();return;}
 const t=Array.from(e.touches).find(t=>t.identifier===touchStart.id);if(!t)return;
 const dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;
 if(!gesture.drag&&Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){touchStart=null;cancel();return;}
 if(!gesture.drag&&(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy)*1.15))return;
 gesture.drag=true;suppressClick=true;gesture.dx=dx;stage.classList.add('is-dragging');
 if(e.cancelable)e.preventDefault();
 let visual=dx;if((index===0&&dx>0)||(index===data.length-1&&dx<0))visual=dx*.25;
 position(visual,false);
},{passive:false});
stage.addEventListener('touchend',e=>{
 if(!touchStart)return;
 const t=Array.from(e.changedTouches).find(t=>t.identifier===touchStart.id);if(!t)return;
 touchStart=null;
 if(gesture&&gesture.id==='touch')end({pointerId:'touch',preventDefault:()=>{if(e.cancelable)e.preventDefault();}});
},{passive:false});
stage.addEventListener('touchcancel',()=>{touchStart=null;cancel();},{passive:true});
const visibility=()=>{if(document.hidden)cancel();schedule();};document.addEventListener('visibilitychange',visibility);
root._ccDestroy=()=>{clearTimeout(timer);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',pointerCancel);window.removeEventListener('blur',cancel);document.removeEventListener('visibilitychange',visibility);};show(0,false);
}};
function init(){document.querySelectorAll('[data-cc-slider]').forEach(el=>window.CraftCafeSlider.mount(el,window.CRAFTCAFE_SLIDES));}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
