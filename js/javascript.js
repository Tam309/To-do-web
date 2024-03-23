const BACKEND_ROOT_URL = 'http://localhost:3001';
//const BACKEND_ROOT_URL = 'https://to-do-app-backend-owoo.onrender.com';
import { Todo } from './class/Todo.js';

const todos = new Todo(BACKEND_ROOT_URL);
let input = document.getElementById('input');   
let button = document.getElementById('button');
let list = document.getElementById('task-list');

// Initially enable the input field
input.disabled = false;

// Function to render a task item
const renderTask = (task) => {
    let listItem = document.createElement('li');
    listItem.innerHTML = task.getText();
    listItem.setAttribute('data-key', task.getId());
    list.appendChild(listItem);

    input.value = '';
    let span = document.createElement('span');
    let i = document.createElement('i');
    i.className = 'fa-solid fa-trash';
    span.appendChild(i);
    listItem.appendChild(span);

    // Add event listener to mark task as completed
    listItem.addEventListener('click', function() {
        if (listItem.style.textDecoration === 'line-through') {
            listItem.style.textDecoration = 'none';
        } else {
            listItem.style.textDecoration = 'line-through';
        }
    });

    // Add event listener to delete task
    span.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the li click event from firing
        const taskId = task.getId(); // Get the task ID
        todos.removeTask(taskId).then(() => {
            list.removeChild(listItem); // Remove the task item from the list
        }).catch((error) => {
            alert("Error deleting task: " + error.message);
        });
    });
};

// Function to fetch tasks from the backend
const getTasks = () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach(task => {
            renderTask(task);
        })
    }).catch((err) => {
        alert("Error retrieving tasks: " + err.message);
    })
}

// Event listener for button click
button.addEventListener('click', function(event) {
    let task = input.value.trim(); // Trim whitespace from input value
    event.preventDefault();
    if (task === '') {
        alert('Please enter a task');
    } else {
        todos.addTask(task).then((task) => {
            renderTask(task);
            input.focus();
        });
    }
});

// Event listener for input keypress
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        let task = input.value.trim(); // Trim whitespace from input value
        if (task === '') {
            alert('Please enter a task');
        } else {
            todos.addTask(task).then((task) => {
                renderTask(task);
                input.focus();
            });
        }
    }
});

// Fetch tasks when the page loads
window.addEventListener('load', getTasks);
