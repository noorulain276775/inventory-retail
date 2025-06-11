# filters.py
import django_filters
from .models import JewelryProduct

class JewelryProductFilter(django_filters.FilterSet):
    model_number = django_filters.CharFilter(lookup_expr='icontains')
    gold_karat = django_filters.CharFilter(lookup_expr='icontains')
    gold_color = django_filters.CharFilter(lookup_expr='icontains')
    total_usd_min = django_filters.NumberFilter(field_name='total_usd', lookup_expr='gte')
    total_usd_max = django_filters.NumberFilter(field_name='total_usd', lookup_expr='lte')

    class Meta:
        model = JewelryProduct
        fields = ['model_number', 'gold_karat', 'gold_color']
