//this is App.jsx
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Signin from './Auth/Signin';
import Login from './Auth/Login';
import Home from './frontpage/Home'
import Authe from './Auth/Authe';
import Profile from './dashboard/Profile';
import Dashboard from './dashboard/Dasgboard'
import Dhome from './dashboard/Dhome';
import Search from './dashboard/Search';
import Addpost from './dashboard/Addpost';
import Message from './dashboard/Message';
import ProfileSetup from './Auth/ProfileSetup';
import Userposts from './dashboard/Userposts';
import TargetProfile from './dashboard/Targetprofile';

function App() {
  return (
    
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Authe />} >
          <Route path='login' element={<Login />} />
          <Route path='create' element={<Signin />} /> 
        </Route>
        <Route path='/setup' element={<ProfileSetup />} />
        <Route path='/dashboard' element={<Dashboard />} >
        <Route path='home' element={<Dhome />} />
        <Route path='search' element={<Search />} />
        <Route path='addpost' element={<Addpost/>} />
        <Route path='message' element={<Message />} />
        <Route path='profile' element={<Profile />} />
        <Route path='userposts' element= {<Userposts />} />
        <Route path='target/:targetname' element={<TargetProfile />} />
        </Route>
      </Routes>
   
  );
}

export default App;
