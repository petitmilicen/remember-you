from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserDataView.as_view(), name='user-data'),
    path('profile-picture/', views.UploadProfilePictureView.as_view(), name='upload-profile-picture'),
    path('profile-picture/', views.DeleteProfilePictureView.as_view(), name='delete-profile-picture'),
]