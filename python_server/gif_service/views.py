from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the gif service index.")

def Comaru(request):
    return HttpResponse("Comaru")

def Pig(request):
    return HttpResponse("Pig")

def ArcticVixen(request):
    return HttpResponse("ArcticVixen")

def Others(request):
    return HttpResponse("Others")

def SearchByName(request, name):
    return HttpResponse(f"SearchByName: {name}")

def SearchByAttribute(request, attribute):
    return HttpResponse(f"SearchByAttribute: {attribute}")

def ModifyGif(request, name):
    return HttpResponse(f"ModifyGif: {name}")
