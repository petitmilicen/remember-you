from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import SupportRequest
from .serializers import (
    SupportRequestSerializer,
    CreateSupportRequestSerializer,
    UpdateStatusSerializer,
    AssignCaregiverSerializer
)
from ..user.models import User


class SupportRequestListCreateView(generics.ListCreateAPIView):
    """
    GET: List all support requests for the authenticated user
    POST: Create a new support request
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return requests created by the user or assigned to the user
        user = self.request.user
        return SupportRequest.objects.filter(
            models.Q(requester=user) | models.Q(assigned_caregiver=user)
        )
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateSupportRequestSerializer
        return SupportRequestSerializer
    
    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)


class SupportRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a specific support request
    PUT/PATCH: Update a support request
    DELETE: Delete a support request
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SupportRequestSerializer
    
    def get_queryset(self):
        # Users can only access their own requests or requests assigned to them
        user = self.request.user
        return SupportRequest.objects.filter(
            models.Q(requester=user) | models.Q(assigned_caregiver=user)
        )


class AssignCaregiverView(APIView):
    """
    POST: Assign a caregiver to a support request
    Can be used by:
    - The requester to manually assign a specific caregiver
    - Any available caregiver to take the request themselves
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            # Allow access if user is the requester OR if taking the request for themselves
            support_request = SupportRequest.objects.get(pk=pk)
            
            # Check if user is trying to assign themselves
            caregiver_id = request.data.get('caregiver_id')
            is_self_assignment = (caregiver_id == request.user.id)
            
            # Only requester can assign others, anyone can assign themselves
            if not is_self_assignment and support_request.requester != request.user:
                return Response({
                    'error': 'Solo el solicitante puede asignar a otro cuidador.'
                }, status=status.HTTP_403_FORBIDDEN)
                
        except SupportRequest.DoesNotExist:
            return Response({
                'error': 'Solicitud no encontrada.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AssignCaregiverSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        caregiver_id = serializer.validated_data['caregiver_id']
        
        try:
            caregiver = User.objects.get(id=caregiver_id, user_type=User.UserType.CAREGIVER)
        except User.DoesNotExist:
            return Response({
                'error': 'Cuidador no encontrado.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if caregiver is available (no patient assigned)
        if caregiver.patient is not None:
            return Response({
                'error': 'Este cuidador ya tiene un paciente asignado.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Assign caregiver to the support request
        support_request.assigned_caregiver = caregiver
        
        # Get the requester's patient
        requester_patient = support_request.requester.patient
        print(f"🔍 DEBUG - Requester: {support_request.requester.username}")
        print(f"🔍 DEBUG - Requester patient: {requester_patient}")
        
        if requester_patient:
            # Save patient reference in the support request
            support_request.patient = requester_patient
            
            # Temporarily assign the patient to the caregiver
            caregiver.patient = requester_patient
            caregiver.save()
            print(f"✅ DEBUG - Patient {requester_patient.username} assigned to {caregiver.username}")
        else:
            print(f"⚠️ DEBUG - Requester has no patient assigned!")
        
        support_request.status = SupportRequest.Status.ASIGNADA
        support_request.save()
        
        response_serializer = SupportRequestSerializer(support_request, context={'request': request})
        return Response({
            'message': f'Cuidador {caregiver.first_name} {caregiver.last_name} asignado exitosamente.',
            'support_request': response_serializer.data
        }, status=status.HTTP_200_OK)


class UpdateStatusView(APIView):
    """
    POST: Update the status of a support request
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            support_request = SupportRequest.objects.get(
                models.Q(pk=pk) & 
                (models.Q(requester=request.user) | models.Q(assigned_caregiver=request.user))
            )
        except SupportRequest.DoesNotExist:
            return Response({
                'error': 'Solicitud no encontrada o no tienes permiso para modificarla.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        new_status = serializer.validated_data['status']
        
        # Update actual times based on status
        if new_status == SupportRequest.Status.EN_CURSO:
            from django.utils import timezone
            support_request.actual_start = serializer.validated_data.get('actual_start', timezone.now())
        elif new_status == SupportRequest.Status.FINALIZADA:
            from django.utils import timezone
            support_request.actual_end = serializer.validated_data.get('actual_end', timezone.now())
            
            # Unassign patient from caregiver when request is finalized
            if support_request.assigned_caregiver and support_request.patient:
                print(f"🔍 DEBUG - Unassigning patient {support_request.patient.username} from {support_request.assigned_caregiver.username}")
                support_request.assigned_caregiver.patient = None
                support_request.assigned_caregiver.save()
                print(f"✅ DEBUG - Patient unassigned successfully")
        elif new_status == SupportRequest.Status.CANCELADA:
            # Also unassign patient if request is cancelled
            if support_request.assigned_caregiver and support_request.patient:
                print(f"🔍 DEBUG - Unassigning patient (cancelled) {support_request.patient.username} from {support_request.assigned_caregiver.username}")
                support_request.assigned_caregiver.patient = None
                support_request.assigned_caregiver.save()
                print(f"✅ DEBUG - Patient unassigned successfully (cancelled)")
        
        support_request.status = new_status
        support_request.save()
        
        response_serializer = SupportRequestSerializer(support_request, context={'request': request})
        return Response({
            'message': f'Estado actualizado a {new_status}.',
            'support_request': response_serializer.data
        }, status=status.HTTP_200_OK)


class GetAvailableSupportRequestsView(APIView):
    """
    GET: Get all available support requests (status = En espera, not assigned)
    These are requests that caregivers can take
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all support requests that are in "En espera" status and not created by current user
        available_requests = SupportRequest.objects.filter(
            status=SupportRequest.Status.EN_ESPERA,
            assigned_caregiver__isnull=True
        ).exclude(requester=request.user)
        
        serializer = SupportRequestSerializer(available_requests, many=True, context={'request': request})
        
        return Response({
            'requests': serializer.data,
            'count': available_requests.count()
        }, status=status.HTTP_200_OK)
