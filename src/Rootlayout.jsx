import React from 'react'
import { Outlet } from 'react-router'
import Header from './componenets/layout/Header'
import Futter from './componenets/layout/Futter'

const Rootlayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <Futter/>
    </>
  )
}

export default Rootlayout
