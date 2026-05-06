from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Deal
from .serializers import DealSerializer
from .permissions import IsAdminOrReadOnly


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.select_related("product").all().order_by("-created_at")
    serializer_class = DealSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=False, methods=["get"])
    def active(self, request):
        active_deals = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_deals, many=True)
        return Response(serializer.data)