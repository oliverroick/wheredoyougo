(function (global) {
    'use strict';

    function Authenticate() {
        this.element = document.getElementById('authenticate');
        var href = document.getElementById('fs-auth').href;
        document.getElementById('fs-auth').href = href.replace('[token]', SETTINGS.FOURSQUARE.client_id);
    }

    Authenticate.prototype.show = function show() {
        this.element.classList.remove('hidden');
    };

    global.authenticate = new Authenticate();
}(window.views ? window.views : window.views = {}));
