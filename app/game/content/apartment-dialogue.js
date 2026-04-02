const APARTMENT_DIALOGUE = (() => {
  const NPC_DATA = {
    id: 'galina',
    name: 'Галина Ивановна',
    persona: 'Галина Ивановна is the first-floor resident of apartment three. She is patient, methodical, and treats every interaction as a small practical matter to be resolved correctly. She models language without condescension and waits for full answers. She is not unkind, but she does not let things slide. She will repeat herself as many times as necessary, and she expects you to eventually get it right.',
    tutorVocabulary: [
      // Greetings and basics
      { russian: 'здравствуйте', translation: 'hello / good day (formal)' },
      { russian: 'привет', translation: 'hi (casual)' },
      { russian: 'добрый день', translation: 'good afternoon' },
      { russian: 'до свидания', translation: 'goodbye' },
      { russian: 'спасибо', translation: 'thank you' },
      { russian: 'пожалуйста', translation: 'please / you\'re welcome' },
      { russian: 'извините', translation: 'excuse me / sorry' },
      // Introductions
      { russian: 'меня зовут', translation: 'my name is' },
      { russian: 'я из', translation: 'I am from' },
      { russian: 'я студент', translation: 'I am a student (male)' },
      { russian: 'я студентка', translation: 'I am a student (female)' },
      { russian: 'приятно познакомиться', translation: 'nice to meet you' },
      { russian: 'повторите', translation: 'repeat it' },
      // Comprehension
      { russian: 'я не понимаю', translation: 'I don\'t understand' },
      { russian: 'я понимаю', translation: 'I understand' },
      { russian: 'понятно', translation: 'understood' },
      { russian: 'правильно', translation: 'correct' },
      { russian: 'хорошо', translation: 'good / okay' },
      { russian: 'да', translation: 'yes' },
      { russian: 'нет', translation: 'no' },
      // Numbers
      { russian: 'один', translation: 'one' },
      { russian: 'два', translation: 'two' },
      { russian: 'три', translation: 'three' },
      { russian: 'четыре', translation: 'four' },
      { russian: 'пять', translation: 'five' },
      { russian: 'шесть', translation: 'six' },
      { russian: 'семь', translation: 'seven' },
      // Apartment and building vocabulary
      { russian: 'квартира', translation: 'apartment' },
      { russian: 'этаж', translation: 'floor' },
      { russian: 'первый этаж', translation: 'first floor' },
      { russian: 'номер', translation: 'number' },
      { russian: 'дверь', translation: 'door' },
      { russian: 'ключ', translation: 'key' },
      { russian: 'домофон', translation: 'intercom / entry phone' },
      { russian: 'почтовый ящик', translation: 'mailbox' },
      { russian: 'ящик', translation: 'box / mailbox' },
      { russian: 'сосед', translation: 'neighbor' },
      // Directions and location
      { russian: 'здесь', translation: 'here' },
      { russian: 'не здесь', translation: 'not here' },
      { russian: 'вот', translation: 'here it is / there' },
      { russian: 'сверху', translation: 'from upstairs / above' },
      // Questions and phrases
      { russian: 'какая квартира вам нужна', translation: 'which apartment do you need' },
      { russian: 'откуда вы', translation: 'where are you from' },
      { russian: 'вы кто', translation: 'who are you' },
      { russian: 'нужно', translation: 'it is necessary / you need to' },
      { russian: 'нажимаете', translation: 'you press' },
      { russian: 'запомните', translation: 'remember that' },
      { russian: 'скажите', translation: 'say (it)' },
      // Time and rules
      { russian: 'после десяти', translation: 'after ten o\'clock' },
      { russian: 'тишина', translation: 'silence' },
      { russian: 'такие правила', translation: 'those are the rules' },
      { russian: 'десять часов', translation: 'ten o\'clock' },
      // Food and social
      { russian: 'чай', translation: 'tea' },
      { russian: 'варенье', translation: 'jam' },
      { russian: 'суп', translation: 'soup' },
      { russian: 'еда', translation: 'food' },
      { russian: 'вы ели', translation: 'did you eat' },
      { russian: 'студенты должны есть', translation: 'students should eat' },
      // Actions and misc
      { russian: 'отнесите', translation: 'take (it) / bring (it) to' },
      { russian: 'слышите', translation: 'do you hear' },
      { russian: 'ваша очередь', translation: 'your turn' },
      { russian: 'в следующий раз', translation: 'next time' },
      { russian: 'ещё раз', translation: 'once more' },
      { russian: 'всё правильно', translation: 'all correct' },
      { russian: 'вы учитесь', translation: 'you are learning' },
    ],
    portrait: null,
  };

  const VARIATIONS = [
    {
      id: 'opening',
      trigger: { flag: 'galina_met', value: false },
      lines: [
        {
          speaker: 'galina',
          russian: 'Это квартира три. Какая квартира вам нужна?',
          translation: 'This is apartment three. Which apartment do you need?',
          stage_direction: 'Galina opens the door holding a watering can, looks the player over with mild patience.',
          choices: [
            {
              id: 'a',
              russian: 'Извините... [номер].',
              translation: 'Excuse me... [Number].',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Здравствуйте!',
              translation: 'Hello! / Good day!',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Квартира [номер] — это [этаж]. Не здесь.',
          translation: 'Apartment [number] — that\'s the [floor] floor. Not here.',
          stage_direction: 'She nods, points upward or downward.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Квартира. Этаж. Квартира три. Первый этаж. Какая квартира?',
          translation: 'Apartment. Floor. Apartment three. First floor. Which apartment?',
          stage_direction: 'She speaks slowly, gesturing at her door, then at the numbers.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Здравствуйте. Так какая квартира? Первый этаж — квартиры один, два, три.',
          translation: 'Hello. So — which apartment? First floor — apartments one, two, three.',
          stage_direction: 'A slight softening; she dips her chin — then, back to business.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_1',
      trigger: { flag: 'galina_met', value: true },
      title: 'Wrong Door, Redirect',
      lines: [
        {
          speaker: 'galina',
          russian: 'Это квартира три. Первый этаж. Вам нужна другая квартира? Какой номер?',
          translation: 'This is apartment three. First floor. You need a different apartment? What number?',
          stage_direction: 'She sets the watering can down on her hip and looks at you levelly.',
          choices: [
            {
              id: 'a',
              russian: 'Квартира [номер].',
              translation: 'Apartment [number].',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Спасибо.',
              translation: 'Thank you.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Да. Квартира [номер]. [Номер]. Запомните.',
          translation: '[Number]. Yes. [Number]. Remember that.',
          stage_direction: 'Nods once, points down the hall or upward, repeats clearly.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Один, два, три, четыре, пять. Первый этаж. Какая квартира вам нужна?',
          translation: 'One, two, three, four, five. First floor. Which apartment do you need?',
          stage_direction: 'Without impatience, she counts on her fingers.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Пожалуйста. Квартира — какой номер? Скажите.',
          translation: 'You\'re welcome. Apartment — what number? Say it.',
          stage_direction: 'Raises an eyebrow, gestures down the hall.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_2',
      trigger: { flag: 'galina_intro', value: false },
      title: 'Self-Introduction Exchange',
      lines: [
        {
          speaker: 'galina',
          russian: 'Вы кто? Меня зовут Галина Ивановна. Квартира три. А вы?',
          translation: 'And who are you? My name is Galina Ivanovna. Apartment three. And you?',
          stage_direction: 'Galina has set the watering can inside the door. She gestures at the player with a mild expectant look, points to herself, then at you.',
          choices: [
            {
              id: 'a',
              russian: 'Меня зовут [имя]. Я студент/студентка. Я из [место].',
              translation: 'My name is [name]. I am a student. I am from [place].',
              isFinal: false,
            },
            {
              id: 'b',
              russian: '[Имя].',
              translation: '[Name only].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Меня зовут Галина Ивановна — меня зовут [имя]. Хорошо. Приятно познакомиться.',
          translation: 'My name is Galina Ivanovna — my name is [name]. Good. Nice to meet you.',
          stage_direction: 'She nods with something close to approval, repeats your phrase back gently.',
          isFinal: true,
          setsFlag: 'galina_intro',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Меня зовут [имя]. Повторите.',
          translation: 'My name is [name]. Repeat it.',
          stage_direction: 'She repeats your name, then shakes her head slightly and models the full phrase, pointing back at you.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Меня зовут — Галина. Меня зовут — ? Ваше имя.',
          translation: 'My name is — Galina. My name is — ? Your name.',
          stage_direction: 'She breaks it into two parts, holding up fingers, pointing to herself then to you.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_3',
      trigger: { flag: 'galina_intro', value: true },
      title: 'Origin Question',
      lines: [
        {
          speaker: 'galina',
          russian: 'Вы из России? Откуда вы? Я из — откуда?',
          translation: 'Are you from Russia? Where are you from? I am from — where?',
          stage_direction: 'Her arms are crossed lightly. She tilts her head.',
          choices: [
            {
              id: 'a',
              russian: 'Я из [место].',
              translation: 'I am from [place].',
              isFinal: false,
            },
            {
              id: 'b',
              russian: '[Место].',
              translation: '[Place name only].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Я из [место]. Хорошо. Далеко.',
          translation: 'I am from [place]. Good. Far away.',
          stage_direction: 'She considers the place, then nods with mild opinion.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Я из [место]. Так говорят. Я из [место]. Повторите.',
          translation: 'I am from [place]. That is how you say it. I am from [place]. Repeat it.',
          stage_direction: 'She lifts one finger and gestures for you to try again.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Я из Москвы. Вы из — откуда? Место. Город.',
          translation: 'I am from Moscow. You are from — where? A place. A city.',
          stage_direction: 'She mimes pointing outward, then inward toward you.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_4',
      trigger: { flag: 'galina_met', value: true },
      title: 'Tea and Politeness Drill',
      lines: [
        {
          speaker: 'galina',
          russian: 'Чай?',
          translation: 'Tea?',
          stage_direction: 'Galina stands in the doorway with a slight incline of her head — an invitation. She leaves the question short, watching how you answer.',
          choices: [
            {
              id: 'a',
              russian: 'Да, пожалуйста.',
              translation: 'Yes, please.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Нет, спасибо.',
              translation: 'No, thank you.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Да. / Нет.',
              translation: 'Yes. / No. (alone, without the polite word)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. После десяти — тишина. Такие правила. Десять часов. Запомните.',
          translation: 'Good. After ten o\'clock — silence. Those are the rules. Ten o\'clock. Remember that.',
          stage_direction: 'She steps back from the door, satisfied. While pouring she mentions the rules the way someone mentions a weather fact.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Хорошо. Спасибо — правильно.',
          translation: 'Good. "Thank you" — correct.',
          stage_direction: 'She accepts this without complaint, just nods. A small approving gesture.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Да, пожалуйста. Нет, спасибо. Ещё раз.',
          translation: 'Yes, please. No, thank you. Once more.',
          stage_direction: 'Her eyebrow lifts, only slightly. She models without scolding, then waits.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_5',
      trigger: { flag: 'galina_met', value: true },
      title: 'Intercom Code',
      lines: [
        {
          speaker: 'galina',
          russian: 'Домофон — это номер квартиры. Моя квартира — три. Нажимаете три. Понятно? Ваша квартира — какой номер?',
          translation: 'The intercom — it is the apartment number. My apartment — three. You press three. Understood? Your apartment — what number?',
          stage_direction: 'Galina stands at the building door, demonstrating the intercom panel like someone who has explained this before and will again.',
          choices: [
            {
              id: 'a',
              russian: '[Правильный номер].',
              translation: '[The correct apartment number].',
              isFinal: false,
            },
            {
              id: 'b',
              russian: '[Неправильный номер].',
              translation: '[An incorrect number].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: '[Номер]. Да. Правильно.',
          translation: '[Number]. Yes. Correct.',
          stage_direction: 'Nods and repeats it once, presses it on the panel to confirm.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Нет. Ваша квартира — [правильный номер].',
          translation: 'No. Your apartment — [correct number].',
          stage_direction: 'She shakes her head, no reproach in it. Points to the correct button and waits for you to press it.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Один, два, три... Вот. Ваша квартира — [номер]. Нажимаете этот.',
          translation: 'One, two, three… Here. Your apartment — [number]. Press this one.',
          stage_direction: 'She traces the numbers on the panel slowly with one finger, stops at the player\'s number and taps it.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_6',
      trigger: { flag: 'galina_met', value: true },
      title: 'Mailbox Numbers',
      lines: [
        {
          speaker: 'galina',
          russian: 'Ваш почтовый ящик — тот же номер. Квартира три — ящик три. Ваша квартира — какой ящик?',
          translation: 'Your mailbox — the same number. Apartment three — mailbox three. Your apartment — which mailbox?',
          stage_direction: 'Galina is at the mailboxes sorting her letters. She spots the player and naturally turns the moment into something useful.',
          choices: [
            {
              id: 'a',
              russian: '[Номер].',
              translation: '[Number] — pointing to the correct box.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: '[Неправильный номер].',
              translation: '[Wrong number or hesitation].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Правильно. Квартира [номер] — ящик [номер]. Одинаково.',
          translation: 'Correct. Apartment [number] — mailbox [number]. The same.',
          stage_direction: 'A short approving nod.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Вот. [Правильный номер]. Квартира [номер] — ящик [номер]. Запомните.',
          translation: 'Here. [Correct number]. Apartment [number] — mailbox [number]. Remember that.',
          stage_direction: 'She walks to the correct box and taps the number printed on it.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Один, два, три... Вот ваш. [Номер]. Квартира и ящик — один номер.',
          translation: 'One, two, three… Here is yours. [Number]. Apartment and mailbox — one number.',
          stage_direction: 'She runs her finger slowly along the row of numbers, one by one, stops at the player\'s box.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_7',
      trigger: { flag: 'galina_met', value: true },
      title: 'Spare Key Scene',
      lines: [
        {
          speaker: 'galina',
          russian: 'Вот ключ. Это один ключ. Один. Если потеряете — нет нового ключа. Понятно?',
          translation: 'Here is the key. This is one key. One. If you lose it — there is no new key. Understood?',
          stage_direction: 'Galina appears holding her key ring. She holds it out but does not release it yet.',
          choices: [
            {
              id: 'a',
              russian: 'Спасибо. Да, я понимаю.',
              translation: 'Thank you. Yes, I understand.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Спасибо.',
              translation: 'Thank you. (alone, without confirmation)',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Нет.',
              translation: 'No.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Один ключ. Дверь — это дверь, не проблема.',
          translation: 'Good. One key. The door is the door, not a problem.',
          stage_direction: 'She releases the key with a nod. Business concluded. Almost to herself.',
          isFinal: true,
          setsFlag: 'galina_key_given',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Да? Вы понимаете?',
          translation: 'Yes? You understand?',
          stage_direction: 'She does not let go yet. Gently. She waits for the да. She is patient but she is waiting.',
          isFinal: false,
          promptsRetry: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Нет? Ключ — один. Нет нового ключа. Понятно?',
          translation: 'No? The key — one. No new key. Understood?',
          stage_direction: 'She pulls the key back slightly, with a questioning look — not angry, recalibrating. Re-offers it.',
          isFinal: false,
          promptsRetry: true,
        },
      ],
    },

    {
      id: 'variation_8',
      trigger: { flag: 'galina_met', value: true },
      title: 'Return Check-In (Did You Eat?)',
      lines: [
        {
          speaker: 'galina',
          russian: 'Вы ели сегодня?',
          translation: 'Did you eat today?',
          stage_direction: 'Galina spots the player in the hallway, evening light. She is carrying nothing. She just looks at you.',
          choices: [
            {
              id: 'a',
              russian: 'Да, спасибо.',
              translation: 'Yes, thank you.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Нет.',
              translation: 'No.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Студенты должны есть. До свидания.',
          translation: 'Good. Students should eat. Goodbye.',
          stage_direction: 'She looks satisfied, the way someone looks when a plant is watered. Already turning back.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Нет? Студенты не едят. Это неправильно. У меня суп.',
          translation: 'No? Students don\'t eat. That is not right. I have soup.',
          stage_direction: 'A short disapproving sound, not unkind. She shakes her head slightly. Mentions it like a standing complaint — not quite an offer, but almost.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Еда. Ели?',
          translation: 'Food. Did you eat?',
          stage_direction: 'She mimes eating — spoon to mouth, no ceremony. She waits.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_9',
      trigger: { flag: 'galina_met', value: true },
      title: 'Jam Delivery Mission',
      lines: [
        {
          speaker: 'galina',
          russian: 'Это варенье. Отнесите в квартиру семь. Семь. Квартира семь. Скажите: от Галины Ивановны. Какая квартира?',
          translation: 'This is jam. Take it to apartment seven. Seven. Apartment seven. Say: from Galina Ivanovna. Which apartment?',
          stage_direction: 'Galina reappears with a jar of jam. She places it in the player\'s hands with deliberate care, holds up seven fingers.',
          choices: [
            {
              id: 'a',
              russian: 'Квартира семь.',
              translation: 'Apartment seven.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: '[Неправильный номер].',
              translation: '[Any incorrect number].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Да. Квартира семь. Скажите: привет, я от Галины Ивановны. Здравствуйте — лучше.',
          translation: 'Yes. Apartment seven. Say: hello, I\'m from Galina Ivanovna. Здравствуйте — better.',
          stage_direction: 'She nods once, the mission is live.',
          isFinal: true,
          setsFlag: 'mission_jam_delivery_active',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Семь. Не [неправильный номер]. Семь. Квартира семь. Повторите.',
          translation: 'Seven. Not [wrong number]. Seven. Apartment seven. Repeat it.',
          stage_direction: 'She shakes her head and holds up seven fingers again, clearly.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Один, два, три, четыре, пять, шесть, семь. Квартира семь. Семь.',
          translation: 'One, two, three, four, five, six, seven. Apartment seven. Seven.',
          stage_direction: 'She holds up both hands, all seven fingers extended, counts slowly. Taps the jar.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'variation_10',
      trigger: { flag: 'galina_met', value: true },
      title: 'Dmitry Petrovich\'s Music',
      lines: [
        {
          speaker: 'galina',
          russian: 'Слышите? Это Дмитрий Петрович. Сверху. После десяти часов — тишина. Такие правила. Вы будете с ним говорить? Нужно сказать: здравствуйте. Не привет. Здравствуйте.',
          translation: 'Do you hear that? That is Dmitry Petrovich. From upstairs. After ten o\'clock — silence. Those are the rules. Will you speak to him? You need to say: здравствуйте. Not привет. Здравствуйте.',
          stage_direction: 'Galina is standing in her doorway. The music from upstairs is audible. She is holding her key ring, turning it slowly. She is not raising her voice.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте.',
              translation: 'Hello. / Good day. (formal)',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Привет.',
              translation: 'Hi. (casual)',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Ещё раз. Чётко. Здравствуйте. Вот так. Идите.',
          translation: 'Good. Once more. Clearly. Здравствуйте. Like that. Go.',
          stage_direction: 'She listens to the delivery. If it is too flat, she tilts her head. If correct, she nods. Coaches slightly, then satisfied.',
          isFinal: true,
          setsFlag: 'mission_music_complaint_active',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Нет. Привет — это для друзей. Дмитрий Петрович — сосед. Нужно: здравствуйте. Повторите.',
          translation: 'No. Привет — that is for friends. Dmitry Petrovich — he is a neighbor. You need: здравствуйте. Repeat it.',
          stage_direction: 'She shakes her head, patient but firm.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Здравствуйте. Это вежливо. Привет — нет. Здравствуйте — да. Повторите.',
          translation: 'Здравствуйте. This is polite. Привет — no. Здравствуйте — yes. Repeat it.',
          stage_direction: 'She sets the key ring down on the hall table. Both hands free. Speaks slowly, clearly.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'tier_acquaintance_1',
      trigger: { tier: 1 },
      title: 'Acquaintance Tea Offer',
      lines: [
        {
          speaker: 'galina',
          russian: 'А, это ты. Чай будешь? Я как раз ставлю чайник.',
          translation: 'Oh, it\'s you. Want tea? I\'m just putting the kettle on.',
          stage_direction: 'She switches to informal ты, a sign of familiarity. She leaves the door ajar.',
          choices: [
            { id: 'a', russian: 'Да, спасибо!', translation: 'Yes, thanks!', isFinal: false },
            { id: 'b', russian: 'Нет, спасибо. Я спешу.', translation: 'No, thanks. I\'m in a hurry.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'galina',
          russian: 'Садись. Сахар? Один или два?',
          translation: 'Sit down. Sugar? One or two?',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'galina',
          russian: 'Ладно. Но ты мало ешь. Студенты должны есть.',
          translation: 'Fine. But you eat too little. Students should eat.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'tier_acquaintance_2',
      trigger: { tier: 1 },
      title: 'Building Rules Reminder',
      lines: [
        {
          speaker: 'galina',
          russian: 'Слушай, ты помнишь правила? После десяти — тишина.',
          translation: 'Listen, do you remember the rules? After ten — quiet.',
          stage_direction: 'Galina peeks out, wags a finger gently. Casual but firm.',
          choices: [
            { id: 'a', russian: 'Да, помню. После десяти — тишина.', translation: 'Yes, I remember. After ten — quiet.', isFinal: false },
            { id: 'b', russian: 'Извините... я забыл.', translation: 'Sorry... I forgot.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'galina',
          russian: 'Молодец. Хорошо учишься.',
          translation: 'Good job. You learn well.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'galina',
          russian: 'Ничего. Повтори: после десяти — тишина. Запомни.',
          translation: 'It\'s okay. Repeat: after ten — quiet. Remember it.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'tier_friend_1',
      trigger: { tier: 2 },
      title: 'Friend Check-in',
      lines: [
        {
          speaker: 'galina',
          russian: 'Привет! Как дела? Ты сегодня ел? Я сварила суп.',
          translation: 'Hi! How are things? Did you eat today? I made soup.',
          stage_direction: 'She greets warmly, already holding a bowl. Genuinely concerned about the student\'s wellbeing.',
          choices: [
            { id: 'a', russian: 'Привет! Хорошо, спасибо. Суп — да, пожалуйста!', translation: 'Hi! Good, thanks. Soup — yes, please!', isFinal: false },
            { id: 'b', russian: 'Привет, Галина Ивановна! Я уже ел.', translation: 'Hi, Galina Ivanovna! I already ate.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'galina',
          russian: 'Вот, держи. Осторожно, горячий. Как учёба?',
          translation: 'Here, take it. Careful, it\'s hot. How are your studies?',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'galina',
          russian: 'Хорошо. А варенье? У меня свежее варенье. В следующий раз принесу.',
          translation: 'Good. How about jam? I have fresh jam. I\'ll bring some next time.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'tier_friend_2',
      trigger: { tier: 2 },
      title: 'Friend Favor Request',
      lines: [
        {
          speaker: 'galina',
          russian: 'Слушай, отнеси это соседу сверху. Квартира семь. Скажи — от Галины.',
          translation: 'Listen, take this to the neighbor upstairs. Apartment seven. Say — from Galina.',
          stage_direction: 'She hands over a jar of jam. This is a sign of trust — she sends you on errands now.',
          choices: [
            { id: 'a', russian: 'Хорошо! Квартира семь. От Галины.', translation: 'Okay! Apartment seven. From Galina.', isFinal: false },
            { id: 'b', russian: 'Квартира... семь? Сверху?', translation: 'Apartment... seven? Upstairs?', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'galina',
          russian: 'Всё правильно. Спасибо. Ты хороший сосед.',
          translation: 'All correct. Thank you. You are a good neighbor.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'galina',
          russian: 'Да. Сверху. Семь. Сосед. Понятно?',
          translation: 'Yes. Upstairs. Seven. Neighbor. Understood?',
          isFinal: true,
        },
      ],
    },

    {
      id: 'life_detail_sister',
      trigger: { flag: 'galina_key_given', value: true },
      title: 'Sister Lyudmila',
      lines: [
        {
          speaker: 'galina',
          russian: 'В субботу — сестра. Людмила. Она всегда звонит. Не в дверь — по телефону. Она такая.',
          translation: 'On Saturday — my sister. Lyudmila. She always calls. Not the door — on the phone. That\'s just her.',
          stage_direction: 'Galina says this while checking her mailbox, not looking up. A statement of fact about the world. She is not inviting further discussion.',
          choices: [
            {
              id: 'a',
              russian: 'Хорошо.',
              translation: 'Good. / Okay.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Людмила?',
              translation: 'Lyudmila?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Понятно.',
              translation: 'Understood.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Да. Хорошо. В субботу — тишина утром. Запомните.',
          translation: 'Yes. Good. On Saturday — quiet in the morning. Remember that.',
          stage_direction: 'She closes the mailbox. The sister is already behind her. The rule is what matters.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Людмила. Сестра. Она старше. Это всё.',
          translation: 'Lyudmila. My sister. She is older. That is all.',
          stage_direction: 'She repeats it matter-of-factly. Not unfond — just complete. Turns back toward her door.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Понятно. Она придёт в субботу. Не беспокойтесь.',
          translation: 'Understood. She is coming on Saturday. Don\'t worry about it.',
          stage_direction: 'She gives a small dismissive wave — not unfriendly, just concluding. Already moving.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'life_detail_plant',
      trigger: { tier: 1 },
      title: 'The Plant on the Windowsill',
      lines: [
        {
          speaker: 'galina',
          russian: 'Этот цветок — с подоконника. Сухой был. Три дня без воды. Три дня.',
          translation: 'This flower — from the windowsill. It was dry. Three days without water. Three days.',
          stage_direction: 'Galina is watering can in hand, not looking at the player. She holds the can up slightly toward a potted plant near her door — the same can from the first scene. She repeats "три дня" the way she repeats numbers: for emphasis, not for explanation.',
          choices: [
            {
              id: 'a',
              russian: 'Три дня?',
              translation: 'Three days?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Красивый цветок.',
              translation: 'Beautiful flower.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Понятно.',
              translation: 'Understood.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Три дня. Да. Он выжил. Хороший цветок.',
          translation: 'Three days. Yes. It survived. A good flower.',
          stage_direction: 'She says "выжил" with quiet respect, the same tone she uses for "правильно." She tilts the can, waters.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Да. Но воду надо давать. Каждый день. Такие правила.',
          translation: 'Yes. But water must be given. Every day. Those are the rules.',
          stage_direction: 'A small, dry pleasure in "такие правила." The same phrase she uses for the building quiet-after-ten rule. Everything in its place.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Понятно. Цветы — не студенты. Они не скажут, что хотят воды.',
          translation: 'Understood. Flowers are not students. They won\'t tell you they want water.',
          stage_direction: 'She says this almost to herself. Possibly a joke. She does not look up to check.',
          isFinal: true,
        },
      ],
    },

    // ─── TIER 0 — STRANGER (вы, formal) ─────────────────────────────────────────

    {
      id: 'opening_formal_redirect',
      minTier: 0,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 0 &&
        flags.galina_met === true,
      title: 'Wrong Floor Again',
      lines: [
        {
          speaker: 'galina',
          russian: 'Опять вы. Это первый этаж. Квартира три. Вам нужен другой этаж?',
          translation: 'You again. This is the first floor. Apartment three. You need a different floor?',
          stage_direction: 'Galina opens the door with mild recognition — not warm, not cold. She waits.',
          choices: [
            {
              id: 'a',
              russian: 'Да. Извините.',
              translation: 'Yes. I\'m sorry.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Какой этаж?',
              translation: 'Which floor?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Пожалуйста. Запомните: первый этаж — один, два, три.',
          translation: 'You\'re welcome. Remember: first floor — one, two, three.',
          stage_direction: 'She taps the door frame once, counts on three fingers, and closes the door gently.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Скажите номер квартиры. Я скажу этаж.',
          translation: 'Say the apartment number. I will tell you the floor.',
          stage_direction: 'She tilts her head and waits with folded arms.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Этаж. Первый этаж — здесь. Второй этаж — сверху. Вам нужен какой?',
          translation: 'Floor. First floor — here. Second floor — upstairs. Which one do you need?',
          stage_direction: 'She points down at the floor, then up at the ceiling, then at you.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'opening_formal_origins',
      minTier: 0,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 0 &&
        flags.galina_met === true &&
        flags.galina_intro === true,
      title: 'Where Are You From',
      lines: [
        {
          speaker: 'galina',
          russian: 'Вы не отсюда. Откуда вы? Из России?',
          translation: 'You are not from here. Where are you from? From Russia?',
          stage_direction: 'She looks at the player with mild appraisal — not unfriendly, simply direct.',
          choices: [
            {
              id: 'a',
              russian: 'Я из [место]. Не из России.',
              translation: 'I am from [place]. Not from Russia.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Я из [место].',
              translation: 'I am from [place].',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Не из России. Понятно. Далеко. Откуда вы — из [место]. Запомните эту фразу.',
          translation: 'Not from Russia. I see. Far away. Where are you from — from [place]. Remember this phrase.',
          stage_direction: 'She repeats the full phrase back slowly, stressing the "я из" structure.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Я из [место]. Вот так. Хорошо.',
          translation: 'I am from [place]. Just like that. Good.',
          stage_direction: 'A small nod — she accepts this without fanfare.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Откуда вы. Это вопрос. Вы из России? Из Англии? Откуда?',
          translation: 'Where are you from. That is a question. Are you from Russia? From England? From where?',
          stage_direction: 'She repeats the question word by word, hands open, genuinely waiting.',
          isFinal: true,
        },
      ],
    },

    // ─── TIER 1 — ACQUAINTANCE (ты, вы→ты switch) ────────────────────────────────

    {
      id: 'acquaintance_switch',
      minTier: 1,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 1 &&
        flags.galina_switch_done !== true,
      title: 'The вы→ты Switch',
      lines: [
        {
          speaker: 'galina',
          russian: 'Я вас уже знаю. Будем на ты. Не "вы" — ты. Понятно?',
          translation: 'I already know you. We\'ll use "ты" now. Not "вы" — "ты". Understood?',
          stage_direction: 'She says it plainly, as if settling a small administrative matter. No ceremony.',
          choices: [
            {
              id: 'a',
              russian: 'Понятно. Спасибо.',
              translation: 'Understood. Thank you.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Вы — ты. Хорошо.',
              translation: '"Вы" — "ты". Okay.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не понимаю.',
              translation: 'I don\'t understand.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Ты студент — я соседка. На ты.',
          translation: 'Good. You are a student — I am a neighbor. We use "ты".',
          stage_direction: 'She nods once. The matter is closed.',
          isFinal: true,
          setsFlag: 'galina_switch_done',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Да. Вы — это незнакомые люди. Ты — это я и ты. Теперь на ты.',
          translation: '"Вы" — that is for strangers. "Ты" — that is you and me. Now we use "ты".',
          stage_direction: 'She separates the words with two precise gestures: distant, then close.',
          isFinal: true,
          setsFlag: 'galina_switch_done',
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: '"Вы" — незнакомые. "Ты" — знакомые. Мы уже знакомы. Значит — ты.',
          translation: '"Вы" — for people you don\'t know. "Ты" — for people you know. We already know each other. So — "ты".',
          stage_direction: 'She speaks each sentence slowly, one finger for each step.',
          isFinal: true,
          setsFlag: 'galina_switch_done',
        },
      ],
    },

    {
      id: 'acquaintance_mailbox_callback',
      minTier: 1,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 1 &&
        flags.galina_switch_done === true,
      title: 'Mailbox Callback',
      lines: [
        {
          speaker: 'galina',
          russian: 'Ты уже знаешь, где почтовый ящик? Да? Хорошо. Там всегда письма.',
          translation: 'You already know where the mailbox is? Yes? Good. There are always letters there.',
          stage_direction: 'She leans against the doorframe — a fraction more relaxed than before.',
          choices: [
            {
              id: 'a',
              russian: 'Да, уже знаю. Спасибо.',
              translation: 'Yes, I already know. Thank you.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Почтовый ящик — где?',
              translation: 'The mailbox — where?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Нет, не нашёл.',
              translation: 'No, I didn\'t find it.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Пожалуйста. В следующий раз — скажи мне, если что.',
          translation: 'Good. You\'re welcome. Next time — tell me if anything comes up.',
          stage_direction: 'The faintest sign of ease in her face. She turns back inside.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Почтовый ящик — вот, у входа. Номер квартиры на ящике.',
          translation: 'The mailbox — there, by the entrance. Apartment number on the box.',
          stage_direction: 'She points past the player toward the building entrance.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'У входа. Ящик — твой номер. Запомни.',
          translation: 'By the entrance. The box — your number. Remember that.',
          stage_direction: 'She repeats the direction with a short pointing gesture. No judgment.',
          isFinal: true,
        },
      ],
    },

    // ─── TIER 2 — FRIEND (initiates small talk, ты, world texture) ───────────────

    {
      id: 'friend_asks_studies',
      minTier: 2,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 2,
      title: 'How Are Your Studies',
      lines: [
        {
          speaker: 'galina',
          russian: 'Как учёба? Ты учишься хорошо?',
          translation: 'How are your studies? Are you studying well?',
          stage_direction: 'She opens the door before the player knocks — she heard the footsteps. A small thing.',
          choices: [
            {
              id: 'a',
              russian: 'Да, хорошо. Спасибо.',
              translation: 'Yes, well. Thank you.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Трудно. Но я стараюсь.',
              translation: 'It\'s hard. But I\'m trying.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не знаю.',
              translation: 'I don\'t know.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Студенты должны учиться. Ты молодец.',
          translation: 'Good. Students should study. Well done.',
          stage_direction: 'She says "молодец" without irony. It is a small, genuine thing from her.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Трудно — это нормально. Главное — стараться. Хорошо.',
          translation: 'Hard — that is normal. The main thing is to try. Good.',
          stage_direction: 'She nods slowly, as if she has thought about this before.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Не знаешь — спрашивай. Это всегда помогает.',
          translation: 'If you don\'t know — ask. It always helps.',
          stage_direction: 'Dry, but not unkind. She means it.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'friend_sister_lyudmila',
      minTier: 2,
      trigger: (flags, progress) =>
        progress.npcRelationships?.galina?.tier === 2 &&
        flags.galina_lyudmila_mentioned !== true,
      title: 'Sister Lyudmila',
      lines: [
        {
          speaker: 'galina',
          russian: 'Моя сестра Людмила звонила. Она живёт в Новосибирске. Далеко.',
          translation: 'My sister Lyudmila called. She lives in Novosibirsk. Far away.',
          stage_direction: 'She says this while moving letters from her doorstep — not quite looking at the player. An aside, offered freely.',
          choices: [
            {
              id: 'a',
              russian: 'У тебя есть сестра? Хорошо.',
              translation: 'You have a sister? That\'s good.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Новосибирск — это далеко?',
              translation: 'Is Novosibirsk far?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Понятно.',
              translation: 'I see.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Есть. Одна сестра. Людмила. Она врач.',
          translation: 'I have one. One sister. Lyudmila. She is a doctor.',
          stage_direction: 'She says it plainly, as a fact she has carried for years.',
          isFinal: true,
          setsFlag: 'galina_lyudmila_mentioned',
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Далеко. Четыре часа на самолёте. Или три дня на поезде.',
          translation: 'Far. Four hours by plane. Or three days by train.',
          stage_direction: 'She says the train option with a very slight lift of her brow — a standing joke between her and herself.',
          isFinal: true,
          setsFlag: 'galina_lyudmila_mentioned',
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'galina',
          russian: 'Да. Людмила. Она врач. Мы редко видимся.',
          translation: 'Yes. Lyudmila. She is a doctor. We rarely see each other.',
          stage_direction: 'She picks up the last letter, glances at it. The subject is closed on her terms.',
          isFinal: true,
          setsFlag: 'galina_lyudmila_mentioned',
        },
      ],
    },

    {
      id: 'cross_reference_park_and_cafe',
      trigger: { flag: 'artyom_met', value: true },
      title: 'Galina Mentions the Park and Café',
      lines: [
        {
          speaker: 'galina',
          russian: 'Ты ходишь в парк? Там есть молодой человек — Артём. Знаешь его?',
          translation: 'Do you go to the park? There is a young man there — Artyom. Do you know him?',
          stage_direction: 'She asks this at the mailboxes, not looking up from sorting letters. It is not quite casual.',
          choices: [
            {
              id: 'a',
              russian: 'Да, я знаю Артёма.',
              translation: 'Yes, I know Artyom.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Да. Он хороший.',
              translation: 'Yes. He is good.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'galina',
          russian: 'Хорошо. Он хороший. Немного... много читает. Кафе видел? Лена там. Она знает всё.',
          translation: 'Good. He is good. A little... reads too much. Have you seen the café? Lena is there. She knows everything.',
          stage_direction: 'She says "много читает" with the mild disapproval of someone who prefers action. The café mention is given like practical information.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'galina',
          russian: 'Да. Хороший. Скажи ему: варенье я помню. Он знает. И — кафе видел? Лена там.',
          translation: 'Yes. Good. Tell him: I remember the jam. He will know. And — have you seen the café? Lena is there.',
          stage_direction: 'She says "варенье я помню" with quiet weight, as if this jam is a long-standing account receivable. Then pivots cleanly to the café.',
          isFinal: true,
        },
      ],
    },
  ];

  const UNLOCK = {
    requires: ['galina_met', 'galina_intro'],
    elements: ['greeting', 'name', 'floor_number'],
    success: {
      id: 'unlock_success',
      speaker: 'galina',
      russian: 'Правильно. Приветствие. Имя. Квартира. Всё правильно. Вы учитесь. Это хорошо.',
      translation: 'Correct. Greeting. Name. Apartment. All correct. You are learning. That is good.',
      stage_direction: 'She stops. Listens properly, the way she listens to something she is actually pleased about. Nods once, definitively. Almost warmly. Steps aside from the hallway as if it now belongs to you too.',
      setsFlag: 'galina_unlock_complete',
    },
    failures: {
      missing_greeting: {
        id: 'unlock_fail_greeting',
        speaker: 'galina',
        russian: 'Начните сначала. Здравствуйте. Или: добрый день. Сначала — приветствие.',
        translation: 'Start from the beginning. Здравствуйте. Or: добрый день. First — the greeting.',
        stage_direction: 'She tilts her head slightly, models it while touching her chin as if marking the starting point.',
      },
      missing_name: {
        id: 'unlock_fail_name',
        speaker: 'galina',
        russian: 'Меня зовут Галина Ивановна. Меня зовут — ?',
        translation: 'My name is Galina Ivanovna. My name is — ?',
        stage_direction: 'She points to herself, then to you. The gesture is unmistakable. She waits.',
      },
      missing_floor_number: {
        id: 'unlock_fail_floor',
        speaker: 'galina',
        russian: 'Этаж. Квартира. Какой номер?',
        translation: 'Floor. Apartment. What number?',
        stage_direction: 'She points downward at the floor, then at the wall where the apartment numbers run. She waits.',
      },
      missing_all: {
        id: 'unlock_fail_all',
        speaker: 'galina',
        russian: 'Слушайте. Здравствуйте. Меня зовут Галина Ивановна. Квартира три. Первый этаж. Ваша очередь. В следующий раз.',
        translation: 'Listen. Hello. My name is Galina Ivanovna. Apartment three. First floor. Your turn. Next time.',
        stage_direction: 'She takes a breath. Patient. She has done this before. Demonstrates the full sequence slowly and clearly, one element at a time. Gestures to you. When there is still no answer, gives a small nod, not unkind, and goes back inside.',
      },
      partial_two_of_three: {
        id: 'unlock_partial',
        speaker: 'galina',
        russian: 'Хорошо. Но —',
        translation: 'Good. But —',
        stage_direction: 'She pauses. She noticed. She identifies only what is missing.',
        followups: {
          missing_greeting_only: {
            russian: 'Приветствие. Как вы говорите сначала?',
            translation: 'The greeting. How do you say it first?',
          },
          missing_name_only: {
            russian: 'Ваше имя. Меня зовут — ?',
            translation: 'Your name. My name is — ?',
          },
          missing_number_only: {
            russian: 'Квартира. Этаж. Какой номер?',
            translation: 'Apartment. Floor. What number?',
          },
        },
      },
    },
  };

  /**
   * updateGalinaTier — call once per dialogue session end (from ApartmentScene._onDialogueEnd).
   * Mutates and returns the progress object. Caller must saveProgress(progress) after.
   *
   * Thresholds:
   *   tier 0 → 1 : visitCount >= 3
   *   tier 1 → 2 : visitCount >= 7
   */
  function updateGalinaTier(progress) {
    if (!progress.npcRelationships) {
      progress.npcRelationships = {};
    }
    if (!progress.npcRelationships.galina) {
      progress.npcRelationships.galina = { met: false, tier: 0, visitCount: 0 };
    }
    const rel = progress.npcRelationships.galina;
    rel.visitCount += 1;
    if (rel.tier === 0 && rel.visitCount >= 3) {
      rel.tier = 1;
    } else if (rel.tier === 1 && rel.visitCount >= 7) {
      rel.tier = 2;
    }
    return progress;
  }

  return { NPC_DATA, VARIATIONS, UNLOCK, updateGalinaTier };
})();
