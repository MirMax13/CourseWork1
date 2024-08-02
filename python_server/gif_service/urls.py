from django.urls import path

from . import views
from .views import UploadGif, GifList, GetGif, GifAttributes, GifName

urlpatterns = [
    path("", views.index, name="index"),
    path("comaru", views.Comaru, name="Comaru"),
    path("pig", views.Pig, name="Pig"),
    path("arctic-vixen", views.ArcticVixen, name="Arctic-Vixen"),
    path("others", views.Others, name="Others"),
    path("search-by-name", views.SearchByName, name="Search-By-Name"),
    #TODO:
    # path("Search-By-Name/<str:name>", views.SearchByName, name="Search-By-Name"),
    path("search-by-attributes", views.SearchByAttribute, name="Search-By-Attributes"),
    path("modify-gifs", views.ModifyGif, name="Modify-Gifs"),
    path("upload", UploadGif, name="Upload-Gif"),
    path("gif-list", GifList, name="Gif-List"),
    path("gif/<int:id>", GetGif, name="Get-Gif"),
    path("gif-attributes/<int:id>", GifAttributes, name="Gif-Attributes"),
    path("gif-name/<int:id>", GifName, name="Gif-Name"),
]