// levels.js
export const LEVEL_CONFIGS = [
  { week: 1, targetScore: 100, targetDishes: 2, maxHands: 4, maxDiscards: 3, levelName: 'Cozy Cottage Kitchen' },
  { week: 2, targetScore: 220, targetDishes: 3, maxHands: 4, maxDiscards: 3, levelName: 'Family Diner' },
  { week: 3, targetScore: 450, targetDishes: 3, maxHands: 3, maxDiscards: 2, levelName: 'Downtown Bakery' },
  { week: 4, targetScore: 900, targetDishes: 4, maxHands: 3, maxDiscards: 2, levelName: 'Grand Country Inn' }
];

export class LevelManager {
  static getLevel(weekNumber) {
    const level = LEVEL_CONFIGS.find(l => l.week === weekNumber);
    if (level) return level;

    return {
      week: weekNumber,
      targetScore: Math.round(900 * Math.pow(1.5, weekNumber - 4)),
      targetDishes: Math.min(5, 3 + Math.floor((weekNumber - 4) / 2)),
      maxHands: 3,
      maxDiscards: 2,
      levelName: `Kitchen W${weekNumber}`
    };
  }
}