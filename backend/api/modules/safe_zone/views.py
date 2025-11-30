from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SafeZone, LocationHistory
from .serializers import SafeZoneSerializer, LocationHistorySerializer
from ..user.models import User

class SafeZoneListCreateView(generics.ListCreateAPIView):
    serializer_class = SafeZoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return safe zone for the current user (if patient) or their patient (if caregiver)
        user = self.request.user
        if user.user_type == User.UserType.PATIENT:
            return SafeZone.objects.filter(user=user)
        elif user.user_type == User.UserType.CAREGIVER and user.patient:
            return SafeZone.objects.filter(user=user.patient)
        return SafeZone.objects.none()

    def perform_create(self, serializer):
        # Create safe zone for the current user (if patient) or their patient (if caregiver)
        user = self.request.user
        target_user = user
        if user.user_type == User.UserType.CAREGIVER and user.patient:
            target_user = user.patient
        
        # Ensure only one safe zone per patient for now
        SafeZone.objects.filter(user=target_user).delete()
        serializer.save(user=target_user)

class LocationUpdateView(generics.CreateAPIView):
    serializer_class = LocationHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Only patients should update their location
        if self.request.user.user_type == User.UserType.PATIENT:
            patient = self.request.user
            is_out_of_zone = self.request.data.get('is_out_of_zone', False)
            
            # Save location
            location = serializer.save(user=patient)
            
            # Check if safe exit is active
            safe_zone = SafeZone.objects.filter(user=patient).first()
            safe_exit_active = safe_zone.safe_exit_active if safe_zone else False
            
            # 🚨 EMERGENCY ALERT: If just exited zone AND safe exit is NOT active
            if is_out_of_zone and not safe_exit_active:
                # Get previous location to check if this is a NEW exit
                prev_locations = LocationHistory.objects.filter(
                    user=patient
                ).order_by('-timestamp')[1:2]  # Get second most recent
                
                # Only alert if previously was inside (or first location)
                should_alert = not prev_locations or not prev_locations[0].is_out_of_zone
                
                if should_alert:
                    # Find caregiver
                    caregivers = User.objects.filter(
                        user_type=User.UserType.CAREGIVER,
                        patient=patient
                    )
                    
                    for caregiver in caregivers:
                        if caregiver.push_token:
                            # Send emergency notification
                            from ..notifications.push_service import send_emergency_alert
                            patient_name = f"{patient.first_name} {patient.last_name}".strip() or patient.username
                            
                            send_emergency_alert(
                                caregiver_token=caregiver.push_token,
                                patient_name=patient_name,
                                latitude=float(location.latitude),
                                longitude=float(location.longitude)
                            )

class LocationHistoryView(generics.ListAPIView):
    serializer_class = LocationHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.UserType.PATIENT:
            return LocationHistory.objects.filter(user=user)[:100] # Limit to last 100 points
        elif user.user_type == User.UserType.CAREGIVER and user.patient:
            return LocationHistory.objects.filter(user=user.patient)[:100]
        return LocationHistory.objects.none()

class SafeExitToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Toggle safe exit mode for the patient's safe zone"""
        user = request.user
        
        # Determine target user (patient)
        if user.user_type == User.UserType.CAREGIVER and user.patient:
            target_user = user.patient
        elif user.user_type == User.UserType.PATIENT:
            target_user = user
        else:
            return Response(
                {"error": "No patient associated with this account"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get safe zone
        safe_zone = SafeZone.objects.filter(user=target_user).first()
        if not safe_zone:
            return Response(
                {"error": "No safe zone configured"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Toggle or set the value
        active = request.data.get('active')
        if active is not None:
            safe_zone.safe_exit_active = active
        else:
            safe_zone.safe_exit_active = not safe_zone.safe_exit_active
        
        safe_zone.save()
        
        return Response({
            "safe_exit_active": safe_zone.safe_exit_active,
            "message": "Safe exit activated" if safe_zone.safe_exit_active else "Safe exit deactivated"
        }, status=status.HTTP_200_OK)
