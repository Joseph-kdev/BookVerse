import React from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { GoogleBook } from '../types';
import Nav from './Nav';

export default function BookPage() {
    const { title } = useParams();
    const location = useLocation()

    const bookData = location.state as GoogleBook
  return (
    <div className='bg-light-background dark:bg-dark-background'>
      <Nav />
    <div className='text-center text-2xl mt-2'>
      {title}
    </div>
    <div className='flex flex-col-reverse items-center mt-3 px-[5%] md:flex-row md:justify-between md:items-start'>
    <div className='md:w-[70vw] bg-light-primary bg-opacity-70 dark:bg-dark-primary p-2 rounded-md'>
      <p className='text-lg'>Description:</p>
        {bookData.description}
        <hr  className='my-2'/>
      <p>
          Author(s): {bookData.authors?.map(a => (
            <span>
              {a}
            </span>
          ))}
        </p>
        <p>
          Publisher: {bookData?.publisher}
        </p>
        <p>
          Genre(s): {bookData.categories?.map(g => (
            <span>
              {g}
            </span>
          ))}
        </p>
    </div>
    <div className='mb-2'>
      <img src={bookData.imageLinks?.thumbnail} alt={bookData.title} className=''/>
    </div>
    </div>
    <div className=''>
      <div>

      </div>
    </div>
    </div>
  )
}
