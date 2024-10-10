// Función para renderizar la lista de usuarios en el DOM
export function renderUsers(users, container) {
  container.innerHTML = '';
  users.forEach(user => {
      const userElement = document.createElement('div');
      userElement.classList.add('user-item');
      userElement.innerHTML = `
          <h3>${user.firstName} ${user.lastName}</h3>
          <p>Email: ${user.email}</p>
          <p>Teléfono: ${user.phone}</p>
          <p>Puesto: ${user.jobTitle}</p>
          <img src="${user.photo}" alt="${user.firstName}" width="200">
      `;
      container.appendChild(userElement);
  });
}

// Función para mostrar mensajes (éxito o error)
export function showMessage(message, container) {
  container.textContent = message;
}

// Función para rellenar el formulario con los datos existentes (para modificar)
export function populateForm(user) {
  document.getElementById('name').value = user.name;
  document.getElementById('mail').value = user.mail;
  document.getElementById('user-id').value = user.id;
}
