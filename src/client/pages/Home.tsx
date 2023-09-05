import { useState, FormEventHandler } from 'react';
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineRobot,
} from 'react-icons/ai';

export function HomePage() {
  const [topics, setTopics] = useState(['']);
  const [audience, setAudience] = useState('');
  const [isMemeGenerating, setIsMemeGenerating] = useState(false);


  const handleGenerateMeme: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    //...
  };

  const handleDeleteMeme = async (id: string) => {
    //...
  };

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Welcome to Memerator!</h1>
      <p className='mb-4'>Start generating meme ideas by providing topics and intended audience.</p>
      <form onSubmit={handleGenerateMeme}>
        <div className='mb-4 max-w-[500px]'>
          <label htmlFor='topics' className='block font-bold mb-2'>
            Topics:
          </label>
          {topics.map((topic, index) => (
            <input
              key={index}
              type='text'
              id='topics'
              value={topic}
              onChange={(e) => {
                const updatedTopics = [...topics];
                updatedTopics[index] = e.target.value;
                setTopics(updatedTopics);
              }}
              className='p-1 mr-1 mb-1 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'
            />
          ))}
          <div className='flex items-center my-2 gap-1'>
            <button
              type='button'
              onClick={() => topics.length < 3 && setTopics([...topics, ''])}
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
          type='submit'
          className={`flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-sm font-bold py-1 px-2 rounded ${
            isMemeGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } $}`}
        >
          <AiOutlineRobot />
          {!isMemeGenerating ? 'Generate Meme' : 'Generating...'}
        </button>
      </form>
      {/* 
       * TODO: This is where you will display the memes that the user has generated.
       */}
    </div>
  );
}
