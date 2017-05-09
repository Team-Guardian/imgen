'use strict';

const webshot = require('webshot'),
jsdom = require('jsdom'), 
d3 = require('d3'), 
fs = require("fs");

// SGV Dimontions
const
    bg_w = 800,
    bg_h = 400;

// WebShot Options
const options = {
    shotSize: {
        width: bg_w,
        height: bg_h
    },
    siteType: 'html'
}
//load html file in
let htmlDoc = fs.readFileSync("html/index.html","utf8");
// DOM
let doc = jsdom.jsdom(htmlDoc);
let svg = d3.select(doc.getElementById("test"))
    .append('svg')
    .attr('width', bg_w)
    .attr('height', bg_w)
console.log(doc.body);
// Target
let c_r = 40;

let target = svg.append('g')
    .attr('transform', 'translate(' + c_r  + ',' + c_r + ')');

target.append('circle')
    .attr('r', c_r)
    .attr('fill', 'green');
    
target.append('text')
    .text('A')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 40);


//uri of images to use for the bg make sure it's high rez
const imagesUri = ["https://www.lawnstarter.com/blog/wp-content/uploads/2015/01/Yellow-st-augustine-lawn.jpg","http://eskipaper.com/images/grass-3.jpg"]
for (var j = 0; j < imagesUri.length; j++){
    doc.getElementById("img1").src = imagesUri[j];
    webshot(doc.documentElement.outerHTML, `targets/hello_world${j}.png`, options, (err) => { console.log(err) });
}

//webshot(doc.documentElement.outerHTML, 'targets/hello_world.png', options, (err) => { console.log(err) });