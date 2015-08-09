$.getJSON('/files/pages.json', function(data) {
    window.pages = data;
    loadPage('home');
});
console.log('Hi, what are you doing here?');
console.log('Trying to figure out how I made this amaaaaaaazing website?');
console.log('Cool.');
