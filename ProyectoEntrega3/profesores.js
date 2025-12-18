import { supabase } from "./supabaseClient.js";

// Guardamos el formulario en una variable
const formProfesores = document.getElementById("formProfesores");

// Guardamos el div listaProfesores en una variable
const listaProfesores = document.getElementById("listaProfesores");

// Guardamos los valores de los inputs en diferentes variables
const inputNombre = document.getElementById("nombreProfesor");
const inputApellido = document.getElementById("apellidoProfesor");
const inputEmail = document.getElementById("emailProfesor");
const inputFacultad = document.getElementById("facultadProfesor");
const inputId = document.getElementById("idProfesor");
let editando = false;

// Agregamos funciones a los botones, en este caso el evento CLICK
document.getElementById("btnAgregar").addEventListener("click", agregarProfesor);
document.getElementById("btnEditar").addEventListener("click", editarProfesor);
document.getElementById("btnEliminar").addEventListener("click", eliminarProfesorPorId);
document.getElementById("btnBuscar").addEventListener("click", buscarProfesorPorId);

// Cargamos los profesores al html
async function cargarProfesores() {
    const { data: profesores, error } = await supabase
        .from("profesores")
        .select("*");
    if (error) {
        console.error("Error al cargar profesores:", error);
        return;
    }
    listaProfesores.innerHTML = "";
    let alternar = true;
    profesores.forEach(profesor => {
        const fila = document.createElement("div");

        fila.innerHTML = `
            <div class="row align-items-center ${alternar ? "bg-white" : "bg-light"}">
                <div class="col-6 p-2 col-sm-1 text-center">${profesor.id}</div>
                <div class="col-6 p-2 col-sm-4">${profesor.nombre}</div>
                <div class="col-6 p-2 col-sm-4">${profesor.correo}</div>
                <div class="col-6 p-2 col-sm-3">${profesor.facultad}</div>
            </div>
        `;
        alternar = !alternar;
        listaProfesores.appendChild(fila);
    });
}

// Agreamos un profesor a la base de datos
async function agregarProfesor() {
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const correo = inputEmail.value.trim();
    const facultad = inputFacultad.value.trim();

    if (!nombre || !apellido || !correo || !facultad) {
        alert("Complete todos los campos");
        return;
    }
    const nombreCompleto = `${nombre} ${apellido}`;
    const { error } = await supabase
        .from("profesores")
        .insert([{
            nombre: nombreCompleto,
            correo,
            facultad
        }]);
    if (error) {
        console.error(error);
        alert("No se pudo agregar el profesor");
        return;
    }
    alert("Profesor agregado correctamente");
    limpiarFormulario();
    cargarProfesores();
}
// Buscamos un profesor en la base de datos
async function buscarProfesorPorId() {
    const id = inputId.value.trim();
    if (!id) {
        alert("Ingrese un ID");
        limpiarFormulario();
        return;
    }
    const { data, error } = await supabase
        .from("profesores")
        .select("*")
        .eq("id", id)
        .single();
    if (error || !data) {
        alert("Profesor no encontrado");
        limpiarFormulario();
        editando = false;
        return;
    }
    const partesNombre = data.nombre.split(" ");
    inputNombre.value = partesNombre[0] || "";
    inputApellido.value = partesNombre.slice(1).join(" ") || "";
    inputEmail.value = data.correo;
    inputFacultad.value = data.facultad;
    editando = true;
}
// Editamos un profesor de la base de datos
async function editarProfesor() {
    const id = inputId.value.trim();
    if (!id || !editando) {
        alert("Primero busca un profesor");
        return;
    }
    const nombreCompleto =
        inputNombre.value.trim() + " " + inputApellido.value.trim();
    const { error } = await supabase
        .from("profesores")
        .update({
            nombre: nombreCompleto,
            correo: inputEmail.value.trim(),
            facultad: inputFacultad.value.trim()
        })
        .eq("id", id);
    if (error) {
        console.error(error);
        alert("No se pudo actualizar");
        return;
    }
    alert("Profesor actualizado correctamente");
    editando = false;
    limpiarFormulario();
    cargarProfesores();
}

// Eliminamos un profesor de la base de datos
async function eliminarProfesorPorId() {
    const id = inputId.value.trim();
    if (!id) {
        alert("Ingrese un ID");
        return;
    }
    const { error } = await supabase
        .from("profesores")
        .delete()
        .eq("id", id);
    if (error) {
        console.error(error);
        alert("No se pudo eliminar");
        return;
    }
    alert("Profesor eliminado");
    limpiarFormulario();
    cargarProfesores();
}

// Boton de Limpiar
function limpiarFormulario() {
    inputId.value = "";
    inputNombre.value = "";
    inputApellido.value = "";
    inputEmail.value = "";
    inputFacultad.value = "";
}

cargarProfesores();
