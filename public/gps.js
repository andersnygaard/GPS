(function(){
    "use strict";

    var map;
    var config;

    window.initMap = function(){            

        var setupGmaps = function(){

            var style = [
                {
                stylers: [
                    { saturation: "-100" },
                    { lightness: "30" }
                ]
                },{
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
                },{
                featureType: "transit",
                stylers: [
                    { visibility: "off" }
                ]
                },{
                featureType: "road",
                stylers: [
                    { lightness: "50" },
                    { visibility: "on" }
                ]
                },{
                featureType: "landscape",
                stylers: [
                    { lightness: "40" }
                ]
                }
            ]

            var options = {
                zoom: 3,
                center:  new google.maps.LatLng(59.147124899999994, 9.6401769),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };

            window.start = function(){
                $("#placeholder").animate({"margin-top": "100%"}, 100);
            }

            var z;

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

            map = new google.maps.Map(document.getElementById("map"), options);
            map.setOptions({
                styles: style
            });

            var zoomed = false;

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
        }();
    };
}(window));