from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserDataView.as_view(), name='user_data'),
    path('register-push-token/', views.RegisterPushTokenView.as_view(), name='register_push_token'),
    path('upload-profile-picture/', views.UploadProfilePictureView.as_view(), name='upload_profile_picture'),
    path('delete-profile-picture/', views.DeleteProfilePictureView.as_view(), name='delete_profile_picture'),
    path('assign-patient/', views.AssignCaregiverToPatientView.as_view(), name='assign_patient'),
    path('unassign-patient/', views.UnassignPatientView.as_view(), name='unassign_patient'),
    path('patient/<int:patient_id>/', views.GetPatientByIdView.as_view(), name='get_patient_by_id'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete_account'),
    path('available-caregivers/', views.GetAvailableCaregiversView.as_view(), name='available_caregivers'),
]