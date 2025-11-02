from django.urls import path
from . import views

urlpatterns = [
    path('', views.CardListCreateView.as_view(), name='card-list'),
    path('<pk>/', views.CardRetrieveUpdateDestroyView.as_view(), name='card-detail'),
]
