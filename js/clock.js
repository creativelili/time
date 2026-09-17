window.Clock = (() => {
  let use24 = true;
  let showSeconds = true;
  const days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  const pad = n => String(n).padStart(2, "0");

  function draw(el, value) {
    el.innerHTML = `<span class="digit-face">${value}</span>`;
    el.dataset.value = value;
    el.classList.remove("is-flipping");
    el.style.removeProperty("--old");
    el.style.removeProperty("--next");
  }

  function flipTo(el, next) {
    const old = el.dataset.value;
    if (old === undefined) return draw(el, next);
    if (old === next || el.classList.contains("is-flipping")) return;

    // One continuous 360° rotation. The digit is changed at the invisible
    // halfway point, so there is no "flip down, then flip back" feeling.
    el.innerHTML = `<span class="digit-face">${old}</span>`;
    el.dataset.value = next;
    el.classList.add("is-flipping");

    clearTimeout(el._midTimer);
    clearTimeout(el._endTimer);
    el._midTimer = setTimeout(() => {
      const face = el.querySelector(".digit-face");
      if (face) face.textContent = next;
    }, 360);
    el._endTimer = setTimeout(() => draw(el, next), 720);
  }

  function update() {
    const now = new Date();
    let h = now.getHours();
    if (!use24) h = h % 12 || 12;
    const values = [...pad(h), ...pad(now.getMinutes()), ...pad(now.getSeconds())];
    document.querySelectorAll(".flip").forEach((el, i) => flipTo(el, values[i]));

    document.getElementById("date").textContent = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`;
    document.getElementById("weekday").textContent = `${days[now.getDay()]}  ${now.toLocaleDateString("en-US", {weekday:"long"})}`;
    document.querySelectorAll(".seconds").forEach(el => el.style.display = showSeconds ? "flex" : "none");
    const colons = document.querySelectorAll("#flipClock > b");
    if (colons[1]) colons[1].style.display = showSeconds ? "block" : "none";
  }

  function set(options) {
    use24 = options.use24;
    showSeconds = options.showSeconds;
    update();
  }

  setInterval(update, 200);
  update();
  return { set, update };
})();
