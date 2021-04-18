  (function(window){
     var List = (function(){
       function List(params){
         this.items = [];
       }
       List.prototype = {
         add: function(item){
           this.items.push(item);
         },
         remove: function(item){
           var indexOf = this.items.indexOf(item);
           if(indexOf !== -1){
             this.items.splice(indexOf,1);
           }
         },
         find: function(callback, action){
           var callbackReturn,
               items = this.items,
               length = items.length,
               matches = [],
               i = 0;
           for(; i < length; i++){
             callbackReturn = callback(items[i], i);
             if(callbackReturn){
               matches.push(items[i]);
             }
           }
           if (action){
             action.call(this,matches);
           }
           return matches;
         }
       }
       return List;
     }());

     List.create = function(params){
       return new List(params);
     };

     window.List = List;

    }(window));


    (function (window, google, list) {

     var Mapster = (function(){
       function Mapster(element, opts){
         this.gMap = new google.maps.Map(element, opts);
         this.markers = List.create();
         this.markerClusterer = new MarkerClusterer(this.gMap, []);
       }
       Mapster.prototype = {
         _on: function(opts){
           var self = this;
           google.maps.event.addListener(opts.obj, opts.event, function(e){
             opts.callback.call(self, e);
           });
         },
         addMarker: function(opts){
           var marker;
           opts.position = {
             lat: opts.lat,
             lng: opts.lng
           }
           marker = this._createMarker(opts);
           this.markerClusterer.addMarker(marker);
           this.markers.add(marker);
           if (opts.event){
             this._on({
               obj: marker,
               event: opts.event.name,
               callback: opts.event.callback
             });
           }
           if (opts.content){
             this._on({
               obj: marker,
               event: 'click',
               callback: function(){
                                if (window.infowindow) window.infowindow.close();
                 var infoWindow = new google.maps.InfoWindow({
                   content: opts.content
                 });
                               window.infowindow = infoWindow;
                 infoWindow.open(this.gMap, marker);
               }
             });
           }
           return marker;
         },
         findBy: function(callback){
           return this.markers.find(callback);
         },
         removeBy: function(callback){
           var self = this;
           self.markers.find(callback, function(markers){
             markers.forEach(function(marker){
               if (self.markerClusterer) {
                 self.markerClusterer().removeMarker(marker);
               } else {
                 marker.setMap(null);
               }
             });
           });
         },
         _createMarker: function(opts){
           opts.map = this.gMap;
           return new google.maps.Marker(opts);
         }
       }

       return Mapster;
     }());

     Mapster.create = function(element, opts){
       return new Mapster(element, opts);
     }
        
      window.Mapster = Mapster;

    }(window, google));

(function($){
    (function(window, mapster){
      // map options
      var options = {
        center: {
          lat: 12.216545,
          lng: 122.18
        },
        zoom: 5
      }
      var element = document.getElementById('st-map-container');

      // map init
      map = Mapster.create(element, options);
      
//       var newMap = new google.maps.Map($('#amlocator-map-canvas'), {zoom: 4,
//           center: {lat: 37.090, lng: -95.712},
//           mapTypeId: 'terrain'})

      // adding markers
//       for (var i = storeArray.length - 1; i >= 0; i--) {
//         var store = storeArray[i];
//         var marker = map.addMarker({
//           lat: store.lat,
//           lng: store.lng,
//           id: i, 
//           content: store.infoContent
//         });
//       }
      
      var searchBox = new google.maps.places.SearchBox(document.getElementById('searchByAddress'));
      
      // place change event on search box
      google.maps.event.addListener(searchBox, 'places_changed', function(){
        
        var places = searchBox.getPlaces();
        //bound
        var bounds = new google.maps.LatLngBounds();
        var i, place;

        for(i=0; place=places[i];i++){
          console.log('lat: ' + place.geometry.location.lat());
          console.log('lng: ' +place.geometry.location.lng());
         bounds.extend(place.geometry.location);
        }

        map.gMap.fitBounds(bounds);
        map.gMap.setZoom(14);

      });


      //location list map redirect on click
//       $('#leftbar-storecols .location-block').click(function(){
//         var $this = $(this),
//             locLat = $this.data('lat'),
//             locLng = $this.data('lng'),
//             locId = $this.data('amid'),
//             mrkrs = map.markers.items,
//             mrkr;

//             map.gMap.setCenter({lat: locLat, lng: locLng});
//             map.gMap.setZoom(18.5);

//             for(var i = 0; i < mrkrs.length; i++){
//               if(mrkrs[i].id == locId){
//                 mrkr = mrkrs[i];
//               }
//             }
//             google.maps.event.trigger(mrkr, 'click');            
//             // alert(locLat + " " + locLng)
//       })
      
      //location list map redirect v2
      $('.st-list-item').click(function(){
        var $this = $(this),
            locLat = $this.parent().data('lat'),
            locLng = $this.parent().data('lng'),
            locId = $this.parent().data('amid'),
            mrkrs = map.markers.items,
            mrkr;

            map.gMap.setCenter({lat: locLat, lng: locLng});
            map.gMap.setZoom(18.5);

            for(var i = 0; i < mrkrs.length; i++){
              if(mrkrs[i].id == locId){
                mrkr = mrkrs[i];
              }
            }
        	console.log('Yown!');
            google.maps.event.trigger(mrkr, 'click');  
        	
      })

      //search nearest mall from current position
      google.maps.event.addDomListener(document.getElementById('locateNearBy'), 'click', function(){
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){ 
            var currentLat = position.coords.latitude, 
                currentLng = position.coords.longitude,
                currentPosition = new google.maps.LatLng(currentLat, currentLng);
            var distances = [];
            var closest = -1;

            for (var i = storeArray.length - 1; i >= 0; i--) {
                var store = storeArray[i],
                    filterLatLng = new google.maps.LatLng(store.lat, store.lng),
                    d = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, filterLatLng);
                // alert(filterLatLng);
                distances[i] = d;
                if (closest == -1 || d < distances[closest]) {
                    closest = i;
                    var boundsDistance = filterLatLng;
                }
            }
            alert(closest)
            var storeVar = storeArray[closest],
                storeLatLng = new google.maps.LatLng(storeVar.lat, storeVar.lng),
                storeBounds = new google.maps.LatLngBounds()

            map.gMap.setCenter(currentPosition)
            map.gMap.fitBounds(storeBounds(storeLatLng));
            map.gMap.panToBounds(storeBounds(storeLatLng));
            map.gMap.setZoom(map.gMap.getZoom()+1);                
          }) } else { 
              alert("Geolocation is currently not working.");
            }
      })


      //search on click event
      google.maps.event.addDomListener(document.getElementById('sortByFilter'), 'click', function() {
        var $kmValue = $("#amlocator-radius"),
            pi = 3.1415926535897932384626433832795,
            // $kmToMiles = $kmValue.val()*0.62137, - conversion to Miles
            $meters = $kmValue.val()*1000, //-convertion to Meters
            $storesList = $('#leftbar-storecols');



        if($kmValue.val() != ""){
            var places = searchBox.getPlaces();
            var myRadius = $meters,
                //Math.sqrt($meters * pi)*20, - just another wrong formula *wink
                // Math.sqrt($kmToMiles / pi)*1000 - Tested Formula for safekeeping
                currLatLng = new google.maps.LatLng(places[0].geometry.location.lat(), places[0].geometry.location.lng()),
              circ = new google.maps.Circle({
                  center: currLatLng,
                  fillOpacity: 0,
                  strokeOpacity:0,
                  map: map.gMap,
                  radius: myRadius
                });
            var counter = 0;
          
           //set radius to chosen KM value
            circ.setRadius(myRadius);
            map.gMap.fitBounds(circ.getBounds());
            map.gMap.panToBounds(circ.getBounds());
            map.gMap.setZoom(map.gMap.getZoom()+1);

            //filters the store location list
            for (var i = storeArray.length - 1; i >= 0; i--) {
              var store = storeArray[i];
              var filterLatLng = new google.maps.LatLng(store.lat, store.lng);
              var distanceRaw = google.maps.geometry.spherical.computeDistanceBetween(currLatLng, filterLatLng),
                  distanceComputed = distanceRaw / 1000;

              if(distanceComputed > $kmValue.val()){
                $storesList.find('div[data-lat="'+ store.lat +'"][data-lng="'+ store.lng +'"]').hide()
              }
              else if(distanceComputed <= $kmValue.val()){
                $storesList.find('div[data-lat="'+ store.lat +'"][data-lng="'+ store.lng +'"]').show()
              }

            }            
        }
        else{
          var newOptions = new google.maps.LatLng({lat: 12.216545, lng: 122.18});
          map.gMap.setCenter( newOptions);
          map.gMap.setZoom(5);
          
          //resets location lists
          for (var i = storeArray.length - 1; i >= 0; i--) {
              var store = storeArray[i];
              $storesList.find('div[data-lat="'+ store.lat +'"][data-lng="'+ store.lng +'"]').show();
           }           
        }
   
      })
      
    }(window, window.Mapster));  
})(jQuery)