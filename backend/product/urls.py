# urls.py
from django.urls import path
from .views import ExcelUploadAPIView, ProductCardListAPIView, JewelryProductDetailView


urlpatterns = [
    path('product/upload-excel/', ExcelUploadAPIView.as_view(), name='upload_excel'),
    path('products-list/', ProductCardListAPIView.as_view(), name='product-card-list'),
    path('products/<int:id>/', JewelryProductDetailView.as_view(), name='product-detail'),
    
]

