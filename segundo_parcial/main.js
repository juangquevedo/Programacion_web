import UsersService from './api.js'; // Importas la clase
import { renderUsers, showMessage, populateForm } from './dom.js';

const apiBaseURL = 'https://bbd7-2800-e2-2780-2479-2417-fe6c-d24e-ecb3.ngrok-free.app';
const usersService = new UsersService(apiBaseURL); 

const messageContainer = document.getElementById('message-container');
const usersContainer = document.getElementById('users-container');


// Evento para consultar usuarios
document.getElementById('get-users').addEventListener('click', async () => {
    try {
        const users = await usersService.getUsers();
        renderUsers(users, usersContainer);
    } catch (error) {
        showMessage(error.message, messageContainer);
    }
});

// Evento para mostrar el formulario de agregar usuarios
document.getElementById('add-user').addEventListener('click', () => {
    document.getElementById('users-form').classList.remove('hidden'); // Cambié el ID del formulario
    document.getElementById('form-title').textContent = 'Agregar usuario';
});

// Evento para mostrar el formulario de modificar usuarios
document.getElementById('update-user').addEventListener('click', () => {
    document.getElementById('users-form').classList.remove('hidden'); // Cambié el ID del formulario
    document.getElementById('form-title').textContent = 'Modificar Usuario';
});

// Evento de envío del formulario (para agregar o modificar usuarios)
document.getElementById('users-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('user-id').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const phone = document.getElementById('phone').value;
  const jobTitle = document.getElementById('job-title').value;
  const email = document.getElementById('email').value;
  const photo = document.getElementById('photo').value;

  const userData = {
      firstName,
      lastName,
      phone,
      jobTitle,
      email,
      photo
  };

  try {
      if (id) {
          await usersService.updateUsers(id, userData);
          showMessage('Usuario modificado correctamente', messageContainer);
      } else {
          await usersService.addUsers(userData);
          showMessage('Usuario agregado correctamente', messageContainer);
      }
  } catch (error) {
      showMessage(error.message, messageContainer);
  }
});

