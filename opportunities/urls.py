from rest_framework.routers import DefaultRouter
from .views import OpportunityViewSet

router = DefaultRouter()
router.register(r'opportunities', OpportunityViewSet)

urlpatterns = router.urls
