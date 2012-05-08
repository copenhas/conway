test: lint
	jasmine-node .

lint:
	jshint app/

serve: test
	hem server

init:
	npm install -g jasmine-node
	npm install -g hem
	npm install -g jshint
