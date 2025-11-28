from django.urls import path, include

urlpatterns = [
    path('card/', include('api.modules.card.urls')),
    path('medical-appointment/', include('api.modules.medical_appointment.urls')),
    path('medical-log/', include('api.modules.medical_log.urls')),
    path('memory/', include('api.modules.memory.urls')),
    path('safe-zone/', include('api.modules.safe_zone.urls')),
    path('user/', include('api.modules.user.urls')),
    path('user-data/', include('api.modules.user_data.urls')),
    path('support-requests/', include('api.modules.support_request.urls')),
    path('achievements/', include('api.modules.achievements.urls')),
    path('activities/', include('api.modules.activities.urls')),
    path('caregiver-log/', include('api.modules.caregiver_log.urls')),
]
