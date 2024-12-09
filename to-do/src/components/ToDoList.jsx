import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '../firebase';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Img1 from '../images/img1.jpg';
import Swal from 'sweetalert2';
import { getAuth, signOut } from 'firebase/auth';

function ToDoList() {
  const [toDoList, setToDoList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({ task: '', priority: '', description: '', date: '' });
  const [filterPriority, setFilterPriority] = useState('all');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  // Fetch logged-in user and their tasks
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const currentUser = auth.currentUser || JSON.parse(localStorage.getItem('loggedInUser'));
      if (currentUser) {
        setUser(currentUser);

        try {
          const querySnapshot = await getDocs(collection(db, 'todos'));
          const todos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter tasks based on the current user's email
          const userTasks = todos.filter((todo) => todo.createdBy === currentUser.email);
          setToDoList(userTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchUserAndTasks();
  }, [auth]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const updateTask = async () => {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const taskDocRef = doc(db, 'todos', selectedTask.id);
          await updateDoc(taskDocRef, editValues);

          setToDoList((prevList) =>
            prevList.map((task) =>
              task.id === selectedTask.id ? { ...task, ...editValues } : task
            )
          );

          Swal.fire('Saved!', 'The task has been updated successfully.', 'success');
          setEditMode(false);
          setSelectedTask(null);
        } catch (error) {
          console.error('Error updating task: ', error);
          Swal.fire('Error', 'There was an error updating the task. Please try again.', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes not saved', 'No changes were made to the task.', 'info');
        setEditMode(false);
      }
    });
  };

  const deleteTask = async (taskId) => {
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
          await deleteDoc(doc(db, 'todos', taskId));
          setToDoList((prevList) => prevList.filter((task) => task.id !== taskId));
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting task:', error);
          Swal.fire('Error!', 'There was an error deleting the task. Please try again.', 'error');
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

  const filteredToDoList = toDoList.filter((task) => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  return (
    <div className='m-10'>
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-center text-3xl text-green-500 flex-grow">To-Do List</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
    <div className="ToDoList p-6">
     <div className="ToDoList p-6">
        
        {/* Other components and code */}
      </div>

  
      {user && (
        <div className="user-details mb-6 text-center">
          {/* <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email}</p> */}
          
        </div>
      )}

      <div className="flex gap-20">
        <div className="flex gap-[660px]">
          <div className="mb-4">
            <label htmlFor="priorityFilter" className="text-gray-700 mr-2">Filter by Priority:</label>
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={() => navigate('/add-task')}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            >
              <FaPlus className="inline mr-2" /> Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex-grow">
          <ul className="list-none p-0">
            {filteredToDoList.map((task) => (
              <li
                key={task.id}
                onClick={() => {
                  setSelectedTask(task);
                  setEditValues(task);
                }}
                className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between cursor-pointer"
              >
                <p className="text-lg font-semibold text-gray-800">{task.task}</p>
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full text-white font-bold ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                >
                  {task.priority[0].toUpperCase()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/3">
          <img src={Img1} alt="home" className="w-full h-auto rounded-lg" />
        </div>
      </div>

      {selectedTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editMode ? 'Edit Task' : 'Task Details'}
            </h2>

            {editMode ? (
              <div>
                <input
                  name="task"
                  value={editValues.task}
                  onChange={handleEditChange}
                  placeholder="Task Name"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                />
                <select
                  name="priority"
                  value={editValues.priority}
                  onChange={handleEditChange}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <textarea
                  name="description"
                  value={editValues.description}
                  onChange={handleEditChange}
                  placeholder="Task Description"
                  className="w-full p-3 h-24 mb-3 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="date"
                  value={editValues.date}
                  onChange={handleEditChange}
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md"
                />
              </div>
            ) : (
              <div>
                <p><strong>Task:</strong> {selectedTask.task}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Date:</strong> {selectedTask.date}</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              {editMode ? (
                <button
                  onClick={updateTask}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-green-500 text-white p-2 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(selectedTask.id)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    Delete
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setSelectedTask(null);
                  setEditMode(false);
                }}
                className="bg-gray-500 text-white p-2 rounded-md ml-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default ToDoList;
