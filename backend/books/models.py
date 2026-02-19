from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=100, unique=True)
    total_copies = models.IntegerField()
    available_copies = models.IntegerField()

    def __str__(self):
        return self.title