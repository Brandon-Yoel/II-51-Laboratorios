import { supabase } from "./supabaseClient.js";

// ================== FORMULARIO ==================
const formCursos = document.getElementById("formCursos");

// ================== LISTA ==================
const listaCursos = document.getElementById("listaCursos");

// ================== INPUTS ==================
const inputId = document.getElementById("idCurso");
const inputCodigo = document.getElementById("codigoCurso");
const inputNombre = document.getElementById("nombreCurso");
const inputCreditos = document.getElementById("creditosCurso");
const inputCupo = document.getElementById("cupoCurso");

let editando = false;

// ================== BOTONES ==================
document.getElementById("btnAgregar").addEventListener("click", agregarCurso);
document.getElementById("btnEditar").addEventListener("click", editarCurso);
document.getElementById("btnEliminar").addEventListener("click", eliminarCursoPorId);
document.getElementById("btnBuscar").addEventListener("click", buscarCursoPorId);

// ================== CARGAR CURSOS ==================
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

        alternar = !alternar;
        listaCursos.appendChild(fila);
    });
}

// ================== AGREGAR ==================
async function agregarCurso() {
    const codigo = inputCodigo.value.trim();
    const nombre = inputNombre.value.trim();
    const creditos = Number(inputCreditos.value);
    const cupo = Number(inputCupo.value);

    if (!codigo || !nombre || isNaN(creditos) || isNaN(cupo)) {
        alert("Complete todos los campos correctamente");
        return;
    }

    const { error } = await supabase
        .from("cursos")
        .insert([{
            codigo,
            nombre,
            creditos,
            cupo
        }]);

    if (error) {
        console.error("Supabase error:", error);
        alert("No se pudo agregar el curso");
        return;
    }

    alert("Curso agregado correctamente");
    limpiarFormulario();
    cargarCursos();
}



// ================== BUSCAR ==================
async function buscarCursoPorId() {
    const id = inputId.value.trim();

    if (!id) {
        alert("Ingrese un ID");
        limpiarFormulario();
        return;
    }

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        alert("Curso no encontrado");
        limpiarFormulario();
        editando = false;
        return;
    }

    inputCodigo.value = data.codigo;
    inputNombre.value = data.nombre;
    inputCreditos.value = data.creditos;
    inputCupo.value = data.cupo;

    editando = true;
}

// ================== EDITAR ==================
async function editarCurso() {
    const id = inputId.value.trim();

    if (!id || !editando) {
        alert("Primero busca un curso");
        return;
    }

    const codigo = inputCodigo.value.trim();
    const nombre = inputNombre.value.trim();
    const creditos = Number(inputCreditos.value);
    const cupo = Number(inputCupo.value);


    if (!codigo || !nombre || isNaN(creditos) || isNaN(cupo)) {
        alert("Datos inválidos");
        return;
    }

    const { error } = await supabase
        .from("cursos")
        .update({ codigo, nombre, creditos, cupo })
        .eq("id", id);

    if (error) {
        console.error("Error al editar:", error);
        alert("No se pudo actualizar");
        return;
    }

    alert("Curso actualizado correctamente");
    editando = false;
    limpiarFormulario();
    cargarCursos();
}

// ================== ELIMINAR ==================
async function eliminarCursoPorId() {
    const id = inputId.value.trim();

    if (!id) {
        alert("Ingrese un ID");
        return;
    }

    const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar");
        return;
    }

    alert("Curso eliminado correctamente");
    limpiarFormulario();
    cargarCursos();
}

// ================== LIMPIAR ==================
function limpiarFormulario() {
    inputId.value = "";
    inputCodigo.value = "";
    inputNombre.value = "";
    inputCreditos.value = "";
    inputCupo.value = "";
}

// ================== INIT ==================
cargarCursos();
