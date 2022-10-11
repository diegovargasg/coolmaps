class Building {
  constructor(coordinates, properties, height, center) {
    this.coordinates = coordinates;
    this.properties = properties;
    this.height = height ? height : 1;
    this.center = center;
  }

  generate() {
    let shape, geometry;
    let gaps = [];

    this.coordinates.forEach((coordinate, index) => {
      if (index === 0) {
        shape = generateShape(coordinate, this.center);
      } else {
        gaps.push(generateShape(coordinate, this.center));
      }
    });

    gaps.forEach((gap) => {
      shape.holes.push(gap);
    });

    // var rotation = new THREE.Matrix4().makeRotationZ(Math.PI/2);
    // var translation = new THREE.Matrix4().makeTranslation(0, 0, 10);
    // var transformation = rotation.multiply(translation);
    // shape.applyMatrix(transformation);

    geometry = generateGeometry(shape, {
      curveSegments: 1,
      //depth: 0.05 * this.height,
      depth: 0.01 * this.height,
      bevelEnabled: false,
    });

    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);
    //geometry.translate( 0, 2, 0 );

    return geometry;
  }
}
