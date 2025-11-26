import { supabase } from "./supabaseClient.js";

async function cargarEstudiantes() {
    // Cargamos los estudiantes de nuestra pagiona ESTUDIANTES
    let { data: estudiantes, errorEst } = await supabase.from("estudiantes").select("*");
    console.log(estudiantes);
    
    if (errorEst) {
        console.error("Error al cargar cursos:", error);
        return;
    }
    let listaEstudiantes = document.getElementById("listaEstudiantes");
    estudiantes.forEach(estudiante => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${estudiante.idEstudiante}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${estudiante.nombre}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${estudiante.correo}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align:center;">${estudiante.carrera}</td>
        `;

        listaEstudiantes.appendChild(fila); // importante
    });
}



cargarEstudiantes();