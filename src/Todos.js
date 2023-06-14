import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Todo.css';


function Todos() {
  let {userid}=useParams();

  const [todos, setTodos] = useState([]);
  const [findTodos, setFindTodos] = useState(true);
  const [currentTodo,setCurrentTodo]=useState();

  


  const clickedTodo = (todoId) => {
    if(currentTodo===todoId){
      setCurrentTodo(null)
      return;
    }
    setCurrentTodo(todoId)

}
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

  const deleteTodo = () =>{
   
    const updatedTodos = todos.map((todo) =>{
      if (todo.id === currentTodo) {
        return { ...todo, deleted: !todo.deleted };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todosList", JSON.stringify(updatedTodos));

  }

  useEffect(() => {
    var todosFromLocal=JSON.parse(localStorage.getItem("todosList"))
    if(Array.isArray(todosFromLocal)){
      setTodos(todosFromLocal);
      setFindTodos(true);
    }
    else{
      const url = `http://localhost:3000/users/${userid}/todos`;
    
      const requestTodos = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      };
     fetch(url,requestTodos)
      .then((response) => response.json())
      .then((data) => {
        const sortesTodos=[...data].sort((a, b) => a.id - b.id);
        setTodos(sortesTodos);
        localStorage.setItem("todosList", JSON.stringify(sortesTodos));
      })
      .catch(() => setFindTodos(false))
    }
   },[]);
   

  if (findTodos) {
    let todosHtml = todos.map((todo) =>{
      if(todo.deleted===0){
        return(
            <div key={todo.id}>
              <input checked={todo.completed} onChange={() => handleCheckboxChange(todo.id)} type="checkbox"/>
              <button className={ todo.id === currentTodo?'selectedTodo':'todo'} key={todo.id} onClick={() => clickedTodo(todo.id)}>
              <label>{todo.id}. {todo.title}</label>
              </button>


              <div  style={{ visibility: todo.id === currentTodo ? 'visible' : 'collapse',display:todo.id === currentTodo ? 'flex' : 'none' }}>
                  <button onClick={deleteTodo}> 
                    delete todo
                  </button> 
              <div/>
            </div>


            
          </div>
        )
      }
      return null;
  });
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
