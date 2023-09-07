import axios from 'axios';

export const fetchAndStoreMemeTemplates = async (_args: any, context: any) => {
  console.log('.... ><><>< get meme templates cron starting ><><>< ....');

  try {
    const response = await axios.get('https://api.imgflip.com/get_memes');
  
    const promises = response.data.data.memes.map((meme: any) => {
      return context.entities.Template.upsert({
        where: { id: meme.id },
        create: {
          id: meme.id,
          name: meme.name,
          url: meme.url,
          width: meme.width,
          height: meme.height,
          boxCount: meme.box_count,
        },
        update: {},
      });
    });
  
    await Promise.all(promises);
  } catch (error) {
    console.error('error fetching meme templates: ', error)
  }
};
