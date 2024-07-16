from django.db import models

# Create your models here.
class GifManager(models.Manager):
    def search_by_filename(self, filename):
        return self.filter(filename__icontains=filename)

    def search_by_attribute(self, attribute):
        return self.filter(attributes__icontains=attribute)

class Gif(models.Model):
    filename = models.CharField(max_length=200)
    data= models.BinaryField()
    contentType = models.CharField(max_length=50)
    attributes=models.TextField()
    objects = GifManager()
    
    def __str__(self):
        return self.filename