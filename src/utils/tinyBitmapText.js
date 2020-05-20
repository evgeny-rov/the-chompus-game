export default (ctx, x, y, font, text, size, align = 1) => (
  ctx.add.bitmapText(x, y, font, text, size, align).setOrigin(0.5)
);
