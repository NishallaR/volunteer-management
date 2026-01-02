from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer
from notifications.models import Notification

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'volunteer':
            return Application.objects.filter(volunteer=user)
        return Application.objects.filter(opportunity__organization=user)

    def perform_create(self, serializer):
        application = serializer.save(volunteer=self.request.user)
        # Create initial pending notification for organization
        Notification.objects.create(
            user=application.opportunity.organization,
            application=application, 
            status='pending',
            message=f"{self.request.user.username} applied for {application.opportunity.title}"
        )

    def perform_update(self, serializer):
        application = serializer.save()
        Notification.objects.create(
            user=application.volunteer,
            application=application,
            status=application.status,  # Ensure status is passed to the notification
            message=f"Your application for '{application.opportunity.title}' is now {application.status}"
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def decision(self, request, pk=None):
        action_type = request.data.get('action')
        try:
            # Organizations can only act on applications for their opportunities
            app = self.get_queryset().get(pk=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        if action_type not in ["approve", "reject"]:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Update Application Status
        new_status = 'accepted' if action_type == 'approve' else 'rejected'
        app.status = new_status
        app.save()

        # 2. Mark the Organization's original notification as processed (approved/rejected)
        Notification.objects.filter(application=app, status='pending').update(
            status='approved' if action_type == 'approve' else 'rejected'
        )

        # 3. Create a NEW notification for the Volunteer with the final status
        Notification.objects.create(
            user=app.volunteer,
            application=app,
            status=new_status,
            message=f"Your application for '{app.opportunity.title}' has been {new_status}."
        )

        return Response({"success": True, "status": app.status}, status=status.HTTP_200_OK)

