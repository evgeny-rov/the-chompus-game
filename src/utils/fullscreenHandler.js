export default () => {
  const isInFullscreen = document.fullscreenElement;
  return isInFullscreen
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
};
