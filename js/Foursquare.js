OpenLayers.ImgPath = "lib/OpenLayers/theme/dark/";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

Foursquare = {
	token: null,

	checkins: [],

	venues: new Hash(),

	page: 0,

	controller: null,

	initialize: function (c) {
		this.controller = c;
	},

	checkLogin: function () {
		if ((document.URL.indexOf('#') != -1) && (document.URL.split('#')[1].startsWith('access_token='))) {
			this.token = document.URL.split('#')[1].split('=')[1];
			return true;
		} else {
			return false;
		}
	},

	getCategories: function (callbacks) {
		new Ajax.JSONRequest('https://api.foursquare.com/v2/venues/categories?oauth_token=' + this.token + '&v=20140401', {
			method: 'GET',
			onSuccess: function (response) {
				this.categories = response.responseJSON.response.categories;
				callbacks.success();
			}.bind(this),
			onFailure: callbacks.error
		});
	},

	getCheckins: function(callbacks) {
		var offset = this.page * 250;
		new Ajax.JSONRequest('https://api.foursquare.com/v2/users/self/checkins?limit=250&offset=' + offset + '&oauth_token=' + this.token + '&v=20140401', {
			method: 'GET',
			onSuccess: function (response) {
				var count = response.responseJSON.response.checkins.count;
				response.responseJSON.response.checkins.items.each(function(checkin) {
					var date = new Date(checkin.createdAt * 1000);
					if (checkin.venue && (checkin.venue.location.lng != null || checkin.venue.location.lat != null)) {

						this.checkins.push({
							id: checkin.venue.id,
							name: checkin.venue.name,
							city: checkin.venue.location.city,
							lon: checkin.venue.location.lng,
							lat: checkin.venue.location.lat,
							day: date.getDay(),
							hour: date.getHours(),
							month: date.getMonth(),
							categories: checkin.venue.categories
						});

					}
				}.bind(this));

				if (((this.page + 1) * 250) > count) {
					callbacks.success();
				} else {
					this.page++;
					callbacks.update(((this.page * 250) / count) * 100);
					this.getCheckins(callbacks);
				}
			}.bind(this),
			onFailure: callbacks.error
		});
	},

	getChildCategories: function (cat) {
		var childs = [];
		if (cat.categories) {
			cat.categories.each(function (c) {
				childs.push(c.id);
			})
		}
		return childs;
	},

	getRelevantCategories: function (categoryId, catalog) {
		var relevantCategories = [];

		catalog.each(function(searchCat) {
			if (searchCat.id == categoryId) {
				relevantCategories = this.getChildCategories(searchCat);
				relevantCategories.push(searchCat.id);
 			} else {
 				if (searchCat.categories && relevantCategories.length == 0) {
 					relevantCategories = this.getRelevantCategories(categoryId, searchCat.categories);
 				}
			}
		}.bind(this));

		return relevantCategories;
	},

	getDisplayData: function (category, hour, day, month) {
		var relevantCategories = [];
		if (category != false) {
			relevantCategories = this.getRelevantCategories(category, this.categories);
		}

		var venues = new Hash();
		this.checkins.each(function(checkin) {
			var venueCategoryIds = [];
			checkin.categories.each(function (c) {
				venueCategoryIds.push(c.id);
			});

			if (
				(category === -1 || (venueCategoryIds.intersect(relevantCategories) !== 0)) &&
				((checkin.hour >= hour[0] && checkin.hour <= hour[1]))  &&
				((checkin.day >= day[0] && checkin.day <= day[1])) &&
				((checkin.month >= month[0] && checkin.month <= month[1]))
			) {
				if (venues.keys().indexOf(checkin.id) != -1) { // if venue has been processed before
					venues.get(checkin.id).count++;
				} else { // venue hasn't been processed before
					var icon = null;
					if (checkin.categories.length > 0) {
						icon = checkin.categories[0].icon;
					}

					venues.set(checkin.id, {
						id: checkin.id,
						name: checkin.name,
						city: checkin.city,
						lon: checkin.lon,
						lat: checkin.lat,
 						img: icon,
						count: 1
					});
				}
			}
		});
		return venues.values();
	}
}