import { DeleteOldMemes } from '@wasp/jobs/deleteOldMemes';

export const findAndDeleteWeekOldMemes: 
  DeleteOldMemes<never, void> = async (_args, context) => {
    // find the date two weeks ago from today
    const today = new Date();
    const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));

    let memesToDelete = await context.entities.Meme.findMany({
      where: { createdAt: { lte: twoWeeksAgo } },
    });

    if (memesToDelete.length === 0) return;

    const memesArray = memesToDelete.map(async (meme) => {
      return await context.entities.Meme.delete({ where: { id: meme.id } });
    })

    await Promise.all(memesArray);
};
