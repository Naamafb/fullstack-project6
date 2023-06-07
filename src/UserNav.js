import { Outlet, Link } from "react-router-dom";
import "./UserNav.css"

export function UserNav() {
  const handleLogout =()=> {
    localStorage.removeItem("user")
    localStorage.removeItem("todosList")
  };
  var userJson=localStorage.getItem("user");
  var user=JSON.parse(userJson)
  

  return (
    <>
      <nav>
        <ul className="nav-links">
        <li>
           <h3>Hi {user.name}</h3>
          </li>
          <li>
            <Link to={`/users/${user.id}/todos`}>Todos</Link>
          </li>
          <li>
            <Link to={`/users/${user.id}/posts`}>Posts</Link>
          </li>
          <li>
            <Link to={`/users/${user.id}/albums`}>Albums</Link>
          </li>
          <li>
            <Link to={`/users/${user.id}/info`}>Info</Link>
          </li>
          <li>
            <Link to={`/login`} onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default UserNav;