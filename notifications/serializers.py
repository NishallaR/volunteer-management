from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.SerializerMethodField()
    opportunity_title = serializers.SerializerMethodField()
    application_id = serializers.IntegerField(source='application.id', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'message',
            'status',
            'volunteer_name',
            'opportunity_title',
            'application_id',
            'created_at'
        ]

    def get_volunteer_name(self, obj):
        # Use application.volunteer if available
        if obj.application and obj.application.volunteer:
            # Return full name if exists, otherwise username
            return obj.application.volunteer.get_full_name() or obj.application.volunteer.username
        return "Unknown Volunteer"

    def get_opportunity_title(self, obj):
        if obj.application and obj.application.opportunity:
            return obj.application.opportunity.title
        elif obj.opportunity:
            return obj.opportunity.title
        return "General Request"
