from rest_framework import serializers
from .models import JewelryProduct, JewelryProductImage

class JewelryProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JewelryProductImage
        fields = ['image', 'alt_text']

class ProductCardSerializer(serializers.ModelSerializer):
    images = JewelryProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = JewelryProduct
        fields = [
            'model_number',
            'gold_karat',
            'gold_color',
            'total_weight',
            'total_usd',
            'images',
        ]
