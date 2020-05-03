const toggleFullscreen = () => (
  !document.fullscreenElement
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen()
);

export default (ctx) => {
  const fsButton = ctx.add.image(ctx.game.config.width - 50, 25, 'uifs').setInteractive();
  fsButton.on('pointerdown', () => toggleFullscreen());
};
