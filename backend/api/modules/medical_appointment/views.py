from .serializers import MedicalAppointmentSerializer
from .models import MedicalAppointment
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class MedicalAppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalAppointment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicalAppointmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicalAppointment.objects.all()
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalAppointment.objects.filter(user=self.request.user)
