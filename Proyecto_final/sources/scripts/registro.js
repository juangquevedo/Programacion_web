document.getElementById("btnRegistrar").addEventListener("click", async () => {
    // Obtén los valores de los campos
    const name = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("password").value.trim();
  
    // Valida los campos
    if (!name || !apellido || !email || !contrasena) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nombre = name + apellido;
  
    try {
      // Realiza la solicitud POST al backend
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            nombre: nombre, 
            email: email, 
            contrasena: contrasena
         }),
      });
  
      // Manejo de respuesta
      if (response.ok) {
        const data = await response.json();
        alert("Usuario registrado exitosamente.");
        window.location.href = "login.html"; // Redirige al login
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert("Error del servidor. Intenta nuevamente más tarde.");
    }
  });
  