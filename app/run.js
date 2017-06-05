var start_stop_btn,
  wpid=false,
  map,
  z,
  op,
  prev_lat,
  prev_long,
  distance=0,
  min_speed=0,
  max_speed=0,
  min_altitude=0,
  max_altitude=0,
  distance_travelled=0,
  min_accuracy=150,
  date_pos_updated="",
  info_string="";

function format_time_component(time_component) {
  if(time_component<10)
    time_component="0"+time_component;
  else if(time_component.length<2)
    time_component=time_component+"0";
  return time_component;
}

function calc_distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344; }
	if (unit=="N") { dist = dist * 0.8684; }
	return dist;
}

function geo_success(position) {
  start_stop_btn.innerHTML="Stop";
  info_string="";
  var d=new Date();
  var h=d.getHours();
  var m=d.getMinutes();
  var s=d.getSeconds();
  var current_datetime=format_time_component(h)+":"+format_time_component(m)+":"+format_time_component(s);
  if(position.coords.accuracy<=min_accuracy) {
    if(prev_lat!=position.coords.latitude||prev_long!=position.coords.longitude) {
      if(position.coords.speed>max_speed)
        max_speed=position.coords.speed;
      else if(position.coords.speed<min_speed)
        min_speed=position.coords.speed;
      if(position.coords.altitude>max_altitude)
        max_altitude=position.coords.altitude;
      else if(position.coords.altitude<min_altitude)
        min_altitude=position.coords.altitude;
      distance = distance + calc_distance(prev_lat, prev_long,
        position.coords.latitude,
        position.coords.longitude);
      prev_lat=position.coords.latitude;
      prev_long=position.coords.longitude;
      info_string="Distance: "+distance+
	"<br />Current positon: lat="+position.coords.latitude+
        ", long="+position.coords.longitude+
        " (accuracy "+Math.round(position.coords.accuracy,1)+
        "m)<br />Speed: min="+(min_speed?min_speed:"Not recorded/0")+
        "m/s, max="+(max_speed?max_speed:"Not recorded/0")+
        "m/s<br />Altitude: min="+(min_altitude?min_altitude:"Not recorded/0")+
        "m, max="+(max_altitude?max_altitude:"Not recorded/0")+
        "m (accuracy "+Math.round(position.coords.altitudeAccuracy,1)+
        "m)<br />last reading taken at: "+current_datetime;
    }
  } else {
    info_string="Accuracy not sufficient ("+Math.round(position.coords.accuracy,1)+"m vs "+min_accuracy+"m) - last reading taken at: "+current_datetime;
  }
  if(info_string)
    op.innerHTML=info_string;
}

function geo_error(error) {
  switch(error.code) {
    case error.TIMEOUT:op.innerHTML="Timeout!";
    break;
  };
}

function get_pos() {
  if(!!navigator.geolocation) {
    wpid=navigator.geolocation.watchPosition(geo_success,geo_error,
      {enableHighAccuracy:true,maximumAge:30000,timeout:27000});
  } else {
    op.innerHTML="ERROR: Your Browser doesnt support the Geo Location API";
  }
}

function init_geo() {
  op=document.getElementById("output");
  if (op) {
    start_stop_btn=document.getElementById("geo_start_stop");
    if (start_stop_btn) {
      start_stop_btn.onclick=function() {
        if(wpid) {
          start_stop_btn.innerHTML="Start";
          navigator.geolocation.clearWatch(wpid);
          wpid=false;
        } else {
          start_stop_btn.innerHTML="Acquiring Geo Location...";
          get_pos();
        }
      }
    } else {
      op.innerHTML="ERROR: Couldn't find the start/stop button";
    }
  }
}
window.onload=init_geo;

