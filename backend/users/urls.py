# Login will automatically return:
# -> Access Token
# -> Refresh Token (JWT)

from django.urls import path
from .views import RegisterView, delete_account
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('delete-account/', delete_account, name='delete-account'),
]
