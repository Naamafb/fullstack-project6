import './Todo.css';

function Info(){
    var userJson=localStorage.getItem("user");
    var user=JSON.parse(userJson);
return (
    <div className="TodoContainer">
        <h1>Name: {user.name}</h1>
        <h3>Phone: {user.phone}</h3>
        <h3>Email: {user.email}</h3>
        <br/>
        <h3>Website: {user.website}</h3>

    </div>
);
}
export default Info;