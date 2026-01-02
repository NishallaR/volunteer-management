from django.db import models
from accounts.models import User
from opportunities.models import Opportunity
from applications.models import Application
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )
    volunteer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='volunteer_notifications'
    )
    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True
    )
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
