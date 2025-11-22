from django.urls import path
from . import views

urlpatterns = [
    path('', views.ActivitiesListCreateView.as_view(), name='activities-list'),
    path('<pk>/', views.ActivitiesRetrieveUpdateDestroyView.as_view(), name='activities-detail'),
]