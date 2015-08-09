/* pageloader.js */
/* Created by Nachiketa Gargi in August 2015 */

window.loadPage = function(pageId, previous) {
    window.currentPage = pages[pageId];
    document.title = "Nachiketa Gargi | " + currentPage.title;
    $('#nav-' + pageId).addClass('selected');
    if (previous) {
        $('#nav-' + previous).removeClass('selected');
    }
    if (currentPage["md"].slice(-2) == 'md') {
        $.get('files/md/' + currentPage["md"], function(data) {
            var converter = new showdown.Converter();
            $('#content').html(converter.makeHtml(data))
        });
    } else {
        var converter = new showdown.Converter();
        $('#content').html(converter.makeHtml(currentPage["md"]))
    }
}

window.loadPopup = function(pageId) {
    $('nav').addClass('blur');
    $('#content').addClass('blur');
    $('#popup').css({
        display: 'block'
    });
    var currentPage = pages[pageId];
    $('#popup-content').html();
    if (currentPage["md"].slice(-2) == 'md') {
        $.get('files/md/' + currentPage["md"], function(data) {
            var converter = new showdown.Converter();
            $('#popup-content').html(converter.makeHtml(data))
        });
    } else {
        var converter = new showdown.Converter();
        $('#popup-content').html(converter.makeHtml(currentPage["md"]))
    }
    $(document).click(function(event) {
        if (!$(event.target).is('#popup-content') && !$(event.target).parents("#popup-content").is("#popup-content")) {
            closePopup();
        }
    });
    document.title = document.title + ' | ' + currentPage.title;
}

window.closePopup = function() {
    $('nav').removeClass('blur');
    $('#content').removeClass('blur');
    $('#popup').css({
        display: 'none'
    });
    $('#popup-content').html('Loading...');
    document.title = "Nachiketa Gargi | " + currentPage.title
}
