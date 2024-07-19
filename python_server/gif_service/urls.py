from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Comaru", views.Comaru, name="Comaru"),
    path("pig", views.Pig, name="Pig"),
    path("arctic-vixen", views.ArcticVixen, name="Arctic-Vixen"),
    path("others", views.Others, name="Others"),
    path("search-by-name", views.SearchByName, name="Search-By-Name"),
    #TODO:
    # path("Search-By-Name/<str:name>", views.SearchByName, name="Search-By-Name"),
    path("search-by-attributes", views.SearchByAttribute, name="Search-By-Attributes"),
    path("Modify-Gif", views.ModifyGif, name="Modify-Gif"),
]