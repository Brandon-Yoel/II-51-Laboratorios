import { supabase } from "./supabaseClient.js";

// ================== FORMULARIO ==================
const formProfesores = document.getElementById("formProfesores");

// ================== LISTA ==================
const listaProfesores = document.getElementById("listaProfesores");

// ================== INPUTS ==================
const inputNombre = document.getElementById("nombreProfesor");
const inputApellido = document.getElementById("apellidoProfesor");
const inputEmail = document.getElementById("emailProfesor");
const inputFacultad = document.getElementById("facultadProfesor");
const inputId = document.getElementById("idProfesor");

let editando = false;

// ================== BOTONES ==================
document.getElementById("btnAgregar").addEventListener("click", agregarProfesor);
document.getElementById("btnEditar").addEventListener("click", editarProfesor);
document.getElementById("btnEliminar").addEventListener("click", eliminarProfesorPorId);
document.getElementById("btnBuscar").addEventListener("click", buscarProfesorPorId);

// ================== CARGAR PROFESORES ==================
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

// ================== AGREGAR ==================
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

// ================== BUSCAR ==================
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

// ================== EDITAR ==================
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

// ================== ELIMINAR ==================
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

// ================== LIMPIAR ==================
function limpiarFormulario() {
    inputId.value = "";
    inputNombre.value = "";
    inputApellido.value = "";
    inputEmail.value = "";
    inputFacultad.value = "";
}

// ================== INIT ==================
cargarProfesores();
