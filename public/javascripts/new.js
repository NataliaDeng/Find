var map;
var infowindow;
var service;
var latlng;

function init() { 
	if (navigator.geolocation) { 
		
	  navigator.geolocation.getCurrentPosition(function (position) { 
		var coords = position.coords; 
		document.getElementById("lat").value=coords.latitude;
		document.getElementById("lng").value=coords.longitude;		

		latlng = new google.maps.LatLng(coords.latitude, coords.longitude); 
		var myOptions = { 
		zoom: 16, 
		center: latlng,  
		mapTypeId: google.maps.MapTypeId.ROADMAP 
		,showOnLoad : true
		}; 
		//create map
		map = new google.maps.Map(document.getElementById("map"), myOptions); 
		infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		map.addListener('idle', performSearch);			 			 			
	  }, 
	function (error) { 

		switch (error.code) { 
		case 1: 
		alert("Service Denied"); 
		break; 
		case 2: 
		alert("Cannot get location"); 
		break; 
		default: 
		alert("Unknown Error"); 
		break; 
		} 
	}); 
	} 
} 
function performSearch() {
  var request = {
    location: latlng,
    radius: '1000',
	//bounds: map.getBounds(),
    keyword: 'Starbucks'
	
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {	
    addMarker(result);
  }
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    label: 'Starbucks'
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}
