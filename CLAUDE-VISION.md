# CLAUDE-VISION.md — Game vision and design principles

Read this file when you write content, dialogue, missions, or design UI.

---

## Premise

You play a foreign student who just arrived in a small Russian town for a semester abroad.
You know almost no Russian. You need to survive daily life — find your apartment, order coffee,
go to the market, get to the train station. The town is the classroom but it never feels like one.

The learning goal is A1 to A2 Russian. The world map IS the curriculum.
Every unlock has a story reason, not a grammar reason.

## World style

Top-down pixel art. Warm, bright, slightly lived-in. Stardew Valley as the visual reference.
Free exploration — the player walks around the map. No level select, no menu-driven lessons.
Sunny and inviting. Not sterile, not dark, not cartoon-flat.

## The 6 locations

| Order | Location | Russian level | Content |
|---|---|---|---|
| 1 | Apartment building | A1 pure | Greetings, introductions, numbers 1-10 |
| 2 | Park | A1 consolidating | Descriptions, simple present, yes/no questions |
| 3 | Cafe | A1+ | Ordering, polite requests, prices, basic accusative (unlabelled) |
| 4 | Market | A1+ | Objects, quantities, colours, numbers 10-100 |
| 5 | Train station | A2 emerging | Time, directions, tickets, future tense |
| 6 | Police station | A2 | Formal register, past tense, case awareness |

Every word introduced in location N is reinforced in location N+1.

## Location depth rule

Every location must have minimum 8 distinct reasons to visit across the full game.
Return dialogue, daily variations, cross-location NPC references, and casual conversation all count.
No location should feel exhausted after one session.

## Unlock gates

Unlocking the next location requires ALL of:
- Story-relevant missions complete
- Minimum visit count met
- Vocabulary actually used, not just seen

## NPC system

- 1-2 named NPCs per location with fixed pixel portraits
- First visit: NPC enters tutor mode — teaches vocabulary naturally
- Subsequent visits: missions or story continuation
- NPCs remember the player — dialogue reflects relationship history

## Dialogue style

Visual novel style — pixel portrait, speech bubble, response options.
Hybrid: scripted story beats + Gemini fills conversation in between.
NPC speaks Russian. English translation shown smaller below. Never hidden.
Player responds by choosing options or typing Russian.

## Mistake handling

NPC reacts in character (confused), one-line correction, conversation continues.
Mistakes logged silently to KV. Returned later as targeted missions from existing NPCs.
After 3 mistakes on same grammar point: targeted mission appears with story reason.

## Mission system

3-5 missions per location. Types: conversation, fetch, delivery, translation.
Active mission shown in HUD — minimal, never intrusive.

## Chapter and test structure

4 chapters, each covering 1-2 locations.
Chapter test room = professor's apartment, unlocks after each chapter.
Pass 70%+: next chapter unlocks. Fail: targeted practice missions appear.

## Progress tracking

- Unlocked locations on the map + in-game journal (student notebook style)
- Vocabulary, phrases, mission history, chapter progress in journal
- New words added automatically on first encounter
- No points. No streaks. No hearts. No leaderboard.
- Progress feels like a life being built, not a score being chased.

## What this is NOT

- Not a flashcard app with a pixel art skin
- Not Duolingo with a map
- Not a lesson viewer with a character sprite
- Not a game where the Russian is optional or skippable
