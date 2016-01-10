#!/usr/bin/env python
import BaseHTTPServer,CGIHTTPServer,cgitb,subprocess,sys,requests
try:
	a = requests.get('http://localhost:8000')
	print '*** server running ***'
	print '*** the following information is available:'
	subprocess.Popen(['ps -fA | grep server.py'],shell=True)
except:
	print '*** server not running ***';print '*** starting server ***'
	cgitb.enable()  
 
	server = BaseHTTPServer.HTTPServer
	handler = CGIHTTPServer.CGIHTTPRequestHandler
	server_address = ("", 8000)
	handler.cgi_directories = ["/"]
 
	httpd = server(server_address, handler)
	httpd.serve_forever()
