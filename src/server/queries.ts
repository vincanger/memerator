import HttpError from '@wasp/core/HttpError.js';

import type { Meme, Template } from '@wasp/entities';
import type { GetAllMemes, GetMeme, GetMemeTemplates } from '@wasp/queries/types';

type GetMemeArgs = { id: string };

export const getAllMemes: GetAllMemes<void, Meme[]> = async (_args, context) => {
  const memeIdeas = await context.entities.Meme.findMany({
    orderBy: { createdAt: 'desc' },
    include: { template: true },
  });

  return memeIdeas;
};

export const getMeme: GetMeme<GetMemeArgs, Meme & { template: Template }> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const meme = await context.entities.Meme.findUniqueOrThrow({
    where: { id: id },
    include: { template: true },
  });

  return meme;
};

export const getMemeTemplates: GetMemeTemplates<void, Template[]> = async (_arg, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const memeTemplates = await context.entities.Template.findMany({});

  if (!memeTemplates) {
    throw new HttpError(404, 'No meme templates found');
  }

  return memeTemplates;
};
