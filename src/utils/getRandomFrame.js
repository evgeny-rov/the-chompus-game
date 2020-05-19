import randNum from './randomNum';

const zeroPad = '0';

export default (prefix, start, end) => (`${prefix}${zeroPad}${randNum(start, end)}`);
