import { supabase } from "./supabaseClient.js";

async function cargarCursos() {
    // Cargamos los cursos de nuestra pagina CURSOS
    let { data: cursos, errorCur } = await supabase.from("cursos").select("*");
    console.log(cursos);
    
    if (errorCur) {
        console.error("Error al cargar cursos:", error);
        return;
    }
    
    let listaCursos = document.getElementById("listaCursos");
    cursos.forEach(curso => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${curso.codigo}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc;">${curso.nombre}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align:center;">${curso.creditos}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align:center;">${curso.cupo}</td>
        `;

        listaCursos.appendChild(fila); // importante
    });
}



cargarCursos();