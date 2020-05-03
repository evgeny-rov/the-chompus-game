export default (ctx) => {
  const menuButton = ctx.add.image(50, 25, 'uimenu').setInteractive().setDisplaySize(50, 50)
  menuButton.on('pointerdown', () => alert('hi, this is menu'));
};
