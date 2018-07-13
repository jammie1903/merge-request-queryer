var secret = localStorage.getItem("secret");

if (secret) {
    fetch("test/" + secret).then(function(res) {
        if(res.status === 200) {
            res.json().then(function(json) {
                if(json.matched) {
                    location.href = "/" + secret;
                } else {
                    localStorage.removeItem("secret");
                    document.querySelector(".Authenticate").classList.remove("loading");
                }
            });
        }
    }).catch(function() {
        localStorage.removeItem("secret");
        document.querySelector(".Authenticate").classList.remove("loading");
    });
} else {
    document.querySelector(".Authenticate").classList.remove("loading");
}