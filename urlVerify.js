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
    "victorgluz.com.br",
    "economizando.net",
    "redemine.com.br",
    "estudante.sesisenai.org.br"
]


function blackListCheck(){
    replaced = window.location.host.replace('www.', '')
    if(urlBlacklist.includes(replaced)){
        window.location.href = "https://urlverify.com.br/warning/?url="+window.location.href+"&action=unsafe"
    }else{
        console.log("Nothing found on blacklist")
        return false
    }
}

function protocolCheck(){
    protocol = window.location.protocol
    if(protocol != "chrome:"){
        if(protocol != "https:"){
            window.location.href = "https://urlverify.com.br/warning/?url="+window.location.href+"&action=http"
            return false
        }else{
            return true
        }
    }else{
        return false
    }
}

function whoisCheck(){
    fetch("https://www.urlverify.com.br/whois.php?url="+window.location.host.replace('www.', ''))
    .then((result) => { return result.text(); })
    .then((content) => {
        content = content.replace('\n', '');
        result = JSON.parse(content);
        if(result.result.creation_date && result.result.creation_date[0].length>2){
            debugger
            creation_date = new Date(result.result.creation_date[0]);
            today = new Date();
            var diffTime = today.getTime() - creation_date.getTime();
            diffDays = diffTime / 86400000
            console.log('diffDays: '+diffDays);
            if (diffDays < 365){
                window.location.href = "https://urlverify.com.br/warning/?url="+window.location.href+"&action=newer"
            }
        }else{
            debugger
            creation_date = new Date(result.result.creation_date);
            today = new Date();
            var diffTime = today.getTime() - creation_date.getTime();
            diffDays = diffTime / 86400000
            console.log('diffDays: '+diffDays);
            if (diffDays < 365){
                window.location.href = "https://urlverify.com.br/warning/?url="+window.location.href+"&action=newer"
            }
        }
        return true;
    })
}

function whitelistCheck(url){
    if(urlWhitelist.includes(url.host.replace('www.', ''))){
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
        window.location.href = window.location.origin + window.location.pathname
    }else if(urlVerify == "enabled"){
        localStorage.setItem('urlVerify', 'enabled');
        window.location.href = "https://urlverify.com.br/configs/?removed="+window.location.host
    }else if(urlVerify == "continue"){
        localStorage.setItem('urlVerify', 'enabled');
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
    const url = new URL(window.location.href);
    if(verificationStatus() == true){
        if(needVerify() == true){
            if(blackListCheck() == false){
                if(whitelistCheck(url) == false){
                    let isHttps = protocolCheck(url)
                    if(isHttps){
                        whoisCheck()
                    }
                }
            }
        }
    }
}

urlVerification()
// Fim - Execução da verifcação da url