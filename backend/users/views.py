from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

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
