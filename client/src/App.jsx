import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booking from './pages/Bookings';
import Create from './pages/Creates';
import Home from './pages/Dashboard';
import Hosted from './pages/hosted';
import Landing from './pages/landing';
import Login from './pages/Login';
import Messages from './pages/messages';
import Notification from './pages/notification';
import Signup from './pages/Signup';
import Payment from './pages/payment';  
import Profile from './pages/Account';
import Account from './pages/Profile'
import Adminlayout from './components/Navbar/Admin-layout'
import PrivateRoute from './components/utils/Privatroute';
import { useSelector } from "react-redux";

const App = () => {


  const role = useSelector((state) => state.auth.role);

  return (
    <>
    <Router>
      <Routes>
        <Route path ='/' element={<Landing/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<Signup/>}/>

        <Route element={<Adminlayout/>}>
          <Route path ='/home' element={<PrivateRoute allowedRoles={role}><Home /></PrivateRoute>}/>
          <Route path ='/create' element={<PrivateRoute allowedRoles={role}><Create/></PrivateRoute>}/>
          <Route path ='/hosted' element={<PrivateRoute allowedRoles={role}> <Hosted/> </PrivateRoute>}/>
          <Route path ='/booking' element={<PrivateRoute allowedRoles={role}><Booking/></PrivateRoute>}/>
          <Route path ='/messages' element={<PrivateRoute allowedRoles={role}><Messages/></PrivateRoute>}/>
          <Route path ='/notifications' element={<PrivateRoute allowedRoles={role}><Notification/></PrivateRoute>}/>
          <Route path ='/payments' element={<PrivateRoute allowedRoles={role}><Payment/></PrivateRoute>}/>
          <Route path ='/profile' element={<PrivateRoute allowedRoles={role}><Profile/></PrivateRoute>}/>
          <Route path ='/account' element={<PrivateRoute allowedRoles={role}><Account/></PrivateRoute>}/>
        </Route>
      </Routes>

    </Router>
    </>
  )
}

export default App
