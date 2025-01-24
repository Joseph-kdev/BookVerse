import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Explore from './components/Explore'
import Search from './components/Search'
import Login from './components/Login'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/search' element={<Search />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}
