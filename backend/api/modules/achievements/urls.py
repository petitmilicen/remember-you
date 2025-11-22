from django.urls import path
from . import views

urlpatterns = [
    path('', views.AchievementListCreateView.as_view(), name='achievements-list'),
    path('<pk>/', views.AchievementRetrieveUpdateDestroyView.as_view(), name='achievement-detail'),
]
