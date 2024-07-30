from django.http import HttpResponse
from django.template import loader
from .models import Gif
from django.shortcuts import render

gifs = Gif.objects.all()
context = {
    "gifs": gifs
}
#TODO: Add the 404 error page (Express and Django)
def index(request):
    return render(request, "main.html", context)

def Comaru(request):
    return render(request, "Comaru.html")

def Pig(request):
    return render(request, "Pig.html")

def ArcticVixen(request):
    return render(request, "Arctic-Vixen.html")

def Others(request):
    return render(request, "Others.html")

def SearchByName(request):
    return render(request, "Search-By-Name.html")

def SearchByAttribute(request):
    return render(request, "Search-By-Attributes.html")

def ModifyGif(request):
    return render(request, "Modify-Gif.html", context)

def UploadGif(request): #TODO: Maybe upgrade
    if request.method == "POST":
        try:
            filename = request.POST.get("filename")
            data = request.FILES.get("data").read()
            contentType = request.FILES.get("data").content_type
            attributes = request.POST.get("attributes")
            gif = Gif(filename=filename, data=data, contentType=contentType, attributes=attributes)
            gif.save()
            return HttpResponse("Gif uploaded successfully", status=201)
        except Exception as e:
            return HttpResponse(str(e), status=500)
        
def error_404_view(request, exception):
    return render(request, "404.html", status=404)
