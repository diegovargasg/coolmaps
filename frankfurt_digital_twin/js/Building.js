class Building {
  constructor(coordinates, properties, height, center) {
    this.coordinates = coordinates;
    this.properties = properties;
    this.height = height ? height : 1;
    this.center = center;
  }

  generateGeometry() {
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

    geometry = generateGeometry(shape, {
      curveSegments: 1,
      depth: 0.05 * this.height,
      bevelEnabled: false,
    });

    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);

    return geometry;
  }
}
