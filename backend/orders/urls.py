from django.urls import path
from .views import order_list, create_order

urlpatterns = [
    path("", order_list, name="order-list"),
    path("create/", create_order, name="create-order"),
]