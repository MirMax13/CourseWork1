from django.db import models

# Create your models here.
class Gif(models.Model):
    filename = models.CharField(max_length=200)
    data= models.BinaryField()
    contentType = models.CharField(max_length=50)
    attributes=models.TextField()