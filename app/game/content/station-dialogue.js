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

  const KONSTANTIN_VARIATIONS = [
    {
      id: 'konstantin-first-approach',
      trigger: { visit_count: 1 },
      title: 'First Approach',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Слушаю вас.',
          translation: 'I\'m listening.',
          stage_direction: 'Konstantin is at his window, cap straight, posture precise. He does not look up immediately. When he does, he waits.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте.',
              translation: 'Good day.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Привет! Мне нужен билет.',
              translation: 'Hi! I need a ticket.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Билет до Твери, пожалуйста.',
              translation: 'A ticket to Tver, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Здравствуйте. Куда вы следуете?',
          translation: 'Good day. Where are you travelling?',
          stage_direction: 'A small, correct reaction. The greeting was right. He proceeds.',
          choices: [
            {
              id: 'a2',
              russian: 'Мне нужен билет до Твери, пожалуйста.',
              translation: 'I need a ticket to Tver, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Тверь.',
              translation: 'Tver.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'Добрый день. На вокзале мы говорим «здравствуйте». Куда вы следуете?',
          translation: 'Good day. At the station we say "zdravstvuyte." Where are you travelling?',
          stage_direction: 'He says it without looking up from the window. Not a rebuke — a correction, filed and closed.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Мне нужен билет до Твери.',
              translation: 'Good day. I need a ticket to Tver.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'konstantin',
          russian: 'Здравствуйте. Сначала — приветствие. Потом — запрос. Итак: куда вы следуете?',
          translation: 'Good day. First — the greeting. Then — the request. So: where are you travelling?',
          stage_direction: 'He speaks as though the correct procedure is self-evident. He is not annoyed. Procedures are procedures.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Билет до Твери.',
              translation: 'Good day. A ticket to Tver.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'konstantin',
          russian: 'Тверь. Хорошо. Когда вы планируете отправиться?',
          translation: 'Tver. Good. When are you planning to depart?',
          stage_direction: 'He writes something. His penmanship is excellent.',
          choices: [
            {
              id: 'a3',
              russian: 'В пятницу.',
              translation: 'On Friday.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'В котором часу отправляется поезд?',
              translation: 'At what time does the train depart?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'konstantin',
          russian: 'Тверь. Дату отправления, пожалуйста.',
          translation: 'Tver. The departure date, please.',
          stage_direction: 'One-word answers are accepted. He fills in the destination and asks for the next required item.',
          choices: [
            {
              id: 'a3',
              russian: 'В пятницу.',
              translation: 'On Friday.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Какой день — понедельник?',
              translation: 'Which day — Monday?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'konstantin',
          russian: 'В пятницу. Поезд отправляется в пятницу в четырнадцать тридцать. Платформа два. Вагон три.',
          translation: 'On Friday. The train departs Friday at 14:30. Platform two. Carriage three.',
          stage_direction: 'He recites this from memory. Not because he memorised this particular train — because he has memorised all of them.',
          choices: [
            {
              id: 'a4',
              russian: 'Платформа два, вагон три. Понял.',
              translation: 'Platform two, carriage three. Understood.',
              isFinal: false,
            },
            {
              id: 'b4',
              russian: 'Извините — какая платформа?',
              translation: 'Excuse me — which platform?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'konstantin',
          russian: 'Понедельник — это другое направление. В Тверь — в пятницу или в среду. Что вам удобнее?',
          translation: 'Monday — that\'s a different route. To Tver — on Friday or on Wednesday. Which is more convenient?',
          stage_direction: 'He offers two correct options. He does not guess what the player meant.',
          choices: [
            {
              id: 'a4',
              russian: 'В пятницу.',
              translation: 'On Friday.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a4',
          choiceId: 'a4',
          speaker: 'konstantin',
          russian: 'Верно. Платформа два, вагон три. Билет — сто двадцать рублей.',
          translation: 'Correct. Platform two, carriage three. The ticket — one hundred and twenty roubles.',
          stage_direction: 'The small real smile. Brief. Gone.',
          isFinal: true,
        },
        {
          id: 'response_b4',
          choiceId: 'b4',
          speaker: 'konstantin',
          russian: 'Платформа два. Налево по коридору, затем прямо. Указатели есть.',
          translation: 'Platform two. Left along the corridor, then straight ahead. There are signs.',
          stage_direction: 'He repeats without impatience. He has repeated things before. He will again.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'konstantin-time-inquiry',
      trigger: { flag: 'konstantin_first_approach_complete', value: true },
      title: 'Time Inquiry',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Здравствуйте. Слушаю вас.',
          translation: 'Good day. I\'m listening.',
          stage_direction: 'Exactly the same posture. Exactly the same words. This is not routine — it is precision.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Во сколько отправляется поезд в Тверь?',
              translation: 'Good day. At what time does the train to Tver depart?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. В котором часу поезд?',
              translation: 'Good day. At what time is the train?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Здравствуйте. Когда поезд?',
              translation: 'Good day. When is the train?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Поезд в Тверь отправляется в четырнадцать тридцать. В пятницу и в среду.',
          translation: 'The train to Tver departs at 14:30. On Friday and on Wednesday.',
          stage_direction: 'Complete answer. He does not add more than asked.',
          choices: [
            {
              id: 'a2',
              russian: 'В пятницу, в четырнадцать тридцать.',
              translation: 'On Friday, at 14:30.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'В среду.',
              translation: 'On Wednesday.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'В котором часу — это точнее, чем «во сколько». Хорошо. Поезд в Тверь — четырнадцать тридцать.',
          translation: '"V kotorom chasu" — this is more precise than "vo skolko." Good. Train to Tver — 14:30.',
          stage_direction: 'He notes the formal phrasing with approval. Then answers.',
          choices: [
            {
              id: 'a2',
              russian: 'Четырнадцать тридцать. В пятницу?',
              translation: '14:30. On Friday?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'konstantin',
          russian: '«Когда» — это общий вопрос. Лучше: «во сколько» или «в котором часу». Поезд — четырнадцать тридцать.',
          translation: '"When" — this is a general question. Better: "vo skolko" or "v kotorom chasu." Train — 14:30.',
          stage_direction: 'He explains the grammar difference as a service. He was a thorough man before he had a window.',
          choices: [
            {
              id: 'a2',
              russian: 'Понял. Во сколько отправляется в пятницу?',
              translation: 'Understood. At what time does it depart on Friday?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'konstantin',
          russian: 'Верно. Пятница, четырнадцать тридцать, платформа два.',
          translation: 'Correct. Friday, 14:30, platform two.',
          stage_direction: 'He confirms the repetition with one word: верно. It means more from him than from most.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'konstantin',
          russian: 'В среду — то же время. Четырнадцать тридцать. Платформа два.',
          translation: 'Wednesday — same time. 14:30. Platform two.',
          stage_direction: 'Consistent information. He does not need to check the board.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'konstantin-platform-routing',
      trigger: { flag: 'konstantin_time_inquiry_seen', value: true },
      title: 'Platform Routing',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Здравствуйте. Вы уже знаете расписание?',
          translation: 'Good day. You already know the timetable?',
          stage_direction: 'A slight variation from the normal greeting. He noticed the player was here before.',
          choices: [
            {
              id: 'a',
              russian: 'Да. Платформа два, четырнадцать тридцать.',
              translation: 'Yes. Platform two, 14:30.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Не полностью. Какой вагон?',
              translation: 'Not entirely. Which carriage?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Точно. Платформа два. Налево от этого окна, прямо по коридору, затем вниз по лестнице. Платформа будет перед вами.',
          translation: 'Correct. Platform two. Left from this window, straight along the corridor, then down the stairs. The platform will be in front of you.',
          stage_direction: 'He gives the directions with the same precision as a train schedule.',
          choices: [
            {
              id: 'a2',
              russian: 'Налево, прямо, затем лестница. Понял.',
              translation: 'Left, straight, then stairs. Understood.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Извините — ещё раз?',
              translation: 'Excuse me — once more?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'Вагон три. На платформе будут указатели. Поезд из восьми вагонов — вагон три в центре.',
          translation: 'Carriage three. There will be signs on the platform. The train has eight carriages — carriage three is in the middle.',
          stage_direction: 'He explains the layout with quiet pride. He has thought about this.',
          choices: [
            {
              id: 'a2',
              russian: 'Вагон три. Понял. Спасибо.',
              translation: 'Carriage three. Understood. Thank you.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Первый вагон?',
              translation: 'The first carriage?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'konstantin',
          russian: 'Верно. Если вы будете на платформе за пятнадцать минут до отправления — всё будет хорошо.',
          translation: 'Correct. If you are at the platform fifteen minutes before departure — everything will be fine.',
          stage_direction: 'The closest he comes to warmth. Practical care.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'konstantin',
          russian: 'Налево от этого окна. Прямо. Лестница вниз. Платформа два — прямо перед вами.',
          translation: 'Left from this window. Straight. Stairs down. Platform two — right in front of you.',
          stage_direction: 'He repeats the directions with identical clarity. This is not the first time someone has asked twice.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b2',
          speaker: 'konstantin',
          russian: 'Нет. Вагон три. Первый вагон — в начале состава, у локомотива. Третий — чуть дальше.',
          translation: 'No. Carriage three. The first carriage is at the front of the train, by the locomotive. The third — a little further along.',
          stage_direction: 'He corrects the guess precisely. He draws nothing, but his explanation is spatial.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'konstantin-ticket-price',
      trigger: { flag: 'konstantin_platform_routing_seen', value: true },
      title: 'Ticket Price',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Здравствуйте. Слушаю вас.',
          translation: 'Good day. I\'m listening.',
          stage_direction: 'The same. Always the same.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Сколько стоит билет до Твери?',
              translation: 'Good day. How much does a ticket to Tver cost?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Дорого — билет до Твери?',
              translation: 'Good day. Is a ticket to Tver expensive?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Здравствуйте. Сто рублей — билет?',
              translation: 'Good day. One hundred roubles — the ticket?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Билет до Твери — сто двадцать рублей. Один конец.',
          translation: 'A ticket to Tver — one hundred and twenty roubles. One way.',
          stage_direction: 'He states the price as he would state a fact. It is a fact.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот сто двадцать рублей.',
              translation: 'Here is one hundred and twenty roubles.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Дорого.',
              translation: 'Expensive.',
              isFinal: false,
            },
            {
              id: 'c2',
              russian: 'Вот двести рублей.',
              translation: 'Here is two hundred roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'Сто двадцать рублей. Это не дорого.',
          translation: 'One hundred and twenty roubles. That is not expensive.',
          stage_direction: 'He answers both parts of the question. He does not elaborate on the opinion.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот сто двадцать рублей.',
              translation: 'Here is one hundred and twenty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'konstantin',
          russian: 'Нет. Сто двадцать рублей.',
          translation: 'No. One hundred and twenty roubles.',
          stage_direction: 'Single correction. No commentary.',
          choices: [
            {
              id: 'a2',
              russian: 'Вот сто двадцать рублей.',
              translation: 'Here is one hundred and twenty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'konstantin',
          russian: 'Благодарю вас. Ваш билет. Платформа два, вагон три, пятница, четырнадцать тридцать.',
          translation: 'Thank you. Your ticket. Platform two, carriage three, Friday, 14:30.',
          stage_direction: 'He prints the ticket and recites all four elements from memory. He does this every time.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'konstantin',
          russian: 'Тарифы устанавливает расписание, не я. Сто двадцать рублей.',
          translation: 'The fares are set by the timetable, not by me. One hundred and twenty roubles.',
          stage_direction: 'Exact and a little formal. The price is not negotiable. He did not set it.',
          isFinal: true,
        },
        {
          id: 'response_c2',
          choiceId: 'c2',
          speaker: 'konstantin',
          russian: 'Сдача — восемьдесят рублей. Ваш билет.',
          translation: 'Change — eighty roubles. Your ticket.',
          stage_direction: 'He counts the change and places ticket and coins on the counter side by side.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'konstantin-full-unlock-sequence',
      trigger: { flag: 'konstantin_ticket_price_seen', value: true },
      title: 'Full Station Sequence',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Здравствуйте. Слушаю вас.',
          translation: 'Good day. I\'m listening.',
          stage_direction: 'The window is clear. The player is next.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Мне нужен билет до Твери на пятницу, пожалуйста.',
              translation: 'Good day. I need a ticket to Tver for Friday, please.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Билет до Твери.',
              translation: 'Good day. Ticket to Tver.',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Привет. Билет до Твери в пятницу.',
              translation: 'Hi. Ticket to Tver on Friday.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Тверь, пятница. В котором часу вам удобно — четырнадцать тридцать?',
          translation: 'Tver, Friday. What time is convenient for you — 14:30?',
          stage_direction: 'The complete request was given. He confirms and moves to the next step.',
          choices: [
            {
              id: 'a2',
              russian: 'Да, четырнадцать тридцать.',
              translation: 'Yes, 14:30.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'Дату отправления, пожалуйста.',
          translation: 'The departure date, please.',
          stage_direction: 'He acknowledges the partial request and asks for the missing element.',
          choices: [
            {
              id: 'a2',
              russian: 'В пятницу.',
              translation: 'On Friday.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'konstantin',
          russian: 'Здравствуйте. На вокзале — официальное приветствие. Тверь, пятница. Время?',
          translation: 'Good day. At the station — formal greeting. Tver, Friday. Time?',
          stage_direction: 'He corrects the register and continues. He does not labour the point.',
          choices: [
            {
              id: 'a2',
              russian: 'Здравствуйте. Четырнадцать тридцать.',
              translation: 'Good day. 14:30.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'konstantin',
          russian: 'Хорошо. Билет — сто двадцать рублей. Платформа два. Вагон три. Прибытие в Тверь — восемнадцать ноль-ноль.',
          translation: 'Good. The ticket — one hundred and twenty roubles. Platform two. Carriage three. Arrival in Tver — 18:00.',
          stage_direction: 'All four elements. He prints the ticket. This time the small smile is present for a moment longer.',
          choices: [
            {
              id: 'a3',
              russian: 'Вот сто двадцать рублей. Спасибо, до свидания.',
              translation: 'Here is one hundred and twenty roubles. Thank you, goodbye.',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Платформа два, вагон три, четырнадцать тридцать. Верно?',
              translation: 'Platform two, carriage three, 14:30. Correct?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'konstantin',
          russian: 'До свидания. Счастливого пути.',
          translation: 'Goodbye. Have a good journey.',
          stage_direction: 'The first time he says this. He means it. He says it to every passenger who remembers the farewell.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'konstantin',
          russian: 'Верно. Платформа два, вагон три, четырнадцать тридцать.',
          translation: 'Correct. Platform two, carriage three, 14:30.',
          stage_direction: 'He confirms with a single word. Верно. The small smile.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'konstantin-reflective-evening',
      trigger: { random: true },
      title: 'Late Evening',
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Здравствуйте. Поздно для билета. Следующий поезд — завтра, в четырнадцать тридцать.',
          translation: 'Good day. Late for a ticket. The next train — tomorrow, at 14:30.',
          stage_direction: 'The station is quiet. The light is different. He is still at his window. His posture has not changed since morning.',
          choices: [
            {
              id: 'a',
              russian: 'Тихо здесь.',
              translation: 'Quiet here.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Через час поезд прибудет?',
              translation: 'Will a train arrive in an hour?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Хороший маршрут — до Твери?',
              translation: 'Is it a good route — to Tver?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'konstantin',
          russian: 'Вечером тихо. Днём — иначе. Поезда не знают тишины.',
          translation: 'In the evening it is quiet. During the day — different. Trains don\'t know quiet.',
          stage_direction: 'He says this as if he finds it entirely reasonable. He has been here long enough to find it poetic.',
          isFinal: true,
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'konstantin',
          russian: 'Через час — нет. Следующий прибудет в двадцать три ноль-ноль. Товарный.',
          translation: 'In one hour — no. The next arrives at 23:00. Freight.',
          stage_direction: 'He answers the question exactly. He knows the freight schedule too.',
          isFinal: true,
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'konstantin',
          russian: 'Хороший маршрут. Четыре часа — хорошая дорога. Я не ездил, но маршрут знаю хорошо.',
          translation: 'A good route. Four hours — good journey. I haven\'t taken it, but I know the route well.',
          stage_direction: 'He says the last sentence without irony. It is simply true.',
          isFinal: true,
        },
      ],
    },
  ];

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

  const NADYA_VARIATIONS = [
    {
      id: 'nadya-directions',
      trigger: { visit_count: 1 },
      title: 'Directions at the Station',
      lines: [
        {
          speaker: 'nadya',
          russian: 'Здравствуйте! Вы первый раз здесь? Вам куда? Платформа? Кассы? Константин Петрович?',
          translation: 'Hello! Is this your first time here? Where do you need to go? Platform? Ticket desk? Konstantin Petrovich?',
          stage_direction: 'Nadya is standing near the information board. She noticed the player before the player noticed her. She starts talking before they can ask.',
          choices: [
            {
              id: 'a',
              russian: 'Извините, где платформа?',
              translation: 'Excuse me, where is the platform?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте — направо?',
              translation: 'Hello — to the right?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '(gestures vaguely)',
              translation: '(gestures vaguely)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'nadya',
          russian: 'Платформа! Да. Какая платформа? Один, два, три — у нас три. Обычно два.',
          translation: 'Platform! Yes. Which platform? One, two, three — we have three. Usually two.',
          stage_direction: 'She gestures at the board. The board shows the same information she just said.',
          choices: [
            {
              id: 'a2',
              russian: 'Платформа два, пожалуйста.',
              translation: 'Platform two, please.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Налево или направо?',
              translation: 'Left or right?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'nadya',
          russian: 'Налево! Почти всегда налево. Хотя — смотря куда. Куда вам?',
          translation: 'Left! Almost always left. Though — depends where. Where do you need?',
          stage_direction: 'She starts walking in the direction she\'s about to describe.',
          choices: [
            {
              id: 'a2',
              russian: 'Платформа два.',
              translation: 'Platform two.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'nadya',
          russian: 'Понятно! Куда — туда? Это платформа. Хорошо. Налево, прямо, потом вниз.',
          translation: 'Got it! You need — that way? That\'s the platform. Good. Left, straight, then down.',
          stage_direction: 'She interprets the gesture generously and provides directions immediately.',
          choices: [
            {
              id: 'a2',
              russian: 'Налево, прямо, потом вниз. Понял.',
              translation: 'Left, straight, then down. Understood.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'nadya',
          russian: 'Платформа два — налево, прямо, лестница вниз. Там. Не заблудитесь!',
          translation: 'Platform two — left, straight, stairs down. There. Don\'t get lost!',
          stage_direction: 'She points down the corridor. She says "не заблудитесь" lightly — as encouragement, not warning.',
          choices: [
            {
              id: 'a3',
              russian: 'Спасибо большое!',
              translation: 'Thank you very much!',
              isFinal: false,
            },
            {
              id: 'b3',
              russian: 'Ещё раз — налево?',
              translation: 'Once more — left?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'nadya',
          russian: 'Платформа два — налево! Платформа один — направо. Три — прямо. Логика есть.',
          translation: 'Platform two — left! Platform one — right. Three — straight. There\'s a logic.',
          stage_direction: 'She is genuinely pleased by the symmetry of it.',
          choices: [
            {
              id: 'a3',
              russian: 'Спасибо! Налево, понял.',
              translation: 'Thank you! Left, understood.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'nadya',
          russian: 'Пожалуйста! И — добро пожаловать на наш вокзал.',
          translation: 'You\'re welcome! And — welcome to our station.',
          stage_direction: 'She says "наш вокзал" as if she built it.',
          isFinal: true,
        },
        {
          id: 'response_b3',
          choiceId: 'b3',
          speaker: 'nadya',
          russian: 'Налево! Потом прямо. Потом лестница. Это правда несложно.',
          translation: 'Left! Then straight. Then stairs. It\'s really not complicated.',
          stage_direction: 'She says it with warmth, not impatience.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'nadya-timetable-assist',
      trigger: { flag: 'nadya_directions_seen', value: true },
      title: 'Timetable Help',
      lines: [
        {
          speaker: 'nadya',
          russian: 'О, вы снова! Разобрались с платформой? Хорошо. Что сейчас?',
          translation: 'Oh, you\'re back! Did you figure out the platform? Good. What now?',
          stage_direction: 'She is near the timetable board this time. She gestures at it casually as if it were hers.',
          choices: [
            {
              id: 'a',
              russian: 'Во сколько поезд?',
              translation: 'At what time is the train?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Отправляется в котором часу?',
              translation: 'It departs at what time?',
              isFinal: false,
            },
            {
              id: 'c',
              russian: '(points at the board)',
              translation: '(points at the board)',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'nadya',
          russian: 'Куда? Если в Тверь — четырнадцать тридцать. Сегодня или завтра?',
          translation: 'Where to? If Tver — 14:30. Today or tomorrow?',
          stage_direction: 'She pulls out the timetable from memory without looking at the board.',
          choices: [
            {
              id: 'a2',
              russian: 'Сегодня.',
              translation: 'Today.',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Завтра.',
              translation: 'Tomorrow.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'nadya',
          russian: '«В котором часу» — хорошо! Это формально. Константин Петрович будет рад. Четырнадцать тридцать.',
          translation: '"V kotorom chasu" — good! That\'s formal. Konstantin Petrovich will be pleased. 14:30.',
          stage_direction: 'She notices the formal phrasing and comments on it. She approves of Konstantin being pleased.',
          choices: [
            {
              id: 'a2',
              russian: 'Через час?',
              translation: 'In one hour?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Это сегодня?',
              translation: 'Is this today?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'nadya',
          russian: 'Вот! Четырнадцать тридцать — Тверь. Семнадцать ноль-ноль — Москва. Двадцать три — товарный. Понятно?',
          translation: 'Here! 14:30 — Tver. 17:00 — Moscow. 23:00 — freight. Clear?',
          stage_direction: 'She reads the board out loud as if narrating a film.',
          choices: [
            {
              id: 'a2',
              russian: 'Понятно. Четырнадцать тридцать — Тверь.',
              translation: 'Clear. 14:30 — Tver.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'nadya',
          russian: 'Сегодня! Через два часа, примерно. Успеете.',
          translation: 'Today! In about two hours. You\'ll make it.',
          stage_direction: 'She checks her watch. She sounds confident.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'nadya',
          russian: 'Завтра тоже четырнадцать тридцать. Каждый день, кроме вторника.',
          translation: 'Tomorrow also 14:30. Every day except Tuesday.',
          stage_direction: 'She knows the exceptions without hesitating.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'nadya-formal-register-contrast',
      trigger: { flag: 'nadya_timetable_seen', value: true },
      title: 'Register Contrast',
      lines: [
        {
          speaker: 'nadya',
          russian: 'Здравствуйте! Или — привет? Смотря где. Здесь — здравствуйте. Это работа.',
          translation: 'Hello! Or — hi? Depends where. Here — zdravstvuyte. This is work.',
          stage_direction: 'She explains this cheerfully, as if the distinction is amusing rather than strict.',
          choices: [
            {
              id: 'a',
              russian: 'Понял. Ты работаешь здесь сегодня?',
              translation: 'Understood. You work here today?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Вы работаете здесь сегодня?',
              translation: 'Good day. Do you work here today?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'nadya',
          russian: 'Да, работаю! Но на работе — «вы». Не «ты». Или я делаю вид, что не слышу. Попробуйте ещё раз.',
          translation: 'Yes, I work! But at work — "vy." Not "ty." Or I pretend not to hear. Try again.',
          stage_direction: 'She is smiling. The correction is a game, not a judgment.',
          choices: [
            {
              id: 'a2',
              russian: 'Вы работаете здесь сегодня?',
              translation: 'Do you work here today?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Извините. Вы работаете здесь?',
              translation: 'Excuse me. Do you work here?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'nadya',
          russian: 'Да! Именно так. «Вы» — правильно. Работаю, да. Помочь вам?',
          translation: 'Yes! Exactly right. "Vy" — correct. I do work, yes. Can I help you?',
          stage_direction: 'She lights up when the formal register is used correctly unprompted.',
          choices: [
            {
              id: 'a2',
              russian: 'Да, пожалуйста. Мне нужен билет.',
              translation: 'Yes, please. I need a ticket.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'nadya',
          russian: 'Отлично! «Вы работаете» — правильно. Да, работаю. Сегодня и завтра. К Константину Петровичу — за билетом.',
          translation: 'Excellent! "Vy rabotayete" — correct. Yes, I work. Today and tomorrow. To Konstantin Petrovich — for a ticket.',
          stage_direction: 'She nods at the grammar, confirms her schedule, and points in Konstantin\'s direction.',
          isFinal: true,
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'nadya',
          russian: 'Работаю! «Вы» — правильно. За билетом — к Константину. Вопросы — ко мне. Ему нравится это разделение.',
          translation: 'I work! "Vy" — correct. For tickets — to Konstantin. Questions — to me. He likes that division.',
          stage_direction: 'She says the last sentence with a kind of fond exasperation.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'nadya-ticket-purchase',
      trigger: { flag: 'nadya_register_contrast_seen', value: true },
      title: 'Buying a Ticket',
      lines: [
        {
          speaker: 'nadya',
          russian: 'Здравствуйте. Сегодня я за кассой — Константин Петрович на обеде. Могу помочь.',
          translation: 'Hello. Today I\'m at the desk — Konstantin Petrovich is at lunch. I can help.',
          stage_direction: 'She is behind the ticket window. She looks slightly different there — more official. She is doing her best Konstantin impression.',
          choices: [
            {
              id: 'a',
              russian: 'Здравствуйте. Мне нужен билет до Твери на пятницу.',
              translation: 'Good day. I need a ticket to Tver for Friday.',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Здравствуйте. Один билет до Твери, пожалуйста.',
              translation: 'Good day. One ticket to Tver, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'nadya',
          russian: 'Тверь, пятница! Отлично. Во сколько — четырнадцать тридцать?',
          translation: 'Tver, Friday! Excellent. At 14:30?',
          stage_direction: 'She is notably warmer than Konstantin would be. She finds this fun.',
          choices: [
            {
              id: 'a2',
              russian: 'Да. В котором часу прибытие?',
              translation: 'Yes. At what time is arrival?',
              isFinal: false,
            },
            {
              id: 'b2',
              russian: 'Да. Сколько стоит?',
              translation: 'Yes. How much does it cost?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'nadya',
          russian: 'Один билет! На какой день?',
          translation: 'One ticket! For which day?',
          stage_direction: 'She asks the next required element, same as Konstantin would, but with a small smile.',
          choices: [
            {
              id: 'a2',
              russian: 'В пятницу, пожалуйста.',
              translation: 'On Friday, please.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'nadya',
          russian: 'Прибытие в восемнадцать ноль-ноль. Четыре часа дороги — это быстро! Мне нравится этот маршрут.',
          translation: 'Arrival at 18:00. Four hours of travel — that\'s fast! I like this route.',
          stage_direction: 'She says the last sentence entirely for herself.',
          choices: [
            {
              id: 'a3',
              russian: 'Сколько стоит билет?',
              translation: 'How much does the ticket cost?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b2',
          choiceId: 'b2',
          speaker: 'nadya',
          russian: 'Сто двадцать рублей! Недорого, правда? Платформа два, вагон три.',
          translation: 'One hundred and twenty roubles! Not expensive, right? Platform two, carriage three.',
          stage_direction: 'She gives price and platform together.',
          choices: [
            {
              id: 'a3',
              russian: 'Вот сто двадцать рублей.',
              translation: 'Here is one hundred and twenty roubles.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a3',
          choiceId: 'a3',
          speaker: 'nadya',
          russian: 'Сто двадцать рублей. Платформа два, вагон три. Вот билет!',
          translation: 'One hundred and twenty roubles. Platform two, carriage three. Here\'s the ticket!',
          stage_direction: 'She hands over the ticket with significantly more ceremony than Konstantin would.',
          choices: [
            {
              id: 'a4',
              russian: 'Вот сто двадцать рублей. Спасибо большое!',
              translation: 'Here is one hundred and twenty roubles. Thank you very much!',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a4',
          choiceId: 'a4',
          speaker: 'nadya',
          russian: 'Пожалуйста! Приятного пути. Тверь хорошая — я там не была, но говорят, хорошая.',
          translation: 'You\'re welcome! Pleasant journey. Tver is good — I haven\'t been, but they say it\'s good.',
          stage_direction: 'She says this without embarrassment. She has a list of places she hasn\'t been yet.',
          isFinal: true,
        },
      ],
    },

    {
      id: 'nadya-petersburg-hint',
      trigger: { random: true },
      title: 'Saint Petersburg',
      lines: [
        {
          speaker: 'nadya',
          russian: 'Знаете, я уже три года хочу в Петербург. Поезд туда — ночной, быстрый. Восемь часов.',
          translation: 'You know, I\'ve wanted to go to Petersburg for three years now. The train there — overnight, fast. Eight hours.',
          stage_direction: 'She says this looking at the board. Not at the player. It is something she tells the timetable.',
          choices: [
            {
              id: 'a',
              russian: 'Далеко?',
              translation: 'Far?',
              isFinal: false,
            },
            {
              id: 'b',
              russian: 'Хорошо!',
              translation: 'That\'s great!',
              isFinal: false,
            },
            {
              id: 'c',
              russian: 'Когда?',
              translation: 'When?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a',
          choiceId: 'a',
          speaker: 'nadya',
          russian: 'Далеко! Восемьсот километров. Восемь часов на поезде — это быстро. Я считала.',
          translation: 'Far! Eight hundred kilometres. Eight hours by train — that\'s fast. I\'ve calculated it.',
          stage_direction: 'She has calculated it more than once.',
          choices: [
            {
              id: 'a2',
              russian: 'Через восемь часов — Петербург.',
              translation: 'In eight hours — Petersburg.',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_b',
          choiceId: 'b',
          speaker: 'nadya',
          russian: 'Хорошо — это когда я поеду! Билет уже знаю сколько стоит. Только времени нет.',
          translation: '"That\'s great" — that\'s when I go! I already know how much the ticket costs. I just don\'t have the time.',
          stage_direction: 'She grins. The situation is absurd to her too.',
          choices: [
            {
              id: 'a2',
              russian: 'Когда вы поедете?',
              translation: 'When will you go?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_c',
          choiceId: 'c',
          speaker: 'nadya',
          russian: 'Когда? Хороший вопрос. Скоро. Так говорю каждый год. Но — скоро.',
          translation: 'When? Good question. Soon. I say that every year. But — soon.',
          stage_direction: 'She says "скоро" the second time with conviction. It has not wavered in three years.',
          choices: [
            {
              id: 'a2',
              russian: 'Через час? Через год?',
              translation: 'In one hour? In one year?',
              isFinal: false,
            },
          ],
        },
        {
          id: 'response_a2',
          choiceId: 'a2',
          speaker: 'nadya',
          russian: 'Через восемь часов — Петербург. Правильно! И вы запомнили «через».',
          translation: 'In eight hours — Petersburg. Right! And you remembered "cherez."',
          stage_direction: 'She is genuinely pleased they used the time structure.',
          isFinal: true,
        },
      ],
    },
  ];

  // -----------------------------------------------------------
  // Tier-1 VARIATIONS for Konstantin — remains вы; tone warms
  // -----------------------------------------------------------
  KONSTANTIN_VARIATIONS.push(
    {
      id: 'konstantin_acquaintance_1',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Добрый день. Вы снова здесь. Москва ещё не манит?',
          translation: 'Good afternoon. You are here again. Moscow not calling yet?',
          stage_direction: 'He does not quite smile, but his posture is marginally less precise.',
          choices: [
            { id: 'a', russian: 'Нет. Мне здесь нравится.', translation: 'No. I like it here.', isFinal: false },
            { id: 'b', russian: 'Я хочу купить билет.', translation: 'I would like to buy a ticket.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'konstantin',
          russian: 'Хороший ответ. Расписание не изменилось. Вы уже знаете.',
          translation: 'A good answer. The schedule has not changed. You know it already.',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'konstantin',
          russian: 'Конечно. Куда и когда?',
          translation: 'Of course. Where to and when?',
          isFinal: true,
        },
      ],
    },
    {
      id: 'konstantin_acquaintance_2',
      trigger: { tier: 1 },
      lines: [
        {
          speaker: 'konstantin',
          russian: 'Вы правильно сказали «здравствуйте» с первого раза. Не все так делают.',
          translation: 'You said "zdravstvuyte" correctly from the first time. Not everyone does.',
          stage_direction: 'He says it while stamping a form — a compliment delivered at the form, not at you.',
          choices: [
            { id: 'a', russian: 'Спасибо, Константин Петрович.', translation: 'Thank you, Konstantin Petrovich.', isFinal: false },
            { id: 'b', russian: 'Я учусь.', translation: 'I am learning.', isFinal: false },
          ],
        },
        {
          id: 'response_a', choiceId: 'a', speaker: 'konstantin',
          russian: 'Хорошо. Чем могу помочь?',
          translation: 'Good. How can I help you?',
          isFinal: true,
        },
        {
          id: 'response_b', choiceId: 'b', speaker: 'konstantin',
          russian: 'Это заметно. Продолжайте.',
          translation: 'It shows. Continue.',
          isFinal: true,
        },
      ],
    }
  );

  // -----------------------------------------------------------
  // updateKonstantinTier — call once per dialogue session end.
  // Increments visitCount; promotes tier when threshold reached.
  // -----------------------------------------------------------
  function updateKonstantinTier(progress) {
    if (!progress.npcRelationships) progress.npcRelationships = {};
    if (!progress.npcRelationships.konstantin) {
      progress.npcRelationships.konstantin = { met: false, tier: 0, visitCount: 0 };
    }
    const rel = progress.npcRelationships.konstantin;
    rel.visitCount += 1;
    if (rel.tier === 0 && rel.visitCount >= 3) { rel.tier = 1; }
    else if (rel.tier === 1 && rel.visitCount >= 7) { rel.tier = 2; }
    return progress;
  }

  return {
    KONSTANTIN: { ...KONSTANTIN, VARIATIONS: KONSTANTIN_VARIATIONS },
    NADYA: { ...NADYA, VARIATIONS: NADYA_VARIATIONS },
    updateKonstantinTier,
  };
})();
