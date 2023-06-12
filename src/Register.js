import {useState} from "react"
import { useNavigate } from "react-router-dom";
import './login.css';
function Register(){
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [website,setWebsite]=useState("");
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
    const changeName= (event)=>{
        setName(event.target.value);
    }
    const changePhone= (event)=>{
        setPhone(event.target.value);
    }
    const changeEmail= (event)=>{
        setEmail(event.target.value);
    }
    const changeWebsite= (event)=>{
        setWebsite(event.target.value);
    }

    const registerUser = (event)=>{
        debugger;
    const url = "http://localhost:3000/register";
  
    const requestRegister = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name,phone,email,website,userName,password }),
    };
  
    fetch(url, requestRegister)
      .then((response) => {
        if (response.status === 200) {
            alert ("you  are added to the database ");
            navigate('/login');
        } else if (response.status === 202) {
         alert("you already  registerd");
         navigate("/login");
        }
      })
      .catch((error) => {
        setPassword("");
        setUserName("");
        alert(error.message);
      });
      event.preventDefault();
    }
    return (
        <div className="centered-container">
        <form className="formRegister"  onSubmit={registerUser}>
          <label>Name:</label>
          <input
          required
          value={name}
          onChange={changeName}
          placeholder="Name"
          /><br/>
          <label>Phone:</label>
          <input
          required
          value={phone}
          onChange={changePhone}
          placeholder="Phone"
          type="number"
          /><br/>
          <label>Email:</label>
          <input
          required
          value={email}
          onChange={changeEmail}
          placeholder="Email"
          type="email"
          /><br/>
          <label>Website:</label>
          <input
          required
          value={website}
          onChange={changeWebsite}
          placeholder="Website"
          /><br/>
          <label>User name:</label>
          <input
          required
          value={userName}
          onChange={changeUserName}
          placeholder="userName"
          /><br/>
          <label>Password:</label>
          <input
          required
          value={password}
          onChange={changePassword}
          placeholder="password"
          /><br/>
            <input 
            type="submit"
             value="Submit"
             className={isSubmitFocused ? "bold-on-submit" : ""}
             onFocus={handleFocus}
             onBlur={handleBlur}
             />
        </form>
        </div>
       )
}
export default Register;