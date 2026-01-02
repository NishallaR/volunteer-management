"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""
URL configuration for core project.
"""
"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import MyTokenObtainPairView
from drf_spectacular.views import (
    SpectacularAPIView, 
    SpectacularRedocView, 
    SpectacularSwaggerView
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # API routes
    path("api/accounts/", include("accounts.urls")),
    path("api/", include("opportunities.urls")),
    path("api/", include("applications.urls")),
    path("api/", include("notifications.urls")),

    # JWT Authentication
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

   
    # 1. The Schema (The raw data file)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # 2. Swagger UI (The interactive page)
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # 3. Redoc (Alternative layout)
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)