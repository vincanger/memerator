import axios from 'axios';
import { stringify } from 'querystring';
import HttpError from '@wasp/core/HttpError.js';

import type { CreateMemeIdea } from '@wasp/actions/types';
import type { Meme } from '@wasp/entities';

type GenerateMemeArgs = { id?: string; templateName: string; text0: string; text1: string };

export const fetchMemeTemplates = async () => {
  try {
    const response = await axios.get('https://api.imgflip.com/get_memes');
    return response.data.data.memes;
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error fetching meme templates');
  }
};

export const generateMemeImage: CreateMemeIdea<GenerateMemeArgs, Meme> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    console.log('generateMemeImage args: ', args);

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
        },
      });
    }

    return memeIdea;
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error generating meme image');
  }
};
