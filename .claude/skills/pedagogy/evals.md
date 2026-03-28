# Evals for pedagogy

## Eval 1: Vocabulary follows location sequence
**Input:** NPC dialogue in Cafe introduces the word "билет" (ticket) which belongs to Station (A2).
**Expected:** Skill flags this as a violation — "билет" should not appear before Station location.
**Checks:** Rule "A1-to-A2 sequence maps to location unlock order" is applied. Cafe = A1+, ticket vocabulary belongs to Station = A2.

## Eval 2: New word shown before production required
**Input:** Mission in Park asks player to type "привет" but it has never appeared in NPC dialogue.
**Expected:** Skill flags this — player must encounter the word in NPC speech before being asked to produce it.
**Checks:** Rule "Receptive before productive" catches the missing prior exposure.

## Eval 3: Anti-pattern — grammar rule table in dialogue
**Input:** NPC says "Now let me explain the accusative case. Masculine nouns change their ending from -а to -у when..."
**Expected:** Skill flags this as anti-pattern — grammar must be encountered through doing, not explanation.
**Checks:** Anti-pattern "Grammar before context" is detected. NPC should model accusative naturally instead.

## Eval 4: Spaced repetition across locations
**Input:** Word "здравствуйте" introduced in Apartment, never appears again in Park or Cafe dialogue.
**Expected:** Skill flags this — every word from location N must reappear in location N+1.
**Checks:** Rule "every word introduced in location N must appear again naturally in location N+1" is applied.

## Eval 5: One new difficulty at a time
**Input:** Dialogue introduces both a new case ending AND 3 new vocabulary words in the same exchange.
**Expected:** Skill flags this — if introducing new grammar, use familiar vocabulary (or vice versa).
**Checks:** Rule "One new difficulty at a time" catches the double-load.
