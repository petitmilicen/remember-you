from django.urls import path, include

urlpatterns = [
    path('memory/', include('api.modules.memory.urls')),
    path('medical-log/', include('api.modules.medical_log.urls')),
    #path('medical-appointment/', include('api.modules.medical_appointment.urls')),
    #path('safe-zone/', include('api.modules.safe_zone.urls')),
    path('card/', include('api.modules.card.urls')),
    path('user-data/', include('api.modules.user_data.urls')),
    path('achievement/', include('api.modules.achievements.urls')),
    path('activities/', include('api.modules.activities.urls')),
    path('caregiver-log/', include('api.modules.caregiver_log.urls')),
]
