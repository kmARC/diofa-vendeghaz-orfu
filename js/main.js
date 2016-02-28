/*jslint white: true, browser: true */
/*global $: true, jQuery: true */

$(function () {
    "use strict";
    //kwicks begin
    $('.kwicks').kwicks({
        min: 60,
        spacing: 4,
        sticky: true,
        defaultKwick: 0,
        event: 'click'
    });
    $('a').click(function () {
        var page = $(this).attr('href');
        if (page.substr(page.indexOf('#'), 6) === '#page_') {
            $('.kwicks ' + page).click();
            return false;
        }
    });
    // initiate tool tip
    //$('.normaltip').aToolTip();

    var $ribbon = $(".ribbon");
    $(".ribbon, .drawer").mouseover(function(){
        $ribbon.stop();
        $ribbon.animate({"margin-top":-80});
    });

    $(".ribbon, .drawer").mouseout(function(){
        $ribbon.stop();
        $ribbon.animate({"margin-top":-384});
    });
});
