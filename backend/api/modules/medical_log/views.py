from .serializers import MedicalLogSerializer
from .models import MedicalLog
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class MedicalLogListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicalLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicalLog.objects.all()
    serializer_class = MedicalLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalLog.objects.filter(user=self.request.user)