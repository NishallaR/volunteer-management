from django.db import models
from accounts.models import User

class Opportunity(models.Model):
    organization = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='opportunities'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    required_skills = models.TextField()
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=60, decimal_places=50, null=True, blank=True)
    longitude = models.DecimalField(max_digits=60, decimal_places=50, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
