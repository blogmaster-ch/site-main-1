// ads-loader.js
(async () => {
  // ★ここをあなたのシートIDにする
  //   URLが https://docs.google.com/spreadsheets/d/XXXXX/edit...
  //   の「XXXXX」の部分だけに置き換える
  const SHEET_ID = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk"; // 例

  const SHEET_NAME = "aff_list";

  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // gviz形式なので先頭と末尾を削る
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows || [];
    const slots = {};

    rows.forEach((r) => {
      const slotName = r.c[0]?.v; // A列: slot_name
      const tag      = r.c[3]?.v; // D列: active_tag
      const status   = r.c[4]?.v; // E列: status

      if (!slotName || !tag) return;
      if (status && String(status).toLowerCase() !== "active") return;

      slots[slotName] = tag;
    });

    // デバッグ用（必要ならF12 → Consoleで確認できる）
    console.log("loaded ad slots:", slots);

    document.querySelectorAll("[data-ad-slot]").forEach((el) => {
      const name = el.getAttribute("data-ad-slot");
      if (name && slots[name]) {
        el.innerHTML = slots[name];
      }
    });
  } catch (e) {
    console.error("ads-loader error", e);
  }
})();
