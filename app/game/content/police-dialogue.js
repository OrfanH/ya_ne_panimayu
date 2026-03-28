/* ============================================
   Police Station NPC dialogue data — Alina + Sergei
   ============================================ */

const POLICE_DIALOGUE = (() => {
  const ALINA = {
    id: 'alina',
    name: 'Алина Дмитриевна',
    persona: 'Alina Dmitrievna is a police officer in her early 30s, originally from Saint Petersburg. She is professional, uses exclusively formal register (вы), and speaks in complete sentences. She is patient but efficient — she needs information and will guide the player through giving it. She teaches past tense narrative, formal requests, and form-filling through the process of filing a report. She is kind underneath the professionalism.',
    tutorVocabulary: [
      { russian: 'паспорт', translation: 'passport' },
      { russian: 'документ', translation: 'document' },
      { russian: 'адрес', translation: 'address' },
      { russian: 'я потерял', translation: 'I lost (masc.)' },
      { russian: 'я потеряла', translation: 'I lost (fem.)' },
      { russian: 'это произошло', translation: 'it happened' },
      { russian: 'у меня нет', translation: 'I don\'t have' },
      { russian: 'мне нужно', translation: 'I need to' },
      { russian: 'заявление', translation: 'official statement / report' },
      { russian: 'помогите', translation: 'help (me)' },
      { russian: 'когда', translation: 'when' },
      { russian: 'где', translation: 'where' },
      { russian: 'что случилось', translation: 'what happened' },
      { russian: 'имя', translation: 'name (first)' },
      { russian: 'фамилия', translation: 'surname' },
      { russian: 'дата', translation: 'date' },
      { russian: 'подпись', translation: 'signature' },
      { russian: 'здравствуйте', translation: 'hello (formal)' },
      { russian: 'до свидания', translation: 'goodbye (formal)' },
    ],
  };

  const SERGEI = {
    id: 'sergei',
    name: 'Сергей',
    persona: 'Sergei is a junior officer, early 20s, slightly nervous, trying to be professional but sometimes slips into informal speech. He is sympathetic to the player and tries to help within the rules. He teaches the player about navigating bureaucracy and repeating information clearly. He uses a mix of formal and informal depending on whether his superior is watching.',
    tutorVocabulary: [
      { russian: 'подождите', translation: 'wait (formal)' },
      { russian: 'минутку', translation: 'just a moment' },
      { russian: 'сейчас', translation: 'right now' },
      { russian: 'потом', translation: 'later / then' },
      { russian: 'сначала', translation: 'first / at first' },
      { russian: 'заполните', translation: 'fill out (formal)' },
      { russian: 'напишите', translation: 'write (formal)' },
      { russian: 'повторите', translation: 'repeat (formal)' },
      { russian: 'понятно', translation: 'understood / clear' },
      { russian: 'не волнуйтесь', translation: 'don\'t worry' },
      { russian: 'всё будет хорошо', translation: 'everything will be fine' },
      { russian: 'документ', translation: 'document' },
      { russian: 'паспорт', translation: 'passport' },
      { russian: 'помощь', translation: 'help' },
    ],
  };

  return { ALINA, SERGEI };
})();
