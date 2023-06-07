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
        <h2>Address:</h2>
        <h3>Street: {user.address.street}</h3>
        <h3>Suite: {user.address.suite}</h3>
        <h3>City: {user.address.city}</h3>
        <h3>Zipcode: {user.address.zipcode}</h3>
        <br/>
        <h3>Website: {user.website}</h3>
        <h3>Company name: {user.company.name}</h3>

    </div>
);
}
export default Info;