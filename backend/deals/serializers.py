from rest_framework import serializers
from .models import Deal


class DealSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "title",
            "description",
            "discount_percentage",
            "discounted_price",
            "start_date",
            "end_date",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def get_discounted_price(self, obj):
        return round(float(obj.discounted_price), 2)

    def validate(self, data):
        start_date = data.get("start_date", getattr(self.instance, "start_date", None))
        end_date = data.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "End date cannot be before start date."}
            )

        return data

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Deal title must be at least 2 characters.")
        return value