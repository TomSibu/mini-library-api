from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title is required.")
        return value

    def validate_author(self, value):
        if not value.strip():
            raise serializers.ValidationError("Author is required.")
        return value

    def validate_total_copies(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total copies must be greater than 0.")
        return value

    def validate(self, data):
        if data.get("available_copies", 0) > data.get("total_copies", 0):
            raise serializers.ValidationError(
                "Available copies cannot exceed total copies."
            )
        return data
