// content scripts have access to the dom, but run in their own sandbox, and aren't able to access global variables.
// work around for this is to inject the script we want to access globals into the page.
// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
var script = '';

fetch( chrome.extension.getURL( 'content.js' ) )
    .then(res => res.text())
    .then(res => {
        var source = '(function(){' + res + '})();';
        var script = document.createElement('script');
        script.textContent = source;
        script.onload = () => {
            script.parentNode.removeChild(script);
        }
        (document.head||document.documentElement).appendChild(script);
    });


// forward messages   content-script => background-script
window.addEventListener('message', e => {
    if (e.source !== window ||
            typeof e.data !== 'object' ||
            e.data.id !== 'mreinstein/ecs-source') {
                return;
            }

    chrome.runtime?.sendMessage(e.data);
});
