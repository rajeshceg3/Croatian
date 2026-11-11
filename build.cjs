const fs=require('node:fs'),path=require('node:path');
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const f of ['index.html','style.css','readable-map.css','readable-map.js','map.js','map-module.js','ui-module.js','api-module.js','vibe-matcher.js','data.geojson','LICENSE'])fs.copyFileSync(f,path.join('dist',f));
for(const d of ['vendor','icons'])fs.cpSync(d,path.join('dist',d),{recursive:true});
console.log('Static app built. Legacy and tests excluded.');
