import * as Comlink from "./comlink.min.js";

const c = document.getElementById("lcd");
const ctx = c.getContext("2d");
const api = Comlink.wrap(new Worker("./simwrapper.js"));

const bin = async u => new Uint8Array(await (await fetch(u)).arrayBuffer());

(async ()=>{
  await api.Init(
    "CY298","CY",
    await bin("./core.dat"),
    await (await fetch("./keylog.json")).json(),
    1,false,false
  );

  let old=null;
  (function loop(){
    api.GetDisplayImageData(old,false).then(img=>{
      old=img; ctx.putImageData(img,0,0);
      requestAnimationFrame(loop);
    });
  })();
})();

face.addEventListener("load",()=>{
  face.contentDocument.onclick=e=>{
    const k=e.target.getAttribute("data-key");
    if(k) api.SetHardwareKey(k);
  };
});
