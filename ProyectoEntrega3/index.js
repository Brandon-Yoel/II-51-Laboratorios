import { supabase } from "./supabaseClient.js";

// Guardamos el formulario en una variable
const formLogin = document.getElementById("formLogin");

// INPUTS
const inputEmail = document.getElementById("inputEmail");
const inputContrasena = document.getElementById("inputContrasena");

formLogin.addEventListener("submit", iniciarSesion);

async function iniciarSesion(e) {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const contrasena = inputContrasena.value.trim();

    // Buscar usuario en la base de datos
    const { data: usuario, error } = await supabase
        .from("usuario")
        .select("*")
        .eq("email", email)
        .single();

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

    // Guardar sesión (opcional)
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Redirigir
    window.location.href = "estudiantes.html";
}