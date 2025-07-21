import React, { useState } from 'react'
import { searchBooks } from '../services/requests'
import { GoogleBook } from '../types'
import Book from '../components/Book'
import Nav from '../components/Nav'
import toast from 'react-hot-toast'

export default function Search() {
  const [book, setBook] = useState("")
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([])
  
  const doSearch = async(event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (book.length === 0) {
      toast.error("A book title is required")
      return
    }
    const results = await searchBooks(book)
    setSearchedBooks(results)
  }
  
  return (
    <section className='bg-light-background dark:bg-dark-background min-h-screen'>
      <Nav />
      <div className="bg-white flex px-1 py-1 rounded-full border border-light-secondary dark:border-dark-secondary overflow-hidden max-w-sm md:min-w-[70vw] mx-auto font-[sans-serif] mt-2">
        <input type='email' value={book} onChange={(event) => setBook(event.target.value)} placeholder='Crime and Punishment...' className="w-full outline-none bg-white pl-4 text-sm" />
        <button onClick={doSearch} type='button'
          className="bg-light-accent dark:bg-dark-accent hover:bg-light-secondary dark:hover:bg-dark-secondary transition-all text-light-background dark:text-dark-background text-sm rounded-full px-5 py-2.5">Search</button>
      </div>
      <div className='bg-light-background dark:bg-dark-background'>
          {searchedBooks.length === 0 ? (
            <div className='p-4 flex flex-col justify-center items-center mt-5'>
              <img src='/find.svg' className=''/>
              <p className='text-center text-dark-background dark:text-light-background'>
                Find you next read.
              </p>
            </div>
          ): (
          <div className='flex flex-wrap justify-evenly gap-4 md:grid md:grid-cols-5 lg:grid-cols-5 md:place-items-center mt-4 md:px-[15%]'>
            {searchedBooks.map(bk => (
              <Book key={bk.id} id={bk.id} title={bk.title} authors={bk.authors} description={bk.description} publisher={bk.publisher} categories={bk.categories} imageLinks={bk.imageLinks} isbnValue={null}/>
            ))}
          </div>
          )}
      </div>
    </section>
  )
}
