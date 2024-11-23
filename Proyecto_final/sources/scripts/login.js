document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("button[type='button']");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginButton.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email: email,
                    contrasena: password
                 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo iniciar sesión."}`);
                return;
            }

            const data = await response.json();
            alert("Inicio de sesión exitoso");
            console.log("Usuario autenticado:", data);
            sessionStorage.setItem('user_id', data.id);
            sessionStorage.setItem('token', data.token);

            // Redirigir a otra página después del inicio de sesión exitoso
            window.location.href = "eventos.html";
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Ocurrió un error al intentar iniciar sesión.");
        }
    });
});
