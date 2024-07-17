from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Comaru", views.Comaru, name="Comaru"),
    path("Pig", views.Pig, name="Pig"),
    path("Arctic-Vixen", views.ArcticVixen, name="Arctic-Vixen"),
    path("Others", views.Others, name="Others"),
    path("Search-By-Name", views.SearchByName, name="Search-By-Name"),
    #TODO:
    # path("Search-By-Name/<str:name>", views.SearchByName, name="Search-By-Name"),
    path("Search-By-Attributes", views.SearchByAttribute, name="Search-By-Attributes"),
    path("Modify-Gif", views.ModifyGif, name="Modify-Gif"),
]