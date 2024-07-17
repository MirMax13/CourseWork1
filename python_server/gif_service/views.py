from django.http import HttpResponse
from django.template import loader
from .models import Gif
from django.shortcuts import render

def index(request):
    return render(request, "main.ejs")

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
    return render(request, "Modify-Gif.ejs")
