const localization = {
  en: {
    title_play: 'tap to play',
    title_help: 'how to play',
    help_bonus: ['catch sushi', 'to get bonus'],
    help_use_bonus: ['tap left side of the', 'screen, to use bonus'],
    help_action: ['tap right side of the', 'screen, to jump'],
    help_fullscreen: ['fullscreen', 'button'],
  },
  ru: {
    title_play: 'тыкни для начала игры',
    title_help: 'как играть',
    help_bonus: ['лови суши', 'чтобы получить бонус'],
    help_use_bonus: ['тыкни с левой стороны', 'экрана, чтобы использовать бонус'],
    help_action: ['тыкни с правой стороны', 'экрана, чтобы прыгнуть'],
    help_fullscreen: ['полный', 'экран'],
  },
};

export default (lang) => (lang === 'ru' ? localization.ru : localization.en);
