from django.db import models
from django.core.validators import MinValueValidator


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("Electronics", "Electronics"),
        ("Fashion", "Fashion"),
        ("Grocery", "Grocery"),
        ("Home", "Home"),
        ("Beauty", "Beauty"),
        ("Sports", "Sports"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    description = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="Other"
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.is_available = self.stock_quantity > 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name