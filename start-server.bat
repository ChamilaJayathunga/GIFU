@echo off
echo Starting GIFU Interview Practice server...
echo Open: http://localhost:3000
node -e "var h=require('http'),f=require('fs'),p=require('path');h.createServer((r,s)=>{var u=r.url==='/'?'/index.html':r.url,x=p.join(__dirname,u);f.exists(x,function(e){if(e){var t={'html':'text/html','css':'text/css','js':'application/javascript','png':'image/png','jpg':'image/jpeg','mp3':'audio/mpeg','m4a':'audio/mp4','pdf':'application/pdf'};s.writeHead(200,{'Content-Type':t[p.extname(u).slice(1)]||'text/plain'});f.createReadStream(x).pipe(s)}else{s.writeHead(404);s.end('404')}})}).listen(3000,()=>console.log('Server running on http://localhost:3000'))"
pause
