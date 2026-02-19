from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='books')

urlpatterns = router.urls

# GET /books → Any logged-in user
# POST /books → Admin only
# GET /books/{id} → Any logged-in user
# PUT /books/{id} → Admin only
# DELETE /books/{id} → Admin only