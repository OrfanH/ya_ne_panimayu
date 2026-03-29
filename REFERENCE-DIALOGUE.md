# REFERENCE-DIALOGUE.md
*Deep research synthesis for Один Семестр. Every rule is actionable. Sources linked inline.*
*Generated: 2026-03-29*

---

## 1. NPC Voice and Consistency

**Write a voice brief before writing any NPC lines.** For every named NPC, write a 3-sentence voice brief and paste it at the top of every dialogue session for that character. The brief must include:
1. One verbal tic or phrase structure they always use (e.g., Masha ends questions with "правда?" / "right?"; the policeman never uses contractions)
2. One topic they always return to, unprompted (e.g., Baba Zoya redirects everything to her late husband's recipes)
3. One thing they never say — a register, topic, or vocabulary level that is off-limits (e.g., the café owner never complains; the policeman never laughs)

**Character consistency across sessions: three tests.** Before committing any new NPC dialogue:
1. Could you identify the NPC from the line alone, without the name tag? If not, the voice is not distinct enough.
2. Does the line reference something from the character's established backstory? If the NPC has mentioned their nephew twice, subsequent lines can assume the player knows this.
3. Does the line contradict any established fact about this character? (Cross-reference the WORLD-location-X.md and STORY-location-X.md files.)

**Vocabulary and register match social status.** The café owner uses warm, informal Russian with food-related metaphors. The policeman uses formal register, longer sentences, correct case endings even when casual speech would drop them. Baba Zoya uses diminutives (-очка, -ушка endings) constantly. These distinctions make social context teachable without labelling it.

**Characters must have lives the player does not participate in.** Every NPC should mention at least one recurring element of their life that the player never directly helps with — the café owner's sister, the market vendor's ongoing dispute with the city council, the park regular's book club. These details make NPCs feel real, not assistant-bots. Reference these details in 2-3 dialogue variations per NPC per location.

**Track relationship state explicitly.** Three dialogue tiers minimum:
- **Stranger:** NPC is polite but guarded. Uses "вы" (formal you). Names the player by nothing or "молодой человек/девушка" (young man/woman).
- **Acquaintance:** NPC switches to "ты" (informal you). Uses the player's name. References one shared interaction.
- **Friend:** NPC asks questions about the player's life. References multiple past interactions. Initiates small talk rather than waiting to be greeted.

Dialogue files must tag which tier each line belongs to. The system renders only lines appropriate to the current relationship state.

---

## 2. Dialogue Tree Architecture

**Aesthetic over instrumental.** Disco Elysium's design principle: dialogue branches should exist because they are "particular, strange, and true-to-character," not primarily to advance plot. Every branch in Один Семестр should feel like a real conversation option, not a multiple-choice test. The player should want to choose differently on a replay — not because they made a "wrong" choice but because they want to experience another facet of the NPC.

**All options must feel like the player's authentic voice.** Night in the Woods proves this: when every dialogue choice "feels possible and in line with [the character]'s personality," players feel ownership over the conversation. Never include a "wrong" or sarcastic option just to have contrast. Three options that all feel reasonable but lead to slightly different responses are better than one clearly correct option and two decoys.

**Micro-reactivity: remember trivial choices.** Disco Elysium has "probably thousands" of moments where the game responds to decisions the player has long forgotten making. For Один Семестр: when the player mentioned liking tea at the café, the market vendor later says "I saw Lena told you to try the black tea — I have the supplier she uses." These callbacks cost one conditional check and create disproportionate feelings of being seen.

**Failure states advance, they do not punish.** Disco Elysium's failed speech checks produce different outcomes, not dead ends. For Один Семестр: when the player makes a Russian grammar error, the NPC does not refuse to continue — they respond in a way that naturally models the correct form ("Wait — you want two? *Два*, not *два-х* here") and the conversation continues. A failed attempt at a mission gives a different NPC reaction, not a game over.

**Short lines, fast turns.** Disco Elysium's dialogue uses "text blurbs highly inspired by Twitter" — short, punchy exchanges that keep players clicking. Each NPC turn should be a maximum of 2-3 sentences. Players stop reading after the third sentence in a dialogue box. Break longer explanations into 2-3 sequential beats with a player "continue" prompt between them.

**Never explain what the player just experienced.** After a successful mission, the NPC should not summarize what happened ("Great, you got the bread from the market!"). Assume the player experienced it. The NPC's response should be emotional or relational, not a recap. "Наконец-то!" (Finally!) says more and requires the player to recall the context themselves.

---

## 3. Russian as a Diegetic Mechanic

**Comprehensible input at i+1.** The player should understand 70-90% of every NPC exchange without reading the translation. The remaining 10-30% is the learning content. Calibrate this precisely:
- At A1 locations: every NPC line contains only words already encountered. New words appear with immediate visual or gestural context (NPC holds up a key when saying "ключ").
- At A1+ locations: one new word or phrase per exchange, always with context. Never two new structures in the same beat.
- At A2 locations: one new grammatical structure per scene (not per exchange), while all vocabulary is familiar.

**Context clues replace translation.** The English translation shown below Russian dialogue is a safety net, not the primary channel. Every new Russian word should be decodable from context before the player reads the translation. Design each vocabulary introduction scene with: (1) a visual anchor (the NPC holds the item, points at the location, or makes a gesture), (2) a functional anchor (the NPC's action makes the word's meaning obvious from what happens next).

**Do not label grammar.** Never say "Now we'll practice the accusative case." Never name a grammatical structure. The NPC simply uses it naturally. If a pattern needs emphasis, the NPC uses it in two consecutive sentences with different vocabulary — the repetition registers without annotation.

**Natural Russian sounds different from textbook Russian.** Differences to preserve even at A1:
- Contractions in speech: "что ли" not just "или"; "нет" dropped mid-sentence
- Diminutives: Russians use them constantly in casual speech ("Саша" not "Александр," "чашечка" not "чашка")
- Sentence-final particles: "ведь," "же," "-то" add flavour without requiring comprehension — they can be A2+ items that are heard before they are understood
- Incomplete sentences: real speech interrupts itself. "Ну, я думала..." (Well, I thought...) followed by a shrug is more real than a completed sentence.

**Register as curriculum.** The progression from café (informal) to police station (formal) is itself a lesson in register. The player experiences "ты" → "вы" as a social fact before understanding it grammatically. Design register shift as a felt experience: the police station NPC's tone is noticeably cooler and more careful, creating a visceral sense that different contexts require different language.

**Code-switching: NPCs can slip into English for single words.** When a real Russian speaker talks to a foreigner, they sometimes supply the English equivalent for a key word when they sense incomprehension. Model this: "Вам нужен... билет? Ticket?" This is natural, humanising, and gives the player an immediate comprehension hook. Use sparingly — once per scene maximum.

---

## 4. Mistake Handling

**Recast, do not correct.** The most effective and least anxiety-inducing correction technique in SLA research is the "recast" — the teacher/NPC simply repeats the learner's intent using the correct form, naturally embedded in their response. Player says "Я хочу кофе горячий" (word order error). NPC responds: "Горячий кофе? Конечно!" The correct form appears without any meta-commentary. The player hears the correction in the NPC's natural speech.

**Never stop the conversation to correct.** Explicit correction ("That's wrong. Say it like this:") is more memorable but also more anxiety-inducing. Research shows immediate implicit correction (recast) is equally effective for acquisition without the affective filter cost. For Один Семестр: correction is always embedded in the NPC's continuing dialogue — never a pause, never a modal, never a separate correction state.

**Three-strike pattern for persistent errors.** The mistake logging system should count pattern errors silently. After three errors on the same structure: a targeted mission appears from an existing NPC, with a story reason. "Masha noticed you're having trouble with numbers — she wants to practise counting at the market." The mission is the intervention, not a correction in the moment.

**Confused NPC reaction is playful, not punitive.** The NPC's in-character confusion at a garbled Russian sentence should feel warm: "Hmm? I'm not sure I understand..." with a puzzled sprite — not a cold "That's incorrect." The player should feel mild embarrassment, not shame. The difference is the NPC's body language (confused smile vs stern face) and the speed of recovery (the conversation moves on immediately).

**Immediate correction for grammar, relaxed timing for vocabulary.** SLA research distinguishes: for grammar errors, immediate recast is most effective (in-context, same conversation turn). For vocabulary errors (wrong word choice), allowing the conversation to continue and reintroducing the word in the next NPC line may be more natural and less disrupting. Apply accordingly: grammar recast immediately; vocabulary correction in the next NPC beat.

---

## 5. What Makes Dialogue Memorable

**Short lines with maximum subtext.** Undertale demonstrates this: a line that is trivial in isolation becomes devastating in context. "It's a beautiful day outside. Birds are singing, flowers are blooming... on days like these, kids like you... should be burning in hell." The contrast between register and content is the technique. For Один Семестр: the policeman's flat bureaucratic "Следующий" (Next) becomes funny, menacing, or sad depending on everything the player has experienced before hearing it.

**Visual presentation carries emotion.** Night in the Woods uses text size changes, shaking text, and variable timing to carry emotional weight. For Один Семестр: while the dialogue system uses HTML, not custom text rendering, use: (1) ellipses (...) to create pauses and hesitation, (2) ALL CAPS for emphasis or shouting (one word maximum, rarely), (3) sentence fragments to simulate trailing off. These cost nothing technically.

**The principle of contrast.** Dialogue that stays at one register (always cheerful, always formal, always terse) becomes invisible — players click through without reading. Vary: an NPC who is usually warm suddenly goes quiet; an NPC who is usually businesslike makes an unexpected joke. Contrast makes the next line salient.

**End on curiosity, not resolution.** The line a player is left thinking about after closing dialogue is the one that raised a question, not the one that answered it. "Странно, что твоя квартира именно там" (Strange that your apartment is right there) from a stranger in the park — no follow-up, just a hint that something is known. This creates voluntary return.

**Smile lines require surprise.** A joke telegraphed two beats in advance is not funny by the time it lands. The joke must arrive before the player expects it — often in the straight-faced delivery of something absurd: "The weather is good today." *(pause)* "Unusual for me to say this. I usually hate everything." Deadpan works in any language.

---

## 6. Writing Russian for Near-Beginners

**Simple vocabulary, complex meaning.** The constraint is vocabulary, not thought. An A1-level speaker can still express uncertainty, irony, regret, and warmth with simple words. "Я не знаю" (I don't know) said with the right ellipsis and character beat expresses far more than its literal meaning. Do not write NPCs as intellectually simple because their vocabulary is simple.

**Sentence structures that are both natural and parseable:**
- Short declarative sentences: "Это рынок. Здесь всё есть." (This is the market. Everything's here.)
- Subject + verb + object in standard order (SVO works in Russian and is comprehensible)
- Avoid embedded clauses at A1: "Я думаю, что..." (I think that...) is A1+; keep to "Я думаю: нет." at A1
- Questions via intonation rather than inversion: "Ты хочешь кофе?" is more natural than restructured forms

**Diminutives are free complexity.** Using "кофеёк" instead of "кофе" or "Лёшенька" instead of "Алёша" adds warmth and naturalness without increasing comprehension difficulty. Teach diminutives as flavour — the player hears them as affection before they understand the morphological rule.

**Include words the player cannot yet fully parse.** Real comprehensible input includes unknown words that can be decoded from context. An A1 scene can include one A1+ word per exchange — the NPC's gesture or action makes the meaning clear. The player picks it up incidentally. This is exactly i+1 in practice.

**What to simplify vs what to preserve:**
- Simplify: sentence length, embedded clauses, rare vocabulary, complex verb aspects
- Preserve: natural word order (Russian is flexible but has natural patterns), appropriate register for social context, diminutives and particles (even if not yet understood), emotional authenticity
- Never simplify: the NPC's personality, their social intelligence, their ability to have opinions

**Test every Russian line against this question:** "Would a real Russian speaker say this to a foreigner they were trying to be kind to?" If the answer is "they'd probably use more words" or "they'd be more formal" — adjust. If the answer is "yes, this sounds natural" — ship it.

**The translation line is for safety, not teaching.** The English translation shown below Russian dialogue prevents frustration but should not be the primary comprehension path. Write the Russian first, verify it is decodable from context, then write the translation. If the translation is the only way to understand the Russian, the scene design has failed — redesign the context, not the language.

---

## 7. Anti-Patterns to Avoid

**The branching quiz.** Dialogue trees that have one correct answer (clearly the "nice" or "smart" choice) and two obviously wrong decoys are not conversations — they are multiple-choice tests with a pixel art skin. All options must feel like something the player's character might genuinely say. Remove any option that exists only to demonstrate what *not* to say.

**The dialogue-as-tutorial moment.** "Welcome! I will now teach you how to say goodbye in Russian." NPCs are not teachers — they are residents of a town who happen to use Russian. The learning is incidental. If a scene feels like a lesson, it needs a story reason layered over it. Masha does not "teach greetings" — she introduces herself because she is curious about the new foreign student, and greetings are what you say when meeting someone.

**The recap line.** "Great, you completed the mission! You learned how to order coffee!" Never write recap lines. The player experienced the mission. Trust them.

**The over-explained emotion.** "He said it sadly" or "She looked uncomfortable." Emotion should be visible in the words and the sprite, not described in stage directions appended to dialogue. If the emotion is not legible from the words and the sprite, fix the words or sprite — do not add an annotation.

**The monologue NPC.** An NPC who speaks for more than 3 sentences without the player having an option to respond is delivering a lecture, not having a conversation. Break any NPC speech longer than 2-3 sentences with a player "continue" prompt or a player response option. The player must feel like a participant in the exchange.

**Consistency breaks.** An NPC who was established as formal suddenly using slang, or an NPC who was warm suddenly cold, with no in-story reason, destroys the player's model of that character. Once an NPC voice is established in the voice brief and verified by the linguist, all subsequent writers must read the brief before adding lines.

---

## Sources

- [GDC Vault: Disco Elysium — Meaningless Choices and Impractical Advice](https://gdcvault.com/play/1027160/-Disco-Elysium-Meaningless-Choices)
- [Understanding the Meaningless, Micro-Reactive Writing of Disco Elysium — Gamedeveloper.com](https://www.gamedeveloper.com/business/understanding-the-meaningless-micro-reactive-and-marvellous-writing-of-i-disco-elysium-i-)
- [Disco Elysium: An Analysis of Dialogue — Genc Guimond](https://gencguimond.com/blog/f/disco-elysium---an-analysis-of-dialogue)
- [Night in the Woods and Writing Better Dialogue — Decisions and Revisions](https://decisionsandrevisions.substack.com/p/night-in-the-woods-writing-better-dialogue)
- [Comprehensible Input and Krashen's Theory — Leonard English](https://www.leonardoenglish.com/blog/comprehensible-input)
- [Principles and Practice in Second Language Acquisition — Stephen Krashen](https://www.sdkrashen.com/content/books/principles_and_practice.pdf)
- [Optimal Timing of Corrective Feedback — Frontiers in Psychology / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9995700/)
- [How Effective is Second Language Incidental Vocabulary Learning? — Cambridge Core](https://www.cambridge.org/core/journals/language-teaching/article/how-effective-is-second-language-incidental-vocabulary-learning-a-metaanalysis/E38E3468FD2090B1FA3051051DE8E70C)
- [The Immersive Experience of Video Game Language Learning — United Language Group](https://www.unitedlanguagegroup.com/learn/immersive-experience-video-game-language-learning)
- [CEFR Russian A1-A2 Grid](https://languages-cultures.uq.edu.au/files/16508/CEFR%20mapping_Russian%20for%20web(1).pdf)
