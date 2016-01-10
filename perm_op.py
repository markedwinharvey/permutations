#!/usr/bin/env python 
import cgi,json,math
def main():
	print 'content-type:text/html\n'
	data = json.loads(cgi.FieldStorage()['package'].value)
	set_size = int(data[0])
	iterator = float(data[1])	
	map = []
	n = iterator	
	while len(map) < set_size:
		digit = int(set_size/2.*(1.+math.sin(n)))
		if digit not in map:
			map.append(digit)
		n+=iterator
	package = [set_size,iterator,map]
	print json.dumps(package)	
if __name__ == '__main__':
	main()