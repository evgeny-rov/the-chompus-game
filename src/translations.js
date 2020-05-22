const translations = {
  en: {
    title_play: 'tap to play',
    title_help: 'how to play',
    help_bonus: ['catch sushi', 'to get bonus'],
    help_use_bonus_ts: ['tap on the left half of the', 'screen, to use bonus'],
    help_use_bonus_kb: ['press SPACEBAR', 'to use bonus'],
    help_action_ts: ['tap on the right half of the', 'screen, to jump'],
    help_action_kb: ['press W or UP', 'to jump'],
    help_fullscreen: ['fullscreen', 'button'],
    g_over_retry: 'try again',
    score: 'score:',
    hiscore: 'best: ',
  },
  ru: {
    title_play: 'коснись для начала игры',
    title_help: 'как играть',
    help_bonus: ['лови суши,', 'чтобы получить бонус'],
    help_use_bonus_ts: ['коснись левой половины', 'экрана, чтобы использовать бонус'],
    help_use_bonus_kb: ['нажимай ПРОБЕЛ,', 'чтобы использовать бонус'],
    help_action_ts: ['коснись правой половины', 'экрана, чтобы прыгать'],
    help_action_kb: ['нажимай W или ВВЕРХ,', 'чтобы прыгать'],
    help_fullscreen: ['полный', 'экран'],
    g_over_retry: 'заново',
    score: 'счет:',
    hiscore: 'рекорд: ',
  },
};

const userLanguages = navigator.languages.join('');
const hasRussian = /ru/i.test(userLanguages);

export default hasRussian ? translations.ru : translations.en;
