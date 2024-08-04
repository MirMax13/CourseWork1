from django.http import HttpResponse, JsonResponse
from django.template import loader
from .models import Gif
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect, get_token
import json
import os


gifs = Gif.objects.all()
context = {
    "gifs": gifs
}

def login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.session.get('isAuthenticated'):
            return JsonResponse({"error": "Unauthorized"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

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

def error_404_view(request, exception):
    return render(request, "404.html", status=404)
 
def GifAttributes(request, id):
    try:
        gif = Gif.objects.get(id=id)
        return JsonResponse(gif.attributes, safe=False)
    except Gif.DoesNotExist:
        return HttpResponse("Gif not found", status=404)
    except Exception as e:
        return HttpResponse(str(e), status=500)
    
def GifName(request, id):
    try:
        gif = Gif.objects.get(id=id)
        return JsonResponse({'filename': gif.filename})
    except Gif.DoesNotExist:
        return HttpResponse("Gif not found", status=404)
    except Exception as e:
        return HttpResponse(str(e), status=500)
    
def DownloadGif(request, id):
    try:
        gif = Gif.objects.get(id=id)
        filename = request.GET.get("filename") or gif.filename
        response = HttpResponse(gif.data, content_type=gif.contentType)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    except Gif.DoesNotExist:
        return HttpResponse("Gif not found", status=404)
    except Exception as e:
        return HttpResponse(str(e), status=500)


def GifList(request):
    gifs = Gif.objects.all()
    gif_list = []
    for gif in gifs:
        gif_list.append({
            "id": gif.id,
            "filename": gif.filename,
            "attributes": gif.attributes
        })
    return JsonResponse(gif_list, safe=False)

def GifListByAttribute(request, attribute):
    gifs = Gif.objects.filter(attributes__contains=[attribute])
    gif_list = []
    for gif in gifs:
        gif_list.append({
            "id": gif.id,
            "filename": gif.filename,
            "attributes": gif.attributes
        })
    return JsonResponse(gif_list, safe=False)

def GifListByName(request, name):
    gifs = Gif.objects.filter(filename__icontains=name)
    gif_list = []
    for gif in gifs:
        gif_list.append({
            "id": gif.id,
            "filename": gif.filename,
            "attributes": gif.attributes
        })
    return JsonResponse(gif_list, safe=False)

@csrf_protect
@login_required
def EditName(request, id):
    if request.method == 'PUT':
        try:
            gif = Gif.objects.get(id=id)
            data = json.loads(request.body)
            newName = data.get("newName")
            if not newName:
                return HttpResponse("New name is required", status=400)
            gif.filename = newName
            gif.save()
            return HttpResponse("Gif name updated successfully")
        except Gif.DoesNotExist:
            return HttpResponse("Gif not found", status=404)
        except Exception as e:
            return HttpResponse(str(e), status=500)
    return HttpResponse("Invalid request method", status=405)

@csrf_protect
@login_required
def EditAttributes(request, id):
    if request.method == 'PUT':
        try:
            gif = Gif.objects.get(id=id)
            data = json.loads(request.body)
            newAttributes = data.get("newAttributes")
            if not newAttributes:
                return HttpResponse("New attributes are required", status=400)
            if not isinstance(newAttributes, list):
                return HttpResponse("Attributes should be a list", status=400)
            gif.attributes = newAttributes
            gif.save()
            return HttpResponse("Gif attributes updated successfully")
        except Gif.DoesNotExist:
            return HttpResponse("Gif not found", status=404)
        except Exception as e:
            return HttpResponse(str(e), status=500)
    return HttpResponse("Invalid request method", status=405)

@login_required
def GifData(request, id):
    if request.method == 'GET':
        try:
            gif = Gif.objects.get(id=id)
            return HttpResponse(gif.data, content_type=gif.contentType)
        except Gif.DoesNotExist:
            return HttpResponse("Gif not found", status=404)
        except Exception as e:
            return HttpResponse(str(e), status=500)
    elif request.method == 'DELETE':
        try:
            gif = Gif.objects.get(id=id)
            gif.delete()
            if not Gif.objects.filter(id=id).exists():
                return HttpResponse("Gif deleted successfully")
            else:
                return HttpResponse("Failed to delete Gif", status=500)
        except Gif.DoesNotExist:
            return HttpResponse("Gif not found", status=404)
        except Exception as e:
            return HttpResponse(str(e), status=500)
    return HttpResponse("Invalid request method", status=405)

@login_required  
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
                attributes = [attr.strip().lower() for attr in attributes.split(',')]
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
           return HttpResponse(str(e), status=500)
    return HttpResponse("Invalid request method", status=405)


@csrf_protect
def CheckAuth(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        login = data.get("login")
        password = data.get("password")
        if login == os.getenv('ADMIN_LOGIN') and password == os.getenv('ADMIN_PASSWORD'):
            request.session['isAuthenticated'] = True
            return JsonResponse({"isAuthenticated": True})
        else:
            request.session['isAuthenticated'] = False
            return JsonResponse({"isAuthenticated": False})
    elif request.method == 'GET':
        csrf_token = get_token(request)
        return JsonResponse({"csrfToken": csrf_token})
    return HttpResponse("Invalid request method", status=405)

