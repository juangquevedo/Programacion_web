class UsersService {
  constructor() {
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
  }

  // Método para obtener los alimentos
  async getUsers() {
    return this.users;
  }

  // Método para crear un nuevo alimento en la estructura fija
  async addUsers(user) {
    // Genera un ID para el nuevo alimento
    const newId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;

    // Agrega el nuevo alimento al array de alimentos
    const newUser = { ...user, id: newId };
    this.users.push(newUser);

    console.log('New user added:', newUser);
    return { success: true, user: newUser };
  }
}

export default UsersService;
