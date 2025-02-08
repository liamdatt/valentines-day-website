from django.shortcuts import render

def home(request):
    return render(request, 'love_site/index.html')