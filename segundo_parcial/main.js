import UsersService from './api.js'; // Importas la clase
import { renderUsers, showMessage, populateForm } from './dom.js';

const apiBaseURL = 'https://bbd7-2800-e2-2780-2479-2417-fe6c-d24e-ecb3.ngrok-free.app';
const usersService = new UsersService(apiBaseURL);  // Aquí creas una instancia, con un nombre diferente

// Evento para consultar usuarios
document.getElementById('get-users').addEventListener('click', async () => {
    try {
        const users = await usersService.getUsers(); // Llamas al método usando la instancia
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

    const name = document.getElementById('name').value;
    const mail = document.getElementById('mail').value;
    const id = document.getElementById('user-id').value;

    try {
        if (id) {
            await usersService.updateUsers(id, { name, mail }); // Actualización del usuario
            showMessage('Usuario modificado correctamente', messageContainer);
        } else {
            await usersService.addUsers({ name, mail }); // Creación de un nuevo usuario
            showMessage('Usuario agregado correctamente', messageContainer);
        }
    } catch (error) {
        showMessage(error.message, messageContainer);
    }
});
