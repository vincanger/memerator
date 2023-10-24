import { useState, useEffect, FormEventHandler } from 'react';
import { Link } from '@wasp/router';
import { useQuery } from '@wasp/queries';
import createMeme from '@wasp/actions/createMeme';
// import getAllMemes from '@wasp/queries/getAllMemes';
import getMemeCount from '@wasp/queries/getMemeCount';
import getPaginatedMemes from '@wasp/queries/getPaginatedMemes';
import deleteMeme from '@wasp/actions/deleteMeme';
import useAuth from '@wasp/auth/useAuth';
import { useHistory } from 'react-router-dom';
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineRobot,
} from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';

export function HomePage() {
  const [topics, setTopics] = useState(['']);
  const [audience, setAudience] = useState('');
  const [isMemeGenerating, setIsMemeGenerating] = useState(false);
  const [ after, setAfter ] = useState(0);
  const [ pages, setPages ] = useState<number[]>([]);

  const history = useHistory();
  const { data: user } = useAuth();
  // const { data: memes, isLoading, error } = useQuery(getAllMemes);
  const { data: memeCount } = useQuery(getMemeCount);
  const { data: memes, isLoading, error } = useQuery(getPaginatedMemes, { first: 20, after: after});

  useEffect(() => {
    if(memeCount) {
      const numPages = Math.ceil(memeCount / 20);
      const pageNumbers = Array.from(Array(numPages).keys());
      setPages(pageNumbers);
      console.log(pageNumbers)
      console.log(after)
    }

  }, [memeCount]);

  const handleGenerateMeme: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // if (!user) {
    //   history.push('/login');
    //   return;
    // }
    if (topics.join('').trim().length === 0 || audience.length === 0) {
      alert('Please provide topic and audience');
      return;
    }
    try {
      setIsMemeGenerating(true);
      await createMeme({ topics, audience });
    } catch (error: any) {
      alert('Error generating meme: ' + error.message);
    } finally {
      setIsMemeGenerating(false);
    }
  };

  const handleDeleteMeme = async (id: string) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this meme?');
    if (!shouldDelete) return;
    try {
      await deleteMeme({ id: id });
    } catch (error: any) {
      alert('Error deleting meme: ' + error.message);
    }
  };

  if (error) return 'Error: ' + error;

  return (
    <div className='p-4 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-4'>Welcome to Memerator!</h1>
      <p className='mb-4'>Generate memes instantly. Log in to be able to edit memes!</p>
      <form onSubmit={handleGenerateMeme}>
        <div className='flex flex-col mb-4 max-w-[500px]'>
          <div className='flex justify-start items-center gap-2 mb-1'>
            <label htmlFor='topics' className='block font-bold mb-2'>
              Topics:
            </label>
            <button
              type='button'
              onClick={() => topics.length < 3 && setTopics([...topics, ''])}
              className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded'
            >
              <AiOutlinePlusCircle /> Add Topic
            </button>

            <button
              type='button'
              onClick={() => setTopics(topics.slice(0, -1))}
              className={`flex items-center gap-1 bg-red-500 hover:bg-red-700 border-2 text-white text-xs py-1 px-2 rounded ${
                topics.length > 1 ? '' : 'invisible'
              }`}
            >
              <AiOutlineMinusCircle /> Remove Topic
            </button>
          </div>
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
            className='p-1 min-w-[100%] border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'
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
      {/* create a pages component to select through paginated results */}
      <div className='flex justify-center mt-5'>
        {/* "First" page button */}
        <button
          className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded'
          onClick={() => setAfter(0)}
        >
          First Page
        </button>

        {/* "Prev" page button */}
        <button
          className={`flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded ${
            after === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => setAfter(after - 20)}
          disabled={after === 0} // disable if this is the first page
        >
          {'<'}
        </button>

        {/* Show current page */}
        <button className='flex items-center gap-1 bg-gray-200  border-2 text-black text-xs py-1 px-2 rounded' disabled>
          {after / 20 + 1}
        </button>

        {/* "Next" page button */}
        <button
          className={`flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded ${
            after / 20 === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => setAfter(after + 20)}
          disabled={after / 20 === pages.length - 1} // disable if this is the last page
        >
          {'>'}
        </button>

        {/* "Last" page button */}
        <button
          className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded'
          onClick={() => setAfter((pages.length - 1) * 20)}
        >
          Last Page
        </button>
      </div>
      {!isLoading ? (
        <div>
          <div className=' grid grid-cols-1 lg:grid-cols-3'>
            {!!memes && memes.length > 0 ? (
              memes.map((memeIdea) => (
                <div key={memeIdea.id} className='flex flex-col justify-between mt-4 p-4 bg-gray-100 rounded-lg'>
                  <img src={memeIdea.url} width='400px' />
                  <div>
                    <div className='flex flex-col items-start mt-2'>
                      <div>
                        <span className='text-sm text-gray-700'>Topics: </span>
                        <span className='text-sm italic text-gray-500'>{memeIdea.topics}</span>
                      </div>
                      <div>
                        <span className='text-sm text-gray-700'>Audience: </span>
                        <span className='text-sm italic text-gray-500'>{memeIdea.audience}</span>
                      </div>
                    </div>
                    {user && (user.isAdmin || user.id === memeIdea.userId) && (
                      <div className='flex items-center mt-2'>
                        <Link key={memeIdea.id} params={{ id: memeIdea.id }} to={'/meme/:id'}>
                          <button className='flex items-center gap-1 bg-primary-200 hover:bg-primary-300 border-2 text-black text-xs py-1 px-2 rounded'>
                            <AiOutlineEdit />
                            Edit Meme
                          </button>
                        </Link>
                        <button
                          className='flex items-center gap-1 bg-red-500 hover:bg-red-700 border-2 text-white text-xs py-1 px-2 rounded'
                          onClick={() => handleDeleteMeme(memeIdea.id)}
                        >
                          <AiOutlineDelete />
                          Delete Meme
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='flex justify-center mt-5'> :( no memes found</div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex justify-center mt-7 animate-spin'>
          <CgSpinner size='5rem' />
        </div>
      )}
    </div>
  );
}
