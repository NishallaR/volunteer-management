# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity
from .serializers import OpportunitySerializer
from .permissions import IsOrganization

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

    def get_permissions(self):
        """
        Organizations can create, update, partial_update, destroy.
        Authenticated users can list/retrieve.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOrganization()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """
        Automatically assign the creating user as the organization.
        """
        serializer.save(organization=self.request.user)
