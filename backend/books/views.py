from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Book
from .serializers import BookSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Admin: Full access (CRUD)
    - Normal User: Read only
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # GET allowed for everyone
        return request.user and request.user.is_staff  # Only admin for POST/PUT/DELETE


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

# GET /books → Any logged-in user
# POST /books → Admin only
# PUT/DELETE → Admin only