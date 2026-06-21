from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create dev superuser admin/admin123 if not present (local dev only)'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@heartplan.dev', 'admin123')
            self.stdout.write(self.style.SUCCESS('Superuser admin/admin123 created'))
        else:
            self.stdout.write('Superuser admin already exists — skipping')
