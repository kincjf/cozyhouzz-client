/**
 * Created by InSuJeong on 2017-01-11.
 */
window.onload = function() {
    //다른 브라우저 일 경우 팝업창이 뜨도록 하는 함수
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
        window.open("usingChrome.html", "pop", "");
        //this.router.navigate(['/popup']);
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
    }

    return false;
};