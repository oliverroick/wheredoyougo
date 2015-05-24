(function (global) {
    'use strict';

    var Map = function () {
        L.mapbox.accessToken = SETTINGS.MAPBOX.pk;
        this.map = L.mapbox.map('map', 'mapbox.streets').setView([51.50719323477933, -0.12754440307617188], 9);
    };

    global.map = new Map();
}(window));
