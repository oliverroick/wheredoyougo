(function (global) {
    'use strict';

    function VenueInfo() {
        this.element = document.getElementById('venue-info');
        this.head = this.element.getElementsByTagName('h2')[0];
        this.checkins = this.element.getElementsByClassName('number')[0];
        this.closeBtn = this.element.getElementsByClassName('close-btn')[0];

        this.closeBtn.addEventListener('click', function () {
            this.hide();
            this.emitEvent('window:closed');
        }.bind(this));
    }
    VenueInfo.prototype = new EventEmitter();
    VenueInfo.constructor = VenueInfo;

    VenueInfo.prototype.show = function show(name, checkins) {
        this.head.innerHTML = name;
        this.checkins.innerHTML = checkins + ' <span class="label">Checkin' + (checkins > 1 ? 's' : '') + '</span>';
        this.element.classList.remove('hidden');
    };

    VenueInfo.prototype.hide = function show() {
        this.element.classList.add('hidden');
    };

    global.venueInfo = new VenueInfo();
}(window.views ? window.views : window.views = {}));
