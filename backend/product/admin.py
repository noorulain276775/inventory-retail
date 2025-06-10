from django.contrib import admin
from .models import JewelryProduct, Diamond, ColoredStone

class DiamondInline(admin.TabularInline):
    model = Diamond
    extra = 0  # No extra blank forms by default
    fields = ('description', 'size', 'quantity', 'total_weight')
    readonly_fields = ()
    show_change_link = True

class ColoredStoneInline(admin.TabularInline):
    model = ColoredStone
    extra = 0
    fields = ('description', 'size', 'quantity', 'total_weight')
    readonly_fields = ()
    show_change_link = True

@admin.register(JewelryProduct)
class JewelryProductAdmin(admin.ModelAdmin):
    list_display = ('description', 'model_number', 'gold_karat', 'gold_color', 'quantity', 'total_metal_weight', 'total_weight', 'total_usd')
    search_fields = ('model_number', 'description')
    inlines = [DiamondInline, ColoredStoneInline]

@admin.register(Diamond)
class DiamondAdmin(admin.ModelAdmin):
    list_display = ('jewelry_product', 'description', 'size', 'quantity', 'total_weight')
    search_fields = ('jewelry_product__model_number', 'description')

@admin.register(ColoredStone)
class ColoredStoneAdmin(admin.ModelAdmin):
    list_display = ('jewelry_product', 'description', 'size', 'quantity', 'total_weight')
    search_fields = ('jewelry_product__model_number', 'description')
