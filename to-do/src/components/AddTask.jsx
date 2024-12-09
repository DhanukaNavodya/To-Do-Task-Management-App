import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getAuth,signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AddTaskImg from '../images/addTask.jpg'

function ToDo() {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [date, setDate] = useState('');
  const [toDoList, setToDoList] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        console.log('Logged-in user:', currentUser.email);
      } else {
        console.log('No user is logged in');
      }
    };
    fetchUser();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [auth]);

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (user?.email) {
          const userTasks = todos.filter((todo) => todo.createdBy === user.email);
          setToDoList(userTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user?.email) {
      fetchToDoList();
    }
  }, [user]);

  const addToDo = async () => {
    if (!task.trim() || !description.trim() || !date.trim()) {
      Swal.fire('Error', 'All fields are required.', 'warning');
      return;
    }

    try {
      const newTask = {
        task: task.trim(),
        description: description.trim(),
        priority,
        date,
        createdBy: user?.email || 'Anonymous',
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'todos'), newTask);

      setToDoList([...toDoList, { id: docRef.id, ...newTask }]);
      setTask('');
      setDescription('');
      setPriority('low');
      setDate('');
      Swal.fire('Success', 'Task added successfully!', 'success');
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire('Error', 'Failed to add task. Please try again.', 'error');
    }
  };

  const deleteToDo = async (index) => {
    const todoToDelete = toDoList[index];

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, 'todos', todoToDelete.id);
          await deleteDoc(docRef);

          setToDoList(toDoList.filter((_, i) => i !== index));
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting document:', error);
          Swal.fire('Error', 'Failed to delete task. Please try again.', 'error');
        }
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('loggedInUser');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      Swal.fire('Error', 'There was an error signing out. Please try again.', 'error');
    }
  };

  return (
    <div className="m-10">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-center text-3xl text-green-500 flex-grow">To-Do List</h1>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded-md"
      >
        Sign Out
      </button>
    </div>
  
    <div className="App max-w-5xl mx-auto p-6">
      {user && (
        <div className="user-details mb-6 text-center">
          {/* <p><strong>Email:</strong> {user.email}</p> */}
        </div>
      )}
  
      {/* Form and Image Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        {/* Form Section */}
        <div className="AddTask w-full md:w-1/2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
            className="w-full p-3 mb-3 border border-gray-300 rounded-md"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded-md"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            className="w-full p-3 h-24 mb-3 border border-gray-300 rounded-md"
          />
          <button
            onClick={addToDo}
            className="w-full p-3 bg-green-500 text-white rounded-md cursor-pointer"
          >
            Add Task
          </button>
        </div>
  
        {/* Image Section */}
        <div className="hidden md:block w-full md:w-1/2">
          <img
            src={AddTaskImg}
            alt="Task management illustration"
            className="rounded-md"
          />
        </div>
      </div>
  
      {/* To-Do List Section */}
      <div className="ToDoList">
        <ul className="list-none p-0">
          {toDoList.map((todo, index) => (
            <li
              key={todo.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex flex-col w-full">
                <p className="font-semibold text-lg text-gray-800 w-40">
                  <strong>Task:</strong> {todo.task}
                </p>
                <p
                  className={`${
                    todo.priority === 'high' ? 'text-red-500' : ''
                  } ${todo.priority === 'medium' ? 'text-yellow-500' : ''} ${
                    todo.priority === 'low' ? 'text-green-500' : ''
                  }`}
                >
                  <strong>Priority:</strong> {todo.priority}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> <br />
                  {todo.description}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {todo.date}
                </p>
              </div>
              <button
                onClick={() => deleteToDo(index)}
                className="bg-transparent border-none text-red-500 text-2xl cursor-pointer"
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  
  );
}

export default ToDo;
