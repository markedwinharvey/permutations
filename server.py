#!/usr/bin/env python
import BaseHTTPServer,CGIHTTPServer,cgitb,time
def start_server():
	server=BaseHTTPServer.HTTPServer
	handler=CGIHTTPServer.CGIHTTPRequestHandler
	server_address=("", 8000)
	handler.cgi_directories=['/','/static']

	httpd=server(server_address, handler)
	httpd.serve_forever()

def main():
	try:
		start_server()
	except:
		time.sleep(.5)
		print;print 'Cannot start server; other server running elsewhere?'
if __name__ == '__main__':
	main()