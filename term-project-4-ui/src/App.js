
import './App.css';
import { Routes, Route } from 'react-router-dom';
import NotificationPage from './pages/notification-list-data'
import SignIn from './pages/login-pages/sign-in'
import SignUp from './pages/login-pages/sign-up'

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
