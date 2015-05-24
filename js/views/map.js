(function (global) {
    'use strict';

    var STYLE = {
        stroke: false,
        fill: true,
        fillColor: '#22313F',
        fillOpacity: 0.4
    };

    var Map = function () {
        L.mapbox.accessToken = SETTINGS.MAPBOX.pk;
        this.map = L.mapbox.map('map', 'mapbox.streets-basic', {zoomControl: false}).setView([51.50719323477933, -0.12754440307617188], 9);
    };

    Map.prototype.addCheckins = function addCheckins (checkins) {
        var markers = [];
        for (var key in checkins) {
            var checkin = checkins[key];
            var marker = L.circleMarker(checkin.location, STYLE);
            var radius = checkin.checkins <= 41 ? 10 + Math.floor(checkin.checkins/2) : 25;
            marker.setRadius(radius)
            marker.addTo(this.map);
        }
    }

    global.map = new Map();
}(window.views ? window.views: window.views = {}));
