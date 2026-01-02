from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from applications.models import Application
from django.db.models import Q

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Notification API:
    - Volunteers: see all their notifications (pending, approved, rejected)
    - Organizations: see all application-related notifications (pending, approved, rejected)
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.user_type == 'organization':
            # Return all notifications tied to an application (any status)
            return Notification.objects.filter(
                application__isnull=False
            ).order_by('-created_at')
        else:
            # Volunteers see all notifications for themselves
            return Notification.objects.filter(
                user=user
            ).order_by('-created_at')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        notification = self.get_object()

        if request.user.user_type != 'organization':
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        # Update notification
        notification.status = 'approved'
        notification.save()

        if notification.application:
            # Update related application status
            notification.application.status = 'accepted'
            notification.application.save()

            # Update related notifications for the volunteer
            Notification.objects.filter(
                application=notification.application,
                user=notification.application.volunteer
            ).update(status='accepted')

        return Response({"status": "approved"})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        notification = self.get_object()

        if request.user.user_type != 'organization':
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        # Update notification
        notification.status = 'rejected'
        notification.save()

        if notification.application:
            # Update related application status
            notification.application.status = 'rejected'
            notification.application.save()

            # Update related notifications for the volunteer
            Notification.objects.filter(
                application=notification.application,
                user=notification.application.volunteer
            ).update(status='rejected')

        return Response({"status": "rejected"})
