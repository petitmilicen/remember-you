import os
from django.conf import settings
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserDataSerializer, ProfilePictureSerializer, PatientInfoSerializer, CaregiverSerializer
from ..user.models import User


class UserDataView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterPushTokenView(APIView):
    """Register or update user's Expo push notification token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        push_token = request.data.get('push_token')
        
        if not push_token:
            return Response({
                'error': 'Se requiere el push_token.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.push_token = push_token
        user.save()
        
        return Response({
            'message': 'Push token registrado exitosamente.',
            'push_token': push_token
        }, status=status.HTTP_200_OK)


class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        serializer = ProfilePictureSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            if user.profile_picture:
                old_picture_path = user.profile_picture.path
                if os.path.exists(old_picture_path):
                    os.remove(old_picture_path)
            
            user.profile_picture = serializer.validated_data['profile_picture']
            user.save()
            
            user_serializer = UserDataSerializer(user)
            return Response({
                'message': 'Foto de perfil actualizada exitosamente.',
                'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        
        if user.profile_picture:
            picture_path = user.profile_picture.path
            if os.path.exists(picture_path):
                os.remove(picture_path)
            
            user.profile_picture = None
            user.save()
            
            return Response({
                'message': 'Foto de perfil eliminada exitosamente.'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'No hay foto de perfil para eliminar.'
        }, status=status.HTTP_404_NOT_FOUND)


class GetPatientByIdView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, patient_id):
        try:
            patient = User.objects.get(id=patient_id, user_type=User.UserType.PATIENT)
            serializer = PatientInfoSerializer(patient, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'error': 'Paciente no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)


class AssignCaregiverToPatientView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        patient_id = request.data.get('patient_id')
        
        if not patient_id:
            return Response({
                'error': 'Se requiere el ID del paciente.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        
        if user.user_type != User.UserType.CAREGIVER:
            return Response({
                'error': 'Solo los cuidadores pueden ser asignados a pacientes.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            patient = User.objects.get(id=patient_id, user_type=User.UserType.PATIENT)
        except User.DoesNotExist:
            return Response({
                'error': 'Paciente no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        user.patient = patient
        user.save()
        
        return Response({
            'message': f'Asignado exitosamente a {patient.first_name} {patient.last_name}'.strip(),
            'patient': PatientInfoSerializer(patient, context={'request': request}).data,
            'caregiver': UserDataSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)


class UnassignPatientView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        if user.user_type != User.UserType.CAREGIVER:
            return Response({
                'error': 'Solo los cuidadores pueden desvincular pacientes.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not user.patient:
            return Response({
                'error': 'No hay paciente asignado actualmente.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 🗑️ Eliminar zona segura y historial de ubicaciones del paciente
        from ..safe_zone.models import SafeZone, LocationHistory
        
        patient = user.patient
        SafeZone.objects.filter(user=patient).delete()
        LocationHistory.objects.filter(user=patient).delete()
        
        # Desvincular paciente
        user.patient = None
        user.save()
        
        return Response({
            'message': 'Paciente y zona segura desvinculados exitosamente.'
        }, status=status.HTTP_200_OK)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        
        if user.profile_picture:
            picture_path = user.profile_picture.path
            if os.path.exists(picture_path):
                os.remove(picture_path)
        
        user.delete()
        
        return Response({
            'message': 'Cuenta eliminada exitosamente.'
        }, status=status.HTTP_200_OK)


class GetAvailableCaregiversView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):

        available_caregivers = User.objects.filter(
            user_type=User.UserType.CAREGIVER,
            patient__isnull=True
        ).exclude(id=request.user.id)  
        
        serializer = CaregiverSerializer(available_caregivers, many=True, context={'request': request})
        
        return Response({
            'caregivers': serializer.data,
            'count': available_caregivers.count()
        }, status=status.HTTP_200_OK)