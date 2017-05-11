'use strict';

const
    webshot = require('webshot'),
    jsdom = require('jsdom'), 
    d3 = require('d3'), 
    fs = require('fs');

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

//load html file
let htmlDoc = fs.readFileSync("html/index.html", "utf8");

// DOM
let doc = jsdom.jsdom(htmlDoc);
let svg = d3.select(doc.getElementById("test"))
    .append('svg')
    .attr('width', bg_w)
    .attr('height', bg_w)

// Target
const add_circle = function(svg, cr, cx, cy, cc, l, fs, tc){
    let target = svg.append('g')
        .attr('class', 'target')
        .attr('transform', 'translate(' + (cx - cr / 2)  + ',' + (cy - cr / 2) + ')');
    
    target.append('circle')
        .attr('r', cr)
        .attr('fill', cc);
        
    target.append('text')
        .text(l)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', fs)
        .attr('fill', tc);
}

const add_rand_circle = function(svg, bg_w, bg_h){
    const colors = ['white', 'black', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
    const rand = m => Math.floor(Math.random() * (m + 1));
    
    const
        cr = rand(Math.min(bg_w, bg_h) / 2),
        cx = rand(bg_w),
        cy = rand(bg_h),
        cc = colors[rand(9)],
        l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(rand(25)),
        tc = colors[rand(9)];
        
    add_circle(svg, cr, cx, cy, cc, l, cr, tc);
}

//uri of images to use for the bg make sure it's high rez
const imagesUri = [
    "https://www.lawnstarter.com/blog/wp-content/uploads/2015/01/Yellow-st-augustine-lawn.jpg",
    "http://eskipaper.com/images/grass-3.jpg"
]

for (let b = 0; b < imagesUri.length; b++){
    doc.getElementById("img1").src = imagesUri[b]; // select background
    
    for(let i=0; i< 2; i++){
        svg.selectAll('.target').data([]).exit().remove(); // remove previous target
        add_rand_circle(svg, bg_w, bg_h) // add a random target
        
        webshot(
            doc.documentElement.outerHTML,
            `targets/circle_${b}_${i}.png`,
            options, (err) => { if (err !== null){console.log(err)} }
        );
    }
}