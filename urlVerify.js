const urlWhitelist = [
    "urlverify.com.br",
    "youtube.com",
    "google.com",
    "uol.com.br",
    "globo.com",
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "wikipedia.org"
]

const urlBlacklist = [
    "globo.com",
    "redemine.com.br",
    "turbolinks.com.br",
    "victorgluz.com.br"
]


function blackListCheck(){
    debugger
    replaced = window.location.host.replace('www.', '')
    if(urlBlacklist.includes(replaced)){
        window.location.href = "https://urlverify.com.br/warning/&url="+replaced+"&action=unsafe"
    }else{
        console.log("Nothing found on blacklist")
        return false
    }
}

function protocolCheck(){
    protocol = window.location.protocol
    if(protocol != "chrome:"){
        if(protocol != "https:"){
            window.location.href = "https://urlverify.com.br/warning/?url="+replaced+"&action=http"
            return false
        }else{
            return true
        }
    }else{
        return false
    }
}

function whoisCheck(url){
    fetch('https://www.urlverify.com.br/whois.php?url='+url).then(r => r.text()).then(result => {
        debugger
        if(result == false){
            window.location.href = "https://urlverify.com.br/?action=unsafe&url="+replaced
        }
    }) 
}

function whitelistCheck(url){
    if(urlWhitelist.includes(url.host)){
        console.log("Founded on whitelist")
        return true
    }else{
        console.log("Nothing found on whitelist")
        return false
    }
}

function verificationStatus(){
    var urlParams = new URLSearchParams(window.location.search);
    var urlVerify = urlParams.get('urlVerify');
    if(urlVerify == "disabled"){
        localStorage.setItem('urlVerify', 'disabled');
        window.location.href = window.location.origin + window.location.pathname;
        return true;
    }else if(urlVerify == "enabled"){
        localStorage.setItem('urlVerify', 'enabled');
        window.location.href = window.location.origin + window.location.pathname;
        return false;
    }else{
        return true;
    }
}

function needVerify(){
    var urlDisabled = localStorage.getItem('urlVerify');
    if(urlDisabled && urlDisabled == "disabled"){
        return false;
    }else if(urlDisabled && urlDisabled == "enabled"){
        return true;
    }else{
        return true;
    }
}


// Início - Execução da verifcação da url
function urlVerification(){
    const url = window.location.href
    if(verificationStatus() == true){
        if(needVerify() == true){
            if(blackListCheck(url) == false){
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
        }
    }
}

urlVerification()
// Fim - Execução da verifcação da url