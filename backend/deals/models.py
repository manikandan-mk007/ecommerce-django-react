from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product


class Deal(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="deals"
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    discount_percentage = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(90)
        ]
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def discounted_price(self):
        discount_amount = (self.product.price * self.discount_percentage) / 100
        return self.product.price - discount_amount

    def __str__(self):
        return f"{self.title} - {self.product.name}"