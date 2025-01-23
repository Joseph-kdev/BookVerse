import React, { useState } from 'react'
import { searchBooks } from '../services/requests'
import { GoogleBook } from '../types'
import Book from './Book'
import Nav from './Nav'

export default function Search() {
  const [book, setBook] = useState("")
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([])
  
  const doSearch = async(event: { preventDefault: () => void }) => {
    event.preventDefault()
    const results = await searchBooks(book)
    setSearchedBooks(results)
  }
  
  return (
    <>
      <Nav />
      <div className="bg-white flex px-1 py-1 rounded-full border border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif] mt-2">
        <input type='email' value={book} onChange={(event) => setBook(event.target.value)} placeholder='Search Something...' className="w-full outline-none bg-white pl-4 text-sm" />
        <button onClick={doSearch} type='button'
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-sm rounded-full px-5 py-2.5">Search</button>
      </div>
      <div className='flex flex-wrap justify-evenly gap-4 md:grid md:grid-cols-5 lg:grid-cols-5 md:place-items-center mt-4'>
        {searchedBooks.map(bk => (
          <Book key={bk.id} id={bk.id} title={bk.title} authors={bk.authors} description={bk.description} publisher={bk.publisher} categories={bk.categories} imageLinks={bk.imageLinks}/>
        ))}
      </div>
    </>
  )
}
