import style from "./style.js"
import GoogleMaps from 'google-maps';

var map;
var config = null;
var zoomed = false;
var z;
var options = {
    zoom: 3,
    center:  new google.maps.LatLng(59.147124899999994, 9.6401769),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    styles: style
};

window.start = function(){
    $("#placeholder").animate({"margin-top": "100%"}, 100);
}

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80);
    }
}

map = new GoogleMaps.maps.Map(document.getElementById("map"), options);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function showPosition(position) {
        map.setCenter(new google.maps.LatLng( position.coords.latitude, position.coords.longitude ) );
        if(!zoomed){
            smoothZoom(map, 19, map.getZoom());
            zoomed = true;
        }

        if(config){
            config.poi.forEach(function(poi){
                if(position.coords.latitude-0.001 < poi.pos.lat 
                && position.coords.latitude+0.001 > poi.pos.lat
                && position.coords.longitude-0.001 < poi.pos.lng
                && position.coords.longitude+0.001 > poi.pos.lng){
                    alert(poi.title);
                }
            });
        }
    });

    $.getJSON("config.json", function(cfg){
        config = cfg;
        var placeHolder = document.getElementById("placeholder");
        placeHolder.innerHTML = placeHolder.innerHTML.replace('{city}', config.language.city);
        placeHolder.innerHTML = placeHolder.innerHTML.replace('{intro}', config.language.intro);
        placeHolder.innerHTML = placeHolder.innerHTML.replace('{start}', config.language.start);

        config.poi.forEach(function(poi){
            var marker = new google.maps.Marker({
            position: poi.pos,
            map: map,
            title: poi.title
            });
        });
    });   
} else {
    // Handle no location
}