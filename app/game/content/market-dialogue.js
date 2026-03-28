/* ============================================
   Market NPC dialogue data — Fatima, Misha, Styopan
   3 distinct NPCs for variety.
   ============================================ */

const MARKET_DIALOGUE = (() => {
  // -----------------------------------------------------------
  // Fatima — experienced vendor, honest, precise
  // -----------------------------------------------------------
  const FATIMA = {
    id: 'fatima',
    name: 'Фатима',
    persona: 'Fatima runs the main produce stall at Malinov market. She is honest, precise, and has no time for haggling. She speaks clearly, names products and prices without fuss, and corrects the player matter-of-factly when they get quantities wrong. She uses formal Russian (вы) with new customers. She knows everyone in town and has opinions about all of them.',
    tutorVocabulary: [
      { russian: 'картошка', translation: 'potato' },
      { russian: 'морковь', translation: 'carrot' },
      { russian: 'яблоко', translation: 'apple' },
      { russian: 'помидор', translation: 'tomato' },
      { russian: 'килограмм', translation: 'kilogram' },
      { russian: 'полкило', translation: 'half a kilo' },
      { russian: 'свежий', translation: 'fresh' },
      { russian: 'спелый', translation: 'ripe' },
      { russian: 'хороший', translation: 'good quality' },
      { russian: 'я возьму это', translation: 'I\'ll take this' },
      { russian: 'мне не нужно', translation: 'I don\'t need that' },
      { russian: 'сдача', translation: 'change (money)' },
      { russian: 'дорого', translation: 'expensive' },
      { russian: 'дёшево', translation: 'cheap' },
      { russian: 'сколько стоит', translation: 'how much does it cost' },
      { russian: 'пожалуйста', translation: 'please' },
      { russian: 'спасибо', translation: 'thank you' },
      { russian: 'можно посмотреть', translation: 'can I look' },
    ],
  };

  // -----------------------------------------------------------
  // Misha — young vendor, informal, competitive, slang
  // -----------------------------------------------------------
  const MISHA = {
    id: 'misha',
    name: 'Миша',
    persona: 'Misha (Styopan\'s real name is Misha but everyone calls him Styopan) is 22, runs a bread and snack stall next to Fatima. He speaks quickly, uses informal Russian and slang, and is competitive about customers. He teaches informal speech patterns and market haggling. He and Artyom know each other — same age, same town.',
    tutorVocabulary: [
      { russian: 'хлеб', translation: 'bread' },
      { russian: 'булочка', translation: 'roll / bun' },
      { russian: 'пирожок', translation: 'small pie / pastry' },
      { russian: 'вкусно', translation: 'delicious / tasty' },
      { russian: 'попробуй', translation: 'try it (informal)' },
      { russian: 'бери', translation: 'take it (informal)' },
      { russian: 'дёшево', translation: 'cheap' },
      { russian: 'свежий', translation: 'fresh' },
      { russian: 'сегодня', translation: 'today' },
      { russian: 'только что', translation: 'just now' },
      { russian: 'рубль', translation: 'rouble' },
      { russian: 'сколько', translation: 'how much' },
      { russian: 'большой', translation: 'big' },
      { russian: 'маленький', translation: 'small' },
      { russian: 'привет', translation: 'hi' },
    ],
  };

  // -----------------------------------------------------------
  // Styopan — the actual character from STORY.md
  // -----------------------------------------------------------
  const STYOPAN = {
    id: 'styopan',
    name: 'Стёпан',
    persona: 'Styopan is 20, sells miscellaneous goods at the market — batteries, phone cases, socks, things that fell off a truck. He speaks the fastest and most informally of anyone in town. He invents words when he doesn\'t know them, uses slang freely, and has a running joke/argument with Artyom. He teaches informal Russian and numbers through bargaining.',
    tutorVocabulary: [
      { russian: 'сколько', translation: 'how much / how many' },
      { russian: 'дорого', translation: 'expensive' },
      { russian: 'дёшево', translation: 'cheap' },
      { russian: 'двадцать', translation: 'twenty' },
      { russian: 'тридцать', translation: 'thirty' },
      { russian: 'пятьдесят', translation: 'fifty' },
      { russian: 'сто', translation: 'one hundred' },
      { russian: 'рубль', translation: 'rouble' },
      { russian: 'давай', translation: 'come on / let\'s go' },
      { russian: 'нормально', translation: 'fine / normal' },
      { russian: 'классно', translation: 'cool / great (slang)' },
      { russian: 'новый', translation: 'new' },
      { russian: 'хороший', translation: 'good' },
      { russian: 'возьми', translation: 'take it (informal)' },
      { russian: 'сдача', translation: 'change (money)' },
    ],
  };

  return { FATIMA, MISHA, STYOPAN };
})();
