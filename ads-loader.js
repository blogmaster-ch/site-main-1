// ads-loader.js

async function loadAds() {
  // ★ ここはあなたが直したスプレッドシートIDのままでOK
  const sheetId = "10z11NTxO47UlxVWFHoIlM_Zm2pIwgRvI1HxbHapKxvk"; 
  const sheetName = "aff_list";

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // GoogleスプシのJSON前後のゴミを削る
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows;

    // スロット名 → 忍者の src URL のマップ
    const slotToSrc = {};

    rows.forEach((row) => {
      if (!row.c) return;

      const slot   = row.c[0] && row.c[0].v;  // スロット名（DSP_TOPなど）
      const tagRaw = row.c[3] && row.c[3].v;  // 有効タグ（忍者タグ全文）
      const status = row.c[4] && row.c[4].v;  // 状態（ACTIVEなど）

      if (!slot || !tagRaw) return;
      if (status && status !== "ACTIVE") return;

      // 有効タグの中から src="..." を抜き出す
      let src = tagRaw;
      const m = tagRaw.match(/src=["']([^"']+)["']/i);
      if (m) {
        src = m[1];
      }

      slotToSrc[slot] = src;
    });

    // data-ad-slot="DSP_TOP" などの場所に <script src="..."> を挿入
    document.querySelectorAll("[data-ad-slot]").forEach((el) => {
      const slotName = el.getAttribute("data-ad-slot");
      const src = slotToSrc[slotName];
      if (!src) return;

      // いったん中身を空にしてからscript要素を追加
      el.innerHTML = "";
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      el.appendChild(s);
    });

  } catch (e) {
    console.error("loadAds error", e);
  }
}

// ページのDOM読み込みが終わったら実行
document.addEventListener("DOMContentLoaded", loadAds);

