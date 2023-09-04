import { useState, useEffect, FormEventHandler } from 'react';
import { useQuery } from '@wasp/queries';
import editMeme from '@wasp/actions/editMeme';
import getMeme from '@wasp/queries/getMeme';
import { useParams } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

export function EditMemePage() {
  // http://localhost:3000/meme-idea/573f283c-24e2-4c45-b6b9-543d0b7cc0c7
  const { id } = useParams<{ id: string }>();

  const [text0, setText0] = useState('');
  const [text1, setText1] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: meme, isLoading: isMemeLoading, error: memeError } = useQuery(getMeme, { id: id });

  useEffect(() => {
    if (meme) {
      setText0(meme.text0);
      setText1(meme.text1);
    }
  }, [meme]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await editMeme({ id, text0, text1 });
    } catch (error: any) {
      alert('Error generating meme: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMemeLoading) return 'Loading...';
  if (memeError) return 'Error: ' + memeError.message;

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Edit Meme</h1>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-2 items-end'>
          <div className='mb-2'>
            <label htmlFor='text0' className='block font-bold mb-2'>
              Text 0:
            </label>
            <textarea
              id='text0'
              value={text0}
              onChange={(e) => setText0(e.target.value)}
              className='border rounded px-2 py-1'
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='text1' className='block font-bold mb-2'>
              Text 1:
            </label>

            <div className='flex items-center mb-2'>
              <textarea
                id='text1'
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className='border rounded px-2 py-1'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          className={`flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-sm py-1 px-2 rounded ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } $}`}
        >
          <AiOutlineEdit />
          {!isLoading ? 'Edit Meme' : 'Editing...'}
        </button>
      </form>
      {!!meme && (
        <div className='mt-4  mb-2 bg-gray-100 rounded-lg p-4'>
          <img src={meme.url} width='500px' />
          <div className='flex flex-col items-start mt-2'>
            <div>
              <span className='text-sm text-gray-700'>Topics: </span>
              <span className='text-sm italic text-gray-500'>{meme.topics}</span>
            </div>
            <div>
              <span className='text-sm text-gray-700'>Audience: </span>
              <span className='text-sm italic text-gray-500'>{meme.audience}</span>
            </div>
            <div>
              <span className='text-sm text-gray-700'>ImgFlip Template: </span>
              <span className='text-sm italic text-gray-500'>{meme.template.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
