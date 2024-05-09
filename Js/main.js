const user_menu_button= document.getElementById("user-menu-button")
const user_menu= document.getElementById("user-menu")

user_menu_button.addEventListener('click', function(){
    if(user_menu.style.display === 'none'){
        user_menu.style.display = 'block'
    } else {
        user_menu.style.display = 'none'
    }
})
