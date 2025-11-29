// ads-loader.js  （全部これだけにする）

(async () => {
  // ★このIDはあなたのスプレッドシートID（スクショのやつ）
  const sheetId = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk";
  const sheetName = "aff_list";

  const url =
    "https://docs.google.com/spreadsheets/d/" +
    sheetId +
    "/gviz/tq?tqx=out:json&sheet=" +
    encodeURIComponent(sheetName);

  try {
    const res = await fetch(url);
    const text = await res.text();

    // gviz のラッパーを剥がして JSON 部分だけ取り出す
    const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonText);

    const rows = data.table.rows || [];

    // slot_name → active_tag のマップを作る
    const slotMap = {};
    rows.forEach((r) => {
      const slot = r.c[0] && r.c[0].v; // A列 slot_name
      const tag = r.c[3] && r.c[3].v;  // D列 active_tag
      const status = r.c[4] && r.c[4].v; // E列 status

      if (!slot || !tag) return;
      if (status !== "active") return;

      slotMap[slot] = tag;
    });

    // data-ad-slot に対応するタグを流し込む
    document.querySelectorAll("[data-ad-slot]").forEach((el) => {
      const slotName = el.getAttribute("data-ad-slot");
      const tag = slotMap[slotName];
      if (!tag) return;
      el.innerHTML = tag;
    });
  } catch (e) {
    console.error("ads-loader.js error:", e);
  }
})();

