from django.urls import path
from .views import admin_login, admin_profile, admin_logout

urlpatterns = [
    path("admin-login/", admin_login, name="admin-login"),
    path("admin-profile/", admin_profile, name="admin-profile"),
    path("logout/", admin_logout, name="admin-logout"),
]