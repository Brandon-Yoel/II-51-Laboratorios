import { supabase } from "./supabaseClient.js";

// Guardamos el formulario en una variable
const formEstudiantes = document.getElementById("formEstudiantes");

// Guardamos el div listaEstudiantes en una variable
const listaEstudiantes = document.getElementById("listaEstudiantes");

// Guardamos los valores de los inputs en diferentes variables
const inputNombre = document.getElementById("nombreEstudiante");
const inputApellido = document.getElementById("apellidoEstudiante");
const inputEmail = document.getElementById("emailEstudiante");
const inputCarrera = document.getElementById("carreraEstudiante");
let editando = false;

// Agregamos funciones a los botones, en este caso el evento CLICK
const btnAgregar = document.getElementById("btnAgregar");
btnAgregar.addEventListener("click", agregarEstudiante);


// Agregamos funciones a los botones, en este caso el evento CLICK
const btnEliminar = document.getElementById("btnEliminar");
btnEliminar.addEventListener("click", eliminarEstudiantePorId);

// Agregamos funciones a los botones, en este caso el evento CLICK
const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener("click", buscarEstudiantePorId);

// Agregamos funciones a los botones, en este caso el evento CLICK
const btnEditar = document.getElementById("btnEditar");
btnEditar.addEventListener("click", editarEstudiante);

// Funcion que permite mostrar los estudiantes en nuestro HTML
async function cargarEstudiantes() {
    const { data: estudiantes, error } = await supabase
        .from("estudiantes")
        .select("*");

    if (error) {
        console.error("Error al cargar estudiantes:", error);
        return;
    }

    listaEstudiantes.innerHTML = "";
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
        // Alternamos el color de fondo de cada linea
        alternar = !alternar;
        listaEstudiantes.appendChild(fila);
    });
}

// Funcion que permite agregar un estudiante a nuestra base de datos
async function agregarEstudiante() {
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const correo = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();

    // Al agregar un estudiante, buscamos que todos los campos esten llenos
    if (!nombre || !apellido || !correo || !carrera) {
        alert("Complete todos los campos");
        return;
    }

    // Fucionamos nombre y apellido para tener un solo dato
    const nombreCompleto = nombre + " " + apellido;

    // Intentamos ingresar los datos en la base de datos
    const { error } = await supabase
        .from("estudiantes")
        .insert([{
            nombre: nombreCompleto,
            correo: correo,
            carrera: carrera
        }]);
    // Nos indica si no logro subir los datos
    if (error) {
        console.error("Error al agregar:", error);
        alert("No se pudo agregar el estudiante");
        return;
    }
    // Agrega los datos de forma correcta.
    alert("Estudiante agregado correctamente");
    formEstudiantes.reset();
    cargarEstudiantes();
}

// Guardamos un estudiante
formEstudiantes.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombreCompleto = inputNombre.value.trim() + " " + inputApellido.value.trim();
    const email = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();

    if (!editando) {
        await crearEstudiante(nombreCompleto, email, carrera);
    }
    limpiarFormulario(); // Limpiamos el formulario
});

// Eliminar un estudiante de la base de datos
async function eliminarEstudiantePorId() {
    // Creamos variable para el ID y buscarlo por el ID
    const id = document.getElementById("idEstudiante").value.trim();
    // Si no se ha ingresado un ID, lo solicita
    if (!id) {
        alert("Debes ingresar un ID");
        return;
    }
    // Llama a la base de datos y le indica que queremos eliminar algo que coincida con el ID.
    const { error } = await supabase
        .from("estudiantes")
        .delete()
        .eq("id", id);
    // Error al tratar de eliminar
    if (error) {
        console.error("Error al eliminar estudiante:", error);
        alert("No se pudo eliminar");
        return;
    }
    // Confirma la eliminación
    alert("Estudiante eliminado correctamente");
    cargarEstudiantes();
}

// Buscar Estudiante
async function buscarEstudiantePorId() {
    // Creamos variable para el ID y buscarlo por el ID
    const id = document.getElementById("idEstudiante").value.trim();
    // Si no se ha ingresado un ID, lo solicita
    if (!id) {
        alert("Ingrese un ID para buscar");
        limpiarFormulario();
        return;
    }
    // Llama a la base de datos y le indica que queremos buscar algo que coincida con el ID.
    const { data, error } = await supabase
        .from("estudiantes")
        .select("*")
        .eq("id", id)
        .single();
    // Error al tratar de buscar
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
    // Mostramos el resto de datos que están en la base de datos
    inputEmail.value = data.correo;
    inputCarrera.value = data.carrera;

    editando = true;
}


// Editar Estudiante
async function editarEstudiante() {
    // Creamos variable para el ID y buscarlo por el ID
    const id = document.getElementById("idEstudiante").value.trim();
    // Si no se ha ingresado un ID, lo solicita
    if (!id) {
        alert("Debes buscar un estudiante primero");
        return;
    }
    // Se activa la "bandera" de edicion
    if (!editando) {
        alert("Primero busca un estudiante");
        return;
    }

    // Guardamos los valores en variables
    const nombreCompleto =
        inputNombre.value.trim() + " " + inputApellido.value.trim();
    const correo = inputEmail.value.trim();
    const carrera = inputCarrera.value.trim();
    // Tratamos de cargalos a la base de datos
    const { error } = await supabase
        .from("estudiantes")
        .update({
            nombre: nombreCompleto,
            correo: correo,
            carrera: carrera
        })
        .eq("id", id);
    // Nos avisa de un error
    if (error) {
        console.error("Error al editar:", error);
        alert("No se pudo actualizar");
        return;
    }
    // Nos confirma la edicion
    alert("Estudiante actualizado correctamente");
    editando = false;
    limpiarFormulario();
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

cargarEstudiantes();
