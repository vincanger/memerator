import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getMeme from '@wasp/queries/getMeme';


export function MemePage() {
  const { memeId } = useParams();
  const { data: meme, isLoading, error } = useQuery(getMeme, { id: memeId });

  const [generatedMemeUrl, setGeneratedMemeUrl] = useState(null);

  useEffect(() => {
    if (meme) {

    }
  }, [meme]);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Generated Meme</h1>
      {generatedMemeUrl ? (
        <img src={generatedMemeUrl} alt='Generated Meme' className='max-w-full' />
      ) : (
        <p>No meme generated yet.</p>
      )}
      <Link to='/' className='text-blue-500'>Go back to homepage</Link>
    </div>
  );
}