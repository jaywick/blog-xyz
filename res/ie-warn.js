(function () {
    var isMSIE = window.navigator.userAgent.indexOf("MSIE ") > 0;
    var isTrident = navigator.userAgent.indexOf('Trident') > 0;

    if (!isMSIE && !isTrident) {
        return;
    }

    document.querySelector('.ie-banner').style.display = 'block';
})();