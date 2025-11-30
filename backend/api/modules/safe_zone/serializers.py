from rest_framework import serializers
from .models import SafeZone, LocationHistory

class SafeZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafeZone
        fields = ['safe_zone_id', 'user', 'latitude', 'longitude', 'radius_meters', 'address', 'safe_exit_active', 'created_at']
        read_only_fields = ['user', 'created_at']

class LocationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationHistory
        fields = ['location_id', 'user', 'latitude', 'longitude', 'timestamp', 'is_out_of_zone']
        read_only_fields = ['user', 'timestamp']
