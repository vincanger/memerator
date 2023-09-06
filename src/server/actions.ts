import HttpError from '@wasp/core/HttpError.js';
import OpenAI from 'openai';
import { fetchMemeTemplates, generateMemeImage, decrementUserCredits } from './utils.js';

import type { CreateMeme, EditMeme, DeleteMeme } from '@wasp/actions/types';
import type { Meme, Template } from '@wasp/entities';

type CreateMemeArgs = { topics: string[]; audience: string };
type EditMemeArgs = Pick<Meme, 'id' | 'text0' | 'text1'>;
type DeleteMemeArgs = Pick<Meme, 'id'>;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createMeme: CreateMeme<CreateMemeArgs, Meme> = async ({ topics, audience }, context) => {
  // if (!context.user) {
  //   throw new HttpError(401, 'You must be logged in');
  // } 

  // if (context.user.credits === 0 && !context.user.isAdmin) {
  //   throw new HttpError(403, 'You have no credits left');
  // }

  const topicsStr = topics.join(', ');

  let templates: Template[] = await context.entities.Template.findMany({});

	if (templates.length === 0) {
    const memeTemplates = await fetchMemeTemplates();
    templates = await Promise.all(
      memeTemplates.map(async (template: any) => {
        const addedTemplate = await context.entities.Template.upsert({
          where: { id: template.id },
          create: {
            id: template.id,
            name: template.name,
            url: template.url,
            width: template.width,
            height: template.height,
            boxCount: template.box_count,
          },
          update: {},
        });

        return addedTemplate;
      })
    );
  }

  // filter out templates with box_count > 2
  templates = templates.filter((template) => template.boxCount <= 2);
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  console.log('random template: ', randomTemplate);

  const sysPrompt = `You are a meme idea generator. You will use the imgflip api to generate a meme based on an idea you suggest. Given a random template name and topics, generate a meme idea for the intended audience. Only use the template provided`;
  const userPrompt = `Topics: ${topicsStr} \n Intended Audience: ${audience} \n Template: ${randomTemplate.name} \n`;

  let openAIResponse: OpenAI.Chat.Completions.ChatCompletion;
  try {
    openAIResponse = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: userPrompt },
      ],
      functions: [
        {
          name: 'generateMemeImage',
          description: 'Generate meme via the imgflip API based on the given idea',
          parameters: {
            type: 'object',
            properties: {
              text0: { type: 'string', description: 'The text for the top caption of the meme' },
              text1: { type: 'string', description: 'The text for the bottom caption of the meme' },
            },
            required: ['templateName', 'text0', 'text1'],
          },
        },
      ],
      function_call: {
        name: 'generateMemeImage',
      },
      model: 'gpt-4-0613',
    });
  } catch (error: any) {
    console.error('Error calling openAI: ', error);
    throw new HttpError(500, 'Error calling openAI');
  }

  console.log(openAIResponse.choices[0]);

  /**
   * the Function call returned by openAI looks like this:
   */
  // {
  //   index: 0,
  //   message: {
  //     role: 'assistant',
  //     content: null,
  //     function_call: {
  //       name: 'generateMeme',
  //       arguments: '{\n' +
  //         `  "text0": "CSS you've been writing all day",\n` +
  //         '  "text1": "This looks horrible"\n' +
  //         '}'
  //     }
  //   },
  //   finish_reason: 'stop'
  // }
  if (!openAIResponse.choices[0].message.function_call) throw new HttpError(500, 'No function call in openAI response');

  const gptArgs = JSON.parse(openAIResponse.choices[0].message.function_call.arguments);
  console.log('gptArgs: ', gptArgs);

  const memeIdeaText0 = gptArgs.text0;
  const memeIdeaText1 = gptArgs.text1;

  console.log('meme Idea args: ', memeIdeaText0, memeIdeaText1);

  const memeUrl = await generateMemeImage({
    templateId: randomTemplate.id,
    text0: memeIdeaText0,
    text1: memeIdeaText1,
  });

  const newMeme = await context.entities.Meme.create({
    data: {
      text0: memeIdeaText0,
      text1: memeIdeaText1,
      topics: topicsStr,
      audience: audience,
      url: memeUrl,
      templateId: randomTemplate.id,
      userId: context?.user?.id || 1,
    },
  });

  // if (newMeme && !context.user.isAdmin) await decrementUserCredits(context.user.id, context);

  return newMeme;
};

export const editMeme: EditMeme<EditMemeArgs, Meme> = async ({ id, text0, text1 }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const meme = await context.entities.Meme.findUniqueOrThrow({
    where: { id: id },
    include: { template: true },
  });

  if (!context.user.isAdmin && meme.userId !== context.user.id) {
    throw new HttpError(403, 'You are not the creator of this meme');
  }

  const memeUrl = await generateMemeImage({
    templateId: meme.template.id,
    text0: text0,
    text1: text1,
  });

  const newMeme = await context.entities.Meme.update({
    where: { id: id },
    data: {
      text0: text0,
      text1: text1,
      url: memeUrl,
    },
  });

  return newMeme;
};

export const deleteMeme: DeleteMeme<DeleteMemeArgs, Meme> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const meme = await context.entities.Meme.findUniqueOrThrow({
    where: { id: id },
  });

  if (!context.user.isAdmin && meme.userId !== context.user.id) {
    throw new HttpError(403, 'You are not the creator of this meme');
  }

  return await context.entities.Meme.delete({ where: { id: id } });
};
