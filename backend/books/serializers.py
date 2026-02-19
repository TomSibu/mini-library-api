# Converts Book model to JSON automatically
# Industry standard DRF pattern

from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
