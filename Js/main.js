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
    var TrashButton = document.querySelectorAll('.btn-trash');
    for (var i = 0; i < TrashButton.length; i++) {
        TrashButton[i].addEventListener('click', EliminateItem);
    }

    // ADD BUTTON (BOTON QUE SUMA CANTIDAD DE A 1)
    var AddButton = document.querySelectorAll('.add-quantity');
    for (var i = 0; i < AddButton.length; i++) {
        AddButton[i].addEventListener('click', AddItemQuantity);
    }

    // SUBTRACT BUTTON (BOTON QUE RESTA CANTIDAD DE A 1)
    var SubtractButton = document.querySelectorAll('.subtract-quantity');
    for (var i = 0; i < SubtractButton.length; i++) {
        SubtractButton[i].addEventListener('click', SubtractItemQuantity);
    }

    // ADD TO CART BUTTON (BOTON QUE SUMA AL CARRITO)
    var AddToCartButton = document.querySelectorAll('.add-to-cart-button');
    for (var i = 0; i < AddToCartButton.length; i++) {
        AddToCartButton[i].addEventListener('click', AddItemToCart);
    }

    // BUY BUTTON (BOTON DE COMPRA)
    document.querySelector('.btn-buy').addEventListener('click', BuyCartButton);

}

// Función para boton de Comprar
function BuyCartButton() {
    alert("Thanks for trusting in DUSKY");
    // Elimino todos los elementos del carrito
    var CartItems = document.getElementsByClassName('cart-items')[0];
    while (CartItems.hasChildNodes()) {
        CartItems.removeChild(CartItems.firstChild);
    }
    CurrentTotalPrice();
    HideCart();
}

// Función para boton de agregar al carrito
function AddItemToCart(event) {
    var button = event.target;
    var item = button.parentElement;
    var title = item.getElementsByClassName('product-title')[0].innerText;
    var price = item.getElementsByClassName('product-price')[0].innerText;
    var ItemImg = item.getElementsByClassName('product-img')[0].src;
    console.log(title);
    // Llamar a la función correcta: AddToCartButton -> AddToCartButtonClicked
    AddToCartButtonClicked(title, price, ItemImg);
    DisplayCart();
}

// Función que hace visible el carrito
function DisplayCart() {
    ShowCart = true;
    var ShoppingCart = document.getElementsByClassName('shopping-cart')[0];
    ShoppingCart.style.marginRight = '0';
    ShoppingCart.style.opacity = '1';

    var Products = document.getElementsByClassName('galerie-products')[0];
    Products.style.marginRight = '320px';
}

var loadingFromLocalStorage

// Función que crea el div y agrega el item al carrito
function AddToCartButtonClicked(title, price, ItemImg, loadingFromLocalStorage = false) {
    var Item = document.createElement('div');
    Item.classList.add('cart-item' );
    var Items = document.getElementsByClassName('cart-items')[0];
    var ItemsName = Items.getElementsByClassName('cart-item-title');
    for (let i = 0; i < ItemsName.length; i++) {
        if (ItemsName[i].textContent === title) {
            if (!loadingFromLocalStorage) { // Verificar si no se está cargando desde el almacenamiento local antes de mostrar la alerta
                alert("The item has already been added");
            }
            return;
        }
    }
    var CartItemHtml = `
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

    Item.innerHTML = CartItemHtml;
    Items.append(Item);
    // Agregamos la funcionalidad eliminar al nuevo item
    Item.getElementsByClassName('btn-trash')[0].addEventListener('click', EliminateItem);

    // Agregamos la funcionalidad restar cantidad del nuevo item
    var SubtractQuantityButton = Item.getElementsByClassName('subtract-quantity')[0];
    SubtractQuantityButton.addEventListener('click', SubtractItemQuantity);

    // Agregamos la funcionalidad sumar cantidad del nuevo item
    var AddQuantityButton = Item.getElementsByClassName('add-quantity')[0];
    AddQuantityButton.addEventListener('click', AddItemQuantity);

    // Actualizamos total
    CurrentTotalPrice();

}

// Función que suma al apretar boton ADD
function AddItemQuantity(event) {
    var buttonClicked = event.target;
    var QuantitySelector = buttonClicked.parentElement;
    var CurrentQuantity = parseInt(QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value);
    CurrentQuantity++;
    QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value = CurrentQuantity;
    CurrentTotalPrice();
}

// Función que resta al apretar boton SUBTRACT
function SubtractItemQuantity(event) {
    var buttonClicked = event.target;
    var QuantitySelector = buttonClicked.parentElement;
    var CurrentQuantity = parseInt(QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value);
    CurrentQuantity--;
    if (CurrentQuantity >= 1) {
        QuantitySelector.getElementsByClassName('cart-item-quantity')[0].value = CurrentQuantity;
        CurrentTotalPrice();
    } else {
        EliminateItem(event)
    }
}

// Función que elimina item del carrito
function EliminateItem(event) {
    var buttonClicked = event.target;
    var itemToRemove = buttonClicked.closest('.cart-item');
    itemToRemove.parentElement.remove();
    CurrentTotalPrice();
    console.log("Producto eliminado")
    HideCart();
}

// Función que controla si hay elementos en el carrito. Si no hay, oculta el carrito.
function HideCart() {
    var cartitems = document.getElementsByClassName('cart-items')[0];
    if (cartitems.childElementCount == 0) {
        var ShoppingCart = document.getElementsByClassName('shopping-cart')[0];
        ShoppingCart.style.marginRight = '0';
        ShoppingCart.style.opacity = '0';
        ShowCart = false;
        var Products = document.getElementsByClassName('galerie-products')[0];
        Products.style.marginRight = '0';
    }
}

// Función que actualiza el total del carrito
function CurrentTotalPrice() {
    var ShoppingCart = document.getElementsByClassName('shopping-cart')[0];
    var CartItem = ShoppingCart.getElementsByClassName('cart-item');
    var TotalPrice = 0;
    for (let i = 0; i < CartItem.length; i++) {
        var Item = CartItem[i];
        var ProductPrice = Item.getElementsByClassName('cart-item-price')[0];
        var Price = parseFloat(ProductPrice.innerText.replace('$', '').replace('.', ''));
        var CurrentQuantity = Item.getElementsByClassName('cart-item-quantity')[0];
        var Quantity = parseInt(CurrentQuantity.value);
        TotalPrice = TotalPrice + (Price * Quantity)/2;
        document.getElementsByClassName('cart-total-price')[0].innerText = 'FINAL PRICE:    $' + TotalPrice.toLocaleString("es") + ",00";
    }
    TotalPrice = Math.round(TotalPrice * 100) / 100;
    console.log(TotalPrice)
} 

CartButtonsEvents()



//CODIGO DE LOCAL STORAGE

// Función para guardar el carrito en localStorage
function SaveInStorage(ShoppingCart) {
    localStorage.setItem('shopping-cart', JSON.stringify(ShoppingCart));
}

// Función para obtener el carrito desde localStorageGetFromStorage
function GetFromStorage() {
    return JSON.parse(localStorage.getItem('shopping-cart')) || [];
}
// Función para cargar el carrito al cargar la página
function LoadStorage() {
    var ShoppingCart = GetFromStorage();
    for (var i = 0; i < ShoppingCart.length; i++) {
        var item = ShoppingCart[i];
        AddToCartButtonClicked(item.title, item.price, item.image, true);
    }
    CurrentTotalPrice();
    DisplayCart();
    HideCart()
}

// Función para guardar el carrito antes de salir de la página
window.addEventListener('beforeunload', function() {
    var ShoppingCart= document.querySelectorAll('.cart-item');
    var items = [];
    for (var i = 0; i < ShoppingCart.length; i++) {
        var title = ShoppingCart[i].querySelector('.cart-item-title').innerText;
        var price = ShoppingCart[i].querySelector('.cart-item-price').innerText;
        var image = ShoppingCart[i].querySelector('img').src;
        items.push({title: title, price: price, image: image});
    }
    SaveInStorage(items);
});

// Llama a la función cargarCarrito al cargar la página
LoadStorage();
