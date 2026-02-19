from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Borrow
from books.models import Book
from .serializers import BorrowSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if copies available
    if book.available_copies <= 0:
        return Response({"error": "No copies available"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already borrowed and not returned
    existing_borrow = Borrow.objects.filter(
        user=request.user,
        book=book,
        is_returned=False
    ).first()

    if existing_borrow:
        return Response(
            {"error": "You have already borrowed this book and not returned it"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Borrow the book
    borrow = Borrow.objects.create(user=request.user, book=book)

    # Reduce available copies
    book.available_copies -= 1
    book.save()

    serializer = BorrowSerializer(borrow)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_book(request, book_id):
    try:
        borrow = Borrow.objects.get(
            user=request.user,
            book_id=book_id,
            is_returned=False
        )
    except Borrow.DoesNotExist:
        return Response(
            {"error": "No active borrow record found for this book"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Mark as returned
    borrow.is_returned = True
    borrow.return_date = timezone.now()
    borrow.save()

    # Increase available copies
    book = borrow.book
    book.available_copies += 1
    book.save()

    return Response({"message": "Book returned successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_borrows(request):
    borrows = Borrow.objects.filter(user=request.user)
    serializer = BorrowSerializer(borrows, many=True)
    return Response(serializer.data)
