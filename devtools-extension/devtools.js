
chrome.devtools.panels.create(
  "ECS",
  "assets/icon_128_detected.png",
  "app.html", function (panel) {
    /*
    panel.onShown.addListener(function(win) {
        //var status = win.document.querySelector("#status");
        //status.innerHTML = "Fixing to make magic.";
        win.panelShowing(panel)
    });
    */

    // this doesn't seem super useful right now because there's no window reference to the panel
    //panel.onHidden.addListener(function() { });
  });
