import { useParams } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getAutoMemes from '@wasp/queries/getAutoMemes';

export function AutoMemeIdeaPage() {
  const { autoMemeIdeaId } = useParams();

  const { data, isLoading, error } = useQuery(getAutoMemes, { autoMemeIdeaId });

  return (
    <div>
      <h1>Auto Meme Idea</h1>
      {data && (
        <div>
          <p>Topics: {data.topics}</p>
          <p>Audience: {data.audience}</p>
        </div>
      )}
      {/* {!!data.memes &&
        data.memes.length > 0 &&
        data.memes.map((meme) => (
          <div key={memeIdea.id} className='mt-4 p-4 bg-gray-100 rounded-lg'>
            <h3 className='font-bold mb-2'>Meme Idea:</h3>
            <img src={memeIdea.url} width='500px' />
            <div className='flex items-center mt-4'>
              <Link to={`/meme-idea/${memeIdea.id}`}>
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
          </div>
        ))} */}
    </div>
  );
}
