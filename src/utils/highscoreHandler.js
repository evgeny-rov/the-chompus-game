export default (score = 0, highscore) => (score > highscore && localStorage.setItem('chompusHiscore', score));
