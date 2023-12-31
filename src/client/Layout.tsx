import { ReactNode } from "react";
import { Link } from "react-router-dom";
import useAuth from '@wasp/auth/useAuth';
import logout from '@wasp/auth/logout';
import { FaRegLaughBeam } from 'react-icons/fa';
import "./Main.css";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { data: user } = useAuth();

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-black text-primary-300 p-4'>
        <div className='container mx-auto px-4 py-2 flex justify-between '>
          <div className='flex items-center gap-2'>
            <Link to='/'>
              <h1 className='flex items-center gap-2 text-xl2 font-semibold'>
                <FaRegLaughBeam /> Memerator
              </h1>
            </Link>
          </div>
          {user ? (
            <span>
              Hi, {user.username}!{' '}
              <button onClick={logout} className='text-xl2 underline'>
                (Log out)
              </button>
            </span>
          ) : (
            <Link to='/login'>
              <h1 className='text-xl2 underline'>Log in</h1>
            </Link>
          )}
        </div>
      </header>
      <main className='container mx-auto px-4 py-2 flex justify-center'>{children}</main>
      <footer>
        <div className='container mx-auto p-4'>
          <p className='text-center text-gray-500 text-sm'>
            Memerator ~ Powered by{' '}
            <a className='underline' href='https://wasp-lang.dev'>
              Wasp
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};