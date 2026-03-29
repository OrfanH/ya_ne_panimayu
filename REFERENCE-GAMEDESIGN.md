# REFERENCE-GAMEDESIGN.md
*Deep research synthesis for Один Семестр. Every rule is actionable. Sources linked inline.*
*Generated: 2026-03-29*

---

## 1. Daily Loop Design

**The 14-minute day rule.** Stardew Valley's in-game day runs approximately 14 minutes of real time. This is short enough to feel like "one more" is reasonable, long enough to feel complete. For Один Семестр: each in-game day should have 2-4 meaningful things to do but never require more than 15-20 minutes of real time to exhaust them.

**Never let a day end with zero incomplete objectives.** Stardew's core hook is that something is always almost done — crops one day from harvest, an NPC one heart away from an event, a mission in progress. Design the loop so the player always leaves with a thread dangling. For Один Семестр: ensure at least one NPC is mid-relationship-arc, one vocabulary word was seen but not yet "used," and one location is partially explored at any session end.

**Vary completion time across objectives.** Some objectives resolve in seconds (greet an NPC); others take days (complete a multi-step mission). Mixing these timescales means there is always something to finish *and* something to start. Short tasks satisfy; long tasks create return pressure.

**The daily energy/time budget.** Stardew limits each day via an energy meter and a time clock — players cannot do everything. This scarcity makes choices feel meaningful. For Один Семестр: even without an explicit energy system, NPC visit limits (NPCs only talk substantively once per day) create the same effect. After one rich conversation, the NPC gives a short "see you tomorrow" response.

**Dual-resource progression.** Stardew uses money + materials as complementary gates. For Один Семестр: vocabulary knowledge + relationship depth are the two resources. Both must advance together to unlock new content. Knowing a word but having never spoken to the NPC does not unlock the next location; speaking to the NPC without using the vocabulary does not either.

---

## 2. Location Unlock Pacing

**Show the lock before the key.** The design principle from Zelda, validated by level design research: when a player encounters a gate, they must remember encountering it *before* they find what opens it — not the other way around. Show the player the train station in the distance before teaching them the words to buy a ticket. Show the police station's exterior during a walk before the mission that requires entering it.

**Soft gates, not hard walls.** Hard gates block completely and feel arbitrary. Soft gates let the player see through, feel the possibility, but make progress require something meaningful. For Один Семестр: the player can walk past the café from day one. The door is visible. They cannot interact with it until the story reason triggers — not "you don't have enough grammar points" but "the café is closed today; the owner mentions she opens at 9am, come back tomorrow."

**Lock the system, not the display.** Never hide a locked system's existence with a grey-out. If the player cannot yet enter the market, show the market with a "Closed until [story event]" NPC comment. This makes the gate feel like a real-world obstacle rather than an arbitrary game mechanic.

**Proximity principle.** Introduce the tool near where the player will use it. If buying tickets requires knowing numbers 10-100, the market — where numbers are used constantly — must precede the train station in the unlock sequence. Vocabulary and location unlock must be designed together, not separately.

**Gates must have story reasons, never grammar reasons.** "You need to learn the accusative case to enter" is a grammar reason and breaks diegesis. "Baba Zoya won't let strangers into the market until she recognises you" is a story reason. Both gatekeep the same thing; only one feels real.

---

## 3. NPC Relationship Arcs

**The heart event structure.** Stardew Valley's friendship system works because it stages reveals. Early interactions are surface-level (schedules, preferences). Later interactions unlock scripted "heart events" — private scenes that reveal character depth, backstory, and vulnerability. Each event changes the NPC's subsequent dialogue to reference what the player now knows. For Один Семестр: each NPC needs a minimum of 3 scripted depth moments, each unlocked by a different visit count threshold.

**NPCs must have lives that do not revolve around the player.** Stardew's NPCs have jobs, daily schedules, family complications, and aspirations completely independent of the player's needs. When an NPC is absent because of a festival or a personal schedule conflict, players feel the NPC is *real*. For Один Семестр: every NPC should have one mentioned life element the player never directly participates in — Baba Zoya arguing with her supplier, the café owner's sister visiting.

**Dialogue must change based on relationship state.** An NPC who has known the player for two weeks should not speak to them as if it is the first meeting. Track relationship state and use conditional dialogue: three tiers minimum (stranger, acquaintance, friend). Lines at each tier should reference shared history.

**Give players something to feel loss about.** Players return to NPCs when they worry about missing something. Stardew creates this via: seasonal events that only happen once per year, heart events that can be missed if the player isn't at a certain location at a certain time. For Один Семестр: some NPC dialogue variations are tied to real-world days ("it's Thursday — Masha always has her philosophy day"). These create return pressure without explicit notifications.

**Gifts and recognition.** Stardew's gift system is psychologically powerful because the NPC *responds differently* to different gifts. For Один Семестр: when the player correctly uses a vocabulary word the NPC taught them earlier, the NPC should explicitly recognise it — "Oh! You remembered what I said!" This creates a loop of investment.

---

## 4. Replayability in Linear Games

**Roguelikes do not port directly; their underlying mechanisms do.** Roguelike replayability comes from: procedural generation (remove — too random for language learning), high-stakes failure states (remove — too anxiety-inducing for language learning), frequent decision points with visible consequences (keep — design each NPC conversation as a meaningful branch), and daily variation (keep — essential).

**Daily variation minimum threshold.** Players return to completed locations when new content appears. Cozy Grove achieves this with daily procedural NPC tasks. Stardew achieves it with seasonal events and NPC schedule variation. For Один Семестр: each location needs minimum 3 variation triggers per NPC: (1) time-of-day variation, (2) weather variation, (3) relationship-tier progression. Without these, a "completed" location feels dead.

**Cross-location NPC references create return motivation.** When an NPC at the market mentions something happening at the café, players walk back to the café to check. Design deliberate NPC gossip chains. The park NPC mentions the train station. The station NPC mentions the market. These references are free return-visit motivation.

**Secrets visible from the start.** Place things in early locations that only make sense later — a locked door with a strange symbol, a poster referencing an event that hasn't happened yet. When players revisit the apartment building in chapter 3, they see the poster differently. This is the equivalent of Metroidvania back-tracking: the world is always reread.

---

## 5. Progression Without Gamification

**World-state change is more satisfying than points.** When the player helps the café owner, the café should look slightly different — a new poster, a changed greeting, a different menu special. Environmental change as progression feedback requires no UI numbers and feels diegetic. For Один Семестр: unlocking each location should visually change the world map (a lit window, an open door, a new NPC standing outside).

**Progress feels like a life being built, not a score being chased.** Stardew's progression is felt through the farm's transformation — empty land becomes thriving homestead. For Один Семестр: the student notebook (journal) is the equivalent. As the player encounters vocabulary, it fills the journal. As they complete missions, new pages appear. The journal is a physical artefact of their Russian life, not a trophy cabinet.

**Never show the player how much content remains.** Progress bars and percentage-complete counters make players feel the distance to the finish line rather than the journey. The journal should feel like a discovery log, not a checklist. Add entries as they are found, never show "7/40 words collected."

**Flow state over challenge-and-reward cycles.** Stardew's design produces flow — defined as clear goals + immediate feedback + matched challenge level. Language games break flow when they pivot suddenly to explicit tests. The test should feel like a conversation, not an examination. Correction within conversation maintains flow; stopping play to evaluate breaks it.

---

## 6. Language Acquisition in Games

**Krashen's i+1: calibrate input precisely.** Comprehensible input theory states learners acquire language when exposed to input slightly beyond their current level — comprehensible but not trivial. The target is understanding 70-90% of what is heard/read. For Один Семестр: at A1 locations, every NPC line must be comprehensible from context without requiring translation. At A2 locations, one element per exchange should be new. Never introduce more than one unknown structure per scene.

**Context clues replace explicit translation.** When an NPC says "Хлеб" while holding bread, the player acquires the word without a vocabulary card. Design each vocabulary introduction with a visual or contextual anchor. The translation shown below the dialogue is a safety net, not the primary learning mechanism.

**The affective filter: anxiety kills acquisition.** Krashen's Affective Filter Hypothesis states that negative emotions (embarrassment, fear of failure) directly block language acquisition at a neurological level. For Один Семестр: this means no red X on wrong answers, no health loss, no "you lost" screens. The NPC's confused reaction is playful, not punitive. The player can fail gracefully and the conversation continues.

**Incidental learning outperforms intentional drill in retention.** Multiple Cambridge Core studies confirm that vocabulary learned incidentally (through engagement with content) is retained comparably to intentional learning, and players who *use* new L2 words retain them significantly better than those who only encounter them. Design missions that require vocabulary use, not just recognition.

**Spaced repetition through story, not through flashcards.** The game's design principle that "every word introduced in location N is reinforced in location N+1" is exactly correct per SLA research. Words must reappear in new contexts with a 3-7 day spacing for retention. The story provides the spacing naturally.

**Production beats reception.** Studies show learners who use new words (speaking or typing) retain them better than those who only see them. Design at least one "active production" moment per vocabulary word — the player must say or type the word, not just click through NPC dialogue that uses it.

---

## 7. Anti-Patterns to Avoid

**The Duolingo drill trap.** Duolingo's design is rooted in behaviourist habit-formation — mechanical, decontextualised repetition. Research critique identifies: (1) production elicited without concern for context or meaning, (2) inability to promote real-world communicative competence, (3) reliance on outdated Grammar-Translation and Audiolingual approaches. Specifically, Duolingo teaches words as isolated symbols rather than embedded in meaning-making contexts. Do not build vocabulary exercises outside of narrative context.

**The red flash.** Duolingo's visual punishment (red screen flash, loss of hearts) activates the affective filter and creates anxiety. Research shows immediate implicit correction (recast — the NPC simply models the correct form in their response) is as effective as explicit correction without the emotional punishment. Never show red, never subtract from a count, never say "wrong."

**The progress percentage.** Showing "lesson 4 of 12" makes players feel the remaining distance rather than the journey covered. Progress systems that show how much is left create obligation rather than curiosity.

**The gamification tic.** Streaks punish absence rather than reward presence. Leaderboards create competitive anxiety that activates affective filters. Daily notifications that frame non-play as failure are hostile to language acquisition. Points without narrative meaning are empty. None of these belong in Один Семестр.

**Patronising simplification.** Writing Russian that sounds like a textbook ("Привет! Меня зовут Анна. Я живу здесь.") makes players feel they are in a classroom, not a town. Native speakers do not introduce themselves with perfect grammar-exercise sentences. Simplify vocabulary, not register. Use natural contractions, interruptions, and colloquialisms even at A1 level.

---

## Sources

- [Road to the IGF: ConcernedApe's Stardew Valley](https://www.gamedeveloper.com/design/road-to-the-igf-concernedape-s-i-stardew-valley-i-)
- [Stardew Valley: Player Engagement Done Right](https://medium.com/@shakeebzacky/stardew-valley-player-engagement-done-right-7d25f9dc00e9)
- [Stardew Valley: Farm Living is the Life for Me — Game Wisdom](https://game-wisdom.com/analysis/stardew-valley)
- [Stardew Valley Friendship System](https://stardewvalleywiki.com/Friendship)
- [Examining Gating in Game Design](https://www.gamedeveloper.com/design/examining-gating-in-game-design)
- [Pacing — The Level Design Book](https://book.leveldesignbook.com/process/preproduction/pacing)
- [Factors affecting incidental L2 vocabulary acquisition — ReCALL, Cambridge Core](https://www.cambridge.org/core/journals/recall/article/factors-affecting-incidental-l2-vocabulary-acquisition-and-retention-in-a-gameenhanced-learning-environment/429D5D5AF1E567164C49C70CE3DB05DC)
- [What is Comprehensible Input? Krashen's Theory](https://www.leonardoenglish.com/blog/comprehensible-input)
- [Beyond comprehensible input: neuro-ecological critique — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12577063/)
- [Learning Languages with Duolingo: Myth or Reality? — ResearchGate](https://www.researchgate.net/publication/392910362_LEARNING_LANGUAGES_WITH_DUOLINGO_MYTH_OR_REALITY)
- [Optimal timing of CF in SLA — Frontiers in Psychology / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9995700/)
- [Roguelikes and Replayability in Mystery Games](https://mysterygamedev.substack.com/p/roguelikes-and-replayability-in-mystery-games)
