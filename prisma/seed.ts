import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sports
  const football = await prisma.sport.upsert({
    where: { name: 'Football' },
    update: {},
    create: { name: 'Football' },
  })

  const basketball = await prisma.sport.upsert({
    where: { name: 'Basketball' },
    update: {},
    create: { name: 'Basketball' },
  })

  const tennis = await prisma.sport.upsert({
    where: { name: 'Tennis' },
    update: {},
    create: { name: 'Tennis' },
  })

  console.log('✅ Sports created')

  // Create leagues
  const nfl = await prisma.league.upsert({
    where: { id: 'league-nfl' },
    update: {},
    create: {
      id: 'league-nfl',
      name: 'NFL',
      country: 'USA',
      sportId: football.id,
    },
  })

  const nba = await prisma.league.upsert({
    where: { id: 'league-nba' },
    update: {},
    create: {
      id: 'league-nba',
      name: 'NBA',
      country: 'USA',
      sportId: basketball.id,
    },
  })

  const atp = await prisma.league.upsert({
    where: { id: 'league-atp' },
    update: {},
    create: {
      id: 'league-atp',
      name: 'ATP Tour',
      country: 'International',
      sportId: tennis.id,
    },
  })

  console.log('✅ Leagues created')

  // Create teams
  const chiefs = await prisma.team.upsert({
    where: { id: 'team-chiefs' },
    update: {},
    create: {
      id: 'team-chiefs',
      name: 'Kansas City Chiefs',
      leagueId: nfl.id,
    },
  })

  const bills = await prisma.team.upsert({
    where: { id: 'team-bills' },
    update: {},
    create: {
      id: 'team-bills',
      name: 'Buffalo Bills',
      leagueId: nfl.id,
    },
  })

  const lakers = await prisma.team.upsert({
    where: { id: 'team-lakers' },
    update: {},
    create: {
      id: 'team-lakers',
      name: 'Los Angeles Lakers',
      leagueId: nba.id,
    },
  })

  const celtics = await prisma.team.upsert({
    where: { id: 'team-celtics' },
    update: {},
    create: {
      id: 'team-celtics',
      name: 'Boston Celtics',
      leagueId: nba.id,
    },
  })

  console.log('✅ Teams created')

  // Create books
  const bet365 = await prisma.book.upsert({
    where: { name: 'Bet365' },
    update: {},
    create: { name: 'Bet365' },
  })

  const pinnacle = await prisma.book.upsert({
    where: { name: 'Pinnacle' },
    update: {},
    create: { name: 'Pinnacle' },
  })

  const betway = await prisma.book.upsert({
    where: { name: 'Betway' },
    update: {},
    create: { name: 'Betway' },
  })

  console.log('✅ Books created')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@betanalytix.com' },
    update: {},
    create: {
      email: 'demo@betanalytix.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
      profile: {
        create: {
          username: 'demotipster',
          displayName: 'Demo Tipster',
          bio: 'Cuenta demostrativa de Bet-Analytix. Explora todas las funcionalidades de la plataforma.',
          country: 'US',
          currency: 'USD',
          isPublic: true,
          bankroll: 1000,
        },
      },
    },
    include: {
      profile: true,
    },
  })

  console.log('✅ Demo user created')

  // Create events
  const event1 = await prisma.event.upsert({
    where: { providerEventId: 'event-1' },
    update: {},
    create: {
      providerEventId: 'event-1',
      sportId: football.id,
      leagueId: nfl.id,
      homeTeamId: chiefs.id,
      awayTeamId: bills.id,
      startTime: new Date('2024-12-15T18:00:00Z'),
      status: 'FINISHED',
      score: JSON.stringify({ home: 27, away: 24 }),
      provider: 'MOCK',
    },
  })

  const event2 = await prisma.event.upsert({
    where: { providerEventId: 'event-2' },
    update: {},
    create: {
      providerEventId: 'event-2',
      sportId: basketball.id,
      leagueId: nba.id,
      homeTeamId: lakers.id,
      awayTeamId: celtics.id,
      startTime: new Date('2024-12-20T19:30:00Z'),
      status: 'SCHEDULED',
      provider: 'MOCK',
    },
  })

  console.log('✅ Events created')

  // Create sample picks
  const picks = [
    {
      userId: demoUser.id,
      profileId: demoUser.profile!.id,
      eventId: event1.id,
      sportId: football.id,
      leagueId: nfl.id,
      marketType: 'MONEYLINE',
      selectionText: 'Kansas City Chiefs',
      oddsDecimal: 1.85,
      stakeUnits: 2,
      bookId: bet365.id,
      placedAt: new Date('2024-12-14T10:00:00Z'),
      status: 'WON',
      settledAt: new Date('2024-12-15T20:00:00Z'),
      profitUnits: 1.7,
      note: 'Chiefs en excelente forma en casa',
      isSample: true,
    },
    {
      userId: demoUser.id,
      profileId: demoUser.profile!.id,
      eventId: event1.id,
      sportId: football.id,
      leagueId: nfl.id,
      marketType: 'SPREAD',
      selectionText: 'Buffalo Bills +3.5',
      line: 3.5,
      oddsDecimal: 1.9,
      stakeUnits: 1.5,
      bookId: pinnacle.id,
      placedAt: new Date('2024-12-14T12:00:00Z'),
      status: 'WON',
      settledAt: new Date('2024-12-15T20:00:00Z'),
      profitUnits: 1.35,
      isSample: true,
    },
    {
      userId: demoUser.id,
      profileId: demoUser.profile!.id,
      eventId: event1.id,
      sportId: football.id,
      leagueId: nfl.id,
      marketType: 'TOTAL',
      selectionText: 'Over 52.5',
      line: 52.5,
      oddsDecimal: 1.95,
      stakeUnits: 1,
      bookId: betway.id,
      placedAt: new Date('2024-12-14T14:00:00Z'),
      status: 'LOST',
      settledAt: new Date('2024-12-15T20:00:00Z'),
      profitUnits: -1,
      isSample: true,
    },
    {
      userId: demoUser.id,
      profileId: demoUser.profile!.id,
      eventId: event2.id,
      sportId: basketball.id,
      leagueId: nba.id,
      marketType: 'MONEYLINE',
      selectionText: 'Los Angeles Lakers',
      oddsDecimal: 2.1,
      stakeUnits: 2,
      bookId: bet365.id,
      placedAt: new Date('2024-12-18T16:00:00Z'),
      status: 'PENDING',
      note: 'Lakers buscando recuperar nivel',
      isSample: true,
    },
  ]

  for (const pick of picks) {
    await prisma.pick.create({ data: pick })
  }

  console.log('✅ Sample picks created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })