function GPSRelativePosition(objPosi, centerPosi) {
  // Get GPS distance
  let dis = window.geolib.getDistance(objPosi, centerPosi);

  // Get bearing angle
  let bearing = window.geolib.getRhumbLineBearing(objPosi, centerPosi);

  // Calculate X by centerPosi.x + distance * cos(rad)
  let x = centerPosi[0] + dis * Math.cos((bearing * Math.PI) / 180);

  // Calculate Y by centerPosi.y + distance * sin(rad)
  let y = centerPosi[1] + dis * Math.sin((bearing * Math.PI) / 180);

  // Reverse X (it work)
  return [-x / 100, y / 100];
}

function GPSRelativePositionTurf(objPosi, centerPosi) {
  let options = { units: "meters" };

  // Get GPS distance
  let dis = turf.distance(objPosi, centerPosi, options);

  // Get bearing angle
  let bearing = turf.rhumbBearing(objPosi, centerPosi);

  // Calculate X by centerPosi.x + distance * cos(rad)
  let x = centerPosi[0] + dis * Math.cos((bearing * Math.PI) / 180);

  // Calculate Y by centerPosi.y + distance * sin(rad)
  let y = centerPosi[1] + dis * Math.sin((bearing * Math.PI) / 180);

  // Reverse X (it work)
  return [-x / 100, y / 100];
}

function generateShape(coordinate, center) {
  let shape = new THREE.Shape();

  coordinate.forEach((element, index) => {
    let elPosition = GPSRelativePositionTurf(element, center);
    if (index === 0) {
      shape.moveTo(elPosition[0], elPosition[1]);
    } else {
      shape.lineTo(elPosition[0], elPosition[1]);
    }
  });

  return shape;
}

function generateGeometry(shape, settings) {
  let geometry = new THREE.ExtrudeGeometry(shape, settings);
  geometry.computeBoundingBox();
  return geometry;
}

function generateLine(points) {
  let geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Adjust geometry rotation
  geometry.rotateZ(Math.PI);

  return geometry;
}
