//Manifest: https://developer.chrome.com/docs/extensions/mv3/manifest/

//Stage-1 - Verificação do protocolo da requisição
//Stage-2 - 

import * as countryList from './countryList.js';
import * as whitelist from './whitelist.js';

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true }
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions)
    return tab
}


// Início - definição das constantes que serão utilizadas na execução da análise
function notifications(notification, params){
    let message = ""
    switch (notification){
        case 'http':
            return 'Sua conexão com este site não é segura!\nEste site não utiliza criptografia na transferência de dados!'
            break
        case 'domain':
            return 'Atenção você está acessando um site externo!\nEste site utiliza um domínio do(a) '+params+'!'
            break
    }
}

// Fim - definição das constantes que serão utilizadas na execução da análise



// Início - funções necessárias para a execução da análise
function notify(type, message){
    var icon = ""
    if(type == "warning"){
        icon = "img/warning.png"
    }else if(type == "danger"){
        icon = "img/danger.png"
    }else{
        icon = "img/icon32.png"
    }

    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: icon,
        title: "URL Lockup",
        message: message,
        priority: 2
    })
}

function protocolCheck(url){ //stage-1
    if(url.protocol != "chrome:"){
        if(url.protocol != "https:"){
            notify('danger', notifications('http'))
            return false
        }else{
            return true
        }
    }else{
        return false
    }
}

function whoisCheck(url){
    console.log('whois check');
    fetch('https://www.urlverify.com.br/check.php?url='+url).then(r => r.text()).then(result => {
        console.log(result);
    }) 
}

function getHost(url){
    let countries = countryList.default
    let host = url.host.split('.')
    if(host.length == 2){
        return host;
    }else if(host.length >= 3){
        if(countries[host[2]]){
            return host[0]+"."+host[1]+"."+host[2]
        }else{
            return host[1]+"."+host[2]
        }
    }
}

function whitelistCheck(url){
    const whitelisted = whitelist.default
    if(whitelisted.includes(getHost(url))){
        console.log("Founded on whitelist")
        return true;
    }else{
        console.log("Nothing found on whitelist")
        return false;
    }
}

// Fim - funções necessárias para a execução da análise



// Início - Execução da verifcação da url
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var newTab = false
        let tabs = getCurrentTab()
        const url = new URL(tab.url)
        if(whitelistCheck(url) == false){
            let isHttps = protocolCheck(url)
            if(isHttps){
                if(whoisCheck(url)){
                    //accept
                }else{
                    //block
                }
            }
        }
    }
})
// Fim - Execução da verifcação da url