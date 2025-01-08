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
import Profile from './pages/profile';
import Adminlayout from './components/Navbar/Admin-layout'
import PrivateRoute from './components/utils/Privatroute';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path ='/' element={<Landing/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/signup' element={<Signup/>}/>

        <Route element={<Adminlayout/>}>
          <Route path ='/home' element={<PrivateRoute allowedRoles={['host']}><Home /></PrivateRoute>}/>
          <Route path ='/create' element={<PrivateRoute allowedRoles={['host']}><Create/></PrivateRoute>}/>
          <Route path ='/hosted' element={<PrivateRoute allowedRoles={['host']}> <Hosted/> </PrivateRoute>}/>
          <Route path ='/booking' element={<PrivateRoute allowedRoles={['host']}><Booking/></PrivateRoute>}/>
          <Route path ='/messages' element={<PrivateRoute allowedRoles={['host']}><Messages/></PrivateRoute>}/>
          <Route path ='/notifications' element={<PrivateRoute allowedRoles={['host']}><Notification/></PrivateRoute>}/>
          <Route path ='/payment' element={<PrivateRoute allowedRoles={['host']}><Payment/></PrivateRoute>}/>
          <Route path ='/profile' element={<PrivateRoute allowedRoles={['host']}><Profile/></PrivateRoute>}/>
        </Route>
      </Routes>

    </Router>
    </>
  )
}

export default App
