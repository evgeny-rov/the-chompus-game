const HISCORE = 'chompusbest';

const scoreStorage = localStorage;

export const getHiscore = () => scoreStorage.getItem(HISCORE);

export const setHiscore = (score) => score > getHiscore() && scoreStorage.setItem(HISCORE, score);
