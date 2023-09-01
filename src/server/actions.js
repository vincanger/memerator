import HttpError from '@wasp/core/HttpError.js';
import axios from 'axios';
import OpenAI from 'openai';
import { stringify } from 'querystring';
import { generateAutoMemes } from '@wasp/jobs/generateAutoMemes.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateMeme = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  console.log('generateMeme args: ', args);

  const template = await context.entities.Template.findFirstOrThrow({
    where: {
      name: {
        contains: args.templateName,
        mode: 'insensitive', // This makes the search case-insensitive
      },
    },
  });

  const data = stringify({
    template_id: template.id,
    username: process.env.IMGFLIP_USERNAME,
    password: process.env.IMGFLIP_PASSWORD,
    text0: args.text0,
    text1: args.text1,
  });

  // Implement the generation of meme using the Imgflip API
  const res = await axios.post('https://api.imgflip.com/caption_image', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const url = res.data.data.url;

  console.log('generated meme url: ', url);
  
  let memeIdea;

  if (args.id) {
    memeIdea = await context.entities.Meme.update({
      where: { id: args.id },
      data: {
        templateId: template.id,
        url: url,
        text0: args.text0,
        text1: args.text1,
        userId: context.user.id,
        createdAt: new Date(),
        autoMemeIdeaId: args.autoMemeIdeaId,
      },
    });
  } else {
    memeIdea = await context.entities.Meme.create({
      data: {
        templateId: template.id,
        url: url,
        text0: args.text0,
        text1: args.text1,
        userId: context.user.id,
        autoMemeIdeaId: args.autoMemeIdeaId,
      },
    });
  }

  return memeIdea;
};

export const createMemeIdea = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const topics = args.topics.join(', ');
  const audience = args.audience;

  let templates = await context.entities.Template.findMany({});

  // filter out templates with box_count > 2
  templates = templates.filter((template) => template.boxCount <= 2);
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  console.log('random template: ', randomTemplate)

  const sysPrompt = `You are a meme idea generator. You will use the imgflip api to generate a meme based on an idea you suggest. Given a random template name and topics, generate a meme idea for the intended audience. Only use the templates provided`;
  const userPrompt = `Topics: ${topics} \n Intended Audience: ${audience} \n Template: ${randomTemplate.name} \n`;

  const openAIResponse = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: userPrompt },
    ],
    functions: [
      {
        name: 'generateMeme',
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
      name: 'generateMeme',
    },
    model: 'gpt-4-0613',
  });

  console.log(openAIResponse.choices[0]);
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
  const gptArgs = JSON.parse(openAIResponse.choices[0].message.function_call.arguments);
  console.log('gptArgs: ', gptArgs);
  const memeIdeaTemplateName = gptArgs.templateName;
  const memeIdeaText0 = gptArgs.text0;
  const memeIdeaText1 = gptArgs.text1;

  console.log('meme Idea args: ', memeIdeaTemplateName, memeIdeaText0, memeIdeaText1);

  const generatedMeme = await generateMeme(
    {
      templateName: memeIdeaTemplateName,
      text0: memeIdeaText0,
      text1: memeIdeaText1,
    },
    context
  );

  return generatedMeme;
};

export const editMeme = async (args, context) => {

  if (!context.user) {
    throw new HttpError(401);
  }

  const meme = await context.entities.Meme.findUnique({
    where: { id: args.id },
    include: { template: true },
  });

  console.log('meme: ', meme)

  if (!meme) {
    throw new HttpError(404, 'No meme with id ' + args.id);
  }

  if (meme.userId !== context.user.id) {
    throw new HttpError(403, 'You are not the creator of this meme');
  }

  const newMeme = await generateMeme({
    id: args.id,
    templateName: meme.template.name,
    text0: args.text0,
    text1: args.text1,
  }, context);


  return newMeme;
}

export const deleteMeme = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const meme = await context.entities.Meme.findUnique({
    where: { id: args.id },
  });

  if (!meme) {
    throw new HttpError(404, 'No meme with id ' + args.id);
  }

  if (meme.userId !== context.user.id) {
    throw new HttpError(403, 'You are not the creator of this meme');
  }

  await context.entities.Meme.delete({ where: { id: args.id } });

  return meme;
}

export const createAutoMemeIdea = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const newAutoMeme = await context.entities.AutoMemeIdea.create({
    data: {
      userId: context.user.id,
      topics: args.topics.join(', '),
      audience: args.audience,
    },
  });
}

export const deleteAutoMemeIdea = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const autoMemeIdea = await context.entities.AutoMemeIdea.findUnique({
    where: { id: args.id },
  });

  if (!autoMemeIdea) {
    throw new HttpError(404, 'No auto meme idea with id ' + args.id);
  }

  if (autoMemeIdea.userId !== context.user.id) {
    throw new HttpError(403, 'You are not the creator of this auto meme idea');
  }

  await context.entities.AutoMemeIdea.delete({ where: { id: args.id } });

  return autoMemeIdea;
}