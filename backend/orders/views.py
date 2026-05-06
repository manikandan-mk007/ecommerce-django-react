from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from cart.models import CartItem
from .models import Order
from .serializers import OrderSerializer


@api_view(["GET"])
def order_list(request):
    orders = Order.objects.all().order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def create_order(request):
    customer_name = request.data.get("customer_name", "Guest Customer").strip()

    if not customer_name:
        customer_name = "Guest Customer"

    cart_items = CartItem.objects.select_related("product").all()

    if not cart_items.exists():
        return Response(
            {"message": "Cart is empty. Cannot create order."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    total_amount = sum(item.subtotal for item in cart_items)
    total_items = sum(item.quantity for item in cart_items)

    order = Order.objects.create(
        customer_name=customer_name,
        total_amount=total_amount,
        total_items=total_items,
    )

    cart_items.delete()

    serializer = OrderSerializer(order)

    return Response(
        {
            "message": "Order created successfully.",
            "order": serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )