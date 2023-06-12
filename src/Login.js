import {useState} from "react"
import { useNavigate } from "react-router-dom";
import './login.css';

 function Login(){
   const [userName,setUserName]=useState("");
   const [password,setPassword]=useState("");
   const [isSubmitFocused, setIsSubmitFocused] = useState(false);
   const navigate=useNavigate(); 


   const handleFocus = () => {
    setIsSubmitFocused(true);
  };

  const handleBlur = () => {
    setIsSubmitFocused(false);
  };


   const changeUserName= (event)=>{
    setUserName(event.target.value);
   }
   const changePassword= (event)=>{
    setPassword(event.target.value);
   }

   const signIn=()=>{
    navigate("/register");
   }

  
   const checkUser = (event) => {
    debugger;
    const url = "http://localhost:3000/login";
  
    const requestLogin = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    };
  
    fetch(url, requestLogin)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("The password or the username is incorrect");
        }
      })
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        navigate(`/users/${user.id}/home`);
      })
      .catch((error) => {
        setPassword("");
        setUserName("");
        alert(error.message);
      });
  
    event.preventDefault();
  };
  
  

  
   return (
    <div className="centered-container">
    <form className="formSubmit"  onSubmit={checkUser}>
      <label>User name:</label>
      <input
      required
      value={userName}
      onChange={changeUserName}
      placeholder="name"
      /><br/>
      <label>Password:</label>
      <input
      required
      value={password}
      onChange={changePassword}
      placeholder="password"
      type="password"
      /><br/>
        <input 
        type="submit"
         value="Submit"
         className={isSubmitFocused ? "bold-on-submit" : ""}
         onFocus={handleFocus}
         onBlur={handleBlur}
         />
    </form>
    <button onClick={signIn}>Sign in</button>
    </div>
   )
}
export default Login;