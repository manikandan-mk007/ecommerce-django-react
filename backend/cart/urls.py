from django.urls import path
from .views import (
    cart_list,
    add_to_cart,
    update_cart_item,
    remove_cart_item,
    clear_cart,
)

urlpatterns = [
    path("", cart_list, name="cart-list"),
    path("add/", add_to_cart, name="add-to-cart"),
    path("<int:pk>/update/", update_cart_item, name="update-cart-item"),
    path("<int:pk>/remove/", remove_cart_item, name="remove-cart-item"),
    path("clear/", clear_cart, name="clear-cart"),
]