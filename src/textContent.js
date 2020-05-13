const localization = {
  en: {
    title_play: 'tap to play',
    title_help: 'how to play',
    help_bonus: ['catch sushi', 'to get bonus'],
    help_use_bonus_ts: ['tap on the left half of the', 'screen, to use bonus'],
    help_use_bonus_kb: ['press spacebar', 'on the keyboard to use bonus'],
    help_action_ts: ['tap on the right half of the', 'screen, to jump'],
    help_action_kb: ['press w or arrow up', 'on the keyboard to jump'],
    help_fullscreen: ['fullscreen', 'button'],
  },
  ru: {
    title_play: 'коснись для начала игры',
    title_help: 'как играть',
    help_bonus: ['лови суши', 'чтобы получить бонус'],
    help_use_bonus_ts: ['коснись левой половины', 'экрана, чтобы использовать бонус'],
    help_use_bonus_kb: ['нажми пробел на клавиатуре', 'чтобы использовать бонус'],
    help_action_ts: ['коснись правой половины', 'экрана, чтобы прыгнуть'],
    help_action_kb: ['нажми на w или вверх', 'чтобы прыгнуть'],
    help_fullscreen: ['полный', 'экран'],
  },
};

export default (lang) => (lang === 'ru' ? localization.ru : localization.en);
