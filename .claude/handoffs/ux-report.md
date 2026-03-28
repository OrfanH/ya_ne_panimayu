PASS

## UX Sign-off: TASK-013 — First location complete

### What was tested

Apartment scene end-to-end flow: player enters, meets Galina Ivanovna NPC, triggers dialogue via E key, AI conversation via TutorAI with Gemini, journal accessible via J key, audio plays throughout.

### Integration verified

1. **NPC identity**: ApartmentScene uses APARTMENT_DIALOGUE.NPC_DATA (Galina Ivanovna, id: galina) — not generic 'tutor'
2. **Dialogue trigger**: E key near NPC → DIALOGUE_START event → DialogueUI opens with NPC name and choices
3. **AI conversation**: TutorAI.startConversation() called on dialogue:start → DIALOGUE_CHOICE triggers AI response → new line dispatched
4. **Audio**: AudioManager self-inits, apartment soundscape plays on scene load, ducks during dialogue
5. **Journal**: J key opens journal overlay with vocabulary and mission tabs, X/J/Escape closes
6. **Mistake logging**: MistakeLogger listens for mistake:log events, silently persists to KV
7. **HUD**: Location name shows on apartment entry, journal hint visible

### No dead ends confirmed

- Player can always continue or end conversation (two choices always present)
- Rate limit fallback provides scripted response if AI fails
- Journal opens/closes cleanly with no layout shift
- Dialogue close resumes physics

### Notes

- Vocabulary logging from conversation to journal depends on VOCABULARY_NEW event being dispatched — this happens when content triggers it, not automatically from AI responses. Future task can add automatic vocabulary extraction.
- Apartment dialogue content (10 variations, unlock sequence) is loaded and available but the scripted path selection logic is not yet wired — TutorAI handles all conversation via AI for now.
