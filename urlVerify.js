const urlWhitelist = [
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
    "turbolinks.com.br"
]


function blackListCheck(url){
    replaced = url.replace('www.', '')
    if(urlBlacklist.includes(replaced)){
        window.location.href = "https://urlverify.com.br/?action=blacklist&url="+replaced
    }else{
        console.log("Nothing found on blacklist")
        return false
    }
}

function protocolCheck(url){
    if(url.protocol != "chrome:"){
        if(url.protocol != "https:"){
            window.location.href = "https://urlverify.com.br/?action=http&url="+replaced
            return false
        }else{
            return true
        }
    }else{
        return false
    }
}

function whoisCheck(url){
    console.log('whois check: https://who.is/whois/'+url)
    fetch('https://www.urlverify.com.br/whois.php?url='+url).then(r => r.text()).then(result => {
        if(result == false){
            window.location.href = "https://urlverify.com.br/?action=unsafe&url="+replaced
        }
    }) 
}

function getHost(url){
    let host = url.split('.')
    if(host.length == 2){
        return host
    }else if(host.length >= 3){
        if(countries[host[2]]){
            return host[0]+"."+host[1]+"."+host[2]
        }else{
            return host[1]+"."+host[2]
        }
    }
}

function whitelistCheck(url){
    if(urlWhitelist.includes(getHost(url))){
        console.log("Founded on whitelist")
        return true
    }else{
        console.log("Nothing found on whitelist")
        return false
    }
}

// Início - Execução da verifcação da url
function urlVerification(){
    const url = window.location.host
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

urlVerification()
// Fim - Execução da verifcação da url