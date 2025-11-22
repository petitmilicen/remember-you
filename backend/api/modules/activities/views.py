from rest_framework import generics
from .models import Activities
from .serializers import ActivitiesSerializer
from rest_framework.permissions import IsAuthenticated

class ActivitiesListCreateView(generics.ListCreateAPIView):
    queryset = Activities.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activities.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ActivitiesRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Activities.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Activities.objects.filter(user=self.request.user)