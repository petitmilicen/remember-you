from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from .models import Card
from .serializers import CardSerializer
from rest_framework.permissions import IsAuthenticated
from .models import User

class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == User.UserType.PATIENT:
            return Card.objects.filter(user=user)
        
        if user.user_type == User.UserType.CAREGIVER and user.patient:
            return Card.objects.filter(user=user.patient)
        
        return Card.objects.filter(user=user)
    
    def perform_create(self, serializer):
        user = self.request.user

        if user.user_type == User.UserType.PATIENT:
            serializer.save(user=user, created_by_user=user)
            return

        if user.user_type == User.UserType.CAREGIVER:
            serializer.save(user=user.patient, created_by_user=user)
            return

        serializer.save(user=user, created_by_user=user)


class CardRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == User.UserType.PATIENT:
            return Card.objects.filter(user=user)
        
        if user.user_type == User.UserType.CAREGIVER and user.patient:
            return Card.objects.filter(user=user.patient)
        
        return Card.objects.filter(user=user)
    
    def perform_destroy(self, instance):
        user = self.request.user
        
        if user.user_type == User.UserType.CAREGIVER:
            instance.delete()
            return
        
        if user.user_type == User.UserType.PATIENT:
            if instance.created_by_user and instance.created_by_user.user_type == User.UserType.CAREGIVER:
                raise PermissionDenied("No puedes eliminar tarjetas creadas por tu cuidador.")
            
        instance.delete()