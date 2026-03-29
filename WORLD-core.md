# WORLD.md — Один Семестр: World Specification

## The town of Малинов (Malinov)

Malinov is not special. That is its defining quality.

It is not ugly. It is not charming in a postcard way. It is lived-in — which means it has grocery kiosks next to century-old wooden houses, a fountain in the park that works in summer and is turned off in October, a market that has been in the same location since the Soviet era, a cafe that has not updated its menu since 2011, and a train station that connects Malinov to the rest of Russia in a way that mostly benefits people who want to leave.

Population: approximately 18,000.
University: yes, small, mostly engineering and economics.
Industry: light manufacturing, some agriculture, the train line.
Notable feature: nothing. That is the point.

The player will, by the end of the semester, find this town beautiful. Not because it became beautiful. Because they learned to see it.

---

## Visual and atmospheric principles

**Time of year:** Late August through December. The game begins in late summer warmth and moves toward the first real Russian winter. The light changes. The trees change. The pace of the town changes.

**Color palette:** Warm base with lived-in saturation. Amber and ochre for autumn. Soft greys and muted blues for late autumn. Never grimy. Never dark for darkness's sake. The contrast between the warmth of indoor spaces and the cooling outdoor world is part of the world's character.

**Ambient detail:** Each location has background characters — people who pass through, sit at tables, browse stalls, wait for trains. They do not speak. They are not interactive. But they make the world feel populated without adding cognitive load.

**Day/night cycle:** The game runs on a soft time-of-day system. Morning, afternoon, early evening. Not real-time. Time advances through player actions and missions. NPCs have different energy and dialogue at different times of day (documented per-NPC in STORY.md).

---


## Cross-location NPC reference map

This map documents which NPCs reference each other, creating a connected social world.

| NPC (Location) | References |
|---|---|
| Galina Ivanovna (Apt) | Artyom (park), Fatima (market), Lena (cafe, with skepticism) |
| Styopan (Apt) | Artyom (park), Lena (cafe), train station (abstract) |
| Artyom (Park) | Galina Ivanovna (fed him as a child), Fatima (trust her), Lena (charges him half), Konstantin (watches trains), Misha (same-age peer) |
| Tamara Andreyevna (Park) | Galina Ivanovna ("good heart, strong opinions"), Artyom's mother |
| Lena (Cafe) | Artyom (half-price tea), Galina Ivanovna (always to go), Fatima (cardamom supplier), Konstantin (oat milk latte) |
| Boris Gennadyevich (Cafe) | Tamara Andreyevna (park), Konstantin ("three days behind but reliable") |
| Fatima (Market) | Galina Ivanovna (Tuesday bread), Artyom ("that boy sent you"), Lena (cardamom), Konstantin (the carrot story) |
| Misha (Market) | Artyom (same-age, running joke), Fatima ("always watching me") |
| Konstantin (Station) | Galina Ivanovna (pie when ill), Boris Gennadyevich (reliable), Artyom (platform watching), Fatima (carrots) |
| Nadya (Station) | Artyom (watching trains), Lena (cafe on days off), Alina (lost item visit) |
| Viktor (Police) | Galina Ivanovna (noise complaints), Konstantin (arrival coordination) |
| Alina (Police) | Galina Ivanovna (biscuits), Nadya (lost item), Viktor ("exhausting to watch") |

**Rules for cross-references:**
- An NPC will only mention another NPC if the player has already met them
- The reference is always brief — one sentence, never a full explanation
- References create a sense that the town exists when the player is not in it

---

## Daily variation system

Each location has a minimum of three "states" that affect dialogue and atmosphere:

| Location | Morning | Afternoon | Evening/Rainy |
|---|---|---|---|
| Apartment | Galina Ivanovna in the hallway, watering; Styopan just woke up | Quieter; Styopan may be out | Galina Ivanovna listening through door for noise; Styopan gaming |
| Park | Tamara Andreyevna present; chess players active | Hot and slow; Artyom in shade | Artyom still there; Tamara Andreyevna gone |
| Cafe | Boris at his seat; Lena busy | Full; Lena short on time | Quiet; Lena more expansive; Boris absent |
| Market | Crowded; Fatima fully stocked | Thinning; Misha running low | Near close; Fatima packing; Misha is gone |
| Station | Trains arriving; Konstantin at peak formality | Regular schedule; Nadya chattier | Quiet; both NPCs more personal |
| Police station | Alina busy with paperwork | Moderate; Viktor may be available | Late: quiet; Alina is studying |

---

## Seasonal arc

The game takes place across a semester: late August through mid-December.

**August/September (Chapters 1-2):**
Warm, green, long evenings. The park is in full summer. The cafe terrace is open. The market is at its fullest with late-summer produce. The player arrives in warmth and ease.

**October (Chapter 3):**
The leaves change. The terrace closes. The market shifts to root vegetables and preserves. The park is golden and a little melancholy. First cold evenings. Galina Ivanovna comments on this.

**November (Chapter 4):**
Bare trees. The fountain is turned off. The market is under heavier cover. The station is colder and the waiting room is fuller. The police station feels warmer by contrast — it has better heating.

**December (Final scenes):**
First snow possible. The town changes. The player's relationship to the town changes with it. Galina Ivanovna: "You'll miss this next year." Said as a fact, not a sentiment.

---

## What makes each location distinct as a place

**Apartment building:** Privacy and necessity. You live here. The stakes of every interaction are domestic and personal. The NPCs know you in a different way than anyone else — they see you on bad days and early mornings.

**Park:** The first outdoor freedom. Space and light. The social pressure is low — you can walk away. Artyom does not need anything from you. This makes the park the place where learning happens through choice rather than necessity.

**Cafe:** The first commerce. You have to perform here — order, pay, thank. Failure is visible (though mild). Success is satisfying. Lena's presence means the cafe is also the place where the player first feels genuinely seen and approved of by a peer-aged adult.

**Market:** The first complexity. Multiple vendors, a crowd, competing demands. The player cannot talk to everyone at once. The market teaches selectivity — who to trust, how to prioritize. Fatima's rule (ask properly or nothing) is the market's core lesson in non-linguistic form.

**Train station:** The first formality. The register changes and the player feels it. The stakes are higher — you can miss a train. Time matters here in a way it does not at the park. The station is also the first place that connects Malinov to the wider world, which makes it emotionally significant.

**Police station:** The end of the journey. Formal Russia at full force. The player has to marshal everything they know — vocabulary, register, past tense, patience — to navigate a real crisis in a language they are still learning. The fact that they can do it is the arc of the whole game made concrete.
