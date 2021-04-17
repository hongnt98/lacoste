/* global $ EventEmitter Mustache google moment Lacoste urlResources stPageData */
var stEventEmitter = new EventEmitter();
var stTemplateEngine = Lacoste.StoreLocator.TemplateEngine(Mustache);
var stGenerator = Lacoste.StoreLocator.GeneratorFrame(stTemplateEngine, stEventEmitter);
var stHttp = Lacoste.StoreLocator.http;
var stDistance = null;
var stMap = null;
var cssFeature = null;
var stMarkers = null;
var markerStore = null;
var stMarkerHover = null;
var displayersHours = null;
var stUserLocation = null;
var stGeolocalisator = null;
var stDirection = null;
var stCSSPinBottom = null;
var infoWindowCollection = null;
var windowIsLoad = false;

if (/iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    $('.st-main-topBar').addClass('isStatic');
}

stEventEmitter.addListener('detailLoaded', detailLoaded);

function detailLoaded(stData) {
    var Icon = {
        url: urlResources + stData.store.icon,
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(22, 64),
        size: new google.maps.Size(269, 210),
        scaledSize: new google.maps.Size(89, 70)
    };

    markerStore = Lacoste.StoreLocator.Marker(google, stMap.map, {
        lat: stData.store.latitude,
        lng: stData.store.longitude
    }, stData.store.name, Icon);
    if (stUserLocation != null) {
        stEventEmitter.addOnceListener('calculEnded', function(distances) {
            if (distances[0].status == 'OK') {
                $('#page-details .st-card .distance').html(' - ' + distances[0].distance.text);
            }
        });
        var positions = [markerStore.getPosition()];
        for (var i = 0, j = stData.stores.length; i < j; i++) {
            positions.push({
                lat: stData.stores[i].latitude,
                lng: stData.stores[i].longitude
            });
        }
        stDistance.calculDistance(stUserLocation.marker.getPosition(), positions);
        stEventEmitter.addOnceListener('calculEnded', function(distances) {
            if (distances[0].status == 'OK') {
                $('#page-details .st-card .distance').html(' - ' + distances[0].distance.text);
            }
            $('#page-details .st-list li').each(function(index) {
                if (distances[index + 1].status == 'OK') {
                    $(this).find('.distance').html(' - ' + distances[index + 1].distance.text);
                }
            });
        });

    }

    stMap.zoom = 17;
    stMap.center = {
        lat: stData.store.latitude,
        lng: stData.store.longitude
    };
    stMap.resizeMap();
    displayersHours = [];

    if (stData.store.hours != null) {
        var storeHours = Lacoste.StoreLocator.hours(moment, stData.store.hours, stData.store.exceptionalOpening, stData.store.exceptionalClosure);
        displayersHours.push(Lacoste.StoreLocator.displayHours($('#page-details .st-card'), storeHours, stData.trad));
    }

    for (var i = 0, j = stData.stores.length; i < j; i++) {
        if (stData.stores[i].hours != null) {
            var hours = Lacoste.StoreLocator.hours(moment, stData.stores[i].hours, stData.stores[i].exceptionalOpening, stData.stores[i].exceptionalClosure);
            displayersHours.push(Lacoste.StoreLocator.displayHours($('#page-details .st-list li').eq(i), hours, stData.trad));
        }
    }
    Lacoste.StoreLocator.generatorBreadcrumb.generate(stData);
    cssFeature.resize();

    $('#btn-direction').click(function() {
        if(stUserLocation == null) {
            stGeolocalisator = Lacoste.StoreLocator.Geolocalisation(stEventEmitter, false);
            stEventEmitter.addOnceListener('usermarkerCreate', function () {
                stDirection.calculateRoute(stUserLocation.marker.getPosition(), markerStore.getPosition());
            });
        } else {
            stDirection.calculateRoute(stUserLocation.marker.getPosition(), markerStore.getPosition());
        }
    });
    $('#print-store').click(function() {
        window.print();
    });

    $('.st-card .mb-direction').click(function() {
        Lacoste.StoreLocator.redirectToApp(stData.store);
    });

    $('.st-list .mb-direction').click(function() {
        var i = $(this).closest('li').index();
        Lacoste.StoreLocator.redirectToApp(stData.stores[i]);
    });

    stCSSPinBottom = Lacoste.StoreLocator.CSSPinBottom($('.st-btns-fixed'));
    if (windowIsLoad) {
        stCSSPinBottom.init();
    }
}

stEventEmitter.addListener('resultsLoaded', resultsLoaded);

function resultsLoaded(stData) {
    var stStores = new Lacoste.StoreLocator.Stores(stData.stores);
    stStores.defineListenerStoreHidden(hiddenStores);
    stStores.defineListenerStoreVisible(visibleStores);
    stMarkers = Lacoste.StoreLocator.Markers(google, stStores, stMap.map);
    infoWindowCollection = Lacoste.StoreLocator.InfoWindowCollection(stMap.map, stMarkers, stStores);
    if (typeof stData.area !== 'undefined') {
        stMap.bounds = stMarkers.bounds;
        stMap.bounds.extend(new google.maps.LatLng(stData.area.maxLat, stData.area.maxLng));
        stMap.bounds.extend(new google.maps.LatLng(stData.area.minLat, stData.area.minLng));
        stMap.resizeMap();
    } else if (stStores.size > 0) {
        stMap.bounds = stMarkers.bounds;
        stMap.resizeMap();
    }

    if (stUserLocation != null) {
        if (stUserLocation.circle != null) {
            stMap.bounds.union(stUserLocation.circle.getBounds());
        } else {
            stMap.bounds.extend(stUserLocation.marker.getPosition());
        }
        stMap.resizeMap();
        stDistance.calculDistance(stUserLocation.marker.getPosition(), stMarkers.getPositionsArray());
        stEventEmitter.addOnceListener('calculEnded', function(distances) {
            $('#page-results .st-list li').each(function(index) {
                if (distances[index].status == 'OK') {
                    $(this).find('.distance').html(' - ' + distances[index].distance.text);
                }
            });
        });
    }

    stMarkerHover = Lacoste.StoreLocator.MarkerHover(google, stMap.map, $('#page-results .st-list'), stStores, infoWindowCollection);
    stStores.first();
    displayersHours = [];
    while (stStores.valid()) {
        if (stStores.current.hours !== null) {
            var hours = Lacoste.StoreLocator.hours(moment, stStores.current.hours, stStores.current.exceptionalOpening, stStores.current.exceptionalClosure);
            displayersHours.push(Lacoste.StoreLocator.displayHours($('#page-results .st-list li').eq(stStores.getKey()), hours, stData.trad));
        }
        stStores.next();
    }
    var FilterByTypes = Lacoste.StoreLocator.FilterType(stStores, stData.types, stData.trad);
    if (stStores.haveCornerAndStores) {
        Lacoste.StoreLocator.PrinterFilterMenu($('#filterBtn'), FilterByTypes);
    } else {
        $('#filterBtn').addClass('disabled');
    }

    Lacoste.StoreLocator.generatorBreadcrumb.generate(stData);
    cssFeature.resize();
    $('.mb-direction').click(function() {
        stStores.setKey($(this).closest('li').index());
        Lacoste.StoreLocator.redirectToApp(stStores.current);
    });

    $('#showMap').click(function() {
        $('body').addClass('st-show-map');
        stMap.resizeMap();
    });

    $('#closeMap').click(function() {
        $('body').removeClass('st-show-map');
    });

}

function hiddenStores(i) {
    $('#page-results .st-list li').eq(i).hide();
    stMarkers.markers[i].hide();
    cssFeature.resize();
    stEventEmitter.emitEvent('mapContainerResize');
}

function visibleStores(i) {
    $('#page-results .st-list li').eq(i).show();
    stMarkers.markers[i].show();
    cssFeature.resize();
    stEventEmitter.emitEvent('mapContainerResize');
}

stEventEmitter.addListener('searchLoaded', searchLoaded);

function searchLoaded(stData) {
    Lacoste.StoreLocator.generatorBreadcrumb.generate(stData);
    if (typeof stData.continent == 'undefined') {
        return;
    }

    var geocoder = new google.maps.Geocoder();
    var address = typeof stData.continent != 'undefined' ? stData.continent : '';
    address = (typeof stData.country != 'undefined' ? stData.country + ', ' : '') + address;
    address = (typeof stData.city != 'undefined' ? stData.city + ', ' : '') + address;

    geocoder.geocode({
        address: address
    }, function(geoRes) {
        if (geoRes.length === 0) {
            stMap.bounds = null;
            stMap.center = {
                lat: 0,
                lng: 0
            };
            stMap.zoom = 0;
        } else  {
            stMap.bounds = geoRes[0].geometry.bounds;
        }
        stMap.resizeMap();
    });

}

stEventEmitter.addListener('userLocalized', createUserMarker);

function createUserMarker(coords) {
    if (stUserLocation == null) {
        stUserLocation = Lacoste.StoreLocator.CreateUserMarker(stMap.map, coords);
    } else {
        stUserLocation.update(coords);
    }

    stEventEmitter.emitEvent('usermarkerCreate');
}

if (stPageData.page == 'search') {
    stGeolocalisator = Lacoste.StoreLocator.Geolocalisation(stEventEmitter, true);
}

$('.st-topBar-search .st-icon-search').click(function() {
    stGeolocalisator = Lacoste.StoreLocator.Geolocalisation(stEventEmitter, true);
});

$('#st-frame-container').on('click', 'a', function(e) {
    e.preventDefault() && e.stopPropagation();
    var url = $(this).attr('href');
    load(url);
});

$('#st-frame-container').on('click', '.st-btn.tel', function () {
    var phone = $(this).data('phone');
    if (phone.indexOf('+') != -1) {
        location.href = 'tel:' + phone;
    }

});

function load(url, params) {
    destroy();
    var httpDeffereds = stHttp.load(url, params);
    httpDeffereds.jqxhr.done(function(stData) {
        if (stData.page === 'results' && stData.nbrStores === 1) {
            stGenerator.hasNoResultPage = true;
            load(Lacoste.StoreLocator.mainUrl + stData.stores[0].url);
        } else {
            if (stData.page === 'results') {
                stGenerator.hasNoResultPage = false;
            }
            httpDeffereds.rewriteUrl.resolve(stData);
            stGenerator.generate(stData);
        }
    });
}

function destroy() {
    $(window).scrollTop(0);
    $('.site-sections .content-container').scrollTop(0);
    $('body').removeClass('st-show-map');
    stMap.bounds = null;
    stDirection.remove();
    if (infoWindowCollection != null) {
        infoWindowCollection.remove();
        infoWindowCollection = null;
    }
    if (stCSSPinBottom != null) {
        stCSSPinBottom.remove();
        stCSSPinBottom = null;
    }

    if (stMarkers != null) {
        for (var i = 0, j = stMarkers.markers.length; i < j; i++) {
            stMarkers.markers[i].remove();
        }
        stMarkers = null;
    }

    if (stMarkerHover != null) {
        stMarkerHover.unbindEvent();
        stMarkerHover.marker.remove();
        stMarkerHover = null;
    }

    if (markerStore != null) {
        markerStore.remove();
        markerStore = null;
    }

    if (displayersHours != null) {
        for (var i = 0, j = displayersHours.length; i < j; i++) {
            displayersHours[i].disableUpdateRealTime();
        }
        displayersHours = null;
    }

}


$(document).ready(function() {
    cssFeature = Lacoste.StoreLocator.GeneratorCSSFeatures();
    stEventEmitter.emitEvent('mapContainerResize');
    stEventEmitter.addListener('contentLoaded', function() {
        cssFeature.resize();
        stEventEmitter.emitEvent('mapContainerResize');
    });
    $(window).resize(function() {
        $(window).scrollTop(0);
        $('.site-sections .content-container').scrollTop(0);
        cssFeature.resize();
        stEventEmitter.emitEvent('mapContainerResize');
    });

});
$(window).load(function () {
    windowIsLoad = true;
});

function googleScriptIsLoad() {
    stMap = Lacoste.StoreLocator.Map(google, stEventEmitter);
    Lacoste.StoreLocator.Search(stMap.map, google, stEventEmitter, $('#searchByAddress'));
    stDistance = Lacoste.StoreLocator.Distance(google, stEventEmitter);
    stDirection = Lacoste.StoreLocator.direction(stMap);
    rewriteUrl(stPageData);
    if (stPageData.page === 'results' && stPageData.nbrStores === 1) {
        stGenerator.hasNoResultPage = true;
        load(Lacoste.StoreLocator.mainUrl + stPageData.stores[0].url);
    } else {
        if (stPageData.page === 'results') {
            stGenerator.hasNoResultPage = false;
        }
        stGenerator.generate(stPageData);
    }
}

function rewriteUrl(stPageData) {

    if (stPageData.breadcrumb == null || typeof stPageData.breadcrumb.country === 'undefined') {
        return;
    }
    var url = '';
    if (stPageData.page == 'detail' && typeof stPageData.breadcrumb.store !== 'undefined') {
        url = Lacoste.StoreLocator.mainUrl + stPageData.breadcrumb.store.url;
    } else if (stPageData.page == 'results' && typeof stPageData.breadcrumb.city !== 'undefined') {
        url = Lacoste.StoreLocator.mainUrl + stPageData.breadcrumb.city.url;
    } else {
        url = Lacoste.StoreLocator.mainUrl + stPageData.breadcrumb.country.url;
    }

    // Keep GA query parameters
    if( stPageData.query ) {
        var query = '';
        var queryArr = window.location.search.substring(1).split('&');

        for (var i = 0, len = queryArr.length; i < len; i++) {
            if( queryArr[i].split('=')[0].indexOf('utm') !== -1 ) {
                query += (query === '' ? '?' : '&') + queryArr[i];
            }
        }
        url += query;
    }

    Lacoste.StoreLocator.history[0] = {
        state: 0,
        url: url,
        query: ''
    };

    History.replaceState({
        state: Lacoste.StoreLocator.history[0].state
    }, stPageData.trad.metaTitle, Lacoste.StoreLocator.history[0].url);
}