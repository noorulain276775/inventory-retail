from django.contrib import admin
from .models import JewelryProduct, Diamond, ColoredStone, JewelryProductImage
from django.urls import path
from django.shortcuts import render, redirect
import requests
from django.contrib.admin import AdminSite
from django.utils.html import format_html

class CustomAdminSite(AdminSite):
    site_header = "Jewelry Inventory Admin"
    site_title = "Jewelry Inventory Portal"
    index_title = "Manage Jewelry Stock and Products"

    def each_context(self, request):
        context = super().each_context(request)
        context['custom_admin_css'] = True
        return context


class JewelryProductImageInline(admin.TabularInline):
    model = JewelryProductImage
    extra = 1
    fields = ('image', 'image_preview', 'alt_text',)
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: auto;" />', obj.image.url)
        return "-"
    image_preview.short_description = 'Preview'

class DiamondInline(admin.TabularInline):
    model = Diamond
    extra = 0
    fields = ('description', 'size', 'quantity', 'total_weight')

class ColoredStoneInline(admin.TabularInline):
    model = ColoredStone
    extra = 0
    fields = ('description', 'size', 'quantity', 'total_weight')

@admin.register(JewelryProduct)
class JewelryProductAdmin(admin.ModelAdmin):
    list_display = ('description', 'model_number', 'gold_karat', 'gold_color', 'quantity', 'total_metal_weight', 'total_weight', 'total_usd')
    search_fields = ('model_number', 'description')
    inlines = [JewelryProductImageInline, DiamondInline, ColoredStoneInline]

    change_list_template = "admin/jewelryproduct_change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload-excel/', self.admin_site.admin_view(self.upload_excel_view), name='upload_excel')
        ]
        return custom_urls + urls

    def upload_excel_view(self, request):
        if request.method == 'POST' and request.FILES.get('excel_file'):
            file = request.FILES['excel_file']
            response = requests.post(
                'http://127.0.0.1:8000/api/product/upload-excel/',
                files={'excel_file': file}
            )
            if response.status_code == 201:
                self.message_user(request, "Upload successful!")
            else:
                self.message_user(request, f"Upload failed: {response.text}", level='error')
            return redirect("..")
        return render(request, "admin/upload_excel_form.html")



@admin.register(JewelryProductImage)
class JewelryProductImageAdmin(admin.ModelAdmin):
    list_display = ('jewelry_product', 'alt_text', 'image')

@admin.register(Diamond)
class DiamondAdmin(admin.ModelAdmin):
    list_display = ('jewelry_product', 'description', 'size', 'quantity', 'total_weight')
    search_fields = ('jewelry_product__model_number', 'description')

@admin.register(ColoredStone)
class ColoredStoneAdmin(admin.ModelAdmin):
    list_display = ('jewelry_product', 'description', 'size', 'quantity', 'total_weight')
    search_fields = ('jewelry_product__model_number', 'description')

custom_admin_site = CustomAdminSite(name='custom_admin')

# Register all models with `custom_admin_site`, not `admin.site`
custom_admin_site.register(JewelryProduct, JewelryProductAdmin)
custom_admin_site.register(JewelryProductImage, JewelryProductImageAdmin)
custom_admin_site.register(Diamond, DiamondAdmin)
custom_admin_site.register(ColoredStone, ColoredStoneAdmin)