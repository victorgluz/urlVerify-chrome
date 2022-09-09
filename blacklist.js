const blacklist = [
    "globo.com",
    "redemine.com.br",
    "turbolinks.com.br"
]




function blackListCheck(url){
    url = window.location.host
    replaced = url.replace('www.', '')

    if(blacklist.includes(replaced)){
        resp = confirm("Este site é uma possível ameaça, deseja voltar a segurança?")
        if(resp){
            window.location.href = "https://urlverify.com.br/?url="+replaced
        }else{

        }
    }else{
        console.log("Nothing found on blacklist")
    }
}

blackListCheck()