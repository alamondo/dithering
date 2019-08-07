from flask import render_template
from flask import jsonify
from flask import request
from app import app
import dither as dit
from PIL import Image
import numpy as np
import PIL.ImageOps
import base64
import io
import json
from flask import Flask

#app = Flask(__name__)


@app.route('/')
def index():
    return render_template('dithering.html')


@app.route('/dithering')
def dithering():
    return render_template('dithering.html')

@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/dither', methods=['GET', 'POST'])
def imgdither():

    processVal = int(request.form['prcoessingResVal'])
    scaleVal = int(request.form['outputScaleVal'])
    cBW = int(request.form['color'])
    algoVal = request.form['algoVal']
    palVal = request.form['palVal']
    colorCountVal = int(request.form['colorCountVal'])
    colorPaletteStringArray = request.form['colorPaletteArray'].split(',')

    b64string = str(request.form['image'])
    b64string = b64string[b64string.find(',')+1:]
    imgdata = base64.b64decode(b64string)
    image = Image.open(io.BytesIO(imgdata))

    colorPaletteArray = np.zeros([int(len(colorPaletteStringArray)/3),3])

    for i in range(int(len(colorPaletteStringArray)/3)):
        colorPaletteArray[i,0] = int(colorPaletteStringArray[i*3])
        colorPaletteArray[i,1] = int(colorPaletteStringArray[i*3+1])
        colorPaletteArray[i,2] = int(colorPaletteStringArray[i*3+2])

    if cBW == 1:
        colorVal = "BW"
    else:
        colorVal = "RGB"

    if algoVal == "FS":
        algoVal = "FLOYDSTEINBERG"
    else:
        algoVal = algoVal

    if palVal == "ADA":
        palVal = "ADAPTIVE"
    elif palVal == "C64":
        palVal = dit.c64_palette
    elif palVal == "GB":
        palVal = dit.gb_palette
    elif palVal == "3RGB":
        palVal = dit.RGB_3bit
    elif palVal == "2GS":
        palVal = dit.grayscale_2bit
    elif palVal == "CMYK":
        palVal = dit.cmyk
    elif palVal == "RGB3COLORS":
        palVal = dit.rgb
    elif palVal == "CUSTOM":
        palVal = colorPaletteArray
    else:
        palVal = "WEB"

    image = dit.prepare_image(image, size=processVal, conversion=colorVal)
    image = dit.dithering(image, algoVal, colorVal, palVal, colorCountVal)
    image = dit.upscale(image, scale=scaleVal)

    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    data_uri = base64.b64encode(buffer.read()).decode('ascii')

    return data_uri
