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

function App() {
  return (
    <PopupProvider>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<SignUp/>}/>
      </Routes>
      <CreateNewTask/>
      <EditTask/>
      <DeleteTask/>
    </PopupProvider>
  );
}

export default App;
