import React from 'react'
import { Outlet } from 'react-router'
import Header from './componenets/layout/Header'
import Futter from './componenets/layout/Futter'
import CustomerSupportChatbot from './componenets/layout/CustomerSupportChatbot'

const Rootlayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <CustomerSupportChatbot/>
    <Futter/>
    </>
  )
}

export default Rootlayout
