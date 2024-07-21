import { Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/css/bootstrap.overwritten.css'
//import {Header, Footer} from './components/';
import Header from './components/Header'
import Footer from './components/Footer'
import '../src/css/App.css'
import { useDispatch } from 'react-redux';
import AuthVerify from './components/AuthVerify';
import React, { useCallback } from 'react';
import { logout } from './features/user/userSlice';

function App() {
  const dispatch = useDispatch();

  const logOut = useCallback(async () => {
    dispatch(logout());
  }, [dispatch]);

  //Routen
  return (
    <div>
      <Header />
      <main className='container-fluid content'>
        <Outlet />
      </main>
      <Footer />
      <AuthVerify logOut={logOut} />
    </div>
  )
}
//   <!-- <Route path="*" element={<NoPage />} -->
export default App
