(function (global) {
    'use strict';

    function App() {
        if (Foursquare.isAuthorizsed()) {
            views.working.show('Loading', 'We are getting your checkin data from Foursquare.')
            Foursquare.registerListener('checkins:loadend', this.handleCheckinsLoadEnd.bind(this));
            Foursquare.registerListener('checkins:processed', this.handleCheckinsProcessed.bind(this));
            Foursquare.getCheckins();
        } else {
            views.authenticate.show();
        }
    }

    App.prototype.handleCheckinsLoadEnd = function handleCheckinsLoadEnd(event) {
        views.working.hide();
        views.working.show('Processing checkins', 'We are processing ' + event.count + ' checkins now.')
    };

    App.prototype.handleCheckinsProcessed = function handleCheckinsProcessed(event) {
        views.working.hide();
        views.map.addCheckins(event.checkins);
    };

    global.app = new App();
}(window));
