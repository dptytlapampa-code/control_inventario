import React from 'react'
import Navbar from './Navbar'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="content">
        <Navbar />
        {children}
      </div>
    </div>
  )
}

export default Layout
