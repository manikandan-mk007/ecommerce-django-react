from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "category",
        "price",
        "stock_quantity",
        "is_available",
        "created_at",
    ]
    list_filter = ["category", "is_available"]
    search_fields = ["name", "category"]