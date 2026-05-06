from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "customer_name", "total_amount", "total_items", "created_at"]
    search_fields = ["customer_name"]