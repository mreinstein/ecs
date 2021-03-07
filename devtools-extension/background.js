
function setIconAndPopup(type, tabId) {
  chrome.browserAction.setIcon({
    tabId: tabId,
    path: {
      '32': 'assets/icon_32_' + type + '.png',
      '48': 'assets/icon_48_' + type + '.png',
      '64': 'assets/icon_64_' + type + '.png',
      '128': 'assets/icon_128_' + type + '.png'
    },
  })

  chrome.browserAction.setPopup({
    tabId: tabId,
    popup: 'popups/' + type + '.html',
  })

  chrome.browserAction.setTitle({
    tabId: tabId,
    title: (type === 'disabled') ? 'ECS not detected on this page' : 'ECS detected on this page'
  })
}


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'loading') {
    setIconAndPopup('disabled', tabId);
    if (tabId in devtoolConnections) {
      devtoolConnections[tabId].postMessage({
        id: 'mreinstein/ecs-devtools',
        method: 'disabled'
      });
    }
  } else if (tab.active && changeInfo.status === 'complete') {
    // the tab was refreshed, send message to devtools indicating
    // we should stop drawing ecs data
    devtoolConnections[tabId]?.postMessage({
      id: 'mreinstein/ecs-devtools',
      method: 'tab-complete'
    });

  } else {
    console.log('bg - tab active?:', tab.active, '  status:', changeInfo.status)
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender) {
    //if (!sender.tab)
    //    return
    if (request.method === 'worldCreated')
      setIconAndPopup('detected', sender.tab.id)

    //if (!devtoolConnections[sender.tab?.id])
    //    console.log('cant send, tab id not found:', sender.tab?.id)

    //console.log('relaying msg. size:', request)
    // Receive message from content script and relay to the
    // devTools page for that tab
    devtoolConnections[sender.tab?.id]?.postMessage(request)
  }
)


const devtoolConnections = { }


chrome.runtime.onConnect.addListener(function (port) {
    console.log('connection established:', port)

    const devToolsListener = function (message, sender, sendResponse) {
        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (sender.name === 'mreinstein/ecs-devtools' && message.name == 'init') {
          devtoolConnections[message.tabId] = port
          //console.log('tabid:', message.tabId, 'received a new devtools connection')
          return
        }
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(devToolsListener)

    port.onDisconnect.addListener(function () {
        console.log('port connection closed!')

        port.onMessage.removeListener(devToolsListener)

        const tabs = Object.keys(devtoolConnections)
        for (let i=0, len=tabs.length; i < len; i++) {
            if (devtoolConnections[tabs[i]] == port) {
                console.log('devtools connection closed')
                delete devtoolConnections[tabs[i]]
                break
            }
        }
    })
})
