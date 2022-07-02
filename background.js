async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function notify(type, message){
    var icon = "";
    if(type == "warning"){
        icon = "img/warning.png";
    }else if(type == "danger"){
        icon = "img/danger.png";
    }else{
        icon = "img/icon32.png";
    }

    chrome.notifications.create('1', {
        type: 'basic',
        iconUrl: icon,
        title: "URL Lockup",
        message: message,
        priority: 2
    })
}

var notifications = {
    'http': 'Sua conexão com este site não é segura!\n\nEste site não utiliza criptografia na transferência de dados!',
}

//url https://dmitripavlutin.com/parse-url-javascript/
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var newTab = false;
        tabs = getCurrentTab();
        const url = new URL(tab.url);
        
        if(tab.url == "chrome://newtab/"){
            newTab = true;
        }

        if(!newTab){
            if(url.protocol != "https:"){
                notify('warning', notifications['http']);
            }
        }
    }
})