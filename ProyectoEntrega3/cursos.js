import { supabase } from "./supabaseClient.js";

// Guardamos el formulario en una variable
const formCursos = document.getElementById("formCursos");

// Guardamos el div listaCursos en una variable
const listaCursos = document.getElementById("listaCursos");

// Guardamos los valores de los inputs en diferentes variables
const inputId = document.getElementById("idCurso");
const inputCodigo = document.getElementById("codigoCurso");
const inputNombre = document.getElementById("nombreCurso");
const inputCreditos = document.getElementById("creditosCurso");
const inputCupo = document.getElementById("cupoCurso");
let editando = false;

// Agregamos funciones a los botones, en este caso el evento CLICK
document.getElementById("btnAgregar").addEventListener("click", agregarCurso);
document.getElementById("btnEditar").addEventListener("click", editarCurso);
document.getElementById("btnEliminar").addEventListener("click", eliminarCursoPorId);
document.getElementById("btnBuscar").addEventListener("click", buscarCursoPorId);

// Funcion que permite mostrar los cursos en nuestro HTML
async function cargarCursos() {
    const { data: cursos, error } = await supabase
        .from("cursos")
        .select("*");

    if (error) {
        console.error("Error al cargar cursos:", error);
        return;
    }

    listaCursos.innerHTML = "";
    let alternar = true;

    cursos.forEach(curso => {
        const fila = document.createElement("div");

        fila.innerHTML = `
            <div class="row align-items-center ${alternar ? "bg-white" : "bg-light"}">
                <div class="col-6 p-2 col-sm-1 text-center">${curso.id}</div>
                <div class="col-6 p-2 col-sm-1 text-center">${curso.codigo}</div>
                <div class="col-6 p-2 col-sm-7">${curso.nombre}</div>
                <div class="col-6 p-2 col-sm-1 text-center">${curso.creditos}</div>
                <div class="col-6 p-2 col-sm-2 text-center">${curso.cupo}</div>
            </div>
        `;
        // Alternamos el color de fondo de cada linea
        alternar = !alternar;
        listaCursos.appendChild(fila);
    });
}

// Funcion que permite agregar un curso a nuestra base de datos
async function agregarCurso() {
    const codigo = inputCodigo.value.trim();
    const nombre = inputNombre.value.trim();
    const creditos = Number(inputCreditos.value);
    const cupo = Number(inputCupo.value);

    // Al agregar un curso, buscamos que todos los campos esten llenos
    if (!codigo || !nombre || isNaN(creditos) || isNaN(cupo)) {
        alert("Complete todos los campos correctamente");
        return;
    }
    // Intentamos ingresar los datos en la base de datos
    const { error } = await supabase
        .from("cursos")
        .insert([{
            codigo,
            nombre,
            creditos,
            cupo
        }]);
    // Nos indica si no logro subir los datos
    if (error) {
        console.error("Supabase error:", error);
        alert("No se pudo agregar el curso");
        return;
    }
    // Agrega los datos de forma correcta.
    alert("Curso agregado correctamente");
    limpiarFormulario();
    cargarCursos();
}

// Buscamos un curso
async function buscarCursoPorId() {
    // Debemos de buscar por medio del ID, si no lo encuentra lo solicita
    const id = inputId.value.trim();

    if (!id) {
        alert("Ingrese un ID");
        limpiarFormulario();
        return;
    }
    // Buscamos dentro de la base de datos
    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id", id)
        .single();
    // Indicacion de que no lo encontró
    if (error || !data) {
        alert("Curso no encontrado");
        limpiarFormulario();
        editando = false;
        return;
    }
    // Pegamos los datos en los input
    inputCodigo.value = data.codigo;
    inputNombre.value = data.nombre;
    inputCreditos.value = data.creditos;
    inputCupo.value = data.cupo;

    editando = true;
}

// Editamos algun valor del curso
async function editarCurso() {
    const id = inputId.value.trim();
    // Debemos de buscar el ID para lograr editar, si no lo encuentra lo solicita
    if (!id || !editando) {
        alert("Primero busca un curso");
        return;
    }
    // Guardamos los datos en variables para subirlos a la base de datos
    const codigo = inputCodigo.value.trim();
    const nombre = inputNombre.value.trim();
    const creditos = Number(inputCreditos.value);
    const cupo = Number(inputCupo.value);

    // Busca vacios o datos no numericos que no corresponden
    if (!codigo || !nombre || isNaN(creditos) || isNaN(cupo)) {
        alert("Datos inválidos");
        return;
    }
    // Trata de cargar a la base de datos
    const { error } = await supabase
        .from("cursos")
        .update({ codigo, nombre, creditos, cupo })
        .eq("id", id);

    // Error al cargar
    if (error) {
        console.error("Error al editar:", error);
        alert("No se pudo actualizar");
        return;
    }
    // Carga completada
    alert("Curso actualizado correctamente");
    editando = false;
    limpiarFormulario();
    cargarCursos();
}

// Eliminar un curso de la base de datos
async function eliminarCursoPorId() {
    // Creamos variable para el ID y buscarlo por el ID
    const id = inputId.value.trim();
    // Si no se ha ingresado un ID, lo solicita
    if (!id) {
        alert("Ingrese un ID");
        return;
    }
    // Llama a la base de datos y le indica que queremos eliminar algo que coincida con el ID.
    const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", id);
    // Error al tratar de eliminar
    if (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar");
        return;
    }
    // Confirma la eliminación
    alert("Curso eliminado correctamente");
    limpiarFormulario();
    cargarCursos();
}

// Limpiamos los datos del formulario
function limpiarFormulario() {
    inputId.value = "";
    inputCodigo.value = "";
    inputNombre.value = "";
    inputCreditos.value = "";
    inputCupo.value = "";
}

cargarCursos();
