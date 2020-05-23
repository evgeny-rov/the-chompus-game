const HISCORE_KEY = 'chompusbest';

const scoreStore = localStorage;

export const getHiscore = () => scoreStore.getItem(HISCORE_KEY);

export const setHiscore = (score) => score > getHiscore() && scoreStore.setItem(HISCORE_KEY, score);
