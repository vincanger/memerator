import React, { useState, useEffect } from 'react';
import { useQuery } from '@wasp/queries';
import editMeme from '@wasp/actions/editMeme';
import getMeme from '@wasp/queries/getMeme';
import { useParams } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

export function MemeIdeaPage() {
  // http://localhost:3000/meme-idea/573f283c-24e2-4c45-b6b9-543d0b7cc0c7
  const { id } = useParams();

  const [text0, setText0] = useState('');
  const [text1, setText1] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMemeIdea, setGeneratedMemeIdea] = useState(null);

  const { data: meme, isLoading: isMemeLoading, error: memeError } = useQuery(getMeme, { id: id });

  useEffect(() => {
    if (meme) {
      setText0(meme.text0);
      setText1(meme.text1);
    }
  }, [meme]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const generatedMeme = await editMeme({ id, text0, text1 });
      setGeneratedMemeIdea(generatedMeme);
    } catch (error) {
      alert('Error generating meme: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isMemeLoading) return 'Loading...';
  if (memeError) return 'Error: ' + memeError.message;

  return (
    <div className='p-4'>
      <h1 className='text-3xl mb-4'>Meme Editor</h1>
      <div className='flex gap-2 items-end'>
        <div className='mb-2'>
          <label className='block font-bold text-sm'>Text 0:</label>
          <textarea value={text0} onChange={(e) => setText0(e.target.value)} className='border rounded px-2 py-1' />
        </div>
        <div className='mb-2'>
          <label className='block font-bold text-sm'>Text 1:</label>

          <div className='flex items-center mb-2'>
            <textarea value={text1} onChange={(e) => setText1(e.target.value)} className='border rounded px-2 py-1' />
          </div>
        </div>
      </div>
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-sm py-1 px-2 rounded ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } $}`}
          >
            <AiOutlineEdit />
            {!isLoading ? 'Edit Meme' : 'Editing...'}
          </button>
      {!!meme && (
        <div className='mt-4  mb-2 bg-gray-100 rounded-lg p-4'>
          <div className='flex items-center justify-start gap-2'>
            <h2 className='text-md'>{meme.template.name} </h2>
          </div>
          <img src={meme.url} />
        </div>
      )}
    </div>
  );
}
