# urls.py
from django.urls import path
from .views import ExcelUploadAPIView

urlpatterns = [
    path('product/upload-excel/', ExcelUploadAPIView.as_view(), name='upload_excel'),
]
