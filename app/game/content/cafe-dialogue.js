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
    portrait: null,
  };

  const LENA_VARIATIONS = [
    {
      id: 'first_meeting',
      trigger: { flag: 'lena_met', value: false },
      lines: [
        {
          speaker: 'lena',
          russian: 'Добрый день. Что будете?',
          translation: 'Good afternoon. What will you have?',
          stage_direction: 'She sets down a glass, wipes her hands on her apron, and waits. She moves fast but isn\'t rushing you.',
          choices: [
            {
              id: 'a',
              russian: 'Я хочу... кофе?',
              translation: 'I want... coffee?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Что у вас есть?',
              translation: 'What do you have?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю по-русски.',
              translation: 'I don\'t understand Russian.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Хорошо. Большой или маленький? Скажи: большой кофе или маленький кофе.',
          translation: 'Good. Large or small? Say: bolshoy kofe or malenkiy kofe.',
          stage_direction: 'She holds up the two cup sizes. She doesn\'t look impatient — she looks like someone running a useful lesson.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Кофе, чай, сок, вода. Суп, салат, хлеб. Вот меню.',
          translation: 'Coffee, tea, juice, water. Soup, salad, bread. Here\'s the menu.',
          stage_direction: 'She slides a laminated menu across the counter.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'lena',
          russian: 'Ничего. Слушай: я хочу кофе. Повтори: я хочу кофе.',
          translation: 'No problem. Listen: ya khochu kofe. Repeat: ya khochu kofe.',
          stage_direction: 'She says it once, clearly, no exaggeration — the way she\'d explain a pour-over technique.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'ordering_practice',
      trigger: { flag: 'lena_met', value: true },
      title: 'Ordering Practice',
      lines: [
        {
          speaker: 'lena',
          russian: 'Опять ты. Что возьмёшь?',
          translation: 'You again. What\'ll you have?',
          stage_direction: 'Not unfriendly — she remembers you now. She\'s using informal ты without ceremony.',
          choices: [
            {
              id: 'a',
              russian: 'Можно мне чай, пожалуйста?',
              translation: 'May I have tea, please?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Дайте мне кофе.',
              translation: 'Give me coffee.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я хочу суп.',
              translation: 'I want soup.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Можно. Хорошо сказал. «Можно мне» — это вежливо. Лучше, чем просто «я хочу».',
          translation: 'Sure. Well said. "Mozhno mne" — that\'s polite. Better than just "ya khochu."',
          stage_direction: 'She fills a glass and sets it down. The small compliment is genuine.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Хорошо. Но «дайте мне» звучит немного грубо. Лучше: «можно мне кофе?» Попробуй.',
          translation: 'Okay. But "dayte mne" sounds a little blunt. Better: "mozhno mne kofe?" Try it.',
          stage_direction: 'She doesn\'t refuse the order — she fills it and teaches simultaneously.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'lena',
          russian: 'Суп сегодня есть. Но скажи полностью: «можно мне суп?» Или: «я хочу суп, пожалуйста.»',
          translation: 'We have soup today. But say it fully: "mozhno mne sup?" Or: "ya khochu sup, pozhaluysta."',
          stage_direction: 'She ladles while she talks. She\'s efficient.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'prices_and_numbers',
      trigger: { flag: 'lena_met', value: true },
      title: 'Prices',
      lines: [
        {
          speaker: 'lena',
          russian: 'Итого: сто пятьдесят рублей. Ты знаешь числа?',
          translation: 'Total: one hundred fifty roubles. Do you know numbers?',
          stage_direction: 'She punches it into the register and turns it toward you.',
          choices: [
            {
              id: 'a',
              russian: 'Сто пятьдесят рублей. Вот.',
              translation: 'One hundred fifty roubles. Here.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Сколько? Сто... пятьдесят?',
              translation: 'How much? One hundred... fifty?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю числа.',
              translation: 'I don\'t understand numbers.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Хорошо. Вот сдача. Пятьдесят рублей.',
          translation: 'Good. Here\'s your change. Fifty roubles.',
          stage_direction: 'She counts back the change cleanly.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Да, сто пятьдесят. Сто — это вот. Пятьдесят — вот. Итого. Понял?',
          translation: 'Yes, one hundred fifty. One hundred — that. Fifty — that. Total. Got it?',
          stage_direction: 'She points to the register screen for each number.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'lena',
          russian: 'Ладно. Десять, двадцать, пятьдесят, сто. Сейчас сто плюс пятьдесят. Сто пятьдесят. Повтори.',
          translation: 'Okay. Ten, twenty, fifty, one hundred. Now one hundred plus fifty. One hundred fifty. Repeat.',
          stage_direction: 'She writes the numbers on the receipt margin with a pen.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'rainy_day',
      trigger: { flag: 'lena_met', value: true },
      title: 'Rainy Day',
      lines: [
        {
          speaker: 'lena',
          russian: 'Сегодня дождь, и все решили прийти ко мне. Сейчас очень занято. Что берёшь?',
          translation: 'It\'s raining today and everyone decided to come here. Very busy right now. What are you having?',
          stage_direction: 'She moves fast, every surface occupied. She glances at you while wiping down the espresso machine.',
          choices: [
            {
              id: 'a',
              russian: 'Можно мне кофе? Быстро, пожалуйста.',
              translation: 'May I have coffee? Quickly, please.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Маленький чай, пожалуйста.',
              translation: 'Small tea, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Хорошо сказал. Одну минуту. «Быстро» — это правильное слово.',
          translation: 'Well said. One minute. "Bystro" — that\'s the right word.',
          stage_direction: 'She almost smiles. Almost.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Хорошо. Садись там — место есть. Принесу.',
          translation: 'Good. Sit there — there\'s a seat. I\'ll bring it.',
          stage_direction: 'She points to the last free table without breaking stride.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'cross_reference_artyom',
      trigger: { flag: 'artyom_met', value: true },
      title: 'Mention Artyom',
      lines: [
        {
          speaker: 'lena',
          russian: 'Ты Артёма из парка знаешь? Он тебя направил? Он всех направляет.',
          translation: 'Do you know Artyom from the park? Did he send you? He sends everyone.',
          stage_direction: 'She says it affectionately, like someone who has been on the receiving end of Artyom\'s recommendations for years.',
          choices: [
            {
              id: 'a',
              russian: 'Да, он сказал — кафе там, направо.',
              translation: 'Yes, he said — cafe is that way, to the right.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Да. Он сказал: привет от Артёма.',
              translation: 'Yes. He said: hello from Artyom.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Он всегда так. Знает где всё. Передай ему привет. Я ему чай за полцены делаю — только не говори.',
          translation: 'He\'s always like that. Knows where everything is. Say hi back. I charge him half price for tea — don\'t tell him.',
          stage_direction: 'She says the last part quietly, as if the information might escape.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Конечно сказал. Скажи и ты ему. Хороший парень, просто не знает, что делать с собой.',
          translation: 'Of course he did. You say hi back too. Good guy, just doesn\'t know what to do with himself yet.',
          stage_direction: 'She says this with the resigned fondness of someone who has watched a lot of people figure themselves out.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'quiet_afternoon',
      trigger: { random: true },
      title: 'Quiet Afternoon',
      lines: [
        {
          speaker: 'lena',
          russian: 'Тихо сейчас. Садись где хочешь. Что из Москвы слышно? Ты был там?',
          translation: 'Quiet right now. Sit wherever you like. Any news from Moscow? Have you been?',
          stage_direction: 'The cafe is nearly empty. She leans on the counter, more present than usual.',
          choices: [
            {
              id: 'a',
              russian: 'Нет, я не был в Москве.',
              translation: 'No, I haven\'t been to Moscow.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Да, я был в Москве. Большой город.',
              translation: 'Yes, I\'ve been to Moscow. Big city.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'lena',
          russian: 'Ничего. Посмотришь ещё. Я восемь лет как не там. Ничего, нормально.',
          translation: 'Never mind. You\'ll see it. I haven\'t been there for eight years. It\'s okay. Fine.',
          stage_direction: 'She says "нормально" in a way that contains a small novel.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'lena',
          russian: 'Да, большой. Очень большой. Здесь маленький город. Другой. Мне нравится... иногда.',
          translation: 'Yes, big. Very big. Here\'s a small town. Different. I like it... sometimes.',
          stage_direction: 'She looks out the window at the street — narrow, familiar, almost entirely hers.',
          isFinal: true,
        },
      ],
    },
  ];

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
    portrait: null,
  };

  const BORIS_VARIATIONS = [
    {
      id: 'wrong_seat',
      trigger: { flag: 'boris_met', value: false },
      lines: [
        {
          speaker: 'boris',
          russian: 'Это моё место.',
          translation: 'This is my seat.',
          stage_direction: 'He says this without looking up from his newspaper. His reading glasses are on a cord. His coffee is already half finished.',
          choices: [
            {
              id: 'a',
              russian: 'Извините! Я не знал.',
              translation: 'Excuse me! I didn\'t know.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Я могу сесть там?',
              translation: 'Good day. May I sit there?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Извините...',
              translation: 'Sorry...',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Теперь знаете. Вон там свободно.',
          translation: 'Now you know. Over there is free.',
          stage_direction: 'He points without ceremony to another table. He goes back to his newspaper.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Хорошо сказали. «Я могу» — вежливо. Садитесь там.',
          translation: 'Well said. "Ya mogu" — polite. Sit there.',
          stage_direction: 'He actually looks up. A fraction of approval.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'boris',
          russian: 'Да. Извините. Это правильное слово. Садитесь там.',
          translation: 'Yes. Excuse me. That is the right word. Sit there.',
          stage_direction: 'He almost gives a nod of confirmation before returning to his paper.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'the_newspaper_date',
      trigger: { flag: 'boris_met', value: true },
      title: 'The Newspaper Date',
      lines: [
        {
          speaker: 'boris',
          russian: 'Скажите, какое сегодня число?',
          translation: 'Tell me, what is today\'s date?',
          stage_direction: 'He looks up from his newspaper, holds it up so the date is visible, and waits.',
          choices: [
            {
              id: 'a',
              russian: 'Сегодня... двадцать девятое?',
              translation: 'Today is... the twenty-ninth?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я не знаю.',
              translation: 'I don\'t know.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Правильно. Двадцать девятое. Эта газета от двадцать шестого. То есть — три дня назад.',
          translation: 'Correct. The twenty-ninth. This newspaper is from the twenty-sixth. Meaning — three days ago.',
          stage_direction: 'He says this with no apparent embarrassment about reading a three-day-old paper.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Посмотрите на газету. Дата — вот. Двадцать шестое. Читайте.',
          translation: 'Look at the newspaper. The date — here. The twenty-sixth. Read it.',
          stage_direction: 'He points to the dateline. It is a practical instruction, not an unkind one.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'prices_and_cost',
      trigger: { flag: 'boris_met', value: true },
      title: 'Expensive or Cheap',
      lines: [
        {
          speaker: 'boris',
          russian: 'Сколько вы заплатили за кофе?',
          translation: 'How much did you pay for coffee?',
          stage_direction: 'He glances over his paper with a look of mild investigative interest.',
          choices: [
            {
              id: 'a',
              russian: 'Сто рублей.',
              translation: 'One hundred roubles.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Сто пятьдесят рублей.',
              translation: 'One hundred fifty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Сто. Хорошо. Дёшево. По московским ценам — дёшево. Здесь нормально.',
          translation: 'One hundred. Good. Cheap. By Moscow prices — cheap. Here that\'s normal.',
          stage_direction: 'He returns to his paper with the satisfied air of someone who has confirmed a calculation.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Сто пятьдесят. Немного дорого для Малинова. Но Лена делает хороший кофе. Это важно.',
          translation: 'One hundred fifty. A little expensive for Malinov. But Lena makes good coffee. That matters.',
          stage_direction: 'He says this quietly, as if it\'s an engineering verdict.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'window_seat',
      trigger: { flag: 'boris_met', value: true },
      title: 'The Window',
      lines: [
        {
          speaker: 'boris',
          russian: 'Я всегда сижу у окна. Отсюда видно улицу. Я знаю, кто куда идёт.',
          translation: 'I always sit by the window. You can see the street from here. I know who goes where.',
          stage_direction: 'He says this not as a boast but as a system specification.',
          choices: [
            {
              id: 'a',
              russian: 'Красивый вид.',
              translation: 'Beautiful view.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Там — Тамара Андреевна?',
              translation: 'Is that Tamara Andreyevna there?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Красивый. Да. Старый город красивый. Я работал здесь тридцать лет. Знаю каждую трубу.',
          translation: 'Beautiful. Yes. The old town is beautiful. I worked here for thirty years. I know every pipe.',
          stage_direction: 'He says "каждую трубу" with complete sincerity.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Да. Тамара Андреевна. Она из парка. Хороший человек. По субботам сюда приходит.',
          translation: 'Yes. Tamara Andreyevna. She\'s from the park. Good person. Comes here on Saturdays.',
          stage_direction: 'He says it with the undemonstrative approval of someone who approves of very few things.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'everyday_schedule',
      trigger: { flag: 'boris_met', value: true },
      title: 'Every Day',
      lines: [
        {
          speaker: 'boris',
          russian: 'Я прихожу сюда каждый день. В девять пятнадцать. Всегда.',
          translation: 'I come here every day. At nine fifteen. Always.',
          stage_direction: 'He says this as a statement of engineering fact, not pride.',
          choices: [
            {
              id: 'a',
              russian: 'Каждый день? Это... много.',
              translation: 'Every day? That\'s... a lot.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я понимаю. Привычка хорошая.',
              translation: 'I understand. A good habit.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Одиннадцать лет. Это не много. Это — система. Система работает.',
          translation: 'Eleven years. That is not a lot. That is a system. Systems work.',
          stage_direction: 'He picks up his coffee cup.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Привычка. Да. Хорошее слово. Каждый день. Каждый — значит всегда. Запомните.',
          translation: 'Habit. Yes. Good word. Every day. Kazhdiy — means always. Remember that.',
          stage_direction: 'A small nod. He considers this a successful exchange.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'the_town_pipes',
      trigger: { random: true },
      title: 'Engineering',
      lines: [
        {
          speaker: 'boris',
          russian: 'Вы знаете, как работает водопровод в Малинове? Старый. Сорок лет. Хороший.',
          translation: 'Do you know how the water system in Malinov works? Old. Forty years. Good.',
          stage_direction: 'He folds the newspaper. He is about to tell you something important.',
          choices: [
            {
              id: 'a',
              russian: 'Нет. Расскажите.',
              translation: 'No. Tell me.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Вы инженер?',
              translation: 'Are you an engineer?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Хорошо спросили. Слушайте: вода — здесь. Трубы — там, под землёй. Старые, но хорошие. Я проверял.',
          translation: 'Good question. Listen: water — here. Pipes — there, underground. Old, but good. I checked.',
          stage_direction: 'He taps the table at each point like marking locations on a schematic.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Был инженер. Тридцать лет. Водоочистная станция. Теперь пенсия. Читаю газету. Нормально.',
          translation: 'Was an engineer. Thirty years. Water treatment plant. Now retirement. I read the newspaper. It\'s fine.',
          stage_direction: 'He says "нормально" with the same resigned precision Lena uses it — a whole life in one word.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'cross_reference_galina',
      trigger: { flag: 'galina_met', value: true },
      title: 'Boris Mentions Galina',
      lines: [
        {
          speaker: 'boris',
          russian: 'Вы живёте у Галины Ивановны? Я видел вас там. Она строгая, но хорошая.',
          translation: 'You live near Galina Ivanovna? I saw you there. She is strict, but good.',
          stage_direction: 'He says this without looking up from his paper, as if reporting a fact he noted earlier and is only now filing aloud.',
          choices: [
            {
              id: 'a',
              russian: 'Да. Она хорошая.',
              translation: 'Yes. She is good.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Да. Немного строгая.',
              translation: 'Yes. A little strict.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'boris',
          russian: 'Хорошая. Тридцать лет там живёт. Знает всё про этот дом. Как я про трубы.',
          translation: 'Good. She has lived there thirty years. Knows everything about that building. Like I know the pipes.',
          stage_direction: 'He says this last sentence with complete sincerity — it is the highest compliment he knows.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'boris',
          russian: 'Строгая — это правильно. Порядок нужен. Хаос — плохо. Она понимает это.',
          translation: 'Strict — that is correct. Order is necessary. Chaos — bad. She understands this.',
          stage_direction: 'He lowers the paper slightly to deliver this verdict, then raises it again.',
          isFinal: true,
        },
      ],
    },
  ];

  // -----------------------------------------------------------
  // Tier-1 VARIATIONS for Lena — added after first_meeting
  // -----------------------------------------------------------
  LENA_VARIATIONS.push(
    {
      id: 'lena_acquaintance_1',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'lena',
          russian: 'Привет. Как обычно?',
          translation: 'Hi. The usual?',
          stage_direction: 'She reaches for a cup before you answer. First time she\'s used ты.',
          choices: [
            { id: 'a', russian: 'Да, как обычно.', translation: 'Yes, the usual.', isFinal: false },
            { id: 'b', russian: 'Нет, сегодня чай.', translation: 'No, tea today.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'lena',
          russian: 'Хорошо. Садись, принесу.',
          translation: 'Good. Sit down, I\'ll bring it.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'lena',
          russian: 'Хорошо. Чёрный или зелёный?',
          translation: 'Good. Black or green?',
          isFinal: true,
        },
      ],
    },
    {
      id: 'lena_acquaintance_2',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'lena',
          russian: 'Слушай, ты хорошо запоминаешь слова. Это редко.',
          translation: 'You know, you remember words well. That\'s rare.',
          stage_direction: 'She says it while wiping the counter — offhand, not a compliment exactly, just an observation.',
          choices: [
            { id: 'a', russian: 'Ты мне помогаешь.', translation: 'You help me.', isFinal: false },
            { id: 'b', russian: 'Я просто практикую.', translation: 'I just practise.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'lena',
          russian: 'Немного. Кофе не учит грамматике.',
          translation: 'A little. Coffee doesn\'t teach grammar.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'lena',
          russian: 'Это и есть метод.',
          translation: 'That\'s the method.',
          isFinal: true,
        },
      ],
    }
  );

  // -----------------------------------------------------------
  // updateLenaTier — call once per dialogue session end.
  // Increments visitCount; promotes tier when threshold reached.
  // -----------------------------------------------------------
  function updateLenaTier(progress) {
    if (!progress.npcRelationships) progress.npcRelationships = {};
    if (!progress.npcRelationships.lena) {
      progress.npcRelationships.lena = { met: false, tier: 0, visitCount: 0 };
    }
    const rel = progress.npcRelationships.lena;
    rel.visitCount += 1;
    if (rel.tier === 0 && rel.visitCount >= 3) { rel.tier = 1; }
    else if (rel.tier === 1 && rel.visitCount >= 7) { rel.tier = 2; }
    return progress;
  }

  return {
    LENA: { ...LENA, VARIATIONS: LENA_VARIATIONS },
    BORIS: { ...BORIS, VARIATIONS: BORIS_VARIATIONS },
    updateLenaTier,
  };
})();
