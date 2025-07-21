import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Library from './pages/Library'
import BookPage from './pages/BookPage'
import Explore from './pages/Explore'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/search' element={<Search />} />
        <Route path='/login' element={<Login />} />
        <Route path='/library' element={<Library />} />
        <Route path="/book/:title" element={<BookPage />} />
      </Routes>
    </Router>
  )
}
