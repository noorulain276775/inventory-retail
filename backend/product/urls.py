# urls.py
from django.urls import path
from .views import ExcelUploadAPIView, ProductCardListAPIView


urlpatterns = [
    path('product/upload-excel/', ExcelUploadAPIView.as_view(), name='upload_excel'),
    path('products-list/', ProductCardListAPIView.as_view(), name='product-card-list'),
    
]

