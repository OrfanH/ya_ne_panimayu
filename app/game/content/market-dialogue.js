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

  const FATIMA_VARIATIONS = [
    {
      id: 'fatima-first-visit',
      trigger: { visit_count: 1 },
      title: 'First Visit',
      lines: [
        {
          speaker: 'fatima',
          russian: 'Здравствуйте.',
          translation: 'Good day.',
          stage_direction: 'Fatima is arranging tomatoes. She does not look up. She waits. The word lands like a weight on a scale — placed, not offered.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте.',
              translation: 'Good day.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Привет! Можно посмотреть?',
              translation: 'Hi! Can I look?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '...',
              translation: '(gesture at the stall)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'fatima',
          russian: 'Хорошо. Что вам нужно?',
          translation: 'Good. What do you need?',
          stage_direction: 'She finally looks up. Brief, assessing. This is the correct start.',
          choices: [
            {
              id: 'a2',
              russian: 'Можно посмотреть?',
              translation: 'Can I look?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Я хочу картошку.',
              translation: 'I want potatoes.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'fatima',
          russian: 'Со мной — здравствуйте. Не привет.',
          translation: 'With me — zdravstvuyte. Not privet.',
          stage_direction: 'Not unkind. Just factual. She says it once.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Можно посмотреть?',
              translation: 'Good day. Can I look?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'fatima',
          russian: 'Я слушаю.',
          translation: 'I\'m listening.',
          stage_direction: 'She folds her arms. Waits. Her patience is professional, not personal.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Можно посмотреть?',
              translation: 'Good day. Can I look?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'fatima',
          russian: 'Пожалуйста. Картошка свежая. Морковь тоже. Помидоры — сегодня утром.',
          translation: 'Please. The potatoes are fresh. The carrots too. The tomatoes — this morning.',
          stage_direction: 'She indicates each item with a flat hand. No flourish. Inventory report.',
          choices: [
            {
              id: 'a3',
              russian: 'Килограмм картошки, пожалуйста.',
              translation: 'A kilogram of potatoes, please.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Полкило помидоров.',
              translation: 'Half a kilo of tomatoes.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'fatima',
          russian: 'Картошку. Сколько?',
          translation: 'Potatoes. How much?',
          stage_direction: 'She already has the bag open. She asks the next required piece of information.',
          choices: [
            {
              id: 'a3',
              russian: 'Килограмм, пожалуйста.',
              translation: 'A kilogram, please.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Полкило.',
              translation: 'Half a kilo.',
              isFinal: false,
            },
            {
              id: 'c3',
              russian: 'Большой...',
              translation: 'Big...',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'fatima',
          russian: 'Хорошо. Килограмм — сорок рублей.',
          translation: 'Good. One kilogram — forty roubles.',
          stage_direction: 'She weighs and bags in one motion. Places it on the counter. Done.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'fatima',
          russian: 'Полкило — двадцать рублей.',
          translation: 'Half a kilo — twenty roubles.',
          stage_direction: 'She nods at the word полкило. Correct. She weighs without comment.',
          isFinal: true,
        },
        {
          id: 'response_c3',
          choiceId: 'c3',
          speaker: 'fatima',
          russian: 'Картошка не продаётся большими. Килограмм или полкило.',
          translation: 'Potatoes are not sold by "big." One kilogram or half a kilo.',
          stage_direction: 'Factual. No mockery. She waits for the correct unit.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'fatima-price-check',
      trigger: { flag: 'fatima_first_visit_complete', value: true },
      title: 'Price Check',
      lines: [
        {
          speaker: 'fatima',
          russian: 'Здравствуйте. Что сегодня?',
          translation: 'Good day. What today?',
          stage_direction: 'She recognises the player. The greeting is the same. The efficiency ticks up one notch.',
          choices: [
            {
              id: 'a',
              russian: 'Сколько стоит морковь?',
              translation: 'How much do carrots cost?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Сколько это стоит?',
              translation: 'How much does this cost?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Пятьдесят рублей... морковь?',
              translation: 'Fifty roubles... carrots?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'fatima',
          russian: 'Морковь — тридцать рублей килограмм. Свежая.',
          translation: 'Carrots — thirty roubles a kilogram. Fresh.',
          stage_direction: 'She answers the question asked. No additional information.',
          choices: [
            {
              id: 'a2',
              russian: 'Килограмм, пожалуйста.',
              translation: 'A kilogram, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Дорого.',
              translation: 'Expensive.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'fatima',
          russian: 'Что именно вас интересует?',
          translation: 'What exactly are you interested in?',
          stage_direction: 'She does not guess. She asks. Her hand gestures at the whole stall — the question is yours to specify.',
          choices: [
            {
              id: 'a2',
              russian: 'Яблоки. Сколько?',
              translation: 'Apples. How much?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'fatima',
          russian: 'Нет. Морковь — тридцать рублей. Не пятьдесят.',
          translation: 'No. Carrots — thirty roubles. Not fifty.',
          stage_direction: 'She corrects the number without explanation. The price is the price.',
          choices: [
            {
              id: 'a2',
              russian: 'Килограмм, пожалуйста.',
              translation: 'A kilogram, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'fatima',
          russian: 'Хорошо. Тридцать рублей.',
          translation: 'Good. Thirty roubles.',
          stage_direction: 'She bags. Places on counter. Holds out her hand.',
          choices: [
            {
              id: 'a3',
              russian: 'Вот пятьдесят рублей.',
              translation: 'Here is fifty roubles.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Вот тридцать рублей.',
              translation: 'Here is thirty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'fatima',
          russian: 'Нет. Тридцать — нормальная цена.',
          translation: 'No. Thirty is a normal price.',
          stage_direction: 'She says it without heat. Dорого is not a negotiation here. It is an error.',
          isFinal: true,
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'fatima',
          russian: 'Сдача — двадцать рублей.',
          translation: 'Change — twenty roubles.',
          stage_direction: 'She counts it out precisely and sets it on the counter beside the bag.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'fatima',
          russian: 'Точно. Спасибо.',
          translation: 'Exactly. Thank you.',
          stage_direction: 'The only time she says thank you first. Exact payment earns it.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'fatima-decline-politely',
      trigger: { flag: 'fatima_price_check_seen', value: true },
      title: 'Decline Politely',
      lines: [
        {
          speaker: 'fatima',
          russian: 'Здравствуйте. Сегодня яблоки хорошие. Спелые. Возьмёте?',
          translation: 'Good day. The apples are good today. Ripe. Will you take some?',
          stage_direction: 'She holds up an apple. This is the closest she comes to promotion. She means it as information.',
          choices: [
            {
              id: 'a',
              russian: 'Я возьму вот это.',
              translation: 'I\'ll take this one.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Яблоко хорошее?',
              translation: 'Is the apple good quality?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '...',
              translation: '(silence)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'fatima',
          russian: 'Хорошо. Сколько?',
          translation: 'Good. How many?',
          stage_direction: 'She nods. The choice is made. Now the transaction.',
          choices: [
            {
              id: 'a2',
              russian: 'Килограмм, пожалуйста.',
              translation: 'A kilogram, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Полкило.',
              translation: 'Half a kilo.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'fatima',
          russian: 'Хорошее. Спелое. Я сказала.',
          translation: 'Good quality. Ripe. I said so.',
          stage_direction: 'She does not repeat praise. She already told you. Once is enough.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму килограмм.',
              translation: 'I\'ll take a kilogram.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно, спасибо.',
              translation: 'I don\'t need it, thank you.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'fatima',
          russian: 'Яблоки или нет?',
          translation: 'Apples or not?',
          stage_direction: 'She waits. There are two answers.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму килограмм.',
              translation: 'I\'ll take a kilogram.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно, спасибо.',
              translation: 'I don\'t need it, thank you.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'fatima',
          russian: 'Хорошо. Пятьдесят рублей.',
          translation: 'Good. Fifty roubles.',
          stage_direction: 'She bags the apples with the same economy of motion as always.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'fatima',
          russian: 'Хорошо. Ещё что-нибудь?',
          translation: 'Good. Anything else?',
          stage_direction: 'She accepts the decline without comment. Мне не нужно is the correct phrase. She moves on.',
          choices: [
            {
              id: 'a3',
              russian: 'Полкило моркови.',
              translation: 'Half a kilo of carrots.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Нет, спасибо.',
              translation: 'No, thank you.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'fatima',
          russian: 'Пятнадцать рублей. Хорошо.',
          translation: 'Fifteen roubles. Good.',
          stage_direction: 'She weighs carrots without breaking rhythm.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'fatima',
          russian: 'Хорошо. До свидания.',
          translation: 'Good. Goodbye.',
          stage_direction: 'She is already looking at the next customer.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'fatima-comparison',
      trigger: { flag: 'fatima_decline_seen', value: true },
      title: 'Comparison',
      lines: [
        {
          speaker: 'fatima',
          russian: 'Здравствуйте.',
          translation: 'Good day.',
          stage_direction: 'She waits. The stall is arranged with particular care today — two varieties of tomato side by side.',
          choices: [
            {
              id: 'a',
              russian: 'Этот помидор свежее?',
              translation: 'Is this tomato fresher?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Этот и этот — одинаковые?',
              translation: 'This one and this one — the same?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Сколько стоит этот? И этот?',
              translation: 'How much does this one cost? And this one?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'fatima',
          russian: 'Этот свежее. Тот — вчерашний. Но вкус одинаковый.',
          translation: 'This one is fresher. That one — from yesterday. But the taste is the same.',
          stage_direction: 'She points to each without hesitation. The distinction is real. She would not say it otherwise.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму этот.',
              translation: 'I\'ll take this one.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Я возьму вот этот, свежий.',
              translation: 'I\'ll take this fresh one.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'fatima',
          russian: 'Нет. Этот — сегодняшний, свежий. Тот — вчерашний, но тоже хороший.',
          translation: 'No. This one — today\'s, fresh. That one — yesterday\'s, but also good.',
          stage_direction: 'She names the difference. The player should now be able to choose.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму этот.',
              translation: 'I\'ll take this one.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Я возьму вот этот, свежий.',
              translation: 'I\'ll take this fresh one.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'fatima',
          russian: 'Этот — пятьдесят рублей килограмм. Тот — сорок. Тот вчерашний.',
          translation: 'This one — fifty roubles a kilogram. That one — forty. That one is from yesterday.',
          stage_direction: 'Price and information together. She does not explain the difference unless asked.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму этот.',
              translation: 'I\'ll take this one.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Я возьму оба.',
              translation: 'I\'ll take both.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'fatima',
          russian: 'Хорошо. Сколько?',
          translation: 'Good. How much?',
          stage_direction: 'She begins to weigh.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'fatima',
          russian: 'Правильный выбор. Сколько?',
          translation: 'Correct choice. How much?',
          stage_direction: 'A single comment. The first time she has evaluated a choice. She turns immediately to the scale.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'fatima-full-transaction',
      trigger: { flag: 'fatima_comparison_seen', value: true },
      title: 'Full Transaction',
      lines: [
        {
          speaker: 'fatima',
          russian: 'Здравствуйте.',
          translation: 'Good day.',
          stage_direction: 'She waits with the flat patience of someone who has done this ten thousand times and will do it ten thousand more.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Килограмм картошки, пожалуйста.',
              translation: 'Good day. A kilogram of potatoes, please.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Можно посмотреть?',
              translation: 'Good day. Can I look?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Привет! Картошку...',
              translation: 'Hi! Potatoes...',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'fatima',
          russian: 'Сорок рублей.',
          translation: 'Forty roubles.',
          stage_direction: 'She weighs immediately. The full request was correct. Greeting, product, quantity — in order.',
          choices: [
            {
              id: 'a2',
              russian: 'Сколько стоит морковь?',
              translation: 'How much do the carrots cost?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Вот сорок рублей.',
              translation: 'Here is forty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'fatima',
          russian: 'Пожалуйста. Что вам нужно?',
          translation: 'Please. What do you need?',
          stage_direction: 'She allows the browse. But she asks the next step immediately.',
          choices: [
            {
              id: 'a2',
              russian: 'Полкило яблок и килограмм картошки.',
              translation: 'Half a kilo of apples and a kilogram of potatoes.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'fatima',
          russian: 'Здравствуйте. Потом — картошку. Сначала — здравствуйте.',
          translation: 'Good day. Then — potatoes. First — hello.',
          stage_direction: 'She does not raise her voice. She states the correct order of operations.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Килограмм картошки, пожалуйста.',
              translation: 'Good day. A kilogram of potatoes, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'fatima',
          russian: 'Морковь — тридцать рублей. Картошка — сорок. Итого семьдесят. Возьмёте?',
          translation: 'Carrots — thirty roubles. Potatoes — forty. Total seventy. Will you take them?',
          stage_direction: 'She gives the sum. Does not expect a pause.',
          choices: [
            {
              id: 'a3',
              russian: 'Да. Вот сто рублей.',
              translation: 'Yes. Here is a hundred roubles.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Мне не нужна картошка. Только морковь.',
              translation: 'I don\'t need potatoes. Only carrots.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'fatima',
          russian: 'Картошка — сорок рублей. Сдачи нет.',
          translation: 'Potatoes — forty roubles. No change.',
          stage_direction: 'She takes the money precisely.',
          isFinal: true,
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'fatima',
          russian: 'Сдача — тридцать рублей.',
          translation: 'Change — thirty roubles.',
          stage_direction: 'She counts out thirty roubles and places them on the counter. Bags the items. Transaction complete.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'fatima',
          russian: 'Хорошо. Морковь — тридцать рублей.',
          translation: 'Good. Carrots — thirty roubles.',
          stage_direction: 'She removes the potatoes from the scale without comment. The decline was stated correctly.',
          isFinal: true,
        },
      ],
    },
  ];

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

  const MISHA_VARIATIONS = [
    {
      id: 'misha-first-bread',
      trigger: { visit_count: 1 },
      title: 'First Bread',
      lines: [
        {
          speaker: 'misha',
          russian: 'О! Слушай, хлеб только что! Свежий! Бери, пока есть.',
          translation: 'Oh! Hey, the bread is just in! Fresh! Take some while there\'s still some left.',
          stage_direction: 'Misha leans over the counter, already holding a loaf. He moves fast. His whole pitch is delivered before the player stops walking.',
          choices: [
            {
              id: 'a',
              russian: 'Привет! Сколько стоит хлеб?',
              translation: 'Hi! How much does the bread cost?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Хлеб — сколько?',
              translation: 'Good day. Bread — how much?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '(holds up money)',
              translation: '(holds up money without asking)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'misha',
          russian: 'Двадцать пять рублей! Дёшево, правда? Большой или маленький?',
          translation: 'Twenty-five roubles! Cheap, right? Big or small?',
          stage_direction: 'He holds up two sizes side by side. He likes this job.',
          choices: [
            {
              id: 'a2',
              russian: 'Большой, пожалуйста.',
              translation: 'Big, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Маленький.',
              translation: 'Small.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'misha',
          russian: 'Ха, «здравствуйте»! Тут все говорят «привет». Так — двадцать пять рублей.',
          translation: 'Ha, "zdravstvuyte"! Everyone says "privet" here. Anyway — twenty-five roubles.',
          stage_direction: 'He grins at the formality. Not mean — genuinely amused. He answers anyway.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму это.',
              translation: 'I\'ll take this.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'misha',
          russian: 'О, деньги! Хорошо. Двадцать пять рублей за большой. Или двадцать — маленький. Тебе какой?',
          translation: 'Oh, money! Good. Twenty-five roubles for big. Or twenty — small. Which do you want?',
          stage_direction: 'He nods at the money approvingly and starts the negotiation himself.',
          choices: [
            {
              id: 'a2',
              russian: 'Большой, пожалуйста.',
              translation: 'Big, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Маленький.',
              translation: 'Small.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'misha',
          russian: 'Вот! Двадцать пять рублей. Вкусный, обещаю.',
          translation: 'Here! Twenty-five roubles. Delicious, I promise.',
          stage_direction: 'He wraps it and slides it across. Fast. He\'s already looking for the next customer.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'misha',
          russian: 'Маленький — двадцать рублей. Тоже вкусный.',
          translation: 'Small — twenty roubles. Also delicious.',
          stage_direction: 'He takes the small loaf off the shelf without break in pace.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'misha-quality-question',
      trigger: { flag: 'misha_first_bread_seen', value: true },
      title: 'Quality Question',
      lines: [
        {
          speaker: 'misha',
          russian: 'О, ты опять! Привет! Хлеб сегодня — огонь. Бери, пока не разобрали.',
          translation: 'Oh, you\'re back! Hi! The bread today is fire. Take some before it\'s gone.',
          stage_direction: 'He remembers the player. He waves. He is already in motion.',
          choices: [
            {
              id: 'a',
              russian: 'Этот хлеб свежий?',
              translation: 'Is this bread fresh?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Хороший?',
              translation: 'Good quality?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Большой или маленький — дёшево?',
              translation: 'Big or small — which is cheaper?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'misha',
          russian: 'Свежий! Только что! Ну, час назад. Это свежий.',
          translation: 'Fresh! Just in! Well, an hour ago. That\'s fresh.',
          stage_direction: 'He counts on his fingers. His definition of свежий is flexible but sincere.',
          choices: [
            {
              id: 'a2',
              russian: 'Большой, пожалуйста.',
              translation: 'Big, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Дорого или дёшево?',
              translation: 'Expensive or cheap?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'misha',
          russian: 'Хороший! Конечно хороший! Я плохой хлеб не продаю. Это принцип.',
          translation: 'Good quality! Of course it\'s good! I don\'t sell bad bread. It\'s a principle.',
          stage_direction: 'He puts a hand to his chest. He means this. He also says it every day.',
          choices: [
            {
              id: 'a2',
              russian: 'Дёшево!',
              translation: 'Cheap!',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Маленький, пожалуйста.',
              translation: 'Small, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'misha',
          russian: 'Маленький дешевле! Двадцать рублей. Большой — двадцать пять. Оба дёшево.',
          translation: 'Small is cheaper! Twenty roubles. Big — twenty-five. Both are cheap.',
          stage_direction: 'He holds them both up at once. His sales logic is sound.',
          choices: [
            {
              id: 'a2',
              russian: 'Большой, пожалуйста.',
              translation: 'Big, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Маленький.',
              translation: 'Small.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'misha',
          russian: 'Двадцать пять рублей! Вот.',
          translation: 'Twenty-five roubles! Here.',
          stage_direction: 'He bags it and slides it over.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'misha',
          russian: 'Дёшево — это я! Фатима дороже.',
          translation: 'Cheap — that\'s me! Fatima charges more.',
          stage_direction: 'He glances pointedly at Fatima\'s stall. This is an ongoing competition.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'misha-change-scenario',
      trigger: { flag: 'misha_quality_seen', value: true },
      title: 'The Change Error',
      lines: [
        {
          speaker: 'misha',
          russian: 'Привет! Большой хлеб? Двадцать пять рублей.',
          translation: 'Hi! Big bread? Twenty-five roubles.',
          stage_direction: 'He already has the big loaf ready. He has learned the player\'s preference.',
          choices: [
            {
              id: 'a',
              russian: 'Да! Вот пятьдесят рублей.',
              translation: 'Yes! Here is fifty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'misha',
          russian: 'Вот сдача — пятнадцать рублей. Держи.',
          translation: 'Here\'s your change — fifteen roubles. Take it.',
          stage_direction: 'He hands over fifteen. He is already talking to someone else. He miscounted.',
          choices: [
            {
              id: 'a2',
              russian: 'Это не сдача — двадцать пять рублей.',
              translation: 'That\'s not right — twenty-five roubles change.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Сколько сдача?',
              translation: 'How much is the change?',
              isFinal: false,
            },
            {
              id: 'c2',
              russian: '(take the fifteen without comment)',
              translation: '(accept the wrong change)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'misha',
          russian: 'Ой! Да, точно. Пятьдесят минус двадцать пять — двадцать пять. Прости! Вот.',
          translation: 'Oops! Yes, right. Fifty minus twenty-five — twenty-five. Sorry! Here.',
          stage_direction: 'He checks on his fingers, laughs at himself, and gives the correct change without fuss.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'misha',
          russian: 'Сдача? Пятьдесят минус двадцать пять... двадцать пять! Я ошибся, извини. Держи.',
          translation: 'Change? Fifty minus twenty-five... twenty-five! I made a mistake, sorry. Take it.',
          stage_direction: 'He works it out aloud. The question prompted him to check.',
          isFinal: true,
        },
        {
          id: 'response_c2',
          choiceId: 'c2',
          speaker: 'misha',
          russian: 'Пока! Приходи ещё.',
          translation: 'Bye! Come again.',
          stage_direction: 'He waves cheerfully. The ten roubles are gone. He will never notice.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'misha-decline-extra',
      trigger: { random: true },
      title: 'The Extra Offer',
      lines: [
        {
          speaker: 'misha',
          russian: 'Привет! Хлеб берёшь? И пирожок? Сегодня с картошкой. Вкусно, обещаю.',
          translation: 'Hi! Taking bread? And a pastry? Today with potatoes. Delicious, I promise.',
          stage_direction: 'He holds up a pирожок alongside the bread. He always tries for the upsell.',
          choices: [
            {
              id: 'a',
              russian: 'Я возьму это.',
              translation: 'I\'ll take this.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Мне не нужно, спасибо.',
              translation: 'I don\'t need it, thank you.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Сколько стоит пирожок?',
              translation: 'How much is the pastry?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'misha',
          russian: 'Хлеб и пирожок — тридцать пять рублей.',
          translation: 'Bread and pastry — thirty-five roubles.',
          stage_direction: 'He bags both, fast.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот тридцать пять рублей. Спасибо!',
              translation: 'Here is thirty-five roubles. Thank you!',
              isFinal: true,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'misha',
          russian: 'Ладно, ладно. Только хлеб? Двадцать пять рублей.',
          translation: 'Okay, okay. Just bread? Twenty-five roubles.',
          stage_direction: 'He sets the pastry back without complaint. He will ask the next person.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот двадцать пять рублей. Спасибо!',
              translation: 'Here is twenty-five roubles. Thank you!',
              isFinal: true,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'misha',
          russian: 'Пирожок — десять рублей! Дёшево, да? Хлеб плюс пирожок — тридцать пять.',
          translation: 'Pastry — ten roubles! Cheap, right? Bread plus pastry — thirty-five.',
          stage_direction: 'He sees the price question as interest.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму оба. Вот тридцать пять рублей.',
              translation: 'I\'ll take both. Here is thirty-five roubles.',
              isFinal: true,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно. Только хлеб.',
              translation: 'I don\'t need it. Just bread.',
              isFinal: true,
            },
          ],
        },
      ],
    },
  ];

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

  const STYOPAN_VARIATIONS = [
    {
      id: 'styopan-browse',
      trigger: { visit_count: 1 },
      title: 'Browse',
      lines: [
        {
          speaker: 'styopan',
          russian: 'Смотри, смотри. Ничего не трогай. Ну, трогай, нормально.',
          translation: 'Look, look. Don\'t touch anything. Well, touch it, it\'s fine.',
          stage_direction: 'Styopan is sitting behind his stall on a folding chair, one leg up on the counter. He said both instructions so fast they cancel out. He doesn\'t care which one the player follows.',
          choices: [
            {
              id: 'a',
              russian: 'Можно посмотреть?',
              translation: 'Can I look?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Привет, что это?',
              translation: 'Hi, what is this?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '(points silently at something)',
              translation: '(points silently at something)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'styopan',
          russian: 'Можно! Я же говорю — можно. Что интересует? Батарейки, чехлы, носки... вот это.',
          translation: 'You can! I said — you can. What interests you? Batteries, phone cases, socks... there\'s this.',
          stage_direction: 'He waves at the stall without getting up. The inventory is eclectic.',
          choices: [
            {
              id: 'a2',
              russian: 'Сколько стоит?',
              translation: 'How much does it cost?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Дорого?',
              translation: 'Expensive?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'styopan',
          russian: 'О, иностранец! Привет. Это — чехол. Телефон. Защита. Понял?',
          translation: 'Oh, a foreigner! Hi. This — phone case. Phone. Protection. Understand?',
          stage_direction: 'He picks up the nearest object and explains it as if to a child. Friendly, not patronising.',
          choices: [
            {
              id: 'a2',
              russian: 'Сколько стоит?',
              translation: 'How much does it cost?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Хороший?',
              translation: 'Good quality?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'styopan',
          russian: 'А, это. Это... ну, вещь такая. Нужная. Двадцать рублей.',
          translation: 'Ah, that. That\'s a... well, a thing. Useful. Twenty roubles.',
          stage_direction: 'He squints at the item. He is not entirely sure what it is either.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму это.',
              translation: 'I\'ll take this.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно.',
              translation: 'I don\'t need it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'styopan',
          russian: 'Смотря что. Это — двадцать. Это — тридцать. Это... я забыл. Пятьдесят, наверное.',
          translation: 'Depends. This — twenty. This — thirty. This... I forgot. Fifty, probably.',
          stage_direction: 'He shrugs at the last item. Prices are approximate.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'styopan',
          russian: 'Дорого? Нет, нормально. Дёшево даже. Скажи: дёшево.',
          translation: 'Expensive? No, it\'s normal. Cheap even. Say: cheap.',
          stage_direction: 'He leans forward with the enthusiasm of a language teacher who chose the wrong career.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'styopan-price-chat',
      trigger: { flag: 'styopan_browse_seen', value: true },
      title: 'Price Chat',
      lines: [
        {
          speaker: 'styopan',
          russian: 'О, ты снова. Ну что, понравилось в первый раз? Есть ещё всякое.',
          translation: 'Oh, you\'re back. So, did you like it the first time? There\'s more stuff.',
          stage_direction: 'He is playing a game on his phone. He looks up without urgency.',
          choices: [
            {
              id: 'a',
              russian: 'Дорого здесь?',
              translation: 'Is it expensive here?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Сколько стоит вот это?',
              translation: 'How much does this cost?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Хороший товар?',
              translation: 'Good goods here?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'styopan',
          russian: 'Дорого? У меня? Нет. Фатима — вот там дороже. У неё всё взвешивается. У меня — на глаз.',
          translation: 'Expensive? At my stall? No. Fatima — over there is more expensive. She weighs everything. I go by eye.',
          stage_direction: 'He gestures at Fatima\'s stall with cheerful disdain.',
          choices: [
            {
              id: 'a2',
              russian: 'Дёшево!',
              translation: 'Cheap!',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Сколько это стоит?',
              translation: 'How much does this cost?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'styopan',
          russian: 'Вот это? Тридцать. Нет, двадцать пять. Ладно, двадцать. Давай возьми.',
          translation: 'This? Thirty. No, twenty-five. All right, twenty. Come on, take it.',
          stage_direction: 'He talks himself down in real time. Not a strategy. Just how he prices things.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму это.',
              translation: 'I\'ll take this.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно.',
              translation: 'I don\'t need it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'styopan',
          russian: 'Хороший! Самый хороший товар в Малинове. Ну, один из хороших. Нормальный.',
          translation: 'Good! The best goods in Malinov. Well, one of the good ones. Fine.',
          stage_direction: 'He revises his claim as he makes it. He ends somewhere accurate.',
          choices: [
            {
              id: 'a2',
              russian: 'Сколько стоит?',
              translation: 'How much does it cost?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'styopan',
          russian: 'Дёшево — вот именно. Классно, да?',
          translation: 'Cheap — exactly. Cool, right?',
          stage_direction: 'He is pleased. He lives for this word.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'styopan',
          russian: 'Не нужно. Ладно. Приходи, когда нужно.',
          translation: 'Don\'t need it. Fine. Come back when you do.',
          stage_direction: 'He goes back to his phone. No pressure.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'styopan-quantity-attempt',
      trigger: { flag: 'styopan_price_chat_seen', value: true },
      title: 'Quantity Experiment',
      lines: [
        {
          speaker: 'styopan',
          russian: 'Снова ты. Хорошо. Смотри, сегодня есть новое. Вот это. Хорошая штука.',
          translation: 'You again. Good. Look, today there\'s something new. This here. Good thing.',
          stage_direction: 'He holds up an object with genuine enthusiasm. What it is is unclear. It is new.',
          choices: [
            {
              id: 'a',
              russian: 'Полкило... этого?',
              translation: 'Half a kilo... of this?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я возьму большой.',
              translation: 'I\'ll take the big one.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Один, пожалуйста.',
              translation: 'One, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'styopan',
          russian: 'Полкило? Это же не картошка! Это... ну, штуки. Один или два. Килограмм тут не работает.',
          translation: 'Half a kilo? This isn\'t potatoes! These are... well, items. One or two. Kilograms don\'t apply here.',
          stage_direction: 'He laughs. Not at the player — at the situation. He finds the vocabulary collision funny.',
          choices: [
            {
              id: 'a2',
              russian: 'Понял! Один, пожалуйста.',
              translation: 'Got it! One, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Что это значит?',
              translation: 'What does "штуки" mean?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'styopan',
          russian: 'Большой — вот этот. Тридцать рублей. Маленький — двадцать. Какой берёшь?',
          translation: 'Big — this one. Thirty roubles. Small — twenty. Which do you take?',
          stage_direction: 'He holds them both up. Happy to explain.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму большой. Тридцать рублей.',
              translation: 'I\'ll take the big one. Thirty roubles.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Мне не нужно.',
              translation: 'I don\'t need it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'styopan',
          russian: 'Один! Классно. Тридцать рублей. Ну, двадцать пять. Давай.',
          translation: 'One! Cool. Thirty roubles. Well, twenty-five. Go ahead.',
          stage_direction: 'He already has it ready.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот двадцать пять рублей.',
              translation: 'Here is twenty-five roubles.',
              isFinal: true,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'styopan',
          russian: 'Один — тридцать рублей. Хорошая вещь, правда?',
          translation: 'One — thirty roubles. Good thing, right?',
          stage_direction: 'He wraps it in whatever is at hand.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'styopan',
          russian: 'Штуки — это... по одной. Одна штука, две штуки. Ну, это единица. Понял?',
          translation: 'Shtuki — that\'s... by unit. One item, two items. It\'s a unit word. Get it?',
          stage_direction: 'He demonstrates with fingers. He is not a bad explainer when he slows down.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'styopan-full-transaction',
      trigger: { random: true },
      title: 'Full Informal Transaction',
      lines: [
        {
          speaker: 'styopan',
          russian: 'О! Ты как раз вовремя. Смотри, вот это — новое. Нужно? Двадцать рублей. Бери.',
          translation: 'Oh! You\'re just in time. Look, this — new. Want it? Twenty roubles. Take it.',
          stage_direction: 'He holds something up. He has decided to sell it to the player before they arrived.',
          choices: [
            {
              id: 'a',
              russian: 'Сколько стоит?',
              translation: 'How much does it cost?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я возьму вот это.',
              translation: 'I\'ll take this one.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Мне не нужно.',
              translation: 'I don\'t need it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'styopan',
          russian: 'Двадцать рублей! Я же сказал. Новый, хороший. Дёшево. Давай.',
          translation: 'Twenty roubles! I just said. New, good. Cheap. Come on.',
          stage_direction: 'He repeats the price with mild exasperation. He said it thirty seconds ago.',
          choices: [
            {
              id: 'a2',
              russian: 'Я возьму это. Вот двадцать рублей.',
              translation: 'I\'ll take it. Here is twenty roubles.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Дорого.',
              translation: 'Expensive.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'styopan',
          russian: 'Классно! Двадцать рублей.',
          translation: 'Cool! Twenty roubles.',
          stage_direction: 'He is immediately in the transaction.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот двадцать рублей.',
              translation: 'Here is twenty roubles.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Вот пятьдесят рублей.',
              translation: 'Here is fifty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'styopan',
          russian: 'Не нужно? Точно? Двадцать рублей — дёшево.',
          translation: 'Don\'t need it? Really? Twenty roubles — cheap.',
          stage_direction: 'He tries once more. His feelings are not hurt. Business is business.',
          choices: [
            {
              id: 'a2',
              russian: 'Мне не нужно, спасибо.',
              translation: 'I don\'t need it, thank you.',
              isFinal: true,
            },
            {
              id: 'b2',
              russian: 'Ладно. Я возьму это.',
              translation: 'Okay. I\'ll take it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'styopan',
          russian: 'Нормально! Вот оно. Приходи ещё.',
          translation: 'Good! Here it is. Come again.',
          stage_direction: 'Exact payment. He hands it over and nods.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'styopan',
          russian: 'Пятьдесят? Сдача — тридцать рублей. Вот.',
          translation: 'Fifty? Change — thirty roubles. Here.',
          stage_direction: 'He counts the change immediately and hands it over.',
          isFinal: true,
        },
        {
          id: 'response_c_final',
          choiceId: 'b2',
          speaker: 'styopan',
          russian: 'Двадцать рублей! Хорошая вещь.',
          translation: 'Twenty roubles! Good item.',
          stage_direction: 'He hands it over with satisfaction.',
          isFinal: true,
        },
      ],
    },
  ];

  // -----------------------------------------------------------
  // Tier-1 VARIATIONS for Fatima — вы→ты shift is the lesson
  // -----------------------------------------------------------
  FATIMA_VARIATIONS.push(
    {
      id: 'fatima_acquaintance_1',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'fatima',
          russian: 'Снова ты. Картошку берёшь?',
          translation: 'You again. Potatoes today?',
          stage_direction: 'She shifts to ты without announcement. She is already weighing something.',
          choices: [
            { id: 'a', russian: 'Да, килограмм.', translation: 'Yes, one kilogram.', isFinal: false },
            { id: 'b', russian: 'Нет, яблоки.', translation: 'No, apples.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'fatima',
          russian: 'Вот. Хорошая картошка. Вчера свежая.',
          translation: 'Here. Good potatoes. Fresh yesterday.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'fatima',
          russian: 'Яблоки там. Спелые, сегодня утром привезли.',
          translation: 'Apples there. Ripe, brought in this morning.',
          isFinal: true,
        },
      ],
    },
    {
      id: 'fatima_acquaintance_2',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'fatima',
          russian: 'Ты уже знаешь слово «сдача»? Помнишь, первый раз не знал.',
          translation: 'You know the word "change" now? Remember, the first time you didn\'t.',
          stage_direction: 'A rare almost-smile. She counts the change back without being asked.',
          choices: [
            { id: 'a', russian: 'Да, помню.', translation: 'Yes, I remember.', isFinal: false },
            { id: 'b', russian: 'Ты меня научила.', translation: 'You taught me.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'fatima',
          russian: 'Хорошо. Учишься.',
          translation: 'Good. You\'re learning.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'fatima',
          russian: 'Жизнь учит. Я только повторила.',
          translation: 'Life teaches. I just repeated it.',
          isFinal: true,
        },
      ],
    }
  );

  // -----------------------------------------------------------
  // updateFatimaTier — call once per dialogue session end.
  // Increments visitCount; promotes tier when threshold reached.
  // -----------------------------------------------------------
  function updateFatimaTier(progress) {
    if (!progress.npcRelationships) progress.npcRelationships = {};
    if (!progress.npcRelationships.fatima) {
      progress.npcRelationships.fatima = { met: false, tier: 0, visitCount: 0 };
    }
    const rel = progress.npcRelationships.fatima;
    rel.visitCount += 1;
    if (rel.tier === 0 && rel.visitCount >= 3) { rel.tier = 1; }
    else if (rel.tier === 1 && rel.visitCount >= 7) { rel.tier = 2; }
    return progress;
  }

  return {
    FATIMA: { ...FATIMA, VARIATIONS: FATIMA_VARIATIONS },
    MISHA: { ...MISHA, VARIATIONS: MISHA_VARIATIONS },
    STYOPAN: { ...STYOPAN, VARIATIONS: STYOPAN_VARIATIONS },
    updateFatimaTier,
  };
})();
