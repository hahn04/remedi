(() => {
  "use strict";

  const pixelId = "1152863100747905";
  const productionHosts = new Set(["k-remedi.com", "www.k-remedi.com"]);

  // Keep ordinary local previews out of the production dataset.
  if (!productionHosts.has(window.location.hostname) || window.__remediMetaPixelLoaded) return;
  window.__remediMetaPixelLoaded = true;

  // Meta Pixel base loader. The library loads asynchronously.
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  // Use the explicit PageView call instead of automatic event detection.
  window.fbq("set", "autoConfig", false, pixelId);
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
})();
