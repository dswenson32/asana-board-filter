chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
});

console.log("Hello from Asana Board Filter!");