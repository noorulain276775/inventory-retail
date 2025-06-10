from django.db import models

class JewelryProduct(models.Model):
    packing_line_no = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=255)
    model_number = models.CharField(max_length=100)
    gold_karat = models.CharField(max_length=10)
    gold_color = models.CharField(max_length=20)
    quantity = models.IntegerField()
    total_metal_weight = models.DecimalField(max_digits=10, decimal_places=2)
    total_weight = models.DecimalField(max_digits=10, decimal_places=2)
    total_usd = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.model_number} - {self.description}"

class Diamond(models.Model):
    jewelry_product = models.ForeignKey(JewelryProduct, on_delete=models.CASCADE, related_name='diamonds')
    description = models.CharField(max_length=255)
    size = models.CharField(max_length=50)
    quantity = models.IntegerField()
    total_weight = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return f"Diamond {self.description} for {self.jewelry_product.model_number}"

class ColoredStone(models.Model):
    jewelry_product = models.ForeignKey(JewelryProduct, on_delete=models.CASCADE, related_name='colored_stones')
    description = models.CharField(max_length=255)
    size = models.CharField(max_length=50)
    quantity = models.IntegerField()
    total_weight = models.DecimalField(max_digits=10, decimal_places=3)

    def __str__(self):
        return f"Stone {self.description} for {self.jewelry_product.model_number}"

