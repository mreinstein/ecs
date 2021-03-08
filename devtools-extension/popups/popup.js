/*
var globalBrowser =  typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null;

var elRemoteId = document.getElementById('remoteId');

document.getElementById('open').addEventListener('click', () => {
  let remoteId = elRemoteId.value;
  if (remoteId && remoteId.length === 6) {
    globalBrowser.tabs.create({
      "url": "/src/app/index.html?remoteConnect&remoteId=" + remoteId
    });
  } else {
    document.getElementById('error').innerHTML = 'ID should be 6 characters long';
  }
});
*/