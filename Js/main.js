const user_menu_button= document.getElementById("user-menu-button")
const user_menu= document.getElementById("user-menu")

user_menu_button.addEventListener('click', function(){
    if(user_menu.style.display === 'none'){
        user_menu.style.display = 'block'
    } else {
        user_menu.style.display = 'none'
    }
})

HideCart()

// AGREGAR FUNCIONALIDAD A TODOS LOS BOTONES
function CartButtonsEvents() {

    // TRASH BUTTON (BOTON QUE ELIMINA EL ITEM DEL CARRITO)
    let TrashButton = document.querySelectorAll('.btn-trash');
    for (let i = 0; i < TrashButton.length; i++) {
        TrashButton[i].addEventListener('click', EliminateItem)
    }

    // ADD BUTTON (BOTON QUE SUMA CANTIDAD DE A 1)
    let AddButton = document.querySelectorAll('.add-quantity')
    for (let i = 0; i < AddButton.length; i++) {
        AddButton[i].addEventListener('click', AddItemQuantity)
    }

    // SUBTRACT BUTTON (BOTON QUE RESTA CANTIDAD DE A 1)
    let SubtractButton = document.querySelectorAll('.subtract-quantity')
    for (let i = 0; i < SubtractButton.length; i++) {
        SubtractButton[i].addEventListener('click', SubtractItemQuantity)
    }

    // ADD TO CART BUTTON (BOTON QUE SUMA AL CARRITO)
    let AddToCartButton = document.querySelectorAll('.add-to-cart-button')
    for (let i = 0; i < AddToCartButton.length; i++) {
        AddToCartButton[i].addEventListener('click', AddItemToCart)
    }

    // BUY BUTTON (BOTON DE COMPRA)
    document.querySelector('.btn-buy').addEventListener('click', BuyCartButton)

}


// Función para boton de Comprar
function BuyCartButton() {
    // Traer data del JSON
    fetch('../data.json')
        .then(response => response.json())
        .then(data => {
            let toastDuration = data.toastDuration;
            let BuyMessage = data.BuyMessage;
            Toastify({
                text: BuyMessage,
                duration: toastDuration,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#333",
                },
                onClick: function(){}
            }).showToast();

            //Redireccion a formulario despues de comprar
            let CartItems = document.getElementsByClassName('cart-items')[0];
            while (CartItems.hasChildNodes()) {
                CartItems.removeChild(CartItems.firstChild);
            }
            CurrentTotalPrice();
            HideCart();
            setTimeout(function() {
                window.location.href = './buy-form.html';
            }, toastDuration);
        })
        .catch(error => console.error(data.ErrorMessage, error));
}

// Función para boton de agregar al carrito
function AddItemToCart(event) {
    let button = event.target
    let item = button.parentElement
    let title = item.getElementsByClassName('product-title')[0].innerText
    let price = item.getElementsByClassName('product-price')[0].innerText
    let ItemImg = item.getElementsByClassName('product-img')[0].src
    // Llamar a la función correcta: AddToCartButton -> AddToCartButtonClicked
    AddToCartButtonClicked(title, price, ItemImg, loadingFromLocalStorage = false)
    DisplayCart()   
}

// Función que hace visible el carrito
function DisplayCart() {
    ShowCart = true
    let ShoppingCart = document.getElementsByClassName('shopping-cart')[0];
    ShoppingCart.style.marginRight = '0'
    ShoppingCart.style.opacity = '1'
    let Products = document.getElementsByClassName('galerie-products')[0];
    Products.style.marginRight = '320px'
}

let loadingFromLocalStorage

// Función que crea el div y agrega el item al carrito
function AddToCartButtonClicked(title, price, ItemImg, loadingFromLocalStorage = false) {
    let Item = document.createElement('div')
    Item.classList.add('cart-item' )
    let Items = document.getElementsByClassName('cart-items')[0]
    let ItemsName = Items.getElementsByClassName('cart-item-title')
    for (let i = 0; i < ItemsName.length; i++) {
        if (ItemsName[i].textContent === title ) {
            if (!loadingFromLocalStorage) { // Verificar si no se está cargando desde el almacenamiento local antes de mostrar la alerta
                Toastify({
                    text: "The item has already been added",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true, 
                    style: {
                      background: "#333",
                    },
                    onClick: function(){}
                  }).showToast();
            }
            return
        }
    }
    let CartItemHtml = `
        <div class="cart-item">
            <span class="cart-item-title">${title}</span>
            <img src="${ItemImg}" alt="">
            <div class="cart-item-details">
                <div class="quantity-selector">
                    <i class="fa-solid fa-minus subtract-quantity"></i>
                    <input type="text" value="1" class="cart-item-quantity" >
                    <i class="fa-solid fa-plus add-quantity"></i>
                </div>
                <span class="cart-item-price">${price}</span>
            </div>
            <button class="btn-trash">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    Item.innerHTML = CartItemHtml
    Items.append(Item)
    // Agregamos la funcionalidad eliminar al nuevo item
    Item.getElementsByClassName('btn-trash')[0].addEventListener('click', EliminateItem)

    // Agregamos la funcionalidad restar cantidad del nuevo item
    let SubtractQuantityButton = Item.getElementsByClassName('subtract-quantity')[0]
    SubtractQuantityButton.addEventListener('click', SubtractItemQuantity)

    // Agregamos la funcionalidad sumar cantidad del nuevo item
    let AddQuantityButton = Item.getElementsByClassName('add-quantity')[0]
    AddQuantityButton.addEventListener('click', AddItemQuantity)

    // Actualizamos total
    CurrentTotalPrice()

}

// Función que suma al apretar boton ADD
function AddItemQuantity(event) {
    let buttonClicked = event.target
    let QuantitySelector = buttonClicked.parentElement
    let CurrentQuantity = parseInt(QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value)
    CurrentQuantity++
    QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value = CurrentQuantity
    CurrentTotalPrice()
}

// Función que resta al apretar boton SUBTRACT
function SubtractItemQuantity(event) {
    let buttonClicked = event.target
    let QuantitySelector = buttonClicked.parentElement
    let CurrentQuantity = parseInt(QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value)
    CurrentQuantity--
    if (CurrentQuantity >= 1) {
        QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value = CurrentQuantity
        CurrentTotalPrice()
    } else {
        EliminateItem(event)
    }
}

// Función que elimina item del carrito
function EliminateItem(event) {
    let buttonClicked = event.target
    let itemToRemove = buttonClicked.closest('.cart-item')
    itemToRemove.parentElement.remove()
    CurrentTotalPrice()
    HideCart()
}

// Función que controla si hay elementos en el carrito. Si no hay, oculta el carrito.
function HideCart() {
    let cartitems = document.getElementsByClassName('cart-items')[0]
    if (cartitems.childElementCount == 0) {
        let ShoppingCart = document.getElementsByClassName('shopping-cart')[0]
        ShoppingCart.style.marginRight = '0'
        ShoppingCart.style.opacity = '0'
        ShowCart = false
        let Products = document.getElementsByClassName('galerie-products')[0]
        Products.style.marginRight = '0'
    }
}

// Función que actualiza el total del carrito
function CurrentTotalPrice() {
    let ShoppingCart = document.getElementsByClassName('shopping-cart')[0]
    let CartItem = ShoppingCart.getElementsByClassName('cart-item')
    let TotalPrice = 0
    for (let i = 0; i < CartItem.length; i++) {
        let Item = CartItem[i]
        let ProductPrice = Item.getElementsByClassName('cart-item-price')[0]
        let Price = parseFloat(ProductPrice.innerText.replace('$', '').replace('.', ''))
        let CurrentQuantity = Item.getElementsByClassName('cart-item-quantity')[0]
        let Quantity = parseInt(CurrentQuantity.value)
        TotalPrice = TotalPrice + (Price * Quantity)/2
        document.getElementsByClassName('cart-total-price')[0].innerText = 'FINAL PRICE:    $' + TotalPrice.toLocaleString("es") + ",00"
    }
    TotalPrice = Math.round(TotalPrice * 100) / 100
} 

CartButtonsEvents()



//CODIGO DE LOCAL STORAGE

// Función para guardar el carrito en localStorage
function SaveInStorage(ShoppingCart) {
    localStorage.setItem('shopping-cart', JSON.stringify(ShoppingCart))
}

// Función para obtener el carrito desde localStorageGetFromStorage
function GetFromStorage() {
    return JSON.parse(localStorage.getItem('shopping-cart')) || []
}
// Función para cargar el carrito al cargar la página
function LoadStorage() {
    let ShoppingCart = GetFromStorage();
    loadingFromLocalStorage = true
    for (let i = 0; i < ShoppingCart.length; i++) {
        let item = ShoppingCart[i]
        AddToCartButtonClicked(item.title, item.price, item.image, true)
    }
    loadingFromLocalStorage = false
    CurrentTotalPrice()
    DisplayCart()
    HideCart()
}

// Función para guardar el carrito antes de salir de la página
window.addEventListener('beforeunload', function() {
    let ShoppingCart= document.querySelectorAll('.cart-item')
    let items = []
    for (let i = 0; i < ShoppingCart.length; i++) {
        let title = ShoppingCart[i].querySelector('.cart-item-title').innerText
        let price = ShoppingCart[i].querySelector('.cart-item-price').innerText
        let image = ShoppingCart[i].querySelector('img').src
        items.push({title: title, price: price, image: image})
    }
    SaveInStorage(items)
})

// Llama a la función cargarCarrito al cargar la página
LoadStorage();
