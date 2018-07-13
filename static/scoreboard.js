setTimeout(function () {
    // reload every hour;
    location.reload();
}, 1000 * 60 * 60);

localStorage.setItem("secret", location.href.substr(location.href.lastIndexOf("/") + 1));