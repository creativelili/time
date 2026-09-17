(() => {
  const $ = id => document.getElementById(id);
  const K = "time-settings-v1";
  const panel = $("panel");
  const menu = $("menu");
  const close = $("close");
  const alarmBtn = $("alarmBtn");
  const nightBtn = $("nightBtn");
  const use24 = $("use24");
  const seconds = $("seconds");
  const night = $("night");
  const newAlarm = $("newAlarm");
  const alarmEditor = $("alarmEditor");
  const cancel = $("cancel");
  const save = $("save");
  const alarmTime = $("alarmTime");
  const repeat = $("repeat");
  const alarmLabel = $("alarmLabel");
  const stop = $("stop");
  const snooze = $("snooze");
  const fullscreen = $("fullscreen");
  const wake = $("wake");

  let settings = {};
  try { settings = JSON.parse(localStorage.getItem(K) || "{}"); } catch (_) {}

  use24.checked = settings.use24 !== false;
  seconds.checked = settings.seconds !== false;
  night.checked = !!settings.night;

  function apply() {
    const x = {
      use24: use24.checked,
      seconds: seconds.checked,
      night: night.checked
    };
    localStorage.setItem(K, JSON.stringify(x));
    document.body.classList.toggle("night", x.night);
    Clock.set({ use24: x.use24, showSeconds: x.seconds });
  }

  function openPanel() {
    panel.classList.add("open");
  }

  function closePanel() {
    panel.classList.remove("open");
  }

  apply();

  menu.addEventListener("click", openPanel);
  alarmBtn.addEventListener("click", openPanel);

  // 设置面板关闭：右上角 ×
  close.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    closePanel();
  });

  // 点击设置面板外部也可以关闭
  panel.addEventListener("click", event => {
    if (event.target === panel) closePanel();
  });

  // ESC 关闭设置界面
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePanel();
      alarmEditor.classList.remove("show");
    }
  });

  nightBtn.addEventListener("click", () => {
    night.checked = !night.checked;
    apply();
  });

  [use24, seconds, night].forEach(el => el.addEventListener("change", apply));

  newAlarm.addEventListener("click", () => alarmEditor.classList.add("show"));
  cancel.addEventListener("click", () => alarmEditor.classList.remove("show"));

  save.addEventListener("click", () => {
    if (!alarmTime.value) return;
    Alarm.add({
      time: alarmTime.value,
      repeat: repeat.value,
      label: alarmLabel.value.trim(),
      date: new Date().toISOString().slice(0, 10)
    });
    alarmEditor.classList.remove("show");
  });

  stop.addEventListener("click", () => Alarm.stop());
  snooze.addEventListener("click", () => Alarm.snooze());

  fullscreen.addEventListener("click", async () => {
    try {
      document.fullscreenElement
        ? await document.exitFullscreen()
        : await document.documentElement.requestFullscreen();
    } catch (e) {}
  });

  let lock = null;
  wake.addEventListener("click", async () => {
    if (!("wakeLock" in navigator)) {
      alert("当前浏览器不支持屏幕常亮");
      return;
    }
    try {
      lock = await navigator.wakeLock.request("screen");
      wake.textContent = "已保持屏幕常亮";
    } catch (e) {}
  });

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && lock) {
      try { lock = await navigator.wakeLock.request("screen"); } catch (e) {}
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
})();
