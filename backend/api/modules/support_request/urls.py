from django.urls import path
from . import views

urlpatterns = [
    path('', views.SupportRequestListCreateView.as_view(), name='support-request-list-create'),
    path('available/', views.GetAvailableSupportRequestsView.as_view(), name='support-request-available'),
    path('<uuid:pk>/', views.SupportRequestDetailView.as_view(), name='support-request-detail'),
    path('<uuid:pk>/assign/', views.AssignCaregiverView.as_view(), name='support-request-assign'),
    path('<uuid:pk>/update-status/', views.UpdateStatusView.as_view(), name='support-request-update-status'),
]
