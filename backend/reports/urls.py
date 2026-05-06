from django.urls import path
from .views import admin_summary

urlpatterns = [
    path("admin-summary/", admin_summary, name="admin-summary"),
]