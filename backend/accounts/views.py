from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import AdminUserSerializer


@api_view(["POST"])
def admin_login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    if not username or not password:
        return Response(
            {"message": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"message": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_staff and not user.is_superuser:
        return Response(
            {"message": "Only admin users can login."},
            status=status.HTTP_403_FORBIDDEN,
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "message": "Login successful.",
            "token": token.key,
            "admin": AdminUserSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_profile(request):
    user = request.user

    if not user.is_staff and not user.is_superuser:
        return Response(
            {"message": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(
        {
            "message": "Admin profile fetched successfully.",
            "admin": AdminUserSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass

    return Response(
        {"message": "Logout successful."},
        status=status.HTTP_200_OK,
    )