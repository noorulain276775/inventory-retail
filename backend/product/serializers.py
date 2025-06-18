from rest_framework import serializers
from .models import JewelryProduct, JewelryProductImage, Diamond, ColoredStone

class JewelryProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JewelryProductImage
        fields = ['image', 'alt_text']

class DiamondSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diamond
        fields = ['description', 'size', 'quantity', 'total_weight']

class ColoredStoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColoredStone
        fields = ['description', 'size', 'quantity', 'total_weight']

class JewelryProductSerializer(serializers.ModelSerializer):
    images = JewelryProductImageSerializer(many=True)
    diamonds = DiamondSerializer(many=True)
    colored_stones = ColoredStoneSerializer(many=True)

    class Meta:
        model = JewelryProduct
        fields = [
            'id',
            'packing_line_no',
            'description',
            'model_number',
            'gold_karat',
            'gold_color',
            'quantity',
            'total_metal_weight',
            'total_weight',
            'total_usd',
            'images',
            'diamonds',
            'colored_stones',
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        diamonds_data = validated_data.pop('diamonds', [])
        colored_stones_data = validated_data.pop('colored_stones', [])

        product = JewelryProduct.objects.create(**validated_data)

        for image_data in images_data:
            JewelryProductImage.objects.create(jewelry_product=product, **image_data)

        for diamond_data in diamonds_data:
            Diamond.objects.create(jewelry_product=product, **diamond_data)

        for stone_data in colored_stones_data:
            ColoredStone.objects.create(jewelry_product=product, **stone_data)

        return product

    def update(self, instance, validated_data):
        # For now, just update the main product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ProductCardSerializer(serializers.ModelSerializer):
    images = JewelryProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = JewelryProduct
        fields = [
            'id',
            'model_number',
            'gold_karat',
            'gold_color',
            'total_weight',
            'total_usd',
            'images',
        ]
