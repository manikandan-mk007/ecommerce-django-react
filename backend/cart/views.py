from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import CartItem
from .serializers import (
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartQuantitySerializer,
)


@api_view(["GET"])
def cart_list(request):
    cart_items = CartItem.objects.select_related("product").all().order_by("-created_at")
    serializer = CartItemSerializer(
        cart_items,
        many=True,
        context={"request": request}
    )

    total_amount = sum(item.subtotal for item in cart_items)
    total_items = sum(item.quantity for item in cart_items)

    return Response(
        {
            "items": serializer.data,
            "total_items": total_items,
            "total_amount": round(float(total_amount), 2),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def add_to_cart(request):
    serializer = AddToCartSerializer(data=request.data)

    if serializer.is_valid():
        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data.get("quantity", 1)

        product = Product.objects.get(id=product_id)

        cart_item, created = CartItem.objects.get_or_create(
            product=product,
            defaults={"quantity": quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.stock_quantity:
                return Response(
                    {
                        "message": "Cart quantity cannot be greater than available stock."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cart_item.quantity = new_quantity
            cart_item.save()

        response_serializer = CartItemSerializer(
            cart_item,
            context={"request": request}
        )

        return Response(
            {
                "message": "Product added to cart successfully.",
                "item": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def update_cart_item(request, pk):
    try:
        cart_item = CartItem.objects.select_related("product").get(pk=pk)
    except CartItem.DoesNotExist:
        return Response(
            {"message": "Cart item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = UpdateCartQuantitySerializer(
        data=request.data,
        context={"cart_item": cart_item}
    )

    if serializer.is_valid():
        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save()

        response_serializer = CartItemSerializer(
            cart_item,
            context={"request": request}
        )

        return Response(
            {
                "message": "Cart item updated successfully.",
                "item": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def remove_cart_item(request, pk):
    try:
        cart_item = CartItem.objects.get(pk=pk)
    except CartItem.DoesNotExist:
        return Response(
            {"message": "Cart item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart_item.delete()

    return Response(
        {"message": "Cart item removed successfully."},
        status=status.HTTP_200_OK,
    )


@api_view(["DELETE"])
def clear_cart(request):
    CartItem.objects.all().delete()

    return Response(
        {"message": "Cart cleared successfully."},
        status=status.HTTP_200_OK,
    )