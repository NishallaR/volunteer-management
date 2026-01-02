from rest_framework import serializers
from .models import Opportunity

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ['organization', 'created_at']
 