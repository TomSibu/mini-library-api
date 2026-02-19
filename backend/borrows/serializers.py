from rest_framework import serializers
from .models import Borrow

class BorrowSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Borrow
        fields = ['id', 'book', 'book_title', 'borrow_date', 'return_date', 'is_returned']
        read_only_fields = ['borrow_date', 'return_date', 'is_returned']
