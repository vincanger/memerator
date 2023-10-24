import { DeleteOldMemes } from '@wasp/jobs/deleteOldMemes';

export const findAndDeleteWeekOldMemes: 
  DeleteOldMemes<never, void> = async (_args, context) => {
    const oneWeekFromNow = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

    let memesToDelete = await context.

};
