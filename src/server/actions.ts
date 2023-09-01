import HttpError from '@wasp/core/HttpError.js';
import OpenAI from 'openai';
import { fetchMemeTemplates, generateMemeImage } from './utils';

import type { CreateMemeIdea, EditMeme, DeleteMeme } from '@wasp/actions/types';
import type { Meme, Template } from '@wasp/entities';

type CreateMemeIdeaArgs = { topics: string[]; audience: string };
type EditMemeArgs = Pick<Meme, 'id' | 'text0' | 'text1'>;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createMemeIdea: CreateMemeIdea<CreateMemeIdeaArgs, Meme> = async ({ topics, audience }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    const topicsStr = topics.join(', ');

    let templates: Template[] = await context.entities.Template.findMany({});

    if (templates.length === 0) {
      const memeTemplates = await fetchMemeTemplates();
      memeTemplates.forEach(async (template: any) => {
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

        templates.push(addedTemplate);
      });
    }

    // filter out templates with box_count > 2
    templates = templates.filter((template) => template.boxCount <= 2);
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    console.log('random template: ', randomTemplate);

    const sysPrompt = `You are a meme idea generator. You will use the imgflip api to generate a meme based on an idea you suggest. Given a random template name and topics, generate a meme idea for the intended audience. Only use the templates provided`;
    const userPrompt = `Topics: ${topicsStr} \n Intended Audience: ${audience} \n Template: ${randomTemplate.name} \n`;

    const openAIResponse = await openai.chat.completions.create({
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
              templateName: {
                type: 'string',
                description: 'The name of the meme template on imgflip',
              },
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
    //         '  "templateName": "Trump Bill Signing",\n' +
    //         `  "text0": "CSS you've been writing all day",\n` +
    //         '  "text1": "This looks horrible"\n' +
    //         '}'
    //     }
    //   },
    //   finish_reason: 'stop'
    // }
    if (!openAIResponse.choices[0].message.function_call) throw new Error('No function call in openAI response');

    const gptArgs = JSON.parse(openAIResponse.choices[0].message.function_call.arguments);
    console.log('gptArgs: ', gptArgs);
    const memeIdeaTemplateName = gptArgs.templateName;
    const memeIdeaText0 = gptArgs.text0;
    const memeIdeaText1 = gptArgs.text1;

    console.log('meme Idea args: ', memeIdeaTemplateName, memeIdeaText0, memeIdeaText1);

    const generatedMeme = await generateMemeImage(
      {
        templateName: memeIdeaTemplateName,
        text0: memeIdeaText0,
        text1: memeIdeaText1,
      },
      context
    );

    return generatedMeme;
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error generating meme idea');
  }
};

export const editMeme: EditMeme<EditMemeArgs, Meme> = async ({ id, text0, text1 }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    const meme = await context.entities.Meme.findUnique({
      where: { id: id, userId: context.user.id },
      include: { template: true },
    });
  
    console.log('meme: ', meme);
  
    if (!meme) {
      throw new HttpError(404, 'No meme with id ' + id);
    }
  
    if (meme.userId !== context.user.id) {
      throw new HttpError(403, 'You are not the creator of this meme');
    }
  
    const newMeme = await generateMemeImage(
      {
        id: id,
        templateName: meme.template.name,
        text0: text0,
        text1: text1,
      },
      context
    );
  
    return newMeme;
    
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error editing meme: ' + id);
  }

};

type DeleteMemeArgs = Pick<Meme, 'id'>;

export const deleteMeme: DeleteMeme<DeleteMemeArgs, Meme> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    const meme = await context.entities.Meme.findUnique({
      where: { id: id },
    });

    if (!meme) {
      throw new HttpError(404, 'No meme with id ' + id);
    }

    if (meme.userId !== context.user.id) {
      throw new HttpError(403, 'You are not the creator of this meme');
    }

    return await context.entities.Meme.delete({ where: { id: id } });
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error deleting meme: ' + id);
  }
};
