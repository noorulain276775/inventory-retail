from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
import pandas as pd
from .models import JewelryProduct, Diamond, ColoredStone
from rest_framework import generics
from .models import JewelryProduct
from .serializers import ProductCardSerializer, JewelryProductSerializer
from .filters import JewelryProductFilter
from django_filters.rest_framework import DjangoFilterBackend


"""API view to handle Excel file uploads and process jewelry data."""
class ExcelUploadAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('excel_file')
        if not excel_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        df = pd.read_excel(excel_file)

        # Forward-fill only product-related fields
        product_fields = [
            'packing_line_no','model_number', 'description', 'gold_karat', 'gold_color',
            'quantity', 'total_metal_weight', 'total_weight', 'total_usd'
        ]
        df[product_fields] = df[product_fields].ffill()

        grouped = df.groupby('model_number')

        for model_number, group in grouped:
            first_row = group.iloc[0]

            # Create or get JewelryProduct once per model_number
            product, _ = JewelryProduct.objects.get_or_create(
                model_number=model_number,
                defaults={
                    'description': first_row.get('description'),
                    'gold_karat': first_row.get('gold_karat'),
                    'gold_color': first_row.get('gold_color'),
                    'quantity': first_row.get('quantity'),
                    'total_metal_weight': first_row.get('total_metal_weight'),
                    'total_weight': first_row.get('total_weight'),
                    'total_usd': first_row.get('total_usd'),
                    'packing_line_no': first_row.get('packing_line_no')
                }
            )

            # Loop over all rows in this group to create diamonds/stones
            for _, row in group.iterrows():
                # Diamond
                if pd.notna(row.get('diamonds_description')):
                    Diamond.objects.create(
                        jewelry_product=product,
                        description=row.get('diamonds_description'),
                        size=row.get('diamonds_size'),
                        quantity=row.get('diamonds_quantity'),
                        total_weight=row.get('diamonds_total_weight')
                    )

                # Colored Stone
                if pd.notna(row.get('colored_stones_description')):
                    ColoredStone.objects.create(
                        jewelry_product=product,
                        description=row.get('colored_stones_description'),
                        size=row.get('colored_stones_size'),
                        quantity=row.get('colored_stones_quantity'),
                        total_weight=row.get('colored_stones_total_weight')
                    )

        return Response({"message": "Data imported successfully!"}, status=status.HTTP_201_CREATED)


"""API view to list jewelry products with filtering capabilities."""

class ProductCardListAPIView(generics.ListAPIView):
    queryset = JewelryProduct.objects.all()
    serializer_class = ProductCardSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = JewelryProductFilter


class JewelryProductDetailView(generics.RetrieveAPIView):
    queryset = JewelryProduct.objects.all()
    serializer_class = JewelryProductSerializer
    lookup_field = 'id'