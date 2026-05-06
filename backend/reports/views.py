from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from deals.models import Deal
from cart.models import CartItem
from orders.models import Order


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_summary(request):
    user = request.user

    if not user.is_staff and not user.is_superuser:
        return Response(
            {"message": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    total_products = Product.objects.count()
    total_active_deals = Deal.objects.filter(is_active=True).count()
    total_cart_items = sum(item.quantity for item in CartItem.objects.all())
    basic_order_count = Order.objects.count()

    return Response(
        {
            "total_products": total_products,
            "total_active_deals": total_active_deals,
            "total_cart_items": total_cart_items,
            "basic_order_count": basic_order_count,
        },
        status=status.HTTP_200_OK,
    )