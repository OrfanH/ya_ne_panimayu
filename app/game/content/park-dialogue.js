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
    portrait: null,
  };

  const ARTYOM_VARIATIONS = [
    {
      id: 'first_meeting',
      trigger: { flag: 'artyom_met', value: false },
      lines: [
        {
          speaker: 'artyom',
          russian: 'Эй! Ты потерялся? Парк большой, но не такой большой.',
          translation: 'Hey! Are you lost? The park is big, but not that big.',
          stage_direction: 'Artyom is sitting on the back of a bench, book in his pocket. He grins, not unkindly.',
          choices: [
            {
              id: 'a',
              russian: 'Привет. Да, я не знаю, где... фонтан.',
              translation: 'Hi. Yes, I don\'t know where... the fountain is.',
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
              russian: 'Привет! Я иду... там?',
              translation: 'Hi! I\'m going... that way?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'artyom',
          russian: 'Фонтан — там. Прямо, потом направо. Видишь большое дерево? Там фонтан.',
          translation: 'The fountain is that way. Straight ahead, then right. See the big tree? The fountain is there.',
          stage_direction: 'He jumps off the bench and points down the path with easy confidence.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Ничего. Слушай: налево — это влево. Направо — это вправо. Прямо — это вперёд. Понял?',
          translation: 'No problem. Listen: nalevo — that\'s left. Napravo — that\'s right. Pryamo — that\'s forward. Got it?',
          stage_direction: 'He demonstrates with his hands, amused but patient, like someone who enjoys this kind of thing.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'artyom',
          russian: 'Хм. Там — это направо. А вон там — налево. Куда ты идёшь?',
          translation: 'Hmm. That way is to the right. And over there is to the left. Where are you going?',
          stage_direction: 'He tilts his head, genuinely curious now.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'directions_lesson',
      trigger: { flag: 'artyom_met', value: true },
      title: 'The Directions Game',
      lines: [
        {
          speaker: 'artyom',
          russian: 'Слушай, я проверю тебя. Как пройти к фонтану отсюда?',
          translation: 'Hey, I\'ll test you. How do you get to the fountain from here?',
          stage_direction: 'He folds his arms, mock-serious, like a quiz show host.',
          choices: [
            {
              id: 'a',
              russian: 'Прямо, потом налево.',
              translation: 'Straight ahead, then left.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Прямо, потом направо.',
              translation: 'Straight ahead, then right.',
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
          speaker: 'artyom',
          russian: 'Нет! Прямо, потом направо. Но хорошая попытка. Ещё раз.',
          translation: 'No! Straight ahead, then right. But good try. Once more.',
          stage_direction: 'He shakes his head with a grin, then draws the path in the air with his finger.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Правильно! Прямо, потом направо. Отлично. Уже лучше.',
          translation: 'Correct! Straight ahead, then right. Excellent. Getting better.',
          stage_direction: 'He points a finger-gun and grins.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'artyom',
          russian: 'Ладно. Слушай: фонтан — там. Прямо и направо. Просто запомни: направо.',
          translation: 'Okay. Listen: the fountain is that way. Straight and right. Just remember: right.',
          stage_direction: 'He says "направо" like it\'s the most important word in Russian.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'describe_the_park',
      trigger: { flag: 'artyom_met', value: true },
      title: 'Park Descriptions',
      lines: [
        {
          speaker: 'artyom',
          russian: 'Красивый парк, да? Старый, но красивый. Вон то дерево — ему, наверное, лет сто.',
          translation: 'Beautiful park, right? Old, but beautiful. That tree over there — it\'s probably a hundred years old.',
          stage_direction: 'He leans back, glancing at the old oak with something like affection.',
          choices: [
            {
              id: 'a',
              russian: 'Да, красивый! Большой.',
              translation: 'Yes, beautiful! Big.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Дерево старое.',
              translation: 'The tree is old.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Что... там?',
              translation: 'What... is there?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'artyom',
          russian: 'Точно. Большой и старый. Мне нравится это слово — большой. Звучит как то, что значит.',
          translation: 'Exactly. Big and old. I like that word — bolshoy. It sounds like what it means.',
          stage_direction: 'He says "большой" with exaggerated weight, like he\'s tasting it.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Да! Старое дерево. Хорошо сказал. Оно и правда старое.',
          translation: 'Yes! Old tree. Well said. It really is old.',
          stage_direction: 'He looks genuinely pleased at the correct adjective form.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'artyom',
          russian: 'Там? Скамейка. Маленькая, старая скамейка. Иногда я сижу там и читаю.',
          translation: 'There? A bench. Small, old bench. Sometimes I sit there and read.',
          stage_direction: 'He points at a weathered bench near the treeline.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'the_book',
      trigger: { random: true },
      title: 'What Are You Reading?',
      lines: [
        {
          speaker: 'artyom',
          russian: 'Ты читаешь? На русском? Я читаю вот это — старая книга, советская. Хорошая.',
          translation: 'Do you read? In Russian? I\'m reading this — old book, Soviet. Good one.',
          stage_direction: 'He pulls the paperback from his pocket and holds it up — then puts it back before you can read the title.',
          choices: [
            {
              id: 'a',
              russian: 'Что это?',
              translation: 'What is it?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Да, я читаю. Маленькие книги.',
              translation: 'Yes, I read. Small books.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Нет. Русский — сложно.',
              translation: 'No. Russian is difficult.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'artyom',
          russian: 'Приключения. Старые приключения. Люди идут там, находят что-то большое, возвращаются. Хорошо.',
          translation: 'Adventures. Old adventures. People go there, find something big, come back. Good stuff.',
          stage_direction: 'He shrugs, but his expression says he loves it.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Маленькие — это нормально. Начни маленько, потом больше. Так у всех.',
          translation: 'Small ones are fine. Start small, then bigger. That\'s how everyone does it.',
          stage_direction: 'He says this like it\'s the most obvious thing in the world.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'artyom',
          russian: 'Ха! Да, сложно. Но ты уже говоришь. Это самое главное.',
          translation: 'Ha! Yes, it\'s hard. But you\'re already speaking. That\'s the most important thing.',
          stage_direction: 'He flicks a hand dismissively at the word "difficult."',
          isFinal: true,
        },
      ],
    },

    {
      id: 'where_to_eat',
      trigger: { flag: 'artyom_met', value: true },
      title: 'Where to Eat',
      lines: [
        {
          speaker: 'artyom',
          russian: 'Слушай, ты уже был в кафе? Там — направо, потом прямо. Лена там работает. Скажи, что от Артёма.',
          translation: 'Hey, have you been to the cafe yet? It\'s that way — right, then straight ahead. Lena works there. Tell her Artyom sent you.',
          stage_direction: 'He gives directions like he\'s handing over something useful. The book-pocket reference is subtle — he\'s clearly been doing this for years.',
          choices: [
            {
              id: 'a',
              russian: 'Направо, потом прямо?',
              translation: 'Right, then straight ahead?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Кто такая Лена?',
              translation: 'Who is Lena?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Спасибо!',
              translation: 'Thank you!',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'artyom',
          russian: 'Да! Направо, потом прямо. Видишь вон ту дорожку? По ней.',
          translation: 'Yes! Right, then straight. See that path there? Follow it.',
          stage_direction: 'He points at a narrower path branching off from the main one.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Лена? Она там всегда. Хорошая. Знает всё про этот город. Кофе хороший.',
          translation: 'Lena? She\'s always there. She\'s good. Knows everything about this town. Good coffee.',
          stage_direction: 'He says "хороший кофе" with the reverence of someone who can\'t often afford it.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'artyom',
          russian: 'Пожалуйста. Скажи ей привет.',
          translation: 'You\'re welcome. Say hi for me.',
          stage_direction: 'He waves it off and looks back toward the path.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'cross_reference_galina',
      trigger: { flag: 'galina_met', value: true },
      title: 'Galina\'s Cooking',
      lines: [
        {
          speaker: 'artyom',
          russian: 'Ты живёшь у Галины Ивановны? Она тебя кормит? Суп? Она делает хороший суп.',
          translation: 'You live near Galina Ivanovna? Does she feed you? Soup? She makes good soup.',
          stage_direction: 'His face does something complicated — fond and slightly embarrassed.',
          choices: [
            {
              id: 'a',
              russian: 'Да, суп хороший!',
              translation: 'Yes, the soup is good!',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Нет... она не кормит меня.',
              translation: 'No... she doesn\'t feed me.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'artyom',
          russian: 'Конечно хороший. Она меня кормила каждое лето, когда я был маленький. Я до сих пор должен ей варенье.',
          translation: 'Of course it\'s good. She fed me every summer when I was small. I still owe her a jar of jam.',
          stage_direction: 'He laughs at himself, quietly.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'artyom',
          russian: 'Ещё накормит. Подожди. Она не умеет не кормить.',
          translation: 'She will. Wait. She doesn\'t know how not to feed people.',
          stage_direction: 'He says this with complete certainty.',
          isFinal: true,
        },
      ],
    },
  ];

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
    portrait: null,
  };

  const TAMARA_VARIATIONS = [
    {
      id: 'first_meeting',
      trigger: { flag: 'tamara_met', value: false },
      lines: [
        {
          speaker: 'tamara',
          russian: 'Здравствуйте. Вы изучаете русский язык?',
          translation: 'Good day. Are you studying Russian?',
          stage_direction: 'She is sitting upright near the chess tables, coat buttoned despite the warmth. She lowers her book and looks at the player with quiet recognition.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Да, я изучаю русский.',
              translation: 'Good day. Yes, I am studying Russian.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Привет! Да...',
              translation: 'Hi! Yes...',
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
          speaker: 'tamara',
          russian: 'Очень хорошо. Вы сказали «здравствуйте» — это правильно. Я — Тамара Андреевна. Я учительница. Была учительницей.',
          translation: 'Very good. You said "zdravstvuyte" — that is correct. I am Tamara Andreyevna. I am a teacher. Was a teacher.',
          stage_direction: 'She gives the smallest correction to herself with the air of someone who spent decades being precise.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'Вы сказали «привет». Это неформально. С незнакомыми людьми лучше — «здравствуйте». Попробуйте.',
          translation: 'You said "privet." That is informal. With strangers it is better — "zdravstvuyte." Try it.',
          stage_direction: 'She says it without any sting — just the mild adjustment of an expert.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'tamara',
          russian: 'Ничего страшного. Повторите за мной: здравствуйте. Это значит «добрый день». Официально. Хорошо?',
          translation: 'Nothing to worry about. Repeat after me: zdravstvuyte. It means "good day." Formal. All right?',
          stage_direction: 'She speaks the word clearly, giving the player time.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'colors_at_the_fountain',
      trigger: { flag: 'tamara_met', value: true },
      title: 'Colors',
      lines: [
        {
          speaker: 'tamara',
          russian: 'Посмотрите на цветы у фонтана. Какого они цвета?',
          translation: 'Look at the flowers by the fountain. What color are they?',
          stage_direction: 'She gestures toward the flower beds with the unhurried confidence of someone who has set up this exact lesson before.',
          choices: [
            {
              id: 'a',
              russian: 'Красные и жёлтые.',
              translation: 'Red and yellow.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Красивые!',
              translation: 'Beautiful!',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Я не знаю слова...',
              translation: 'I don\'t know the word...',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'tamara',
          russian: 'Превосходно. Красные и жёлтые. Вы знаете цвета — это хорошо. А синие цветы — вон там.',
          translation: 'Excellent. Red and yellow. You know colors — that is good. And the blue flowers — over there.',
          stage_direction: 'She points to a second bed, pleased.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'Да, красивые. И какого они цвета? «Красивый» — это про красоту. Цвет — это другое слово. Красный, синий, жёлтый...',
          translation: 'Yes, beautiful. And what color are they? "Krasiviy" — that is about beauty. Color is a different word. Red, blue, yellow...',
          stage_direction: 'She doesn\'t correct to embarrass — she redirects with a list that gives the answer.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'tamara',
          russian: 'Конечно. Смотрите: вот красный. Вот жёлтый. А вот — зелёный. Это трава.',
          translation: 'Of course. Look: this is red. This is yellow. And this — green. That is grass.',
          stage_direction: 'She touches the flower petals gently as she says each word.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'the_weather',
      trigger: { random: true },
      title: 'Talking About Weather',
      lines: [
        {
          speaker: 'tamara',
          russian: 'Сегодня тепло. Осенью будет холодно. Вы любите холод?',
          translation: 'Today it is warm. In autumn it will be cold. Do you like the cold?',
          stage_direction: 'She looks up at the sky with the expression of someone making a careful assessment.',
          choices: [
            {
              id: 'a',
              russian: 'Да, я люблю холод.',
              translation: 'Yes, I like the cold.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Нет. Я люблю тепло.',
              translation: 'No. I like warmth.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Что такое «осенью»?',
              translation: 'What does "in autumn" mean?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'tamara',
          russian: 'Хорошо. В России вы будете довольны. Зима здесь настоящая. Белый снег, серое небо. Красиво по-своему.',
          translation: 'Good. In Russia you will be satisfied. Winter here is real. White snow, grey sky. Beautiful in its own way.',
          stage_direction: 'She says "белый снег" with a kind of quiet pride.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'Понимаю. Тепло сейчас хорошо. Наслаждайтесь. Дождь придёт скоро.',
          translation: 'I understand. Warmth now is good. Enjoy it. Rain will come soon.',
          stage_direction: 'She says "дождь придёт" with the certainty of meteorological authority.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'tamara',
          russian: 'Осень — это сезон. Сентябрь, октябрь, ноябрь. Листья жёлтые и красные. Холодно. Красиво.',
          translation: 'Autumn is a season. September, October, November. Leaves are yellow and red. Cold. Beautiful.',
          stage_direction: 'She frames it as geography and poetry simultaneously.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'formal_address',
      trigger: { flag: 'tamara_met', value: true },
      title: 'On Formal Address',
      lines: [
        {
          speaker: 'tamara',
          russian: 'Позвольте спросить — вы знаете, почему меня зовут «Тамара Андреевна»? Не просто «Тамара»?',
          translation: 'Allow me to ask — do you know why I am called "Tamara Andreyevna"? Not simply "Tamara"?',
          stage_direction: 'She asks this with genuine curiosity, not testing. She wants to know what they know.',
          choices: [
            {
              id: 'a',
              russian: 'Нет. Почему?',
              translation: 'No. Why?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Это... официально?',
              translation: 'It is... formal?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'tamara',
          russian: 'По-русски у каждого человека есть отчество — имя отца с окончанием. Мой отец — Андрей. Я — Андреевна. Это уважение.',
          translation: 'In Russian, every person has a patronymic — the father\'s name with an ending. My father is Andrei. I am Andreyevna. It is respect.',
          stage_direction: 'She explains it the way she explained it for thirty-five years — clearly, completely, without condescension.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'Правильно — официально, или точнее, уважительно. Это называется отчество. Имя отца. Очень по-русски.',
          translation: 'Correct — formal, or more precisely, respectful. It is called an otchestvo. The father\'s name. Very Russian.',
          stage_direction: 'She nods at the word "official" — the player was in the right territory.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'lost_glasses',
      trigger: { flag: 'tamara_met', value: true },
      title: 'The Lost Glasses',
      lines: [
        {
          speaker: 'tamara',
          russian: 'Ах! Вы не видели очки? Маленькие, в прямоугольной оправе. Я сидела вон там.',
          translation: 'Oh! Have you seen glasses? Small, rectangular frames. I was sitting over there.',
          stage_direction: 'She gestures to her usual bench, genuinely flustered — a small disruption to her orderly routine.',
          choices: [
            {
              id: 'a',
              russian: 'Нет, не видел. Я поищу.',
              translation: 'No, I haven\'t seen them. I\'ll look.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Там? На скамейке?',
              translation: 'There? On the bench?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'tamara',
          russian: 'Спасибо. Посмотрите у фонтана и у старого дерева. Я туда ходила сегодня.',
          translation: 'Thank you. Look near the fountain and by the old tree. I went there today.',
          stage_direction: 'She smooths her coat and waits with patient dignity.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'На скамейке — нет, я смотрела. Наверное у фонтана. Там светло — можно увидеть. Пожалуйста.',
          translation: 'On the bench — no, I looked. Probably by the fountain. It\'s bright there — you can see them. Please.',
          stage_direction: 'She says "пожалуйста" quietly, a word she uses precisely.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'poetry_and_autumn',
      trigger: { random: true },
      title: 'Russian Poetry',
      lines: [
        {
          speaker: 'tamara',
          russian: 'Осень скоро. Пушкин очень любил осень. «Унылая пора! Очей очарованье...» Это значит: грустно, но красиво.',
          translation: 'Autumn is coming. Pushkin loved autumn very much. "Dreary season! Enchantment of the eyes..." It means: sad, but beautiful.',
          stage_direction: 'She quotes from memory without drama, the way you quote things you know in your bones.',
          choices: [
            {
              id: 'a',
              russian: 'Красиво.',
              translation: 'Beautiful.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Кто такой Пушкин?',
              translation: 'Who is Pushkin?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'tamara',
          russian: 'Да. Красиво. Вы уже понимаете что-то важное о русском языке.',
          translation: 'Yes. Beautiful. You already understand something important about the Russian language.',
          stage_direction: 'She says this with quiet satisfaction, like someone who has just confirmed a hypothesis.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'tamara',
          russian: 'Пушкин — самый главный русский поэт. Вы в России и не знаете Пушкина? Это мы исправим.',
          translation: 'Pushkin is the most important Russian poet. You are in Russia and don\'t know Pushkin? We will fix that.',
          stage_direction: 'She says "мы исправим" with the serenity of a person who has fixed many things.',
          isFinal: true,
        },
      ],
    },
  ];

  return {
    ARTYOM: { ...ARTYOM, VARIATIONS: ARTYOM_VARIATIONS },
    TAMARA: { ...TAMARA, VARIATIONS: TAMARA_VARIATIONS },
  };
})();
