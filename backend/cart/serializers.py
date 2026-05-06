from rest_framework import serializers
from .models import CartItem
from products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    original_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_price = serializers.SerializerMethodField()
    has_deal = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    product_image_url = serializers.SerializerMethodField()
    stock_quantity = serializers.IntegerField(source="product.stock_quantity", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "original_price",
            "product_price",
            "has_deal",
            "discount_percentage",
            "product_image_url",
            "stock_quantity",
            "quantity",
            "subtotal",
            "created_at",
            "updated_at",
        ]

    def get_product_price(self, obj):
        """
        This price is final selling price.
        If active deal exists, discounted price is returned.
        """
        return round(float(obj.final_price), 2)

    def get_has_deal(self, obj):
        return obj.get_active_deal() is not None

    def get_discount_percentage(self, obj):
        deal = obj.get_active_deal()
        if deal:
            return deal.discount_percentage
        return 0

    def get_product_image_url(self, obj):
        request = self.context.get("request")

        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)

        if obj.product.image:
            return obj.product.image.url

        return None

    def get_subtotal(self, obj):
        return round(float(obj.subtotal), 2)


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")

        if not product.is_available or product.stock_quantity <= 0:
            raise serializers.ValidationError("Product is out of stock.")

        return value

    def validate(self, data):
        product = Product.objects.get(id=data["product_id"])
        quantity = data.get("quantity", 1)

        if quantity > product.stock_quantity:
            raise serializers.ValidationError(
                {"quantity": "Quantity cannot be greater than available stock."}
            )

        return data


class UpdateCartQuantitySerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, data):
        cart_item = self.context.get("cart_item")
        quantity = data.get("quantity")

        if cart_item and quantity > cart_item.product.stock_quantity:
            raise serializers.ValidationError(
                {"quantity": "Quantity cannot be greater than available stock."}
            )

        return data