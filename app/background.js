chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, {
        message: 'TabUpdated'
      });
    }
  })

console.log("Hello from Asana Board Filter!");