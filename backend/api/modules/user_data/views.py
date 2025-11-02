from .serializers import UserDataSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class UserDataView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user