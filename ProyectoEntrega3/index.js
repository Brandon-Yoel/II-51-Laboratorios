import { supabase } from "./supabaseClient.js";

// Guardamos el formulario en una variable
const formLogin = document.getElementById("formLogin");

// Guardamos los datos de los inputs en variables
const inputEmail = document.getElementById("inputEmail");
const inputContrasena = document.getElementById("inputContrasena");

// Creamos el evento sumity para el boton iniciar seccion
formLogin.addEventListener("submit", iniciarSesion);

// Funcion de inciar secion
async function iniciarSesion(e) {
    e.preventDefault();

    // creamos variables locales con los datos del input
    const email = inputEmail.value.trim();
    const contrasena = inputContrasena.value.trim();

    // Buscar usuario en la base de datos
    const { data: usuario, error } = await supabase
        .from("usuario")
        .select("*")
        .eq("email", email)
        .single();
    // Error si no lo encontramos
    if (error || !usuario) {
        alert("Correo no registrado");
        return;
    }
    // Validar contraseña
    if (usuario.contrasena !== contrasena) {
        alert("Contraseña incorrecta");
        return;
    }
    // Login exitoso
    alert("Inicio de sesión exitoso");

    // Guardar sesión (opcional) si no quiere volver a digitar los datos
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Redirigir al html de estudiantes
    window.location.href = "estudiantes.html";
}