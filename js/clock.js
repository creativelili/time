
window.Clock = (() => {
  let use24 = true;
  let showSeconds = true;

  const days = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  const pad = n => String(n).padStart(2, "0");

  function draw(el, value) {
    el.innerHTML = `<span class="digit-base">${value}</span>`;
    el.dataset.value = value;
    el.classList.remove("is-flipping");
  }

  function flipTo(el, next) {
    const old = el.dataset.value;

    if (old === undefined) {
      draw(el, next);
      return;
    }
    if (old === next || el.classList.contains("is-flipping")) return;

    /*
      关键：
      1. 整个“下一数字”先铺在底层，因此任何时刻都不会出现空白。
      2. 旧数字只有上半页参与翻转。
      3. 新数字的上半页在旧上半页翻下后翻入。
      4. 下半页始终显示下一数字，避免黑块和空内容。
    */
    el.innerHTML = `
      <span class="digit-base">${next}</span>

      <span class="digit-half old-top">
        <span>${old}</span>
      </span>

      <span class="digit-half new-top">
        <span>${next}</span>
      </span>
    `;

    el.dataset.value = next;
    el.classList.add("is-flipping");

    clearTimeout(el._timer);
    el._timer = setTimeout(() => draw(el, next), 700);
  }

  function update() {
    const now = new Date();

    let h = now.getHours();
    if (!use24) h = h % 12 || 12;

    const values = [
      ...pad(h),
      ...pad(now.getMinutes()),
      ...pad(now.getSeconds())
    ];

    document.querySelectorAll(".flip").forEach((el, i) => {
      flipTo(el, values[i]);
    });

    document.getElementById("date").textContent =
      `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}`;

    document.getElementById("weekday").textContent =
      `${days[now.getDay()]}  ${now.toLocaleDateString("en-US", {weekday:"long"})}`;

    document.querySelectorAll(".seconds").forEach(el => {
      el.style.display = showSeconds ? "flex" : "none";
    });

    const colons = document.querySelectorAll("#flipClock > b");
    if (colons[1]) {
      colons[1].style.display = showSeconds ? "block" : "none";
    }
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
