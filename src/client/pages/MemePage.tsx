import { Link } from '@wasp/router';

const Meme = () => { 
  return (
    <Link params={{ id: 1 }} to={'/meem/:id'} >
      <button>Edit Meme</button>
    </Link>
  )
}

export default Meme;