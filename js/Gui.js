Controller = { 
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February',  'March',  'April',  'May',  'June',  'July',  'August',  'September',  'October',  'November',  'December'],

    initialize: function() {
        jQuery("#daySlider").slider({
            range: true,
            min: 0,
            max: 6,
            values: [0, 6],
            change: Controller.updateMapView.bind(this),
            slide: function (e, ui) {
                jQuery(e.target).tooltip('destroy');
                jQuery(e.target).tooltip({
                    title:  this.days[ui.values[0]] + '&mdash;' + this.days[ui.values[1]],
                    animation: true,
                    placement: 'top'
                });
                jQuery(e.target).tooltip('show');
            }.bind(this)
        });
        
        jQuery("#hourSlider").slider({
            range: true,
            min: 0,
            max: 23,
            values: [0, 23],
            change: Controller.updateMapView.bind(this),
            slide: function (e, ui) {
                jQuery(e.target).tooltip('destroy');
                jQuery(e.target).tooltip({
                    title:  ui.values[0] + ':00h&mdash;' + ui.values[1] + ':59h',
                    animation: true,
                    placement: 'top'
                });
                jQuery(e.target).tooltip('show');
            }.bind(this)
        });
        
        jQuery("#monthSlider").slider({
            range: true,
            min: 0,
            max: 11,
            values: [0, 11],
            change: Controller.updateMapView.bind(this),
            slide: function (e, ui) {
                jQuery(e.target).tooltip('destroy');
                jQuery(e.target).tooltip({
                    title:  this.months[ui.values[0]] + '&mdash;' + this.months[ui.values[1]],
                    animation: true,
                    placement: 'top'
                });
                jQuery(e.target).tooltip('show');
            }.bind(this)
        });
        jQuery('#filter select[name="selectCategory"]').click(function(event) {
            console.log('click');
            event.preventDefault();
        });
        jQuery('#filter select[name="selectCategory"]').change(Controller.updateMapView.bind(this));
        
        Map.init(this);
        Foursquare.initialize(this);
        
        if (Foursquare.checkLogin()) {
            this.showProgress();
            Foursquare.getCheckins({
                update: this.updateProgress,
                success: function () {
                    this.hideProgress(), this.updateMapView()
                }.bind(this),
                error: this.showError
            });

            Foursquare.getCategories({
                success: function () {
                    Foursquare.categories.each(function(category) {
                        this.insertCategory(category, 0);
                    }.bind(this))
                }.bind(this),
                error: this.showError
            });
        } else {
            jQuery('#login').modal('show');
        }
    },
    
    showError: function (error) {
        console.log(error);
    },
    
    showProgress: function () {
        jQuery('#loading').modal('show');
    },
    
    updateProgress: function (percent) {
        jQuery('#loading .bar').width(percent + '%');
    },
    
    hideProgress: function () {
        this.updateProgress(100);
        jQuery('#loading').modal('hide');
    },
    
    updateMapView: function () {
        var category = jQuery('#filter select[name="selectCategory"]').val();
        var day = jQuery('#daySlider').slider('values');
        var hour = jQuery('#hourSlider').slider('values');
        var month = jQuery('#monthSlider').slider('values');
        console.log(category);
        Map.initCluster(Foursquare.getDisplayData(category, hour, day, month));
    },
    
    insertCategory: function (category, level) {
        var pre = '';
        for (var i = 0; i < level; i++) {
            pre += '--';
        }

        jQuery('#filter select[name="selectCategory"]').append('<option value="' + category.id + '">' + pre + category.pluralName  + '</option>');
        if (category.categories) {
            if (category.categories.length > 0) {
                for (var i = 0; i < category.categories.length; i++) {
                    this.insertCategory(category.categories[i], level + 1);
                }
            }
        }
    }
};