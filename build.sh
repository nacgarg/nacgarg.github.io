cat src/index.html | html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true > index.html
cat src/main.js | uglifyjs --compress  --mangle  --wrap _ > main.js
cat src/main.css | uglifycss > main.css
