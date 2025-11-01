// Service worker for Manifest V3
// The redirect logic has been moved to the content script since webRequest blocking is not available in MV3

// Listen for extension installation/startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Google Meet Default Account extension started');
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Google Meet Default Account extension installed');
});

// Handle any messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Future: Handle any cross-script communication if needed
    return true;
});