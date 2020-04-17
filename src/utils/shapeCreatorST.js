export default (context, x, y, width, height, fill, alpha) => {
  const shape = context.add.rectangle(x, y, width, height, fill, alpha);
  context.physics.add.existing(shape, true);
  return shape;
}