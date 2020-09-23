var count = 0;
var app = document.querySelector('#app');


let backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
})


backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});


chrome.runtime.onConnect.addListener(m => {
    count = 0
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
})


backgroundPageConnection.onMessage.addListener(function (message) {
    // worldCreated || refreshData || disabled
    if (message.method === 'disabled')
        count = 0
    else
        count++

    app.innerHTML = `Stats Count:: ${count}`
})


backgroundPageConnection.onDisconnect.addListener(function () {
    console.log('background page disconnected :o')
    console.log('reconnecting')
    backgroundPageConnection = chrome.runtime.connect({
        name: 'mreinstein/ecs-devtools'
    })

    console.log('sending init. tabid:', chrome.devtools.inspectedWindow.tabId)
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
})


window.panelShowing = function () {
    console.log('panel is showing. backgroundPageConnection:', backgroundPageConnection)

    console.log('firing an init from panel')
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
}

