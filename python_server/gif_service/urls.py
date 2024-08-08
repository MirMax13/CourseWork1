from django.urls import path

from . import views
from .views import UploadGif, GifList,GifListByAttribute,DownloadGif, GifData, GifAttributes, GifName,GifListByName,EditName,EditAttributes,CheckAuth

urlpatterns = [
    path("", views.index, name="index"),
    path("comaru", views.Comaru, name="Comaru"),
    path("pig", views.Pig, name="Pig"),
    path("arctic-vixen", views.ArcticVixen, name="Arctic-Vixen"),
    path("others", views.Others, name="Others"),
    path("search-by-name", views.SearchByName, name="Search-By-Name"),
    path("search-by-attributes", views.SearchByAttribute, name="Search-By-Attributes"),
    path("modify-gifs", views.ModifyGif, name="Modify-Gifs"),
    
    path("gif/<int:id>", GifData, name="Gif-Data"),
    path("gif-attributes/<int:id>", GifAttributes, name="Gif-Attributes"),
    path("gif-name/<int:id>", GifName, name="Gif-Name"),
    path("download-gif/<int:id>", DownloadGif, name="Download-Gif"),
    path("gif-list", GifList, name="Gif-List"),
    path("gif-list-by-name/<str:name>", GifListByName, name="Gif-List-By-Name"),
    path("gif-list-by-attribute/<str:attribute>", GifListByAttribute, name="Gif-List-By-Attribute"),
    path("edit-name/<int:id>", EditName, name="Edit-Name"),
    path("edit-attributes/<int:id>", EditAttributes, name="Edit-Attributes"),
    path("upload", UploadGif, name="Upload-Gif"),
    path("check-auth", CheckAuth, name="Check-Auth"),

]