# Generated by Django 3.0.3 on 2020-03-02 11:48

from django.db import migrations, models
import model_api.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('guid', models.UUIDField(primary_key=True, serialize=False)),
                ('n_cells', models.PositiveIntegerField()),
                ('cell_area', models.FloatField()),
                ('temperature', models.FloatField(blank=True, null=True)),
                ('months_elapsed', models.PositiveIntegerField(blank=True, null=True)),
                ('arrays', models.FileField(blank=True, null=True, upload_to=model_api.models.arrays_upload_location)),
            ],
        ),
    ]
