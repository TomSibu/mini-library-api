from django.urls import path
from .views import borrow_book, return_book, my_borrows

urlpatterns = [
    path('borrow/<int:book_id>/', borrow_book, name='borrow-book'),
    path('return/<int:book_id>/', return_book, name='return-book'),
    path('my-borrows/', my_borrows, name='my-borrows'),
]
