/* global Lacoste urlStoresMain $ */

// If UTM Google Analytics detected save it
var savedUtmQuery = '';
if (window.location.search.indexOf('utm') !== -1) {
    // Save utm params
    var queryArr = window.location.search.substring(1).split('&');
    for (var i = 0, len = queryArr.length; i < len; i++) {
        if( queryArr[i].split('=')[0].indexOf('utm') !== -1 ) {
            savedUtmQuery += (savedUtmQuery === '' ? '?' : '&') + queryArr[i];
        }
    }
}

Lacoste.StoreLocator = {};

Lacoste.StoreLocator.history = [];
Lacoste.StoreLocator.currentUrl = urlStoresMain;
if (urlStoresMain.indexOf('?') >= 0) {
    Lacoste.StoreLocator.mainUrl = urlStoresMain.substring(0, urlStoresMain.indexOf('?'));
} else {
    Lacoste.StoreLocator.mainUrl = urlStoresMain;
}


Lacoste.StoreLocator.http = (function() {
    var state = 0;
    var pageTraveled = 0;
    var isFirstPage = false;

    History.Adapter.bind(window, 'statechange', function() {
        var currentState = History.getState();
        pageTraveled++;
        if (isFirstPage) {
            history.go(-pageTraveled);
        } else if (currentState.data.state < state) {
            isFirstPage = currentState.data.state == 0;
            state = currentState.data.state;
            var url = Lacoste.StoreLocator.history[state].url + Lacoste.StoreLocator.history[state].query;
            var httpDeffereds = load(url);
            httpDeffereds.jqxhr.done(function(stData) {
                destroy(stData.page, stData.geolocalisation);
                httpDeffereds.rewriteUrl.resolve(stData);
                stGenerator.generate(stData);
            });
        } else {
            state++;
        }
    });

    return {
        load: load,
        getPrevUrl: getPrevUrl
    };

    function load(url, params) {
        var rewriteUrl = $.Deferred();
        if (typeof params == 'undefined') {
            params = {
                json: true
            };
        } else {
            params.json = true;
        }
        $('.site-sections .content-container').scrollTop(0);
        $(window).scrollTop(0);
        $('#st-frame-container .st-frame-inner').empty();
        $('.st-frame').addClass('isLoading');
        cssFeature.resize();
        var jqxhr = $.ajax({
            url: url,
            type: 'get',
            data: params
        });

        $.when(rewriteUrl).then(function(stData) {
            Lacoste.StoreLocator.currentUrl = url;
            rewriteHistory(url, stData.trad.metaTitle);
        });

        return {jqxhr: jqxhr, rewriteUrl: rewriteUrl};
    }

    function getPrevUrl() {
        return Lacoste.StoreLocator.history[state - 1].url + Lacoste.StoreLocator.history[state - 1].query;
    }

    function rewriteHistory(url, title) {
        var query = '';
        if (url.indexOf('?') !== -1) {
            query =  url.substr(url.indexOf('?')) + (savedUtmQuery ? savedUtmQuery.replace('?', '&') : '');
            url = url.substr(0, url.indexOf('?'));
        } else {
            query = savedUtmQuery;
        }

        // If GA parameters saved add it to url
        if( savedUtmQuery ) {
            url += savedUtmQuery;
        }

        Lacoste.StoreLocator.history[state] = {
            state: state,
            url: url,
            query: query
        };

        History.pushState({
            state: state
        }, title, url);
    }
})();

Lacoste.StoreLocator.Distance = function(google, EventEmitter) {
    var service = new google.maps.DistanceMatrixService;

    return {
        calculDistance: calculDistance
    };

    function calculDistance(origin, destinations) {
        service.getDistanceMatrix({
            origins: [origin],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem[Lacoste.configurations.STORELOCATOR_UNITSYSTEM],
            avoidHighways: false,
            avoidTolls: false
        }, getDistance);

        function getDistance(response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                return;
            }
            EventEmitter.emit('calculEnded', response.rows[0].elements);
        }
    }
};

Lacoste.StoreLocator.Geolocalisation = function(EventEmitter, loadingStore) {
    if (navigator.geolocation) {
        var idGeoloc = navigator.geolocation.getCurrentPosition(getPosition, errorPosition, {
            enableHighAccuracy: true
        });
    }
    var alreadyLocalized = false;
    return {
        removeWatch: removeWatch
    };

    function getPosition(position) {
        if (!alreadyLocalized) {
            var url = Lacoste.StoreLocator.mainUrl;
            url += '?latitude=' + position.coords.latitude;
            url += '&longitude=' + position.coords.longitude;

            if (loadingStore) {
                load(url);
            }
            alreadyLocalized = true;
        }

        EventEmitter.emitEvent('userLocalized', [{
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
        }]);
    }

    function errorPosition(error) {
    //navigator.geolocation.clearWatch(idGeoloc);
        switch (error.code) {
        case error.PERMISSION_DENIED:
        default:
            alert(stPageData.trad.errorGeolocalisation);
            break;
        }
    }

    function removeWatch() {
    //navigator.geolocation.clearWatch(idGeoloc);
    }
};

Lacoste.StoreLocator.CreateUserMarker = function(Map, coordinates) {
    var self = {};
    self.marker = null;
    self.circle = null;
    construct();

    return {
        marker: self.marker,
        circle: self.circle,
        remove: remove,
        update: update
    };

    function construct() {
        self.marker = Lacoste.StoreLocator.Marker(google, Map, new google.maps.LatLng(coordinates.lat, coordinates.lng), '', getIconUser());
        if (typeof coordinates.accuracy != 'undefined') {
            self.circle = new google.maps.Circle({
                center: self.marker.getPosition(),
                map: Map,
                radius: coordinates.accuracy,
                fillColor: '#0aa6e2',
                fillOpacity: 0.5,
                strokeWeight: 0
            });
        }
    }

    function getIconUser() {
        return {
            url: urlResources + '/img/ico-storelocator/marker-user.svg',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 20),
            size: new google.maps.Size(20, 20)
        };
    }

    function remove() {
        self.marker.remove();
        if (self.circle != null) {
            self.circle.setMap(null);
        }
    }

    function update(coords) {
        self.marker.setPosition({
            lat: coords.lat,
            lng: coords.lng
        });
        if (typeof coords.accuracy != 'undefined') {
            if (self.circle != null) {
                self.circle.setCenter({
                    lat: coords.lat,
                    lng: coords.lng
                });
                self.circle.setRadius(coords.accuracy);
            } else {
                self.circle = new google.maps.Circle({
                    center: self.marker.getPosition(),
                    map: Map,
                    radius: coords.accuracy,
                    fillColor: '#0aa6e2',
                    fillOpacity: 0.5,
                    strokeWeight: 0
                });
            }
        } else if (self.circle != null) {
            self.circle.setMap(null);
            self.circle = null;
        }
    }
};

Lacoste.StoreLocator.generatorBreadcrumb = (function() {
    var $breadcrumb = $('.st-breadcrumb');

    $breadcrumb.on('click', 'a:not(.active)', function(e) {
        e.preventDefault() && e.stopPropagation();
        var url = $(this).attr('href');
        load(url);
    });

    return {
        generate: generate
    };

    function generate(stData) {

        // TODO : Need to refacto and just have a single call to .html()

        $breadcrumb.find('.st-breadcrumb-item:not(.breadcrumb-home)').empty();
        if (typeof stData.breadcrumb == 'undefined') {
            $breadcrumb.find('.st-breadcrumb-item.breadcrumb-home .st-breadcrumb-link').addClass('active');
            return;
        }
        $breadcrumb.find('.st-breadcrumb-item.breadcrumb-home .st-breadcrumb-link').removeClass('active');
        var breadcrumbData = stData.breadcrumb;
        if (typeof breadcrumbData.continent != 'undefined') {
            $breadcrumb.find('.breadcrumb-continent').html('<a class="st-breadcrumb-link ' + (stData.page == 'search' && stData.level == 'countries' ? 'active' : '') + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.continent.url + '">' + breadcrumbData.continent.name + '</a>');
        }

        if (typeof breadcrumbData.states !== 'undefined') {

            var breadcrumbCountry = $breadcrumb.find('.breadcrumb-country');
            var activeClass = 'active';

            breadcrumbCountry.html('<a class="st-breadcrumb-link '
                + (stData.page == 'search' && stData.level == 'cities' ? activeClass : '')
                + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.country.url + '">'
                + breadcrumbData.country.name + '</a>');
            if (stData.level === 'states') {
                breadcrumbCountry.html('<a class="st-breadcrumb-link '
                        + (stData.page === 'search' && stData.level === 'states' ? activeClass : '')
                        + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.country.url
                        + '">' + breadcrumbData.country.name + '</a>');
            } else if (breadcrumbData.states.name !== 'noState') {
                $breadcrumb.find('.breadcrumb-state')
                    .html('<a class="st-breadcrumb-link '
                    + (stData.page === 'search' ? activeClass : '')
                        + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.country.url + '">'
                    + breadcrumbData.states.name + '</a>');
            }
        } else if (typeof breadcrumbData.country != 'undefined') {
            $breadcrumb.find('.breadcrumb-country').html('<a class="st-breadcrumb-link ' + (stData.page == 'search' && stData.level == 'cities' ? 'active' : '') + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.country.url + '">' + breadcrumbData.country.name + '</a>');
        }

        if (typeof breadcrumbData.city != 'undefined') {
            $breadcrumb.find('.breadcrumb-city').html('<a class="st-breadcrumb-link ' + (stData.page == 'results' ? 'active' : '') + '" href="' + Lacoste.StoreLocator.mainUrl + breadcrumbData.city.url + '">' + breadcrumbData.city.name + '</a>');
        }

        if (typeof breadcrumbData.store != 'undefined') {
            $breadcrumb.find('.breadcrumb-store').html('<a class="st-breadcrumb-link ' + (stData.page == 'detail' ? 'active' : '') + '" href="">' + breadcrumbData.store.name + '</a>');
        }
    }
})();

Lacoste.StoreLocator.GeneratorFrame = function(TemplateEngine, EventEmitter) {
    var self = {};
    var urlParent = null;
    var prevUrl = null;
    self.generate = generate;
    self.hasNoResultPage = false;
    var $container = $('#st-frame-container .st-frame-inner');

    return self;

    function generate(data) {
        data.haveStartPos = stUserLocation != null;
        data.prev_url = definePrevUrl(data);
        urlParent = defineParentUrl(data);
        data.mainUrl = Lacoste.StoreLocator.mainUrl;
        data.title = defineTitle(data);
        data.key = Lacoste.siteprefs.GOOGLE.GOOGLE_MAPS_API_KEY;
        data.iconurl = Lacoste.statics.SVG_PATH + 'sprite.svg';
        data.getType = function getType() {
            return this.type != null ? data.trad[this.type.toLowerCase()] : '';
        };
        TemplateEngine.load(data.page, data).done(function() {
            $container.html(TemplateEngine.getRendered());
            $('.st-frame').removeClass('isLoading');
            EventEmitter.emitEvent('contentLoaded');
            if (data.page == 'detail' || data.nbrStores > 0 || (data.page == 'search' && data.level == 'continents')) {
                EventEmitter.emitEvent(data.page + 'Loaded', [data]);
            }
        });
    }


    function defineTitle(data) {
        if (data.page == 'detail') {
            return '';
        }
        if (data.nbrStores == 0) {
            return data.trad.nothing;
        } else if (data.page === 'results') {
            if (data.geolocalisation) {
                return data.nbrStores + ' ' + data.trad.stores + ' <b>' + data.trad.around + '</b>';
            } else if ($(window).width() < 960 && !data.area) {
                return data.breadcrumb.city.name;
            } else {
                return data.nbrStores + ' ' + data.trad.stores;
            }
        } else {
            return data.title;
        }
    }

    function defineParentUrl(data) {
        if (data.page != 'results') {
            return null;
        }
        var url = '';
        if (data.area) {
            url = Lacoste.StoreLocator.mainUrl;
            url += '?maxLatitude=' + data.area.maxLat;
            url += '&minLatitude=' + data.area.minLat;
            url += '&maxLongitude=' + data.area.maxLng;
            url += '&minLongitude=' + data.area.minLng;
            return url;
        } else if (data.geolocalisation) {
            url = Lacoste.StoreLocator.mainUrl;
            url += '?latitude=' + data.geolocalisation.latitude;
            url += '&longitude=' + data.geolocalisation.longitude;
            return url;
        } else {
            url = Lacoste.StoreLocator.mainUrl + data.breadcrumb.city.url;
        }
        return url;
    }

    function definePrevUrl(data) {
        if (data.page === 'detail') {
            if (self.hasNoResultPage) {
                return Lacoste.StoreLocator.mainUrl + (data.breadcrumb ? data.breadcrumb.country.url : '');
            } else if (urlParent) {
                return urlParent;
            } else if(typeof data.breadcrumb != "undefined"){
                return Lacoste.StoreLocator.mainUrl + data.breadcrumb.city.url;
            } else {
                return Lacoste.StoreLocator.mainUrl;
            }
        } else if (data.page === 'results') {
            return ((data.geolocation || data.area) && data.nbrStores == 0) ? Lacoste.StoreLocator.mainUrl : Lacoste.StoreLocator.mainUrl + data.breadcrumb.country.url;
        } else if (data.level === 'cities' || data.level === 'states') {
            return Lacoste.StoreLocator.mainUrl + (data.breadcrumb ? data.breadcrumb.continent.url : '');
        } else {
            return Lacoste.StoreLocator.mainUrl;
        }
    }
};

Lacoste.StoreLocator.Map = function(google, EventEmitter) {
    var self = {};
    self.map = null;
    self.bounds = null;
    self.center = {
        lat: 0,
        lng: 0
    };
    self.zoom = 13;
    self.resizeMap = resizeMap;

    init();

    return self;

    function init() {
        createMap();
        EventEmitter.addListener('mapContainerResize', resizeMap);
    }

    function createMap() {
        self.map = new google.maps.Map(document.getElementById('gmap'), {
            center: {
                lat: 0,
                lng: 0
            },
            zoom: 1,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            styles: [{
                featureType: 'poi.business',
                stylers: [{
                    'visibility': 'off'
                }]
            }]
        });

    }

    function resizeMap() {
        if (self.map != null) {
            google.maps.event.trigger(self.map, 'resize');
            if (self.bounds != null) {
                self.map.fitBounds(self.bounds);
            } else {
                self.map.setCenter(self.center);
                self.map.setZoom(self.zoom);
            }
            if (self.map.getZoom() < 3) {
                self.zoom = 3;
                self.map.setZoom(self.zoom);
            } else if (self.map.getZoom() > 13) {
                self.zoom = 13;
                self.map.setZoom(self.zoom);
            }
        }

    }
};


Lacoste.StoreLocator.TemplateEngine = function(Mustache) {
    var self = {};
    self.rendered = null;

    return {
        load: load,
        getRendered: getRendered
    };

    function load(id, data) {
        return $.get(folderTPL + id + '.tpl.mst', function(template) {
            //helper
            data.phoneNumber = function () {
                var _phoneNumber = this.replace(/(\s+)|(\.+)/g, '');
                //_phoneNumber = this.phone.replace('.', '');
                return _phoneNumber;
            };
            self.rendered = Mustache.render(template, data);
        });
    }

    function getRendered() {
        return self.rendered;
    }
};


Lacoste.StoreLocator.GeneratorCSSFeatures = function() {
    var self = {
        DOM: {
            $main: $('.st-main'),
            $map: $('.st-map'),
            $frame: $('.st-frame'),
            $footer: $('footer'),
            $topBar: $('.st-topBar')
        },
        mapAscended: false
    };

    self.cssFitMain = Lacoste.StoreLocator.CSSFit(self.DOM.$main, self.DOM.$main);

    cssTopBar();
    cssMap();

    return {
        resize: resize
    };

    function resize() {
        if(Lacoste.StoreLocator.isMobile.Android() != true) {
            cssReset();
            cssTopBar();
            cssMap();
        }
    }

    function cssReset() {
        self.DOM.$topBar.css({
            position: '',
            top: '',
            left: '',
            width: '',
            height: ''
        });
        self.DOM.$map.css({
            position: '',
            top: '',
            left: '',
            width: '',
            height: ''
        });
        self.DOM.$frame.css({
            position: '',
            top: '',
            left: '',
            width: '',
            height: ''
        });
        if (!self.DOM.$map.parent().is('body')) {
            self.DOM.$map.parent().appendTo($('.st-main-content > .st-grid-col2:last-child'));
        }
        if (self.cssPinMap) {
            self.cssPinMap.unbindPin();
        }
        if (self.cssPinTopBar) {
            self.cssPinTopBar.unbindPin();
        }
    }

    function cssTopBar() {
        if(self.DOM.$footer.offset() > 0){
        var posTopbar = self.DOM.$topBar.offset();
        if ($(window).width() < 768) {
            posTopbar.top = $('.topbar').height();
        }
        var endPosTopBar = self.DOM.$footer.offset().top - $('.backtotop-container').outerHeight(true);
        if ($(window).width() > 980 || $(window).width() < 768) {
            endPosTopBar += self.DOM.$topBar.outerHeight(true) + posTopbar.top - $(window).height();
        } else {
            endPosTopBar -= self.DOM.$map.outerHeight(true);
        }

        if (self.cssPinTopBar) {
            self.cssPinTopBar.bindPin(posTopbar.top, posTopbar.top, endPosTopBar);
            self.cssPinTopBar.resize();
        } else {
            self.cssPinTopBar = Lacoste.StoreLocator.CSSPin(self.DOM.$topBar);
            self.cssPinTopBar.bindPin(self.DOM.$map.offset().top, posTopbar.top, endPosTopBar);
        }
        }
    }

    function cssMap() {
        if (!self.cssFitFrame) {
            self.cssFitFrame = Lacoste.StoreLocator.CSSFit(self.DOM.$frame, self.DOM.$frame);
        }
        if (!self.cssFitMap) {
            self.cssFitMap = Lacoste.StoreLocator.CSSFit(self.DOM.main, self.DOM.$map);
        }

        var marginBotMap = (self.DOM.$map.closest('.st-grid-col2').outerHeight(true) - self.DOM.$map.closest('.st-grid-col2').height()) / 2;

        self.DOM.$map.width(self.DOM.$map.width());

        if ($(window).width() >= 760) {
            if (self.DOM.$footer.offset().top > 0) {
                var posMap = self.DOM.$map.offset();
                var endPosMap = self.DOM.$footer.offset().top - $('.backtotop-container').outerHeight(true);

                if ($(window).width() > 980) {
                    self.cssFitMain.fitToWindow();
                    self.cssFitMap.fitToWindow(marginBotMap, true);
                    var marginBotFrame = (self.DOM.$frame.parent().outerHeight(true) - self.DOM.$frame.parent().height()) / 2;
                    self.cssFitFrame.fitToWindow(marginBotFrame);
                    endPosMap += self.DOM.$map.outerHeight(true) + posMap.top - $(window).height();
                }
                if (self.cssPinMap) {
                    self.cssPinMap.bindPin(posMap.top, posMap.top, endPosMap);
                    self.cssPinMap.resize();
                } else {
                    self.cssPinMap = Lacoste.StoreLocator.CSSPin(self.DOM.$map);
                    self.cssPinMap.bindPin(posMap.top, posMap.top, endPosMap);
                }
            }
        } else {
            self.DOM.$map.parent().appendTo($('body'));
        }
    }
};

Lacoste.StoreLocator.LoaderPage = function(promisesKey) {
    var self = {
        promises: {}
    };

    construct(promisesKey);

    return {
        addPromise: addPromise,
        load: load,
        resolvePromise: resolvePromise,
        rejectPromise: rejectPromise
    };

    function construct(promisesKey) {
        if (typeof promisesKey !== 'undefined') {
            if (Array.isArray(promisesKey)) {
                for (var i = 0, j = promisesKey.length; i < j; i++) {
                    addPromise(promisesKey[i]);
                }
            } else {
                console.error('The Object except a Array');
            }
        }
    }

    function addPromise(name) {
        if (typeof name === 'string') {
            self.promises[name] = $.Deferred();
        } else {
            console.error('Impossible to add a promise because It\'s not a string');
        }
    }

    function resolvePromise(name) {
        if (typeof self.promises[name] !== 'undefined') {
            self.promises[name].resolve();
        } else {
            console.warn('The promise ' + name + ' not existe');
        }
    }

    function rejectPromise(name) {
        if (typeof self.promises[name] !== 'undefined') {
            self.promises[name].reject();
        } else {
            console.warn('The promise ' + name + ' not existe');
        }
    }

    function load(handler) {
        $.when.apply($, getArrayPromises()).done(function() {
            handler();
        });
    }

    function getArrayPromises() {
        var deferreds = [];
        for (var i in self.promises) {
            if (self.promises.hasOwnProperty(i)) {
                deferreds.push(self.promises[i]);
            }
        }
        return deferreds;
    }
};

Lacoste.StoreLocator.Search = function(map, google, EventEmitter, $input) {
    var autocompleteService = new google.maps.places.AutocompleteService();
    var placesService = new google.maps.places.PlacesService(map);
    var self = {};
    self.$input = $input;
    self.autocomplete = null;

    construct();

    return {};

  /*
   Create google autocomplete input
   */
    function construct() {
        self.$input.keydown(function(e) {
            if (e.keyCode == 13) {
                e.preventDefault() & e.stopPropagation();
                autocompleteService.getPlacePredictions({input: self.$input.val(), types: ['geocode']} , function (predictions, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        self.$input.val(predictions[0].description);
                        placesService.getDetails({placeId: predictions[0]['place_id']}, function (place) {
                            retrievePlaceCoordinate(place);
                        });
                    }
                });
                return false;
            }
        });
        self.autocomplete = new google.maps.places.Autocomplete(self.$input.get(0), {
            types: ['geocode']
        });

        //correctif to close choose's list
        var isFocus = false;
        self.$input.focus(function() {
            if ($(window).width() < 1280) {
                setTimeout(function () {
                    isFocus = true;
                }, 500);
            }else {
                isFocus = true;
            }
        });

        if ($(window).width() >= 1280) {
            $(window).scroll(function() {
                if(isFocus) {
                    self.$input.trigger('blur');
                    isFocus = false;
                }
            });
        } else {
            $('.site-sections .content-container').scroll(function () {
                if (isFocus) {
                    self.$input.trigger('blur');
                    isFocus = false;
                }
            });
        }

        google.maps.event.addListener(self.autocomplete, 'place_changed', function() {
            var place = self.autocomplete.getPlace();
            retrievePlaceCoordinate(place);
        });
    }

    function retrievePlaceCoordinate(place) {
        if (typeof place.geometry == 'undefined') {
            return;
        }

        if (typeof place.geometry.viewport === 'undefined') {
            searchNearestStores(place.geometry.location.lat(), place.geometry.location.lng());
        } else {
            var neCoords = place.geometry.viewport.getNorthEast();
            var swCoords = place.geometry.viewport.getSouthWest();
            searchStoresInArea(neCoords.lat(), swCoords.lat(), neCoords.lng(), swCoords.lng());
        }
    }

    function searchStoresInArea(maxLat, minLat, maxLng, minLng) {

        var url = Lacoste.StoreLocator.mainUrl;
        url += '?maxLatitude=' + maxLat;
        url += '&minLatitude=' + minLat;
        url += '&maxLongitude=' + maxLng;
        url += '&minLongitude=' + minLng;
        load(url);
    }

    function searchNearestStores(lat, lng) {
        if (stGeolocalisator) {
            stGeolocalisator.removeWatch();
        }
        EventEmitter.emitEvent('userLocalized', [{
            lat: lat,
            lng: lng
        }]);

        var url = Lacoste.StoreLocator.mainUrl;
        url += '?latitude=' + lat;
        url += '&longitude=' + lng;

        load(url);
    }
};

Lacoste.StoreLocator.CSSFit = function($main, $container) {
    var self = {
        $window: $(window),
        $main: $main,
        $container: $container
    };

    return {
        fitToWindow: fitToWindow
    };

  //// FUNCTIONS /////
    function fitToWindow(marginBottom, forceHeight) {
        marginBottom = marginBottom !== 'undefined' && !isNaN(marginBottom) ? marginBottom : 0;
        var marginHeight = self.$container.outerHeight(true) - self.$container.outerHeight();
        var newheight = self.$window.height() - self.$container.offset().top - marginHeight - marginBottom;
        if (forceHeight) {
            self.$container.css('height', newheight);
        } else {
            self.$container.css('min-height', newheight);
        }
    }
};

Lacoste.StoreLocator.CSSPin = function($container) {
    var self = {
        $window: $(window),
        $parent: $container.parent(),
        $index: $container.index() - 1,
        $container: $container,
        topPos: 0,
        leftPos: 0,
        startPos: 0,
        endPos: 0,
        outerHeight: 0,
        isPin: false
    };

    construct();

    return {
        setTopPos: setTopPos,
        getTopPos: getTopPos,
        setLeftPos: setLeftPos,
        setStartPos: setStartPos,
        setEndPos: setEndPos,
        isPin: isPin,
        bindPin: bindPin,
        unbindPin: unbindPin,
        resize: resize
    };

    function construct() {
        self.$container.width(self.$container.width());
        self.posLeft = self.$container.position().left;
    }

    function isPin() {
        return self.isPin;
    }

    function setTopPos(pos) {
        if (!isNaN(pos)) {
            self.topPos = pos;
        } else {
            console.error('It\'s not a number.');
        }
    }

    function getTopPos() {
        return self.topPos;
    }

    function setLeftPos(pos) {
        if (!isNaN(pos)) {
            self.leftPos = pos;
        } else {
            console.error('It\'s not a number.');
        }
    }

    function setStartPos(pos) {
        if (!isNaN(pos)) {
            self.startPos = pos;
        } else {
            console.error('It\'s not a number.');
        }
    }

    function setEndPos(pos) {
        if (!isNaN(pos)) {
            self.endPos = pos;
        } else {
            console.error('It\'s not a number.');
        }
    }

    function bindPin(topPos, startPos, endPos) {
        setTopPos(topPos);
        setStartPos(startPos);
        setEndPos(endPos);
        self.$window.unbind('scroll', checkPos).bind('scroll', checkPos);
        $('.site-sections .content-container').unbind('scroll', checkPos).bind('scroll', checkPos);
    }

    function unbindPin() {
        if (self.$index < 0) {
            self.$container.prependTo(self.$parent);
        } else {
            self.$container.insertAfter(self.$parent.find('*:eq(' + self.$index + ')'));
        }
        self.$window.unbind('scroll', checkPos);
        $('.site-sections .content-container').unbind('scroll', checkPos);
        unpin(false);
    }

    function checkPos() {
        self.outerHeight = self.$container.outerHeight(true);
        var currPos = self.$window.scrollTop() + $('.site-sections .content-container').scrollTop() + self.topPos;
        if (currPos >= self.startPos && currPos + self.outerHeight <= self.endPos && !self.isPin) {
            pin();
        } else if (self.isPin && (currPos < self.startPos || currPos + self.outerHeight > self.endPos)) {
            unpin(currPos + self.outerHeight > self.endPos);
        }
    }

    function resize() {
        self.outerHeight = self.$container.outerHeight(true);
        var currPos = self.$window.scrollTop() + self.topPos;
        if (currPos >= self.startPos && currPos + self.outerHeight <= self.endPos) {
            pin();
        } else if (currPos < self.startPos || currPos + self.outerHeight > self.endPos) {
            unpin(currPos + self.outerHeight > self.endPos);
        }
    }

    function pin() {
        if (self.isPin) {
            return;
        }

        self.isPin = true;
        var posLeft = self.$container.offset().left;
        var posTop = self.topPos;
        if (windowIsLoad) {
            self.$container.appendTo('body');
            self.$container.css({
                position: 'fixed',
                top: posTop,
                left: posLeft,
                zIndex: 3
            });
        } else {
            $(window).load(function () {
                self.$container.appendTo('body');
                self.$container.css({
                    position: 'fixed',
                    top: posTop,
                    left: posLeft,
                    zIndex: 3
                });
            });
        }

    }

    function unpin(below) {
        self.isPin = false;
        var pos = 0;
        if (below) {
            pos = self.endPos - self.topPos - self.outerHeight;
        }
        if (pos < self.startPos - self.topPos) {
            pos = self.startPos - self.topPos;
        }

        self.$container.css({
            position: 'absolute',
            top: pos,
            left: self.posLeft
        });
        if (self.$index < 0) {
            self.$container.prependTo(self.$parent);
        } else {
            self.$container.insertAfter(self.$parent.find('*:eq(' + self.$index + ')'));
        }
    }
};

Lacoste.StoreLocator.MarkerHover = function(google, Map, $list, Stores, infoWindowCollection) {
    var self;
    self = {
        Stores: Stores,
        MarkerHover: null,
        $list: $list,
        Map: Map
    };

    construct();

    return {
        marker: self.MarkerHover,
        unbindEvent: unbindEvent
    };

    function construct() {
        self.MarkerHover = Lacoste.StoreLocator.Marker(google, self.Map, {
            lat: 0,
            lng: 0
        }, 'Lacoste', getIcon());
        self.MarkerHover.hide();
        $list.find('li').unbind('hover').hover(selectStore, unselectStore);
    }

    function unbindEvent() {
        $list.find('li').unbind('hover');
    }

    function selectStore() {
        var $li = $(this);
        self.Stores.setKey($li.index());
        self.MarkerHover.show();
        self.MarkerHover.setPosition({
            lat: self.Stores.current.latitude,
            lng: self.Stores.current.longitude
        });
        self.MarkerHover.setIcon({
            url: urlResources + self.Stores.current.icon,
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 46),
            size: new google.maps.Size(269, 210),
            scaledSize: new google.maps.Size(89, 70)
        });
        self.Map.panTo({
            lat: self.Stores.current.latitude,
            lng: self.Stores.current.longitude
        });
        infoWindowCollection.closeCurrent();
    }

    function unselectStore() {
        self.MarkerHover.hide();
    }

    function getIcon() {
        return {
            url: urlResources + '/img/ico-storelocator/marker.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 46)
        };
    }
};

Lacoste.StoreLocator.Stores = function(data) {

    var self;
    self = {
        size: 0,
        list: [],
        current: {},
        next: next,
        valid: valid,
        first: first,
        setKey: setKey,
        getKey: getKey,
        filterBy: filterBy,
        haveCornerAndStores: false,
        defineListenerStoreHidden: defineListenerStoreHidden,
        removeListenerStoreHidden: removeListenerStoreHidden,
        defineListenerStoreVisible: defineListenerStoreVisible,
        removeListenerStoreVisible: removeListenerStoreVisible
    };

    var indexList = 0;
    var handlersVisible = null;
    var handlersHidden = null;

    init();

    return self;

    function init() {
        self.size = data.length;
        self.list = data;
        self.current = data[0];
        var haveCorner = false;
        var haveStore = false;
        for (var i = 0; i < self.size && (!haveCorner || !haveStore); i++) {
            if (self.list[i].type && self.list[i].type.toLowerCase() === 'corner') {
                haveCorner = true;
            } else {
                haveStore = true;
            }
        }
        self.haveCornerAndStores = haveCorner && haveStore;
    }

    function first() {
        indexList = 0;
        self.current = self.list[0];
    }

    function next() {
        ++indexList;
        self.current = self.list[indexList];
    }

    function setKey(i) {
        indexList = i;
        self.current = self.list[indexList];
    }

    function getKey() {
        return indexList;
    }

    function valid() {
        return typeof self.list[indexList] !== 'undefined';
    }

    function filterBy(key, value) {
        if (typeof handlersVisible === 'function' || typeof handlersHidden === 'function') {
            for (var i = 0, j = self.list.length; i < j; i++) {
                if (self.list[i][key].toLowerCase() === 'flagship') {
                    self.list[i][key] = 'store';
                }
                if (typeof handlersVisible === 'function'
                    && (value === 'all' || self.list[i][key].toLowerCase() === value.toLowerCase())) {
                    handlersVisible(i);
                } else if (typeof handlersHidden === 'function') {
                    handlersHidden(i);
                }
            }
        }
    }

    function defineListenerStoreHidden(handler) {
        handlersHidden = handler;
    }

    function removeListenerStoreHidden() {
        handlersHidden = null;
    }

    function defineListenerStoreVisible(handler) {
        handlersVisible = handler;
    }

    function removeListenerStoreVisible() {
        handlersVisible = null;
    }
};

Lacoste.StoreLocator.direction = function(Map) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var mode = google.maps.TravelMode.DRIVING;
    var currentOrigin = null;
    var currentDestination = null;

    $('.st-map-direction').on('click', '.st-direction-btn', function() {
        $('.st-direction-btn').removeClass('active');
        $(this).addClass('active');
        if ($(this).hasClass('driving')) {
            enableDrivingMode();
        } else {
            enableWalkingMode();
        }
        calculateRoute(currentOrigin, currentDestination);
    });

    return {
        enableDrivingMode: enableDrivingMode,
        enableWalkingMode: enableWalkingMode,
        calculateRoute: calculateRoute,
        remove: remove
    };

    function remove() {
        directionsDisplay.setMap(null);
        $('.st-map-direction').removeClass('show');
        currentOrigin = null;
        currentDestination = null;
        Map.resizeMap();
    }

    function enableDrivingMode() {
        mode = google.maps.TravelMode.DRIVING;
        $('.st-direction-btn').removeClass('active');
        $('.st-map-direction .driving').addClass('active');
    }

    function enableWalkingMode() {
        mode = google.maps.TravelMode.WALKING;
        $('.st-direction-btn').removeClass('active');
        $('.st-map-direction .walking').addClass('active');
    }

    function calculateRoute(origin, destination) {
        currentOrigin = origin;
        currentDestination = destination;
        directionsDisplay.setMap(Map.map);
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: mode
        }, displayRoute);
    }

    function displayRoute(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            $('.st-map-direction').addClass('show');
            $('.st-direction-info .st-duration').html(response.routes[0].legs[0].duration.text);
            $('.st-direction-info .st-distance').html(response.routes[0].legs[0].distance.text);
            Map.resizeMap();
        } else {
            alert(stPageData.trad.errorDirection);
        }
    }

};

Lacoste.StoreLocator.hours = function(moment, openingHoursMilitary, exceptOpening, exceptClosure) {
    var self;
    self = {
        exceptOpening: exceptOpening,
        exceptClosure: exceptClosure,
        openingHoursMilitary: openingHoursMilitary,
        hours: null
    };
    construct();

    return {
        getPlainTextExceptOpening: getPlainTextExceptOpening,
        getPlainTextExceptClosure: getPlainTextExceptClosure,
        getPlainTextHours: getPlainTextHours,
        getHours: getHours,
        closedToday: closedToday,
        isOpen: isOpen,
        openToday: openToday,
        getOpeningHour: getOpeningHour,
        getClosureHour: getClosureHour
    };

    function construct() {
        if (self.openingHoursMilitary == null) {
            return;
        }
        self.hours = {};

        parseOpeningHoursMilitary();
        parseExceptionalOpening();
        parseExceptionalClosure();
    }

    function parseExceptionalClosure() {
        if (typeof self.exceptClosure == 'undefined' || self.exceptClosure == null) {
            return;
        }

        self.hours.exceptionalClosure = self.exceptClosure.split(';');
    }

    function parseExceptionalOpening() {
        if (typeof self.exceptOpening == 'undefined' || self.exceptOpening == null) {
            return;
        }
        self.hours.exceptionalOpening = {};
        var exceptOpeningsArr = self.exceptOpening.split(';');

        for (var i = 0, j = exceptOpeningsArr.length; i < j; i++) {
            var tmpArr = exceptOpeningsArr[i].split(':');
            self.hours.exceptionalOpening[tmpArr[0]] = parseDayHours(tmpArr[1]);
        }
    }

    function parseOpeningHoursMilitary() {
        var reg = new RegExp('[1-7](\-[2-7])?:(,{0,1}[0-2][0-9][0-5][0-9]-[0-2][0-9][0-5][0-9]){0,3}', 'g');
        var matches = self.openingHoursMilitary.match(reg);
        for (var i = 0, nrbMatches = matches.length; i < nrbMatches; i++) {
            parseIntervalOpeningHours(matches[i]);
        }
    }

    function parseIntervalOpeningHours(strIntervalOpeningHours) {
        var intervalOpeningHours = strIntervalOpeningHours.split(':');
        var hoursDay = parseDayHours(intervalOpeningHours[1]);
        parseIntervalDays(intervalOpeningHours[0], hoursDay);
    }

    function parseIntervalDays(intervalDays, hoursDay) {
        if (intervalDays.indexOf('-') !== -1) {
            for (var i = parseInt(intervalDays.substr(0, 1)), j = parseInt(intervalDays.substr(2, 1)); i <= j; i++) {
                self.hours['day-' + i] = hoursDay;
            }
        } else {
            self.hours['day-' + intervalDays] = hoursDay;
        }
    }

    function parseDayHours(strDayHours) {
        if (strDayHours == 'undefined') {
            return null;
        }
        if (strDayHours && strDayHours.indexOf(',') != -1) {
            var arrayHours = strDayHours.split(',');
            var hours = parseHours(arrayHours[0]);
            if (typeof arrayHours[1] !== 'undefined') {
                hours.and = parseHours(arrayHours[1]);
            }
            return hours;
        }
        return parseHours(strDayHours);
    }

    function parseHours(stHours) {
        var hours = {
            hstart: moment('1212-12-12'),
            hend: moment('1212-12-12'),
            isEmpty: true
        };
        if (stHours && stHours.indexOf('-') != -1) {
            var arrayHours = stHours.trim().split('-');
            hours.hstart.hour(arrayHours[0].substr(0, 2)).minute(arrayHours[0].substr(2, 2));
            hours.hend.hour(arrayHours[1].substr(0, 2)).minute(arrayHours[1].substr(2, 2));
            hours.isEmpty = false;
        }

        return hours;
    }

    function getHours() {
        return self.hours;
    }

    function getPlainTextExceptOpening() {
        var hoursTextArray = [];
        moment.locale(stLang);
        if (typeof self.hours.exceptionalOpening == 'undefined') {
            return hoursTextArray;
        }

        for (var prop in self.hours.exceptionalOpening) {
            if (self.hours.exceptionalOpening.hasOwnProperty(prop)) {

                var hoursText = '';
                var hours = self.hours.exceptionalOpening[prop];
                var day = moment(prop, 'MM-DD-YY');
                var now = moment();
                now.startOf('day');
                var nextMonth = moment(now).add(1, 'months').endOf('day');
                if (day.isSame(now) || day.isBetween(now, nextMonth)) {
                    hoursText += day.format('LL');
                    if (!hours.isEmpty) {
                        hoursText += ': ' + hours.hstart.format('H:mm') + '-' + hours.hend.format('H:mm');
                        if (typeof hours.and !== 'undefined') {
                            hoursText += ', ' + hours.and.hstart.format('H:mm') + '-' + hours.and.hend.format('H:mm');
                        }
                    }
                    hoursTextArray.push(hoursText);
                }
            }
        }
        return hoursTextArray;
    }

    function getPlainTextExceptClosure() {
        var hoursTextArray = [];
        moment.locale(stLang);
        if (typeof self.hours.exceptionalClosure == 'undefined') {
            return hoursTextArray;
        }

        for (var i = 0; i < self.hours.exceptionalClosure.length; i++) {
            var day = moment(self.hours.exceptionalClosure[i], 'MM-DD-YY');
            var now = moment();
            now.startOf('day');
            var nextMonth = moment(now).add(1, 'months').endOf('day');
            if (day.isSame(now) || day.isBetween(now, nextMonth)) {
                hoursTextArray.push(day.format('LL'));
            }
        }
        return hoursTextArray;
    }

    function getPlainTextHours() {
        var hoursTextArray = [];
        moment.locale(stLang);
        for (var i = 1; i <= 7; i++) {
            var firstDay = i;
            var isInterval = false;
            if (typeof self.hours['day-' + i] === 'undefined') {
                continue;
            }
            while (sameHours(self.hours['day-' + i], self.hours['day-' + (i + 1)])) {
                isInterval = true;
                i++;
            }
            var hoursText = '';

            if (isInterval) {
                hoursText = moment().day(firstDay).format('dddd') + ' - ' + moment().day(i).format('dddd') + ': ';
                hoursText += self.hours['day-' + i].hstart.format('H:mm') + '-' + self.hours['day-' + i].hend.format('H:mm');
                if (typeof self.hours['day-' + i].and !== 'undefined') {
                    hoursText += ', ' + self.hours['day-' + i].and.hstart.format('H:mm') + '-' + self.hours['day-' + i].and.hend.format('H:mm');
                }
                hoursTextArray.push(hoursText);
            } else {
                hoursText = moment().day(i).format('dddd');
                if (!self.hours['day-' + i].isEmpty) {
                    hoursText += ': ' + self.hours['day-' + i].hstart.format('H:mm') + '-' + self.hours['day-' + i].hend.format('H:mm');
                    if (typeof self.hours['day-' + i].and !== 'undefined') {
                        hoursText += ', ' + self.hours['day-' + i].and.hstart.format('H:mm') + '-' + self.hours['day-' + i].and.hend.format('H:mm');
                    }
                }
                hoursTextArray.push(hoursText);
            }
        }

        moment.locale('en');
        return hoursTextArray;
    }

    function sameHours(h1, h2) {
        if (typeof h2 === 'undefined') {
            return false;
        }
        if (h1.hstart.isSame(h2.hstart) && h1.hend.isSame(h2.hend)) {
            if (typeof h1.and !== 'undefined' && h2.and !== 'undefined') {
                return h1.and.hstart.isSame(h2.and.hstart) && h1.and.hend.isSame(h2.and.hend);
            }
            return typeof h1 === typeof h2;
        }
        return false;
    }

    function closedToday() {
        var now = moment();
        return typeof self.hours.exceptionalClosure != 'undefined' && self.hours.exceptionalClosure.indexOf(now.format('MM-DD-YY')) != -1;
    }

    function isOpen() {
        var now = moment();
        var hoursToday;
        if (typeof self.hours.exceptionalClosure != 'undefined' && self.hours.exceptionalClosure.indexOf(now.format('MM-DD-YY')) != -1) {
            return false;
        } else if (!(typeof self.hours.exceptionalOpening != 'undefined' && (now.format('MM-DD-YY') in self.hours.exceptionalOpening))) {
            var dayOfWeek = now.day() == 0 ? 7 : now.day();
            hoursToday = self.hours['day-' + dayOfWeek];
        } else {
            hoursToday = self.hours.exceptionalOpening[now.format('MM-DD-YY')];
        }
        now.year(1212);
        now.month(11);
        now.date(12);
        if (typeof hoursToday === 'undefined') {
            return false;
        }
        if (now.isBetween(hoursToday.hstart, hoursToday.hend)) {
            return true;
        } else if (typeof hoursToday.and !== 'undefined') {
            return now.isBetween(hoursToday.and.hstart, hoursToday.and.hend);
        } else {
            return false;
        }
    }

    function openToday() {
        var now = moment();
        var hoursToday;
        if (typeof self.hours.exceptionalClosure != 'undefined' && self.hours.exceptionalClosure.indexOf(now.format('MM-DD-YY')) != -1) {
            return false;
        } else if (!(typeof self.hours.exceptionalOpening != 'undefined' && (now.format('MM-DD-YY') in self.hours.exceptionalOpening))) {
            var dayOfWeek = now.day() == 0 ? 7 : now.day();
            hoursToday = self.hours['day-' + dayOfWeek];
        } else {
            hoursToday = self.hours.exceptionalOpening[now.format('MM-DD-YY')];
        }
        now.year(1212);
        now.month(11);
        now.date(12);
        if (typeof hoursToday === 'undefined') {
            return false;
        }
        if (now.isBefore(hoursToday.hstart)) {
            return true;
        } else if (typeof hoursToday.and !== 'undefined') {
            return now.isBefore(hoursToday.and.hstart);
        } else {
            return false;
        }
    }

    function getOpeningHour() {
        var now = moment();
        var hoursToday;
        if (typeof self.hours.exceptionalOpening != 'undefined' && (now.format('MM-DD-YY') in self.hours.exceptionalOpening)) {
            hoursToday = self.hours.exceptionalOpening[now.format('MM-DD-YY')];
        } else {
            var dayOfWeek = now.day() == 0 ? 7 : now.day();
            hoursToday = self.hours['day-' + dayOfWeek];
        }
        var openingHour = null;
        now.year(1212);
        now.month(11);
        now.date(12);

        if (now.isBefore(hoursToday.hstart)) {
            openingHour = hoursToday.hstart;
        } else {
            openingHour = hoursToday.and.hstart;
        }
        return openingHour.locale(stLang).format('LT');
    }

    function getClosureHour() {
        var now = moment();
        var hoursToday;
        if (typeof self.hours.exceptionalOpening != 'undefined' && (now.format('MM-DD-YY') in self.hours.exceptionalOpening)) {
            hoursToday = self.hours.exceptionalOpening[now.format('MM-DD-YY')];
        } else {
            var dayOfWeek = now.day() == 0 ? 7 : now.day();
            hoursToday = self.hours['day-' + dayOfWeek];
        }
        var closureHour = null;
        now.year(1212);
        now.month(11);
        now.date(12);

        if (now.isBefore(hoursToday.hend)) {
            closureHour = hoursToday.hend;
        } else {
            closureHour = hoursToday.and.hend;
        }
        return closureHour.locale(stLang).format('LT');
    }

};


Lacoste.StoreLocator.displayHours = function($elem, hours, trad) {
    var self = {
        $elem: $elem,
        $pStatus: $elem.find('.st-openingStatus'),
        $pHours: $elem.find('.st-hours'),
        $pExceptOpening: $elem.find('.st-hours-exceptionalOpening'),
        $pExceptClosure: $elem.find('.st-hours-exceptionalClosure'),
        hours: hours,
        timer: null
    };

    construct();

    return {
        enableUpdateRealTime: enableUpdateRealTime,
        disableUpdateRealTime: disableUpdateRealTime
    };

    function construct() {
        printOpeningStatus();
        enableUpdateRealTime();
        if (self.$pHours.length == 1) {
            printHours();
            printExceptionalOpening();
            printExceptionalClosure();
        }
    }

    function printExceptionalOpening() {
        var exceptOpening = self.hours.getPlainTextExceptOpening();
        if (exceptOpening.length == 0) {
            self.$pExceptOpening.parent().remove();
        }
        for (var i = 0, j = exceptOpening.length; i < j; i++) {
            $('<p>', {
                text: exceptOpening[i]
            }).appendTo(self.$pExceptOpening);
        }
    }

    function printExceptionalClosure() {
        var exceptClosure = self.hours.getPlainTextExceptClosure();
        if (exceptClosure.length == 0) {
            self.$pExceptClosure.parent().remove();
        }
        for (var i = 0, j = exceptClosure.length; i < j; i++) {
            $('<p>', {
                text: exceptClosure[i]
            }).appendTo(self.$pExceptClosure);
        }
    }

    function printHours() {
        var hours = self.hours.getPlainTextHours();
        for (var i = 0, j = hours.length; i < j; i++) {
            $('<p>', {
                text: hours[i]
            }).appendTo(self.$pHours);
        }
    }

    function enableUpdateRealTime() {
        self.timer = setInterval(printOpeningStatus, 60000);
    }

    function disableUpdateRealTime() {
        if (typeof self.timer === 'number') {
            clearInterval(self.timer);
            self.timer = null;
        }
    }

    function printOpeningStatus() {
        var text = '';
        if (self.hours.closedToday()) {
            text = trad.closedToday;
        } else if (self.hours.isOpen()) {
            text = trad.openUntil.replace('%h', self.hours.getClosureHour());
        } else if (self.hours.openToday()) {
            text = trad.opensAt.replace('%h', self.hours.getOpeningHour());
        } else {
            text = trad.closed;
        }
        self.$pStatus.html(text);
    }
};

Lacoste.StoreLocator.Markers = function(google, Stores, Map) {
    var self = {};
    self.markers = [];
    self.Stores = Stores;
    self.bounds = new google.maps.LatLngBounds();

    construct(Map);

    return {
        markers: self.markers,
        bounds: self.bounds,
        getPositionsArray: getPositionsArray
    };

    function construct() {
        self.Stores.first();
        while (self.Stores.valid()) {
            var marker = Lacoste.StoreLocator.Marker(google, Map, {
                lat: self.Stores.current.latitude,
                lng: self.Stores.current.longitude
            }, self.Stores.current.name, getIconStore());
            marker.addListener('click', (function (storeCurrent) {
                return function () {
                    load(Lacoste.StoreLocator.mainUrl + storeCurrent.url);
                };
            })(self.Stores.current));
            self.markers.push(marker);
            self.bounds.extend(marker.getPosition());
            self.Stores.next();
        }
    }

    function getIconStore() {
        return {
            scale: 5,
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#000000',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#000000'
        };
    }

    function getPositionsArray() {
        var positions = [];
        for (var i = 0, j = self.markers.length; i < j; i++) {
            positions.push(self.markers[i].getPosition());
        }
        return positions;
    }
};

Lacoste.StoreLocator.Marker = function(google, Map, position, title, Icon, zIndex) {
    var self = {};
    self.marker = null;

    construct(Map, position, title, Icon, zIndex);

    return self.marker;

    function construct(Map, position, title, Icon, zIndex) {
        var options = {
            position: position,
            map: Map,
            icon: Icon,
            zIndex: (typeof zIndex !== 'undefined' ? zIndex : 1),
            optimized: false,
            title: decode(title)
        };

        self.marker = new google.maps.Marker(options);
        self.marker.show = show;
        self.marker.hide = hide;
        self.marker.remove = remove;
    }

    function decode(txt){
        var sp = document.createElement('span');
        sp.innerHTML = txt;
        return sp.innerHTML;
    }


    function show() {
        self.marker.setVisible(true);
    }

    function hide() {
        self.marker.setVisible(false);
    }

    function remove() {
        self.marker.setMap(null);
        self.marker = null;
    }
};

Lacoste.StoreLocator.FilterType = function(Stores, types, trad) {
    var self = {
        types: types.values,
        filterActivated: 'all',
        Stores: Stores
    };

    return {
        getValues: getValues,
        getLabelByValue: getLabelByValue,
        getFilterActivated: getFilterActivated,
        filterBy: filterBy
    };

    function getValues() {
        return self.types;
    }

    function getLabelByValue(val) {
        return trad[val.toLowerCase()];
    }

    function getFilterActivated() {
        return self.filterActivated;
    }

    function filterBy(val) {
        self.filterActivated = val;

        self.Stores.filterBy('type', val);
    }
};

Lacoste.StoreLocator.PrinterFilterMenu = function($button, Filter) {
    var self = {
        $window: $(window),
        $body: $('body'),
        $button: $button,
        Filter: Filter,
        $filterMenu: null
    };
    construct();

    return {};

    function construct() {
        self.$filterMenu = createMenu();
        self.$filterMenu.appendTo(self.$body);

        self.$button.unbind('click', open).click(open);
    }

    function createMenu() {
        var $filterMenu = $('<div/>', {
            id: 'filterMenu',
            'class': 'st-dropdown'
        }).width(self.$button.outerWidth());

        var $ul = createList();

        $ul.appendTo($filterMenu);

        return $filterMenu;
    }

    function createList() {
        var $ul = $('<ul/>');
        var values = self.Filter.getValues();
        for (var i = 0, j = values.length; i < j; i++) {
            var $li = createLi(values[i]);
            $li.appendTo($ul);
        }
        return $ul;
    }

    function createLi(val) {
        var $li = $('<li/>', {
            text: self.Filter.getLabelByValue(val)
        });
        $li.click(function() {
            select($li, val);
        });
        if (val === self.Filter.getFilterActivated()) {
            $li.addClass('active');
        }
        return $li;
    }

    function positionMenu() {
        var top = self.$button.offset().top + self.$button.outerHeight();
        var left = self.$button.offset().left;
        var width = self.$button.outerWidth();

        self.$filterMenu.css({
            top: top,
            left: Math.floor(left),
            width: width
        });
    }

    function open() {
        self.$filterMenu.toggleClass('open');
        self.$window.bind('click', close);
        positionMenu();
        return false;
    }

  /*
   Close filters' menu
   */
    function close() {
        self.$window.unbind('click', close);
        self.$filterMenu.removeClass('open');
    }

    function select($li, val) {
        self.$filterMenu.find('li.active').removeClass('active');
        $li.addClass('active');
        self.Filter.filterBy(val);
    }
};

Lacoste.StoreLocator.InfoWindow = function(map, store) {
    var content = '';
    content = '<h2>' + store.name + '</h2>';
    content += '<p>' + store.address + '</p>';
    content += '<p>' + store.postalCode + ' ' + store.city + '</p>';

    var $contentInfoWindow = $('<div>', {
        'class': 'infoWindow',
        'data-url': Lacoste.StoreLocator.mainUrl + store.url
    });
    $contentInfoWindow.append(content);
    $contentInfoWindow.click(function (e) {
        e.preventDefault();
        load($(this).data('url'));
    });

    var infoWindow = new google.maps.InfoWindow({
        content: $contentInfoWindow.get(0)
    });

    return infoWindow;
};

Lacoste.StoreLocator.InfoWindowCollection = function(map, Markers, Stores) {
    var infoWindows = [];
    var currentInfoWindow = null;

    Stores.first();
    while (Stores.valid()) {
        var tmpInfoWindow = Lacoste.StoreLocator.InfoWindow(map, Stores.current);
        var currentMarker = Markers.markers[Stores.getKey()];
        currentMarker.addListener('mouseover', (openWindow)(tmpInfoWindow, currentMarker));
        currentMarker.addListener('click', (openWindow)(tmpInfoWindow, currentMarker));
        infoWindows.push(tmpInfoWindow);
        Stores.next();
    }

    return {
        closeCurrent: closeCurrent,
        collection: infoWindows,
        remove: remove
    };

    function remove() {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    }

    function openWindow(infoWindow, marker) {
        return function() {
            if (currentInfoWindow != null) {
                currentInfoWindow.close();
            }
            currentInfoWindow = infoWindow;
            infoWindow.open(map, marker);
        };
    }

    function closeCurrent() {
        if (currentInfoWindow != null) {
            currentInfoWindow.close();
        }
    }
};

Lacoste.StoreLocator.redirectToApp = function(store) {
    if (Lacoste.StoreLocator.isMobile.iOS() && Lacoste.StoreLocator.isPlatform.iOS()) {
        window.open('http://maps.apple.com/?daddr=' + encodeURIComponent(store.address + ', ' + store.postalCode + ' ' + store.city));
    } else {
        window.open('http://maps.google.com/maps?daddr=' + store.latitude + ',' + store.longitude + '&directionsmode=driving');
    }
};

Lacoste.StoreLocator.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

Lacoste.StoreLocator.isPlatform = {
    iOS: function() {
        return navigator.appVersion.match(/iPhone|iPod/i) ? true : false;
    },
    Android: function() {
        return navigator.appVersion.match(/Android/i) ? true : false;
    },
    Windows: function() {
        return navigator.appVersion.match(/Windows NT/i) ? true : false;
    }
};

Lacoste.StoreLocator.CSSPinBottom = function($element) {
    var initPos = null;
    var isPin = false;
    var $container = $('.site-sections .content-container');
    $(window).load(init);
    $container.bind('scroll', pin);
    $(window).resize(pin);

    function init() {
        pin();
    }
    function setInitPos() {
        initPos = $element.outerHeight() + $element.position().top + $('.st-card').position().top + $('.st-frame').position().top + $('.st-topBar').outerHeight() + $('.topbar').outerHeight();
    }
    function pin() {
        if (initPos == null) {
            setInitPos();
        }
        var scrollTop = $container.scrollTop() + $(window).height();
        if (scrollTop < initPos) {
            $element.appendTo($('body'));
            $element.css({
                position: 'fixed',
                bottom: 0,
                left: 0
            });
            isPin = true;
        } else if (scrollTop >= initPos && isPin) {
            $element.appendTo($('.st-card'));
            $element.removeAttr('style');
            setInitPos();
            isPin = false;
        }
    }

    function remove() {
        $container.unbind('scroll', pin);
        $(window).unbind('resize', pin);
        $element.remove();
    }

    return {
        remove: remove,
        init: init
    };
};