export const BEHAVIOR_KEYS = ['Habitual', 'Urgent', 'Flexible']

export const BEHAVIOR_DISPLAY = {
  Habitual: 'Habit-based',
  Urgent: 'Urgent',
  Flexible: 'Flexible',
}

export const BEHAVIOR_COLORS = {
  Habitual: '#6366f1',
  Urgent: '#ea580c',
  Flexible: '#059669',
}

export function aggregateBehavior(behaviorList) {
  const counts = { Habitual: 0, Urgent: 0, Flexible: 0 }
  if (!Array.isArray(behaviorList)) return []
  for (const row of behaviorList) {
    const b = row.behavior
    if (counts[b] !== undefined) counts[b] += 1
  }
  return BEHAVIOR_KEYS.filter((k) => counts[k] > 0).map((k) => ({
    key: k,
    name: BEHAVIOR_DISPLAY[k],
    value: counts[k],
  }))
}
