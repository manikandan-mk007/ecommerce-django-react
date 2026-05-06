from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator
from products.models import Product


class CartItem(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_active_deal(self):
        """
        Returns the latest active deal for this product.
        """
        from deals.models import Deal

        return (
            Deal.objects.filter(
                product=self.product,
                is_active=True
            )
            .order_by("-created_at")
            .first()
        )

    @property
    def final_price(self):
        """
        If product has active deal, return discounted price.
        Otherwise return original product price.
        """
        deal = self.get_active_deal()

        if deal:
            discount_percentage = Decimal(deal.discount_percentage)
            discount_amount = (self.product.price * discount_percentage) / Decimal(100)
            return self.product.price - discount_amount

        return self.product.price

    @property
    def subtotal(self):
        """
        Cart subtotal must use discounted price if active deal exists.
        """
        return self.final_price * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"