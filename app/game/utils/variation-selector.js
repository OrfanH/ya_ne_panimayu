function selectVariation(variations, flags, progress, npcId) {
  const rel = progress.npcRelationships && progress.npcRelationships[npcId];
  const seen = (rel && rel.seenVariations) ? rel.seenVariations : [];
  for (const v of variations) {
    if (!v.trigger) continue;                   // skip triggerless (first-visit opening)
    if (seen.includes(v.id)) continue;          // skip already-seen
    let matches = false;
    if (typeof v.trigger === 'function') {
      try { matches = !!v.trigger(flags, progress); } catch (_) {}
    } else if (v.trigger.flag !== undefined) {
      matches = flags[v.trigger.flag] === v.trigger.value;
    } else if (v.trigger.tier !== undefined) {
      const rel = progress.npcRelationships && progress.npcRelationships[npcId];
      const currentTier = (rel && rel.tier != null) ? rel.tier : 0;
      matches = currentTier >= v.trigger.tier;
    }
    // { visit_count } and other unrecognised formats → matches stays false (intentional)
    if (matches) return v;
  }
  return null;
}
