import HttpError from '@wasp/core/HttpError.js'

export const getAllMemeIdeas = async (arg, context) => {
  const { memeIdeaId } = arg;
  if (!context.user) {
    throw new HttpError(401);
  }

  const memeIdeas = await context.entities.Meme.findMany({
    orderBy: { createdAt: 'desc' },
    include: { template: true },
  });

  if (!memeIdeas) {
    throw new HttpError(404, 'No meme idea with id ' + memeIdeaId);
  }

  return memeIdeas;
};

export const getAutoMemeIdeas = async (arg, context) => {

  if (!context.user) {
    throw new HttpError(401);
  }

  const memeIdeas = await context.entities.AutoMemeIdea.findMany({
    where: { userId: context.user.id },
    // orderBy: { createdAt: 'desc' },
  });

  if (!memeIdeas) {
    throw new HttpError(404, 'No meme ideas found');
  }

  return memeIdeas;
}

export const getAutoMemes = async (arg, context) => {
  const { autoMemeIdeaId } = arg;
  if (!context.user) { throw new HttpError(401) }

  const memes = await context.entities.AutoMemeIdea.findUnique({
    where: { userId: context.user.id, id: autoMemeIdeaId },
    // orderBy: { createdAt: 'desc' },
    include: { memes: true}
  });

  if (!memes) { throw new HttpError(404, 'No memes found') }

  return memes;
}

export const getMeme = async (arg, context) => {
  if (!context.user) { throw new HttpError(401) }

  const meme = await context.entities.Meme.findUnique({
    where: { id: arg.id },
    include: { template: true },
  });

  if (!meme) { throw new HttpError(404, 'No meme with id ' + arg.id) }

  return meme;
}

export const getMemeTemplates = async (arg, context) => {
  if (!context.user) { throw new HttpError(401) }

  const memeTemplates = await context.entities.Template.findMany({});

  if (!memeTemplates) { throw new HttpError(404, 'No meme templates found') }

  return memeTemplates;
}
