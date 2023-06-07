import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import Home from "./Home.js";
import Albums from "./Albums.js";
import Posts from "./Posts.js";
import Todos from "./Todos.js"
import Photos from "./Photos.js"
import Login from "./Login.js"
import UserNav from "./UserNav.js"
import Info from "./Info.js"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/users/:userid" element={<UserNav/>}> 
          <Route path="home" element={<Home/>}/>
          <Route path="albums" element={<Albums />}/>
          <Route path="todos" element={<Todos/>}/>
          <Route path="posts" element={<Posts/>} />
          <Route path="info" element={<Info/>} />
        </Route>      
        
        <Route path="users/:userid/albums/:albumId/photos" element={<Photos/>}/>

      </Routes>
    </BrowserRouter>
   
  );
}

