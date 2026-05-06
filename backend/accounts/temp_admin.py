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
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.email = email
        user.save()

        return Response(
            {"message": "Existing admin password updated successfully."},
            status=status.HTTP_200_OK,
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