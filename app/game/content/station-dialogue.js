/* ============================================
   Train Station NPC dialogue data — Konstantin + Nadya
   ============================================ */

const STATION_DIALOGUE = (() => {
  const KONSTANTIN = {
    id: 'konstantin',
    name: 'Константин Петрович',
    persona: 'Konstantin Petrovich has managed Malinov train station for 22 years and runs it like clockwork. He is formal, precise, slightly self-important, and genuinely helpful when approached correctly. He uses вы exclusively and expects the player to do the same. He teaches time expressions, ticket buying, and formal register through real transactions. He has a small real smile when the player gets formal address right.',
    tutorVocabulary: [
      { russian: 'в котором часу', translation: 'at what time' },
      { russian: 'во сколько', translation: 'at what time (informal)' },
      { russian: 'через час', translation: 'in one hour' },
      { russian: 'поезд', translation: 'train' },
      { russian: 'прибудет', translation: 'will arrive' },
      { russian: 'отправляется', translation: 'departs' },
      { russian: 'билет', translation: 'ticket' },
      { russian: 'платформа', translation: 'platform' },
      { russian: 'вагон', translation: 'carriage' },
      { russian: 'направление', translation: 'direction (of travel)' },
      { russian: 'понедельник', translation: 'Monday' },
      { russian: 'вторник', translation: 'Tuesday' },
      { russian: 'среда', translation: 'Wednesday' },
      { russian: 'четверг', translation: 'Thursday' },
      { russian: 'пятница', translation: 'Friday' },
      { russian: 'суббота', translation: 'Saturday' },
      { russian: 'воскресенье', translation: 'Sunday' },
      { russian: 'сколько стоит', translation: 'how much does it cost' },
      { russian: 'здравствуйте', translation: 'hello (formal)' },
    ],
  };

  const NADYA = {
    id: 'nadya',
    name: 'Надя',
    persona: 'Nadya is 28, a police officer who moonlights as informal station security. She is from Saint Petersburg originally and has encyclopedic knowledge of Russian geography. She is warmer than Konstantin but still uses formal register at work. She teaches the player about travel, destinations, and future tense through casual conversation about where trains go.',
    tutorVocabulary: [
      { russian: 'куда', translation: 'where to' },
      { russian: 'откуда', translation: 'where from' },
      { russian: 'далеко', translation: 'far' },
      { russian: 'близко', translation: 'near / close' },
      { russian: 'через два часа', translation: 'in two hours' },
      { russian: 'завтра', translation: 'tomorrow' },
      { russian: 'сегодня', translation: 'today' },
      { russian: 'вчера', translation: 'yesterday' },
      { russian: 'поезд', translation: 'train' },
      { russian: 'билет', translation: 'ticket' },
      { russian: 'путь', translation: 'track / way' },
      { russian: 'маршрут', translation: 'route' },
      { russian: 'хороший', translation: 'good' },
      { russian: 'быстрый', translation: 'fast' },
      { russian: 'медленный', translation: 'slow' },
    ],
  };

  return { KONSTANTIN, NADYA };
})();
