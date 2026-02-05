import dayjs from 'dayjs';
import prisma from './prisma';
import { DAILY_REWARD_AMOUNT } from './constants';

export async function recordTransaction(userId: string, amount: number, reason: string, metadata?: Record<string, unknown>) {
  return prisma.transaction.create({
    data: { userId, amount, reason, metadata: metadata ? JSON.stringify(metadata) : null },
  });
}

export async function adjustBits(userId: string, amount: number, reason: string, metadata?: Record<string, unknown>) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, select: { bits: true } });
    if (!user) throw new Error('User not found');
    const newBalance = Math.max(0, user.bits + amount);
    await tx.user.update({
      where: { id: userId },
      data: { bits: newBalance },
    });
    await tx.transaction.create({
      data: {
        userId,
        amount,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
    return newBalance;
  });
}

export async function claimDailyReward(userId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { lastDailyClaim: true, bits: true },
    });
    if (!user) throw new Error('User not found');

    if (user.lastDailyClaim && dayjs(user.lastDailyClaim).isSame(dayjs(), 'day')) {
      throw new Error('Daily reward already claimed');
    }

    const newBalance = user.bits + DAILY_REWARD_AMOUNT;

    await tx.user.update({
      where: { id: userId },
      data: {
        bits: newBalance,
        lastDailyClaim: new Date(),
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        amount: DAILY_REWARD_AMOUNT,
        reason: 'daily_bonus',
        metadata: JSON.stringify({ day: dayjs().format('YYYY-MM-DD') }),
      },
    });

    return newBalance;
  });
}

export async function getLeaderboard(limit = 20) {
  return prisma.user.findMany({
    orderBy: { bits: 'desc' },
    take: limit,
    select: { id: true, username: true, bits: true, role: true, tag: true },
  });
}

export async function getRecentTransactions(userId: string, limit = 10) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
