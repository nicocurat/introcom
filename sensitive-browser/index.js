// GPS
navigator.geolocation.getCurrentPosition(position => {
  $('#gps-latitude').text(position.coords.latitude);
  $('#gps-longitude').text(position.coords.longitude);
  const gpsMap = $('#gps-map');
  gpsMap.attr('src', gpsMap.attr('src') + position.coords.latitude + '~' + position.coords.longitude);
});

// Gyroscope
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', event => {
    $('#gyroscope-gamma').text(event.gamma + '°');
    $('#gyroscope-beta').text(event.beta + '°');
    $('#gyroscope-alpha').text(event.alpha + '°');
  });
}

// Accelerometer
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', event => {
    $('#accelerometer-x').text(event.acceleration.x);
    $('#accelerometer-y').text(event.acceleration.y);
    $('#accelerometer-z').text(event.acceleration.z);
    $('#accelerometer-gravity-x').text(event.accelerationIncludingGravity.x);
    $('#accelerometer-gravity-y').text(event.accelerationIncludingGravity.y);
    $('#accelerometer-gravity-z').text(event.accelerationIncludingGravity.z);
    $('#accelerometer-rotation-alpha').text(event.rotationRate.alpha);
    $('#accelerometer-rotation-beta').text(event.rotationRate.beta);
    $('#accelerometer-rotation-gamma').text(event.rotationRate.gamma);
  });
}

// Camera
navigator.getUserMedia(
  { video: true },
  localMediaStream => {
    document.getElementById('camera-video').srcObject = localMediaStream;
  },
  err => { console.log('getUserMedia error: ' + err); }
);

// Vibrator
$('#vibrator-1second').on('click', () => navigator.vibrate(1000));
$('#vibrator-sequence').on('click', () => navigator.vibrate([500, 250, 500, 250, 500, 250, 1000, 250, 1000]));

// Light
window.addEventListener('devicelight', event => {
  $('#light-value').text(event.value + ' lux');
});
window.addEventListener('lightlevel', event => {
  $('#light-level').text(event.value);
});

// Battery
if (navigator.battery) {
  $('#battery-level').text(navigator.battery.level + '%');
  $('#battery-charging').text(navigator.battery.charging);
  $('#battery-charge-time').text(navigator.battery.chargingTime + ' minutos');
  $('#battery-discharge-time').text(navigator.battery.dischargingTime + ' minutos');
  navigator.battery.addEventListener('chargingchange', () => {
    $('#battery-charging').text(navigator.battery.charging);
  });
}

// Proximity
window.addEventListener('deviceproximity', event => {
  $('#proximity-min').text(event.min + ' cm');
  $('#proximity-max').text(event.max + ' cm');
  $('#proximity-value').text(event.value + ' cm');
});