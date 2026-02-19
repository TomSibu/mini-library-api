# Login will automatically return:
# -> Access Token
# -> Refresh Token (JWT)

from django.urls import path
from .views import RegisterView, delete_account
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('delete-account/', delete_account, name='delete-account'),
]
