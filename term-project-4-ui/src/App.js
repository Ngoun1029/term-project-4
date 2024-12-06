import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotificationPage from './pages/notification-list-data'
import SignIn from './pages/login-pages/sign-in';
import SignUp from './pages/login-pages/sign-up';
import Home from './pages/Home';
import CreateNewTask from './components/actions/CreateNewTask';
import { PopupProvider } from './components/context/PopupContext';
import EditTask from './components/actions/EditTask';
import DeleteTask from './components/actions/DeleteTask';
import Profile from './pages/Profile';
import EmailVerify from './pages/login-pages/EmailVerify';
import EmailVerifyCode from './pages/login-pages/EmailVerifyCode';
import TaskNotifications from './pages/notification-list-data';

function App() {
  return (
    <PopupProvider>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/email-verify-code' element={<EmailVerifyCode/>}/>
        <Route path='/notification' element={<TaskNotifications/>}/>
      </Routes>
      <CreateNewTask/>
      <EditTask/>
      <DeleteTask/>
    </PopupProvider>
  );
}

export default App;
