from django.urls import path
from . import views

urlpatterns = [
    path('', views.MedicalLogListCreateView.as_view(), name='medical-log-list'),
    path('<pk>/', views.MedicalLogRetrieveUpdateDestroyView.as_view(), name='medical-log-detail'),
]
