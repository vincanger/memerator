import axios from 'axios';
import { stringify } from 'querystring';
import HttpError from '@wasp/core/HttpError.js';

type GenerateMemeArgs = {
  text0: string;
  text1: string;
  topics?: string;
  id?: string;
  templateId?: string;
  audience?: string;
};

export const fetchMemeTemplates = async () => {
  try {
    const response = await axios.get('https://api.imgflip.com/get_memes');
    return response.data.data.memes;
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error fetching meme templates');
  }
};

export const generateMemeImage = async (args: GenerateMemeArgs) => {
  console.log('args: ', args);

  try {
    const data = stringify({
      template_id: args.templateId,
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

    return url as string;
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error generating meme image');
  }
};
