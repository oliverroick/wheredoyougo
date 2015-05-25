(function (global) {
    'use strict';

    function App() {
        if (Foursquare.isAuthorizsed()) {
            views.working.show('Loading', 'We are getting your checkin data from Foursquare.')
            Foursquare.registerListener('checkins:loadend', handleCheckinsLoadEnd);
            Foursquare.registerListener('checkins:processed', handleCheckinsProcessed);
            Foursquare.getCheckins();
        } else {
            views.authenticate.show();
        }
    }

    var handleCheckinsLoadEnd = function handleCheckinsLoadEnd(event) {
        views.working.hide();
        views.working.show('Processing checkins', 'We are processing ' + event.count + ' checkins now.')
    };

    var handleCheckinsProcessed = function handleCheckinsProcessed(event) {
        views.working.hide();
        views.map.addCheckins(event.checkins);
        views.map.registerListener('map:featureSelect', handleFeatureSelect);
        views.map.registerListener('map:featureUnselect', handleFeatureUnselect);
        views.map.registerListener('map:drag', handleFeatureUnselect);
        views.venueInfo.registerListener('window:closed', handleFeatureUnselect);
    };

    var handleFeatureSelect = function handleFeatureSelect(feature) {
        views.venueInfo.show(feature.properties.name, feature.properties.checkins);
    }

    var handleFeatureUnselect = function handleFeatureUnselect(event) {
        views.venueInfo.hide();
        views.map.unselectFeature();
    }

    global.app = new App();
}(window));
