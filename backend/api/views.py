from api.serializers import MemorySerializer, MedicalLogSerializer, UserDataSerializer
from api.models import Memory, MedicalLog, User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class UserDataView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class MemoryListCreateView(generics.ListCreateAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Memory.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MemoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Memory.objects.filter(user=self.request.user)

class MedicalLogListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MedicalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedicalLog.objects.all()
    serializer_class = MedicalLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MedicalLog.objects.filter(user=self.request.user)