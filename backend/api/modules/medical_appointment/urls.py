from django.urls import path
from . import views

urlpatterns = [
    path('', views.MedicalAppointmentListCreateView.as_view(), name='medical-appointment-list'),
    path('<pk>/', views.MedicalAppointmentRetrieveUpdateDestroyView.as_view(), name='medical-appointment-detail'),
]