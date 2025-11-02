from django.urls import path
from . import views

urlpatterns = [
    path('', views.MemoryListCreateView.as_view(), name='memory-list'),
    path('<pk>/', views.MemoryRetrieveUpdateDestroyView.as_view(), name='memory-detail'),
]
