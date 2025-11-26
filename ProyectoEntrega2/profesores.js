import { supabase } from "./supabaseClient.js";

async function cargarProfesores() {
    // Cargamos los profesores de nuestra pagina PROFESORES
    let { data: profesores, errorPro } = await supabase.from("profesores").select("*");
    console.log(profesores);
    
    if (errorPro) {
        console.error("Error al cargar profesores:", error);
        return;
    }
    let listaProfesores = document.getElementById("listaProfesores");
    profesores.forEach(profesor => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${profesor.nombre}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${profesor.correo}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align:center;">${profesor.facultad}</td>
        `;

        listaProfesores.appendChild(fila); // importante
    });
}



cargarProfesores();