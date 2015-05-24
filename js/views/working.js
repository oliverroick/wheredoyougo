(function (global) {
    'use strict';

    function Working() {
        this.element = document.getElementById('working');
        this.head = this.element.getElementsByTagName('h2')[0];
        this.message = this.element.getElementsByTagName('p')[0];
    }

    Working.prototype.show = function show(headline, message) {
        this.head.innerHTML = headline;
        this.message.innerHTML = message;
        this.element.classList.remove('hidden');
    };

    Working.prototype.hide = function show() {
        this.element.classList.add('hidden');
    };

    global.working = new Working();
}(window.views ? window.views : window.views = {}));
