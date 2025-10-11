from django.urls import path
from . import views

urlpatterns = [
    path('memories/', views.MemoryListCreateView.as_view(), name='memory-list'),
    path('memories/<pk>/', views.MemoryRetrieveUpdateDestroyView.as_view(), name='memory-detail'),
    path('medical-log/', views.MedicalLogListCreateView.as_view(), name='medical-log-list'),
    path('medical-log/<pk>/', views.MedicalRetrieveUpdateDestroyView.as_view(), name='medical-log-detail')
]
