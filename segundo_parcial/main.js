import UsersService from './api.js'; // Importas la clase
import { renderUsers, showMessage, populateForm } from './dom.js';

const apiBaseURL = 'http://ec2-3-138-183-128.us-east-2.compute.amazonaws.com:4010';
const usersService = new UsersService(apiBaseURL); 

const messageContainer = document.getElementById('message-container');
const usersContainer = document.getElementById('users-container');


document.getElementById('get-users').addEventListener('click', async () => {
  try {
    const users = await usersService.getUsers(); // Obtén los usuarios desde la API
    
    if (Array.isArray(users)) {  // Verifica que users sea un arreglo antes de usar forEach
      renderUsers(users, usersContainer);
    } else {
      console.error('La respuesta no es un arreglo de usuarios');
      showMessage('Error: La respuesta no contiene usuarios válidos', messageContainer);
    }
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

