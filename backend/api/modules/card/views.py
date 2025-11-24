from rest_framework import generics
from .models import Card
from .serializers import CardSerializer
from rest_framework.permissions import IsAuthenticated
from .models import User

class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        user = self.request.user

        if user.user_type == User.UserType.PATIENT:
            serializer.save(user=user)
            return

        if user.user_type == User.UserType.CAREGIVER:
            serializer.save(user=user.patient)
            return

        serializer.save(user=user)


class CardRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)