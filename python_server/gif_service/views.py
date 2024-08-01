from django.http import HttpResponse
from django.template import loader
from .models import Gif
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json

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

@csrf_exempt
def UploadGif(request):
    if request.method == "POST" and request.FILES['file']:
        try:
            if 'file' not in request.FILES:
                return HttpResponse("No file uploaded", status=400)
            data = request.FILES.get("file").read()
            default_filename = request.FILES.get("file").name
            filename = request.POST.get("filename")
            if not filename:
                filename = default_filename
            contentType = request.FILES.get("file").content_type
            attributes = request.POST.get("attributes")
            if attributes:
                attributes = [attr.strip() for attr in attributes.split(',')]
                if not isinstance(attributes, list):
                    return HttpResponse("Attributes should be a list", status=400)
            else:
                attributes = []
            if "all" not in attributes:
                attributes.append("all")

            gif = Gif(filename=filename, data=data, contentType=contentType, attributes=attributes)
            gif.save()
            return HttpResponse("Gif uploaded successfully", status=201)
        except Exception as e:
           return HttpResponse(str(e), status=400)
    return HttpResponse("Invalid request method", status=405)
        
def error_404_view(request, exception):
    return render(request, "404.html", status=404)
