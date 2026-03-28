/* ============================================
   Cafe NPC dialogue data — Lena Mikhailova and
   Boris Gennadyevich.
   ============================================ */

const CAFE_DIALOGUE = (() => {
  // -----------------------------------------------------------
  // Lena — barista, practical, slightly guarded, warms up
  // -----------------------------------------------------------
  const LENA = {
    id: 'lena',
    name: 'Лена',
    persona: 'Lena Mikhailova is 34, the barista and partial owner of the only cafe in Malinov. She returned from Moscow eight years ago and has made her peace with small-town life. She is practical, slightly guarded, and warms up gradually. She speaks at normal speed and uses service language naturally. She models ordering vocabulary and corrects gently when the player gets an order wrong. She uses informal Russian (ты) with the player after the first meeting.',
    tutorVocabulary: [
      { russian: 'я хочу', translation: 'I want' },
      { russian: 'дайте мне', translation: 'give me' },
      { russian: 'можно', translation: 'may I / is it possible' },
      { russian: 'можно мне', translation: 'may I have' },
      { russian: 'кофе', translation: 'coffee' },
      { russian: 'чай', translation: 'tea' },
      { russian: 'вода', translation: 'water' },
      { russian: 'сок', translation: 'juice' },
      { russian: 'хлеб', translation: 'bread' },
      { russian: 'суп', translation: 'soup' },
      { russian: 'салат', translation: 'salad' },
      { russian: 'сколько стоит', translation: 'how much does it cost' },
      { russian: 'рубль', translation: 'rouble' },
      { russian: 'счёт', translation: 'the bill' },
      { russian: 'большой', translation: 'big / large' },
      { russian: 'маленький', translation: 'small' },
      { russian: 'спасибо', translation: 'thank you' },
      { russian: 'пожалуйста', translation: 'please / you\'re welcome' },
      { russian: 'здесь', translation: 'here' },
      { russian: 'там', translation: 'there' },
    ],
  };

  // -----------------------------------------------------------
  // Boris — retired engineer, gruff, newspaper reader, warms slowly
  // -----------------------------------------------------------
  const BORIS = {
    id: 'boris',
    name: 'Борис Геннадьевич',
    persona: 'Boris Gennadyevich is a retired water treatment engineer who comes to the cafe every morning at 9:15 to read his newspaper. He is dry, economical with words, and occasionally accidentally funny. He uses formal Russian (вы) and speaks in short, precise sentences. He teaches numbers through newspaper dates and prices, and describes things with engineering precision. He does not suffer fools but gradually accepts the player.',
    tutorVocabulary: [
      { russian: 'здравствуйте', translation: 'hello (formal)' },
      { russian: 'газета', translation: 'newspaper' },
      { russian: 'сегодня', translation: 'today' },
      { russian: 'вчера', translation: 'yesterday' },
      { russian: 'десять', translation: 'ten' },
      { russian: 'двадцать', translation: 'twenty' },
      { russian: 'пятьдесят', translation: 'fifty' },
      { russian: 'сто', translation: 'one hundred' },
      { russian: 'рубль', translation: 'rouble' },
      { russian: 'сколько', translation: 'how much / how many' },
      { russian: 'дорого', translation: 'expensive' },
      { russian: 'дёшево', translation: 'cheap' },
      { russian: 'хорошо', translation: 'good' },
      { russian: 'плохо', translation: 'bad' },
      { russian: 'новый', translation: 'new' },
      { russian: 'старый', translation: 'old' },
      { russian: 'красивый', translation: 'beautiful' },
      { russian: 'место', translation: 'place / seat' },
      { russian: 'окно', translation: 'window' },
    ],
  };

  return { LENA, BORIS };
})();
