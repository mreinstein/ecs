
chrome.devtools.panels.create(
  "ECS",
  "assets/icon_128_detected.png",
  "app.html", function (panel) {
    panel.onShown.addListener(function(win) {
        //var status = win.document.querySelector("#status");
        //status.innerHTML = "Fixing to make magic.";
        win.panelShowing()

    });
  });
