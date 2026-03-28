/* ============================================
   Park NPC dialogue data — Artyom Voronov and
   Tamara Andreyevna Borisova.
   ============================================ */

const PARK_DIALOGUE = (() => {
  // -----------------------------------------------------------
  // Artyom — young, informal, curious about the player
  // -----------------------------------------------------------
  const ARTYOM = {
    id: 'artyom',
    name: 'Артём',
    persona: 'Artyom Voronov is 21, works at a grocery kiosk near the park, and reads Soviet adventure novels. He speaks clearly and slowly, is genuinely curious about the player, and finds communication gaps amusing rather than frustrating. He uses informal Russian (ты) and models directional vocabulary naturally. He always has a book in his back pocket.',
    tutorVocabulary: [
      { russian: 'налево', translation: 'to the left' },
      { russian: 'направо', translation: 'to the right' },
      { russian: 'прямо', translation: 'straight ahead' },
      { russian: 'здесь', translation: 'here' },
      { russian: 'там', translation: 'there' },
      { russian: 'где', translation: 'where' },
      { russian: 'что', translation: 'what' },
      { russian: 'как', translation: 'how' },
      { russian: 'кто', translation: 'who' },
      { russian: 'большой', translation: 'big' },
      { russian: 'маленький', translation: 'small' },
      { russian: 'новый', translation: 'new' },
      { russian: 'старый', translation: 'old' },
      { russian: 'красивый', translation: 'beautiful' },
      { russian: 'я иду', translation: 'I am going' },
      { russian: 'он сидит', translation: 'he is sitting' },
      { russian: 'книга', translation: 'book' },
      { russian: 'скамейка', translation: 'bench' },
      { russian: 'фонтан', translation: 'fountain' },
      { russian: 'дерево', translation: 'tree' },
      { russian: 'дорожка', translation: 'path' },
      { russian: 'привет', translation: 'hi' },
      { russian: 'да', translation: 'yes' },
      { russian: 'нет', translation: 'no' },
    ],
  };

  // -----------------------------------------------------------
  // Tamara — retired teacher, formal, warm, precise
  // -----------------------------------------------------------
  const TAMARA = {
    id: 'tamara',
    name: 'Тамара Андреевна',
    persona: 'Tamara Andreyevna Borisova is 71, a retired Russian language teacher who comes to the park every day. She uses formal Russian (вы) and has an instinct for teaching. She explains grammar gently, praises correct usage visibly, and never makes mistakes feel shameful. She models formal greetings and descriptive language about seasons and weather.',
    tutorVocabulary: [
      { russian: 'здравствуйте', translation: 'hello (formal)' },
      { russian: 'красный', translation: 'red' },
      { russian: 'синий', translation: 'blue' },
      { russian: 'зелёный', translation: 'green' },
      { russian: 'белый', translation: 'white' },
      { russian: 'чёрный', translation: 'black' },
      { russian: 'жёлтый', translation: 'yellow' },
      { russian: 'тепло', translation: 'warm' },
      { russian: 'холодно', translation: 'cold' },
      { russian: 'дождь', translation: 'rain' },
      { russian: 'солнце', translation: 'sun' },
      { russian: 'она сидит', translation: 'she is sitting' },
      { russian: 'красивый', translation: 'beautiful' },
      { russian: 'новый', translation: 'new' },
      { russian: 'старый', translation: 'old' },
      { russian: 'учительница', translation: 'teacher (female)' },
      { russian: 'книга', translation: 'book' },
      { russian: 'очки', translation: 'glasses' },
      { russian: 'спасибо', translation: 'thank you' },
      { russian: 'пожалуйста', translation: 'please' },
    ],
  };

  return { ARTYOM, TAMARA };
})();
