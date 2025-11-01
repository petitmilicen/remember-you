from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserDataView.as_view(), name='users-list'),
]