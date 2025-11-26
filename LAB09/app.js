// Importamos la base de datos
import { supabase } from "./supabaseClient.js";

// Guardamos la información en variables
const form = document.getElementById("curso-form");

const inputId = document.getElementById("idUsuario");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.querySelector('input[type="email"]');

const statusDiv = document.getElementById("status");

// ===============================
// EVENTO DEL FORMULARIO
// ===============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idUsuario = inputId.value.trim();
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();

    if (!idUsuario || !nombre || !email) {
        statusDiv.innerHTML = `<p class="text-danger mt-3">Todos los campos son obligatorios.</p>`;
        return;
    }
    await crearUsuario(idUsuario, nombre, email);

    form.reset();
});

// ===============================
// CREATE (INSERTAR USUARIO)
// ===============================
async function crearUsuario(idUsuario, nombre, email) {
    const nuevoUsuario = { idUsuario, nombre, email };

    let { data, error } = await supabase
        .from("usuario")
        .insert([nuevoUsuario]);

    if (error) {
        console.error("Error al insertar usuario:", error);
        statusDiv.innerHTML = `<p class="text-danger mt-3">Error al agregar usuario.</p>`;
        return;
    }

    statusDiv.innerHTML = `<p class="text-success mt-3">Usuario agregado con éxito.</p>`;
}