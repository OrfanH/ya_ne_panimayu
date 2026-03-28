PASS

# Content Spec — Galina Ivanovna, Apartment NPC
## TASK-014 | Location 1 | content-writer output

---

### Opening Beat (First Visit)

Scene: Player knocks on door 3. Galina opens, holding watering can. She looks the player over and says this is apartment 3, not wherever they were headed. She asks which apartment they are looking for.

Player choices:
- A. Say a number (any number 1–10) — she nods, points up or down, tells them the floor and apartment number for that unit.
- B. Say nothing / "I don't understand" — she repeats the apartment numbers slowly, gesturing at her door (квартира, этаж).
- C. Attempt a greeting — she warms slightly, responds in kind, then still redirects.

Vocabulary introduced: квартира, этаж, дверь, numbers 1–10.

---

### Visit Variation 1: Wrong Door, Redirect
Trigger: First ever visit (flag: galina_met = false).
Flow: Player knocks. Galina opens. She establishes this is apt 3. She teaches floor number for apt 3 (первый этаж). She redirects player to the correct apartment number. She closes by repeating the number clearly.
Vocabulary: квартира, этаж, numbers 1–10.

---

### Visit Variation 2: Self-Introduction Exchange
Trigger: Second visit, or player chooses to introduce themselves in variation 1.
Flow: Galina asks the player's name (gestures expectantly). Player must produce "меня зовут [name]." She repeats it back with a nod (correction mechanic). She then says her own name and apartment number.
Player choices:
- A. Produce full intro — she approves, moves conversation forward.
- B. Only say name without structure — she models the full phrase and waits.
- C. Say "я не понимаю" — she slows down, breaks it into two parts.
Vocabulary: меня зовут, я студент/студентка, я из.

---

### Visit Variation 3: Origin Question
Trigger: After name exchange.
Flow: Galina asks where the player is from ("я из... откуда?"). Player selects or inputs a place. She reacts with mild opinion (she knows someone from there, or she's never heard of it). She models the structure back.
Player choices:
- A. Answer with "я из [place]" — full approval.
- B. Just say the place name alone — she models full sentence, repeats it.
- C. "я не понимаю" — she mimes pointing outward, repeats the phrase fragment.
Vocabulary: я из, я студент/студентка.

---

### Visit Variation 4: Tea and Politeness Drill
Trigger: Any visit after variation 2, or player lingers at door.
Flow: Galina offers tea. Player must respond with да/нет + пожалуйста or спасибо. If player says нет without спасибо she raises an eyebrow (soft fail). If player says да she models "да, пожалуйста." Inside, she mentions the building rule: no noise after 10pm (десять часов).
Player choices:
- A. "да, пожалуйста" — she looks pleased.
- B. "нет, спасибо" — she accepts gracefully.
- C. Just "да" or "нет" alone — she models the polite form and waits.
Vocabulary: да, нет, пожалуйста, спасибо, numbers (10 for the time rule).

---

### Visit Variation 5: Intercom Code
Trigger: Player has been inside building at least once; random or after failed intercom attempt.
Flow: Galina explains the intercom uses apartment numbers. She runs through the sequence for her apartment and the player's. Uses numbers 1–10 explicitly. Tests player by asking what number to press for her apartment.
Player choices:
- A. Say correct number — she nods and repeats.
- B. Say wrong number — she corrects without judgment, repeats.
- C. "я не понимаю" — she draws a small diagram in the air, repeats numbers.
Vocabulary: numbers 1–10, квартира, этаж.

---

### Visit Variation 6: Mailbox Numbers
Trigger: Player near mailboxes or random morning visit.
Flow: Galina is checking her mail. She points out each box by number, asking the player to identify theirs. She explains that "квартира" and mailbox number match.
Player choices:
- A. Point to correct box and say the number — approval.
- B. Hesitate or say wrong number — she models the correct one.
- C. "я не понимаю" — she runs her finger along the numbers slowly.
Vocabulary: numbers 1–10, квартира.

---

### Visit Variation 7: Spare Key Scene
Trigger: Story flag: player has lost access / key event triggered.
Flow: Galina produces key ring. She is warm but serious. She hands over a spare ключ with a firm statement that she will not replace it if lost. Player must acknowledge with "спасибо" and "да" (confirming they understand).
Player choices:
- A. "спасибо" + "да, я понимаю" — she nods and releases the key.
- B. Just "спасибо" — she repeats the condition, waits for да.
- C. "нет" — she pulls the key back briefly, gives a questioning look, then re-offers (assumed misunderstanding).
Vocabulary: ключ, дверь, да, нет, спасибо.

---

### Visit Variation 8: Return Check-In (Did You Eat?)
Trigger: Player returns to floor after extended absence (time-of-day: evening).
Flow: Galina spots player in hall. She asks if they ate today, offering fruit or mentioning soup. No food transaction required — purely social + yes/no drill.
Player choices:
- A. "да, спасибо" — she looks satisfied.
- B. "нет" — she disapproves mildly, makes a remark about students not eating.
- C. "я не понимаю" — she mimes eating, repeats the question.
Vocabulary: да, нет, спасибо, я не понимаю.

---

### Visit Variation 9: Jam Delivery Mission
Trigger: Mission flag jam_mission_active.
Flow: Galina hands player a jar of jam. She explains it goes to apartment 7 (семь). She says the neighbor's name. Player must repeat the apartment number back. On delivery, NPC in apt 7 expects a greeting and the player to state who sent them.
Player choices:
- A. Repeat "квартира семь" — she confirms and unlocks mission step.
- B. Say wrong number — she corrects and waits.
- C. "я не понимаю" — she holds up seven fingers.
Vocabulary: numbers (7), квартира, привет, здравствуйте.

---

### Visit Variation 10: Dmitry Petrovich's Music
Trigger: Music noise event active OR random after 10pm.
Flow: Galina is annoyed. She asks the player if they hear the music from upstairs. She names Dmitry Petrovich. She rehearses a complaint with the player — drilling formal greeting (здравствуйте) and the phrase for "I don't understand why..." as a scaffold. Player chooses how to greet Dmitry when the moment comes.
Player choices:
- A. Practice "здравствуйте" — she coaches delivery.
- B. Suggest "привет" — she corrects: too casual for a complaint.
- C. "я не понимаю" — she simplifies to just the greeting drill.
Vocabulary: здравствуйте, привет, до свидания, извините.

---

### Unlock Sequence

Trigger condition: Player has completed variation 1 (redirect) and variation 2 (self-intro).

What player must produce (in any single exchange):
1. Correct time-of-day greeting — привет (casual, daytime) OR здравствуйте (formal) OR добрый день (daytime formal).
2. Self-introduction — "меня зовут [name]."
3. Floor or apartment number stated — any correct number for their unit (этаж or квартира + number).

Success path: All three elements present in one exchange (order flexible). Galina nods, says the player is learning well, and the apartment floor unlocks fully. Flag: galina_unlock = true.

Failure paths:
- Missing greeting — she models the greeting and re-prompts.
- Missing name — she points to herself, says her name, waits.
- Missing number — she points at the floor, says the floor number, waits.
- All three missing (silence / я не понимаю) — she runs the full scaffold once slowly, then the exchange resets for next visit.

Partial credit: Two of three elements present triggers a near-success response from Galina — she identifies the missing element only and waits one more beat before resetting.
