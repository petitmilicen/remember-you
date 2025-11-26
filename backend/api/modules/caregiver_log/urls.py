from django.urls import path
from . import views

urlpatterns = [
    path('', views.CaregiverLogListCreateView.as_view(), name='caregiver-log-list'),
    path('<pk>/', views.CaregiverLogRetrieveUpdateDestroyView.as_view(), name='caregiver-log-detail'),
]
