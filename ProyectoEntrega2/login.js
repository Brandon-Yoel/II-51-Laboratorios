// Varaiables para disimular un inicion de seccion
const conrreoIngre = "admin@universidad.com";
const contrasenaIngre = "123456";


document.getElementById("btnIngresar").addEventListener("click", verificarLogin);

function verificarLogin() {
    // tomamos los valores ingresados y los guardamos en variables para su uso
    let correo = document.getElementById("correo").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();
    // Validacion de que se ingrese la informacion
    if (!correo || !contrasena) {
        alert("Debe ingresar el correo y la contraseña.");
        return;
    }
    // Validacion de contrasena y correo electronico
    if (correo === conrreoIngre && contrasena === contrasenaIngre) {
        alert("Inicio de sesión exitoso.");
        window.location.href = "cursos.html";  
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}