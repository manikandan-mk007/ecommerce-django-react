from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    stock_status = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "image",
            "image_url",
            "price",
            "description",
            "category",
            "stock_quantity",
            "is_available",
            "stock_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["is_available", "created_at", "updated_at"]

    def get_stock_status(self, obj):
        return "In Stock" if obj.stock_quantity > 0 else "Out of Stock"

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Product name must be at least 2 characters.")
        return value

    def validate_description(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("Description must be at least 5 characters.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value