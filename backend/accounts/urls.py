from django.urls import path
from .views import admin_login, admin_profile, admin_logout
from .temp_admin import create_temp_admin

urlpatterns = [
    path("admin-login/", admin_login, name="admin-login"),
    path("admin-profile/", admin_profile, name="admin-profile"),
    path("logout/", admin_logout, name="admin-logout"),

    # Temporary route for Render admin creation
    path("create-temp-admin/", create_temp_admin, name="create-temp-admin"),
]