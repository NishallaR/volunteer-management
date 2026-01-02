# permissions.py
from rest_framework.permissions import BasePermission

class IsOrganization(BasePermission):
    """
    Allows access only to users with user_type='organization'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'organization'

