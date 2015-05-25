(function (global) {
    'use strict';

    function Foursquare() {
        this.token = null;
        this.page = 0;
        this.checkins = [];
    }
    Foursquare.prototype = new EventEmitter();
    Foursquare.constructor = Foursquare;

    Foursquare.prototype.isAuthorizsed = function isAuthorizsed() {
        if ((document.URL.indexOf('#') !== -1) && (document.URL.split('#')[1].startsWith('access_token='))) {
			this.token = document.URL.split('#')[1].split('=')[1];
        }
        return this.token !== null;
    };

    Foursquare.prototype.storeCheckins = function storeCheckins(response) {
        this.checkins = this.checkins.concat(response.response.checkins.items);

        var count = response.response.checkins.count;
        if (((this.page + 1) * 250) > count) {
            this.emitEvent('checkins:loadend', {count: this.checkins.length});
            this.processCheckins();
        } else {
            this.page++;
            this.getCheckins();
        }
    };

    Foursquare.prototype.getCheckins = function getCheckins() {
        var offset = this.page * 250;
        var url = 'https://api.foursquare.com/v2/users/self/checkins?limit=250&offset=' + offset + '&oauth_token=' + this.token + '&v=20140401';

        var script = document.createElement('script');
        script.src = url + '&callback=Foursquare.storeCheckins';
        document.body.appendChild(script);
    };

    Foursquare.prototype.processCheckins = function processCheckins() {
        var processed = {};
        for (var i = 0, len = this.checkins.length; i < len; i++) {
            var venue = this.checkins[i].venue;
            if (venue) {
                if (processed[venue.id] !== undefined) {
                    processed[venue.id].checkins++;
                } else {
                    processed[venue.id] = {
                        id: venue.id,
                        name: venue.name,
                        category: venue.categories[0],
                        checkins: 1,
                        location: [venue.location.lat, venue.location.lng]
                    };
                }
            }
        }
        this.emitEvent('checkins:processed', {checkins: processed});
    };

    global.Foursquare = new Foursquare();

}(window));
