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