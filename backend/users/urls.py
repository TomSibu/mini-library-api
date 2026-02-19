# Login will automatically return:
# -> Access Token
# -> Refresh Token (JWT)

from django.urls import path
from .views import RegisterView, delete_account
from .views import CustomTokenObtainPairView
from .views import list_users, delete_user, forgot_password


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('delete-account/', delete_account, name='delete-account'),
    path('users/', list_users, name='list-users'),
    path('users/<int:user_id>/', delete_user, name='delete-user'),
    path('forgot-password/', forgot_password, name='forgot-password'),
]
