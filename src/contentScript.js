// Content script for Google Meet Default Account extension (Manifest V3)

function handleDefaultAccountRedirect() {
    chrome.storage.sync.get({
        authuser: '',
        force: false
    }, function(result) {
        const authUser = result.authuser;
        const force = result.force;
        
        // Only proceed if authuser is set and is a valid positive integer
        if (!authUser || parseInt(authUser) <= 0) {
            return;
        }
        
        const currentUrl = window.location.href;
        const loweredUrl = currentUrl.toLowerCase();
        
        const authUserExists = loweredUrl.indexOf('authuser') >= 0;
        const authUserIsSame = authUserExists && loweredUrl.indexOf('authuser=' + authUser) >= 0;
        
        const shouldRedirect = (!authUserExists || (!authUserIsSame && force));
        const isRedirectUriCorrect = (
            /meet.google.com\/.*-.*-.*/.test(currentUrl) || 
            currentUrl === 'https://meet.google.com/' || 
            currentUrl === 'https://meet.google.com/landing' || 
            currentUrl === 'https://meet.google.com/new'
        );
        
        if (shouldRedirect && isRedirectUriCorrect) {
            const urlParts = currentUrl.split('?');
            const baseUrl = urlParts[0];
            const params = new URLSearchParams(urlParts[1] || '');
            
            // Remove any existing authuser parameter
            for (const [key] of params.entries()) {
                if (key.toLowerCase() === 'authuser') {
                    params.delete(key);
                }
            }
            
            // Add the new authuser parameter
            params.set('authuser', authUser);
            
            // Perform the redirect
            const newUrl = baseUrl + '?' + params.toString();
            window.location.href = newUrl;
        }
    });
}

function handleAuthUserHiding() {
    if (window.location.href.toLowerCase().indexOf("authuser=") >= 0) {
        chrome.storage.sync.get({
            hideAuthUser: false,
        }, function(result) {
            if (result.hideAuthUser) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        });
    }
}

// Run the redirect logic when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleDefaultAccountRedirect);
} else {
    handleDefaultAccountRedirect();
}

// Handle authuser hiding functionality
handleAuthUserHiding();