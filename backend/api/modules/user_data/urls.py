from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserDataView.as_view(), name='user-data'),
    path('profile-picture/', views.UploadProfilePictureView.as_view(), name='upload-profile-picture'),
    path('profile-picture/', views.DeleteProfilePictureView.as_view(), name='delete-profile-picture'),
    path('patient/<int:patient_id>/', views.GetPatientByIdView.as_view(), name='get-patient-by-id'),
    path('assign-patient/', views.AssignCaregiverToPatientView.as_view(), name='assign-caregiver-to-patient'),
    path('unassign-patient/', views.UnassignPatientView.as_view(), name='unassign-patient'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete-account'),
    path('available-caregivers/', views.GetAvailableCaregiversView.as_view(), name='available-caregivers'),
]