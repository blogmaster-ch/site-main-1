// ads-loader.js（最終版）
// AFF_SYSTEM の aff_list から広告タグを読み込んで、
// data-ad-slot="◯◯" の要素に流し込む。

(async function loadAds() {
  // ★ここだけ自分のシートIDに差し替える
  const SHEET_ID = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk";
  const SHEET_NAME = "aff_list";

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
    SHEET_NAME
  )}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // gvizレスポンスの余分な部分を削ってJSONだけ取り出す
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows || [];

    const slots = {};

    rows.forEach((row) => {
      if (!row.c) return;
      const slotName = row.c[0]?.v;   // A列: スロット名
      const tag = row.c[3]?.v;        // D列: 有効タグ
      const status = row.c[4]?.v;     // E列: 状態（ACTIVE だけ使う）

      if (slotName && tag && (!status || status === "ACTIVE")) {
        slots[slotName] = tag;
      }
    });

    // ページ内の data-ad-slot にタグを差し込む
    document.querySelectorAll("[data-ad-slot]").forEach((el) => {
      const name = el.getAttribute("data-ad-slot");
      if (name && slots[name]) {
        el.innerHTML = slots[name];
      }
    });
  } catch (e) {
    console.error("広告読み込みでエラーが発生しました:", e);
  }
})();
