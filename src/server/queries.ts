import HttpError from '@wasp/core/HttpError.js';

import type { Meme, Template } from '@wasp/entities';
import type { GetAllMemes, GetPaginatedMemes, GetMeme, GetMemeTemplates } from '@wasp/queries/types';

type GetPaginatedMemesArgs = { first: number, after: number };
type GetMemeArgs = { id: string };

export const getAllMemes: GetAllMemes<void, Meme[]> = async (_args, context) => {
  const memeIdeas = await context.entities.Meme.findMany({
    orderBy: { createdAt: 'desc' },
    include: { template: true },
  });

  return memeIdeas;
};

export const getPaginatedMemes: GetPaginatedMemes<GetPaginatedMemesArgs, Meme[]> = async ({ first, after }, context) => {
  const memes = await context.entities.Meme.findMany({
    orderBy: { createdAt: 'desc' },
    include: { template: true },
    skip: after,
    take: first,
  });

  return memes;
}

export const getMeme: GetMeme<GetMemeArgs, Meme & { template: Template }> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You are not logged in');
  }

  const meme = await context.entities.Meme.findUniqueOrThrow({
    where: { id: id },
    include: { template: true },
  });

  return meme;
};

export const getMemeTemplates: GetMemeTemplates<void, Template[]> = async (_arg, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You are not logged in');
  }

  const memeTemplates = await context.entities.Template.findMany({});

  if (!memeTemplates) {
    throw new HttpError(404, 'No meme templates found');
  }

  return memeTemplates;
};

import { GetMemeCount } from '@wasp/queries/types'



export const getMemeCount: GetMemeCount<void, number> = async (args, context) => {
  const count = await context.entities.Meme.count({})

  return count
}
