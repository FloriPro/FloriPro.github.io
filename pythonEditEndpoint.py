from flask import Flask, request, flash, render_template, redirect, make_response, url_for, request
from flask import jsonify
import asyncio
import datetime
import time
import os
from os import listdir
from os.path import isfile, join
app = Flask('')
app.secret_key ='idk_cookie_key'

@app.route('/edithtml', methods=["POST"])
def edithtml():
    html=request.form.get("html")
    file=request.form.get("file")
    f=open(file[1:],"w")
    f.write(html)
    f.close()
    return "ok"
def run():
  app.run(host="0.0.0.0", port=8080)
  
run()