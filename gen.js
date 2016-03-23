var fs = require('fs'),
    mu = require('mu2'),
    fileExts = ["png", "jpg", "jpeg"];

var results = [];

console.log("Discovering wallpapers");

fs.readdirSync(__dirname).forEach(function(file) {
  var path = __dirname + '/' + file;
  var stat = fs.statSync(path);

  if (stat && !stat.isDirectory() && fileExts.indexOf(file.split(".")[1]) !== -1) results.push(file);
});

console.log("Found", results.length, "wallpapers to include");

var wallpapers = [];

results.forEach(function(result){
  wallpapers.push({ image: "https://raw.githubusercontent.com/tjhorner/wallpapers/master/" + result });
});

var final = "";

mu.compileAndRender("_template.html", { wallpapers: wallpapers })
  .on("data", function(data){
    final += data;
  })
  .on("end", function(){
    fs.writeFileSync("index.html", final);

    final = "";

    mu.compileAndRender("_template.md", { wallpapers: wallpapers })
      .on("data", function(data){
        final += data;
      })
      .on("end", function(){
        fs.writeFileSync("README.md", final);
      });
  });

console.log("Done");
