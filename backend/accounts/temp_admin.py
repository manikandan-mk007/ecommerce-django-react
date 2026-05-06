from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
def create_temp_admin(request):
    secret = request.data.get("secret")

    if secret != "create-admin-123":
        return Response(
            {"message": "Invalid secret."},
            status=status.HTTP_403_FORBIDDEN,
        )

    username = request.data.get("username", "admin")
    password = request.data.get("password", "admin123")
    email = request.data.get("email", "admin@gmail.com")

    if User.objects.filter(username=username).exists():
        return Response(
            {"message": "Admin already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
    )

    return Response(
        {
            "message": "Admin created successfully.",
            "username": user.username,
        },
        status=status.HTTP_201_CREATED,
    )