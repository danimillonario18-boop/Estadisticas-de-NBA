/**
 * Calculate profit units for a single pick based on status and odds
 */
export function calculateProfit(
  status: string,
  stakeUnits: number,
  oddsDecimal: number,
  customProfit?: number
): number {
  // For cashout, use custom profit
  if (status === 'CASHOUT' && customProfit !== undefined) {
    return customProfit
  }

  switch (status) {
    case 'WON':
      return stakeUnits * (oddsDecimal - 1)
    case 'LOST':
      return -stakeUnits
    case 'PUSH':
    case 'VOID':
      return 0
    case 'CASHOUT':
      return 0 // Default if no custom profit
    default:
      return 0
  }
}

/**
 * Calculate total staked units (excluding VOID picks)
 */
export function calculateTotalStaked(picks: any[]): number {
  return picks
    .filter(pick => pick.status !== 'VOID')
    .reduce((sum, pick) => sum + pick.stakeUnits, 0)
}

/**
 * Calculate net units (total profit)
 */
export function calculateNetUnits(picks: any[]): number {
  return picks.reduce((sum, pick) => sum + pick.profitUnits, 0)
}

/**
 * Calculate ROI (Return on Investment)
 * ROI = (NetUnits / TotalStaked) * 100
 */
export function calculateROI(picks: any[]): number {
  const totalStaked = calculateTotalStaked(picks)
  
  if (totalStaked === 0) return 0
  
  const netUnits = calculateNetUnits(picks)
  return (netUnits / totalStaked) * 100
}

/**
 * Calculate Win Rate
 * Win Rate = Wins / (Wins + Losses)
 */
export function calculateWinRate(picks: any[]): number {
  const settledPicks = picks.filter(
    pick => pick.status === 'WON' || pick.status === 'LOST'
  )
  
  if (settledPicks.length === 0) return 0
  
  const wins = settledPicks.filter(pick => pick.status === 'WON').length
  
  return (wins / settledPicks.length) * 100
}

/**
 * Calculate Average Odds
 */
export function calculateAvgOdds(picks: any[]): number {
  const nonVoidPicks = picks.filter(pick => pick.status !== 'VOID')
  
  if (nonVoidPicks.length === 0) return 0
  
  const sumOdds = nonVoidPicks.reduce((sum, pick) => sum + pick.oddsDecimal, 0)
  
  return sumOdds / nonVoidPicks.length
}

/**
 * Calculate current streak
 * Returns: { currentStreak: number, streakType: 'win' | 'loss' | 'none' }
 */
export function calculateCurrentStreak(picks: any[]): {
  currentStreak: number
  streakType: 'win' | 'loss' | 'none'
} {
  const settledPicks = picks
    .filter(pick => (pick.status === 'WON' || pick.status === 'LOST') && pick.settledAt)
    .sort((a, b) => new Date(b.settledAt!).getTime() - new Date(a.settledAt!).getTime())

  if (settledPicks.length === 0) {
    return { currentStreak: 0, streakType: 'none' }
  }

  const firstPick = settledPicks[0]
  const streakType = firstPick.status === 'WON' ? 'win' : 'loss'
  let currentStreak = 1

  for (let i = 1; i < settledPicks.length; i++) {
    if (settledPicks[i].status === firstPick.status) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, streakType }
}

/**
 * Calculate best and worst streaks
 */
export function calculateBestWorstStreaks(picks: any[]): {
  bestWinStreak: number
  worstLossStreak: number
} {
  const settledPicks = picks
    .filter(pick => (pick.status === 'WON' || pick.status === 'LOST') && pick.settledAt)
    .sort((a, b) => new Date(a.settledAt!).getTime() - new Date(b.settledAt!).getTime())

  if (settledPicks.length === 0) {
    return { bestWinStreak: 0, worstLossStreak: 0 }
  }

  let bestWinStreak = 0
  let worstLossStreak = 0
  let currentWinStreak = 0
  let currentLossStreak = 0

  settledPicks.forEach(pick => {
    if (pick.status === 'WON') {
      currentWinStreak++
      currentLossStreak = 0
      bestWinStreak = Math.max(bestWinStreak, currentWinStreak)
    } else {
      currentLossStreak++
      currentWinStreak = 0
      worstLossStreak = Math.max(worstLossStreak, currentLossStreak)
    }
  })

  return { bestWinStreak, worstLossStreak }
}

/**
 * Calculate maximum drawdown
 */
export function calculateMaxDrawdown(picks: any[]): number {
  const settledPicks = picks
    .filter(pick => pick.settledAt)
    .sort((a, b) => new Date(a.settledAt!).getTime() - new Date(b.settledAt!).getTime())

  if (settledPicks.length === 0) return 0

  let peak = 0
  let maxDrawdown = 0
  let cumulative = 0

  settledPicks.forEach(pick => {
    cumulative += pick.profitUnits
    peak = Math.max(peak, cumulative)
    const drawdown = peak - cumulative
    maxDrawdown = Math.max(maxDrawdown, drawdown)
  })

  return maxDrawdown
}

/**
 * Generate equity curve data
 */
export function generateEquityCurve(picks: any[]): Array<{
  date: string
  value: number
}> {
  const settledPicks = picks
    .filter(pick => pick.settledAt)
    .sort((a, b) => new Date(a.settledAt!).getTime() - new Date(b.settledAt!).getTime())

  const equityCurve: Array<{ date: string; value: number }> = []
  let cumulative = 0

  settledPicks.forEach(pick => {
    cumulative += pick.profitUnits
    equityCurve.push({
      date: new Date(pick.settledAt!).toISOString().split('T')[0],
      value: cumulative,
    })
  })

  return equityCurve
}

/**
 * Calculate complete metrics for a set of picks
 */
export function calculateMetrics(picks: any[]) {
  const totalPicks = picks.length
  const settledPicks = picks.filter(pick => pick.status !== 'PENDING')
  const wins = picks.filter(pick => pick.status === 'WON').length
  const losses = picks.filter(pick => pick.status === 'LOST').length
  const pushes = picks.filter(pick => pick.status === 'PUSH').length
  const voids = picks.filter(pick => pick.status === 'VOID').length

  const totalStaked = calculateTotalStaked(picks)
  const netUnits = calculateNetUnits(picks)
  const roi = calculateROI(picks)
  const winRate = calculateWinRate(picks)
  const avgOdds = calculateAvgOdds(picks)
  const currentStreak = calculateCurrentStreak(picks)
  const bestWorstStreaks = calculateBestWorstStreaks(picks)
  const maxDrawdown = calculateMaxDrawdown(picks)
  const equityCurve = generateEquityCurve(picks)

  return {
    totalPicks,
    settledPicks: settledPicks.length,
    wins,
    losses,
    pushes,
    voids,
    totalStaked,
    netUnits,
    roi,
    winRate,
    avgOdds,
    currentStreak,
    bestWinStreak: bestWorstStreaks.bestWinStreak,
    worstLossStreak: bestWorstStreaks.worstLossStreak,
    maxDrawdown,
    equityCurve,
  }
}