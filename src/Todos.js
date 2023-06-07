import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Todo.css';


function Todos() {
  let {userid}=useParams();

  const [todos, setTodos] = useState([]);
  const [findTodos, setFindTodos] = useState(true);
  
  const handleCheckboxChange = (todoId) => {
    const updatedTodos = todos.map((todo) =>{
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todosList", JSON.stringify(updatedTodos));
  };

  const sortHandleChange= (e)=>{

    const sort = e.target.value;
    var updatedTodos=[...todos]
    if(sort==="completed"){
     updatedTodos = [...todos].sort((x, y)=> Number(x.completed) - Number(y.completed))
    }
    if(sort==="abc")
    {
      updatedTodos=[...todos].sort((x,y)=>x.title.localeCompare(y.title));
    }
    setTodos(updatedTodos);
    localStorage.setItem("todosList", JSON.stringify(updatedTodos));

  };

  useEffect(() => {
    var todosFromLocal=JSON.parse(localStorage.getItem("todosList"))
    if(Array.isArray(todosFromLocal)){
      setTodos(todosFromLocal);
      setFindTodos(true);
    }
    else{
     fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userid}`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        localStorage.setItem("todosList", JSON.stringify(data));
      })
      .catch(() => setFindTodos(false))
    }
   },[]);
   

  if (findTodos) {
    let todosHtml = todos.map((todo) => (
        <div key={todo.id}>
            <input checked={todo.completed} onChange={() => handleCheckboxChange(todo.id)} type="checkbox"/>
            <label>{todo.title}</label>
        </div>
    ));
    return (
      <div className="TodoContainer">
        <div>
          <label htmlFor="sort">Select a sort form:  </label>
          <select id="cars" className="SortSelect" onChange={sortHandleChange}>
            <option value="abc">abc</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <div className="TodoList">
          {todosHtml}
        </div>
      </div>

    );
  }

  return (
    <h2>There are no todos</h2>
  );
}

export default Todos;
