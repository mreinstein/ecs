// content scripts have access to the dom, but run in their own sandbox, and aren't able to access global variables.
// work around for this is to inject the script we want to access globals into the page.
// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script

var script = document.createElement('script');
script.textContent = 'window.__MREINSTEIN_ECS_DEVTOOLS = true;';
script.onload = () => {
    script.parentNode.removeChild(script);
}
(document.head || document.documentElement).appendChild(script);

/*
const backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
})
*/

// forward messages   content-script => background-script
window.addEventListener('message', e => {
    if (e.source !== window || typeof e.data !== 'object' || e.data.id !== 'mreinstein/ecs-source')
        return;

    // sometimes this just inexplicably fails.
    // wrapping it in a try/catch block at least ignores the failures.
    // I'm not sure the failures actually affect anything.
    try {
        chrome.runtime.sendMessage(e.data);
        //backgroundPageConnection.sendMessage(e.data);

    } catch (err) { }
});
