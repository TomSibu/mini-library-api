from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from borrows.models import Borrow
from books.models import Book

from rest_framework.permissions import IsAdminUser

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔥 Add custom fields to JWT
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser

        return token
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from borrows.models import Borrow

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    users = User.objects.filter(is_superuser=False)

    data = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        for user in users
    ]

    return Response(data, status=status.HTTP_200_OK)


from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from borrows.models import Borrow
from books.models import Book


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # 🚫 Prevent deleting admin users
        if user.is_superuser:
            return Response(
                {"error": "Cannot delete admin users."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 🚫 Prevent admin from deleting themselves
        if user == request.user:
            return Response(
                {"error": "You cannot delete your own account from admin panel."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 📚 STEP 1: Find all active borrows (not returned)
        active_borrows = Borrow.objects.filter(user=user, is_returned=False)

        # 📦 STEP 2: Automatically return books
        for borrow in active_borrows:
            book = borrow.book

            # Restore available copies
            book.available_copies += 1
            book.save()

            # Mark borrow as returned for record integrity
            borrow.is_returned = True
            borrow.return_date = None  # or timezone.now() if you track dates
            borrow.save()

        # 🗑 STEP 3: Delete the user
        user.delete()

        return Response(
            {
                "message": "User deleted successfully and all borrowed books were automatically returned."
            },
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    password = request.data.get("password")

    # 🔴 Restrict superusers
    if user.is_superuser:
        return Response(
            {"error": "Superusers cannot delete their account."},
            status=status.HTTP_403_FORBIDDEN
        )

    # 🔐 Verify password
    if not password:
        return Response(
            {"error": "Password is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    auth_user = authenticate(username=user.username, password=password)
    if not auth_user:
        return Response(
            {"error": "Incorrect password."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 📚 Check for unreturned books
    active_borrows = Borrow.objects.filter(user=user, is_returned=False)
    if active_borrows.exists():
        return Response(
            {"error": "Return all borrowed books before deleting account."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 🗑️ Delete account
    user.delete()

    return Response(
        {"message": "Account deleted successfully."},
        status=status.HTTP_200_OK
    )

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    if not email or not new_password:
        return Response(
            {"error": "Email and new password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        return Response(
            {"error": "No user found with this email."},
            status=status.HTTP_404_NOT_FOUND
        )