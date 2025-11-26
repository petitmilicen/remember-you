from .serializers import CaregiverLogSerializer
from .models import CaregiverLog
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class CaregiverLogListCreateView(generics.ListCreateAPIView):
    serializer_class = CaregiverLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CaregiverLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CaregiverLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CaregiverLog.objects.all()
    serializer_class = CaregiverLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CaregiverLog.objects.filter(user=self.request.user)
