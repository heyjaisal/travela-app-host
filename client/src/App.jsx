import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booking from './pages/Bookings';
import Create from './pages/Creates';
import Home from './pages/Dashboard';
import Hosted from './pages/Hosted';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Notification from './pages/Notification';
import Signup from './pages/Signup';
import Payment from './pages/Payment';  
import Profile from './pages/Profile';
import Adminlayout from './components/Navbar/Admin-layout'

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path ='/' element={<Landing/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<Signup/>}/>

        <Route element={<Adminlayout/>}>
          <Route path ='/home' element={<Home/>}/>
          <Route path ='/create' element={<Create/>}/>
          <Route path ='/hosted' element={<Hosted/>}/>
          <Route path ='/booking' element={<Booking/>}/>
          <Route path ='/messages' element={<Messages/>}/>
          <Route path ='/notification' element={<Notification/>}/>
          <Route path ='/payment' element={<Payment/>}/>
          <Route path ='/profile' element={<Profile/>}/>
        </Route>
      </Routes>

    </Router>
    </>
  )
}

export default App
