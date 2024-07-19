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
    return render(request, "main.ejs", context)

def Comaru(request):
    return render(request, "Comaru.ejs")

def Pig(request):
    return render(request, "Pig.ejs")

def ArcticVixen(request):
    return render(request, "Arctic-Vixen.ejs")

def Others(request):
    return render(request, "Others.ejs")

def SearchByName(request):
    return render(request, "Search-By-Name.ejs")

def SearchByAttribute(request):
    return render(request, "Search-By-Attributes.ejs")

def ModifyGif(request):
    return render(request, "Modify-Gif.ejs", context)

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
        

