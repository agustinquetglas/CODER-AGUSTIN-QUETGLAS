// Obtener el botón de envío del formulario
let SendButton = document.getElementById("checkout-form-button");

// Agregar un evento de clic al botón de envío
SendButton.addEventListener('click', SendForm);

// Función para enviar el formulario
function SendForm(event) {
    // Prevenir el envío del formulario por defecto
    event.preventDefault();

    // Obtener la dirección del formulario
    let address = document.getElementById('address').value;

    fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            // Obtener duración del toast
            let toastDuration = data.toastDuration;
            
            //Obtener mensaje y reemplazar el address del JSON por el address ingresado por el usuario
            let successMessage = data.successMessage.replace('{address}', address);

            // Mostrar el toast con el mensaje de éxito
            Toastify({
                text: successMessage,
                duration: toastDuration,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#333",
                },
                onClick: function(){}
            }).showToast();

            // Redirigir a la página de inicio después de que desaparezca el toast
            setTimeout(function() {
                window.location.href = '../index.html';
            }, toastDuration);
        })
        .catch(error => console.error(data.ErrorMessage, error));
}