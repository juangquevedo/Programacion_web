class UsersService {
  constructor(apiBaseURL) {
    // Estructura fija de alimentos temporal mientras no se usa la API real
    this.users = [
      {
        "firstName": "Magnus",
        "lastName": "Weissnat",
        "phone": "3104759987",
        "jobTitle": "Configuration",
        "id": 6,
        "photo": "http://loremflickr.com/640/480/people?71543",
        "email": "Ul56f1.t@akss.co"
      },
      {
        "firstName": "Zane",
        "lastName": "Wolf",
        "id": 7,
        "photo": "http://loremflickr.com/640/480/people?66550",
        "email": "2IyTWKkL@aahorbl.com.co",
        "phone": "3158513888",
        "jobTitle": "Paradigm"
      },
      {
        "firstName": "Chauncey",
        "lastName": "Kohler",
        "id": 7,
        "jobTitle": "Accounts",
        "phone": "3150432638",
        "photo": "http://loremflickr.com/640/480/people?89897",
        "email": "HAy5HuXk1D4@nquosy.com"
      }
    ];
    this.apiBaseURL = apiBaseURL;
  }

  // Método para obtener los usuarios desde la API
  async getUsers() {
    try {
      const response = await fetch(`${this.apiBaseURL}/users`); // Cambia la URL según la estructura del API
      const users = await response.json(); // Asegúrate de parsear la respuesta como JSON
      return users; // Devuelve el arreglo de usuarios
    } catch (error) {
      console.error('Error obteniendo los usuarios:', error);
      throw error;
    }
  }

  // Método para crear un nuevo usuario en la API
  async addUsers(user) {
    try {
      const response = await fetch(`${this.apiBaseURL}/users`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error al agregar el usuario');
      }
      const newUser = await response.json();
      return newUser;
    } catch (error) {
      console.error('Error en addUsers:', error);
      throw error;
    }
  }

  // Método para actualizar un usuario existente
  async updateUsers(id, user) {
    try {
      const response = await fetch(`${this.apiBaseURL}/users/${id}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error al modificar el usuario');
      }
      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error('Error en updateUsers:', error);
      throw error;
    }
  }
  }

export default UsersService;
