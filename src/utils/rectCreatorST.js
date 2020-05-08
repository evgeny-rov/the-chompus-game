export default (ctx, x, y, width, height, fill, alpha) => {
  const shape = ctx.add.rectangle(x, y, width, height, fill, alpha);
  ctx.physics.add.existing(shape, true);
  return shape;
};
