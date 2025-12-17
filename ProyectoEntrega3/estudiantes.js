import { supabase } from "./supabaseClient.js";

// FORMULARIO
const formEstudiantes = document.getElementById("formEstudiantes");

// LISTA
const listaEstudiantes = document.getElementById("listaEstudiantes");

// INPUTS
const inputNombre = document.getElementById("nombreEstudiante");
const inputApellido = document.getElementById("apellidoEstudiante");
const inputEmail = document.getElementById("emailEstudiante");
const inputCarrera = document.getElementById("carreraEstudiante");

let editando = false;

// Funciones del bonton Agregar
const btnAgregar = document.getElementById("btnAgregar");
btnAgregar.addEventListener("click", agregarEstudiante);


// Funciones del boton Eliminar
const btnEliminar = document.getElementById("btnEliminar");
btnEliminar.addEventListener("click", eliminarEstudiantePorId);

// Funciones del boton Buscar
const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", buscarEstudiantePorId);

// Funciones del boton Editar
const btnEditar = document.getElementById("btnEditar");
btnEditar.addEventListener("click", editarEstudiante);


// ================== CARGAR ESTUDIANTES ==================
async function cargarEstudiantes() {
    const { data: estudiantes, error } = await supabase
        .from("estudiantes")
        .select("*");

    if (error) {
        console.error("Error al cargar estudiantes:", error);
        return;
    }

    listaEstudiantes.innerHTML = ""; // limpiar lista
    let alternar = true;

    estudiantes.forEach(estudiante => {
        const fila = document.createElement("div");

        fila.innerHTML = `
            <div class="row align-items-center ${alternar ? "bg-white" : "bg-light"}">
                <div class="col-6 p-2 col-sm-1 text-center">${estudiante.id}</div>
                <div class="col-6 p-2 col-sm-4">${estudiante.nombre}</div>
                <div class="col-6 p-2 col-sm-4">${estudiante.correo}</div>
                <div class="col-6 p-2 col-sm-3">${estudiante.carrera}</div>
            </div>
        `;

        alternar = !alternar;
        listaEstudiantes.appendChild(fila);
    });
}

// Agregar a la base de datos
async function agregarEstudiante() {
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const correo = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();

    if (!nombre || !apellido || !correo || !carrera) {
        alert("Complete todos los campos");
        return;
    }

    const nombreCompleto = nombre + " " + apellido;

    const { error } = await supabase
        .from("estudiantes")
        .insert([{
            nombre: nombreCompleto,
            correo: correo,
            carrera: carrera
        }]);

    if (error) {
        console.error("Error al agregar:", error);
        alert("No se pudo agregar el estudiante");
        return;
    }

    alert("Estudiante agregado correctamente");
    formEstudiantes.reset();
    cargarEstudiantes();
}

// Accion de Submit
formEstudiantes.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombreCompleto = inputNombre.value.trim() + " " + inputApellido.value.trim();
    const email = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();

    if (!editando) {
        await crearEstudiante(nombreCompleto, email, carrera);
    }
    formEstudiantes.reset();
});

// Eliminar en el formulario
async function eliminarEstudiantePorId() {
    const id = document.getElementById("idEstudiante").value.trim();
    if (!id) {
        alert("Debes ingresar un ID");
        return;
    }
    const { error } = await supabase
        .from("estudiantes")
        .delete()
        .eq("id", id);
    if (error) {
        console.error("Error al eliminar estudiante:", error);
        alert("No se pudo eliminar");
        return;
    }
    alert("Estudiante eliminado correctamente");
    cargarEstudiantes();
}

// Buscar Estudiante
async function buscarEstudiantePorId() {
    const id = document.getElementById("idEstudiante").value.trim();

    if (!id) {
        alert("Ingrese un ID para buscar");
        limpiarFormulario();
        return;
    }

    const { data, error } = await supabase
        .from("estudiantes")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        alert("Estudiante no encontrado");
        limpiarFormulario();
        editando = false;
        return;
    }

    // Separar nombre y apellido
    const partesNombre = data.nombre.split(" ");
    inputNombre.value = partesNombre[0] || "";
    inputApellido.value = partesNombre.slice(1).join(" ") || "";

    inputEmail.value = data.correo;
    inputCarrera.value = data.carrera;

    editando = true;
}


// Editar Estudiante
async function editarEstudiante() {
    const id = document.getElementById("idEstudiante").value.trim();

    if (!id) {
        alert("Debes buscar un estudiante primero");
        return;
    }

    if (!editando) {
        alert("Primero busca un estudiante");
        return;
    }

    const nombreCompleto =
        inputNombre.value.trim() + " " + inputApellido.value.trim();
    const correo = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();

    const { error } = await supabase
        .from("estudiantes")
        .update({
            nombre: nombreCompleto,
            correo: correo,
            carrera: carrera
        })
        .eq("id", id);

    if (error) {
        console.error("Error al editar:", error);
        alert("No se pudo actualizar");
        return;
    }

    alert("Estudiante actualizado correctamente");
    editando = false;
    formEstudiantes.reset();
    cargarEstudiantes();
}
// Limpiar formulario
function limpiarFormulario() {
    document.getElementById("idEstudiante").value = "";
    inputNombre.value = "";
    inputApellido.value = "";
    inputEmail.value = "";
    inputCarrera.value = "";
}


// ================== INIT ==================
cargarEstudiantes();
