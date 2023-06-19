import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Todo.css';

function Todos() {
  let { userid } = useParams();

  const [todos, setTodos] = useState([]);
  const [findTodos, setFindTodos] = useState(true);
  const [currentTodo, setCurrentTodo] = useState();
  const [newTodo,setNewTodo]=useState('');

  const handleNewTodoChange = (e) => {
    setNewTodo(e.target.value);
  };

  const clickedTodo = (todoId) => {
    if (currentTodo === todoId) {
      setCurrentTodo(null);
      return;
    }
    setCurrentTodo(todoId);
  };

  const handleCheckboxChange = (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
   

    const todoToUpdate = updatedTodos.find((todo) => todo.id === todoId);
    if (!todoToUpdate) return;
  
    const url = `http://localhost:3000/users/${userid}/todos`;
  
    const requestUpdateTodo = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoToUpdate),
    };
  
    fetch(url, requestUpdateTodo)
      .then((response)=>{
        setTodos(updatedTodos);
        localStorage.setItem('todosList', JSON.stringify(updatedTodos));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const sortHandleChange = (e) => {
    const sort = e.target.value;
    let updatedTodos = [...todos];
    if (sort === 'completed') {
      updatedTodos = [...todos].sort((x, y) => Number(x.completed) - Number(y.completed));
    }
    if (sort === 'abc') {
      updatedTodos = [...todos].sort((x, y) => x.title.localeCompare(y.title));
    }
    setTodos(updatedTodos);
    localStorage.setItem('todosList', JSON.stringify(updatedTodos));
  };

  const addNewTodo = () =>{
    debugger;
    const url = `http://localhost:3000/users/${userid}/todos`;
  
    const requestNewTodo = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTodo }),
    };
  
    fetch(url, requestNewTodo)
        .then((response) => response.json())
        .then((data) => {
          const sortedTodos = [...data].sort((a, b) => a.id - b.id);
          console.log(sortedTodos);
          setTodos(sortedTodos);
          localStorage.setItem('todosList', JSON.stringify(sortedTodos));
          setNewTodo("");
        })
        .catch(() => setFindTodos(false));
  }

  const deleteTodo = () => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === currentTodo) {
        return { ...todo, deleted: !todo.deleted };
      }
      return todo;
    });const url = `http://localhost:3000/users/${userid}/todos/${currentTodo}`;

    const requestDeleteTodo = {
      method: 'DELETE',
    };

    fetch(url, requestDeleteTodo)
      .then(response => {
        if (response.status===200) {
          console.log('Todo deleted successfully');
          setTodos(updatedTodos);
          localStorage.setItem('todosList', JSON.stringify(updatedTodos));
        } else {
          console.log('Failed to delete todo');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });

    
  };

  const updateTodo = (todoTitle) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === currentTodo) {
        return { ...todo, title: todoTitle };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const finishUpdate = (todoId) => {
    localStorage.setItem('todosList', JSON.stringify(todos));
    const todoToUpdate = todos.find((todo) => todo.id === todoId);
    if (!todoToUpdate) return;
  
    const url = `http://localhost:3000/users/${userid}/todos`;
  
    const requestUpdateTodo = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoToUpdate),
    };
  
    fetch(url, requestUpdateTodo)
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const todosFromLocal = JSON.parse(localStorage.getItem('todosList'));
    if (Array.isArray(todosFromLocal)) {
      setTodos(todosFromLocal);
      setFindTodos(true);
    } else {
      const url = `http://localhost:3000/users/${userid}/todos`;

      const requestTodos = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      fetch(url, requestTodos)
        .then((response) => response.json())
        .then((data) => {
          const sortedTodos = [...data].sort((a, b) => a.id - b.id);
          setTodos(sortedTodos);
          localStorage.setItem('todosList', JSON.stringify(sortedTodos));
        })
        .catch(() => setFindTodos(false));
    }
  }, []);

  if (findTodos) {
    let todosHtml = todos.map((todo) => {
      if (todo.deleted === 0) {
        return (
          <div className="todo-item" key={todo.id}>
            <input
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.id)}
              type="checkbox"
            />
            <button className={todo.id === currentTodo ? 'selectedTodo' : 'todo'} onClick={() => clickedTodo(todo.id)}>
            <div className="todo-input-container">
                <label className="todo-label">{todos.indexOf(todo) + 1}.</label>
                <input
                  className="todo-input"
                  value={todo.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    updateTodo(newTitle);
                  }}
                />
            </div>
            </button>
            <div style={{ visibility: todo.id === currentTodo ? 'visible' : 'collapse', display: todo.id === currentTodo ? 'flex' : 'none' }}>
              <button className="delete-button" onClick={deleteTodo}>
                delete
              </button>
            </div>
            <div style={{ visibility: todo.id === currentTodo ? 'visible' : 'collapse', display: todo.id === currentTodo ? 'flex' : 'none' }}>
              <button className="update-button" onClick={() => finishUpdate(todo.id)}>
                update
              </button>
            </div>
          </div>
        );
      }
      return null;
    });

    return (
      <div className="TodoContainer">
        <div className='add todo'>
          <input 
          value={newTodo}
          placeholder='add new todo'
          onChange={handleNewTodoChange}
          />
          <button onClick={addNewTodo}>add todo</button>
        </div>
        <div>
          {/* <label htmlFor="sort">Select a sort form: </label>
          <select id="cars" className="SortSelect" onChange={sortHandleChange}>
            <option value="abc">abc</option>
            <option value="completed">completed</option>
          </select> */}
        </div>
        <div className="TodoList">{todosHtml}</div>
      </div>
    );
  }

  return <h2>There are no todos</h2>;
}

export default Todos;
