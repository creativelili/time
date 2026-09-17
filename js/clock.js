window.Clock=(()=>{let use24=true,showSeconds=true;
const days=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
const pad=n=>String(n).padStart(2,"0");

function base(el,v){
  el.innerHTML=`<span class="digit-static">${v}</span>`;
  el.dataset.v=v;
  el.classList.remove("flipping");
}
function setDigit(el,v){
  if(el.dataset.v===undefined){base(el,v);return}
  if(el.dataset.v===v)return;
  const old=el.dataset.v;

  // 下一张数字始终铺在底层，所以翻页过程中不会出现“上半块空白”。
  el.innerHTML=`
    <span class="digit-static next">${v}</span>
    <span class="flap top old-top"><span>${old}</span></span>
    <span class="flap bottom old-bottom"><span>${old}</span></span>
    <span class="flap top new-top"><span>${v}</span></span>
    <span class="flap bottom new-bottom"><span>${v}</span></span>`;

  el.dataset.v=v;
  el.classList.remove("flipping");
  void el.offsetWidth;
  el.classList.add("flipping");

  clearTimeout(el._flipTimer);
  el._flipTimer=setTimeout(()=>base(el,v),720);
}
function update(){
  const d=new Date();
  let h=d.getHours();
  if(!use24)h=h%12||12;
  const vals=[...pad(h),...pad(d.getMinutes()),...pad(d.getSeconds())];
  document.querySelectorAll(".flip").forEach((el,i)=>setDigit(el,vals[i]));
  document.getElementById("date").textContent=`${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())}`;
  document.getElementById("weekday").textContent=`${days[d.getDay()]}  ${d.toLocaleDateString("en-US",{weekday:"long"})}`;
  document.querySelectorAll(".seconds").forEach(el=>el.style.display=showSeconds?"flex":"none");
  const c=document.querySelectorAll("#flipClock>b"); if(c[1])c[1].style.display=showSeconds?"block":"none";
}
function set(o){use24=o.use24;showSeconds=o.showSeconds;update()}
setInterval(update,250);update();return{set,update};
})();