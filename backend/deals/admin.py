from django.contrib import admin
from .models import Deal


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "product",
        "discount_percentage",
        "start_date",
        "end_date",
        "is_active",
    ]
    list_filter = ["is_active", "start_date", "end_date"]
    search_fields = ["title", "product__name"]