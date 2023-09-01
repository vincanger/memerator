import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import createAutoMemeIdea from '@wasp/actions/createAutoMemeIdea';
import getAutoMemeIdeas from '@wasp/queries/getAutoMemeIdeas';
import deleteAutoMemeIdea from '@wasp/actions/deleteAutoMemeIdea';
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineRobot,
} from 'react-icons/ai';

export function AutoMemePage() {
  const [topics, setTopics] = useState(['']);
  const [audience, setAudience] = useState('');
  const [isMemeGenerating, setIsMemeGenerating] = useState(false);

  const { data: autoMemeIdeas, isLoading, error } = useQuery(getAutoMemeIdeas);

  const handleGenerateAutoMeme = async () => {
    try {
      setIsMemeGenerating(true);
      await createAutoMemeIdea({ topics, audience });
    } catch (error) {
      alert('Error generating meme: ' + error.message);
    } finally {
      setIsMemeGenerating(false);
    }
  };

  const handleDeleteAutoMeme = async (id) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this scheduled meme generator?');
    if (!shouldDelete) return;
    try {
      await deleteAutoMemeIdea({ id: id });
    } catch (error) {
      alert('Error deleting meme: ' + error.message);
    }
  };

  // if (isLoading) return 'Loading...';
  // if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Schedule Automatic Meme Generation!</h1>
      <p className='mb-4'>Generate meme ideas periodically by providing topics and intended audience.</p>
      <div className='flex-col justify-center gap-2 mb-4 '>
        {!!autoMemeIdeas &&
          autoMemeIdeas.length > 0 &&
          autoMemeIdeas.map((autoMemeIdea) => (
            <Link to={`/auto-meme/${autoMemeIdea.id}`} className>
              Topics: {autoMemeIdea.topics} / Audience: {autoMemeIdea.audience}
            </Link>
          ))}
        <label htmlFor='topics' className='block font-bold mb-2'>
          Topics:
        </label>
        {topics.map((topic, index) => (
          <input
            key={index}
            type='text'
            value={topic}
            onChange={(e) => {
              const updatedTopics = [...topics];
              updatedTopics[index] = e.target.value;
              setTopics(updatedTopics);
            }}
            className='p-1 mr-1 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'
          />
        ))}
        <div className='flex items-center my-2 gap-1'>
          <button
            onClick={() => setTopics([...topics, ''])}
            className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded'
          >
            <AiOutlinePlusCircle /> Add Topic
          </button>
          {topics.length > 1 && (
            <button
              onClick={() => setTopics(topics.slice(0, -1))}
              className='flex items-center gap-1 bg-red-500 hover:bg-red-700 border-2 text-white text-xs py-1 px-2 rounded'
            >
              <AiOutlineMinusCircle /> Remove Topic
            </button>
          )}
        </div>
      </div>
      <div className='mb-4'>
        <label htmlFor='audience' className='block font-bold mb-2'>
          Intended Audience:
        </label>
        <input
          type='text'
          id='audience'
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className='p-1 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'
        />
      </div>
      <button
        onClick={handleGenerateAutoMeme}
        className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-sm font-bold py-1 px-2 rounded'
      >
        <AiOutlineRobot /> Schedule Hourly Meme Generation
      </button>
    </div>
  );
}
