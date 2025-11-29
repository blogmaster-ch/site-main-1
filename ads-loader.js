// ads-loader.js
(async () => {
  const slots = {
    "DSP_TOP": `<script src="https://adm.shinobi.jp/s/137c05cbffcb686bbf68307ee12856cf"></script>`,
    "DSP_MID": `<script src="https://adm.shinobi.jp/s/137c05cbffcb686bbf68307ee12856cf"></script>`,
    "DSP_BOTTOM": `<script src="https://adm.shinobi.jp/s/137c05cbffcb686bbf68307ee12856cf"></script>`
  };

  Object.keys(slots).forEach(key => {
    const target = document.querySelector(`[data-ad-slot="${key}"]`);
    if (target) {
      target.innerHTML = slots[key];
    }
  });
})();
