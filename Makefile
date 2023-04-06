docs/script.js: src/*.ts node_modules
	./node_modules/.bin/esbuild src/index.ts --bundle --minify --outfile=$@

node_modules: package.json
	npm install

clean:
	rm -rf docs/script.js node_modules
