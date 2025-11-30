from django.urls import path
from .views import SafeZoneListCreateView, LocationUpdateView, LocationHistoryView, SafeExitToggleView

urlpatterns = [
    path('zone/', SafeZoneListCreateView.as_view(), name='safe-zone-list-create'),
    path('location/update/', LocationUpdateView.as_view(), name='location-update'),
    path('location/history/', LocationHistoryView.as_view(), name='location-history'),
    path('safe-exit/toggle/', SafeExitToggleView.as_view(), name='safe-exit-toggle'),
]
