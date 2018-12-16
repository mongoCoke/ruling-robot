var http = require("http");
var url = require("url");
var fs = require("fs");
var req = require("request");

http.createServer(function(request,response){
    var pathname = url.parse(request.url).pathname;
    var params = url.parse(request.url,true).query;
    var is = isStaticRequest(pathname);
    if (is){//访问静态页面
        try{
            var data = fs.readFileSync("./page/" + pathname);
            // console.log(data.toString())
            response.writeHead(200);
            response.write(data);
            response.end();
        }catch (e){
            response.writeHead(404);
            response.write("<html><body><h1>404 NotFound</h1></body></html>");
            response.end();
        }
    }else{//请求数据
        if (pathname == "/chat"){
            var data = {
                "reqType":0,
                "perception": {
                    "inputText": {
                        "text": params.text
                    },
                },
                "userInfo": {
                    "apiKey": "214fe8296bb842b6b7789af0c62ad6e9",
                    "userId": "151902"
                }
            }
            var content = JSON.stringify(data);
            req({
                url:"http://openapi.tuling123.com/openapi/api/v2",
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:content
            },function(error,resp,body){
                if (!error && resp.statusCode == 200){
                    var obj = JSON.parse(body);
                    if (obj && obj.results && obj.results.length > 0 && obj.results[0].values){
                        var head = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET","Access-Control-Allow-Headers":"x-requested-with,content-type"};
                        response.writeHead(200,head);
                        response.write(JSON.stringify(obj.results[0].values));
                        response.end();
                    }
                }else{
                    response.write("{\"text\":\"布吉岛你说的是神马！\"}");
                    response.end();
                }
            });
        }
    }
}).listen(12306);

function isStaticRequest(pathName){
    var static = [".html",".css",".js",".jpg"];
    for (var i = 0; i < static.length; i++){
        if (pathName.indexOf(static[i]) == pathName.length - static[i].length){
            return true;
        }
    }
    return false;
}