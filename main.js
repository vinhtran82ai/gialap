import * as Comlink from "./comlink.min.js";

const canvas = document.getElementById("lcd");
const ctx = canvas.getContext("2d");
const api = Comlink.wrap(new Worker("./simwrapper.js"));

const loadBin = async url =>
  new Uint8Array(await (await fetch(url)).arrayBuffer());

(async () => {
  await api.Init(
    "CY298",
    "CY",
    await loadBin("./core.dat"),
    await (await fetch("./keylog.json")).json(),
    1,
    false,
    false
  );

  let prev = null;
  function loop() {
    api.GetDisplayImageData(prev, false).then(img => {
      prev = img;
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(loop);
    });
  }
  loop();
})();

// CLICK HANDLER – SVG INLINE
document.addEventListener("click", e => {
  const key = e.target.getAttribute("data-key");
  if (key) {
    api.SetHardwareKey(key);
  }
});
