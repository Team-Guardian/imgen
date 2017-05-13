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
};

//load html file
let htmlDoc = fs.readFileSync("html/index.html", "utf8");

// DOM
let doc = jsdom.jsdom(htmlDoc);
let svg = d3.select(doc.getElementById("test"))
    .append('svg')
    .attr('width', bg_w)
    .attr('height', bg_w);

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
};

const add_rand_circle = function(svg, bg_w, bg_h){
    const colors = ['white', 'black', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
    const rand = (l, r, e) => {
        for(let i = 0; i< 100; i++) {
            let n = Math.floor(Math.random() * (r - l + 1) + l);
            if (n !== e) { return n; }
        }
    }
    
    const scale = Math.min(bg_w, bg_h);
    const
        cr = rand(scale / 20, scale / 10),
        cx = rand(cr / 2, bg_w - cr / 2),
        cy = rand(cr / 2, bg_h - cr / 2),
        cc = colors[rand(0, 9)],
        l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(rand(0, 25)),
        tc = colors[rand(0, 9, cc)];
        
    add_circle(svg, cr, cx, cy, cc, l, cr, tc);
    
    return {
        shape: 'circle',
        background_color: cc,
        alphanumeric: l,
        alphanumeric_color: tc,
        iw: bg_w, ih: bg_h,
        x: cx - cr,
        y: cy - cr,
        w: cr, h: cr
    };
};

//uri of images to use for the bg make sure it's high rez
const imagesUri = [
    "https://www.lawnstarter.com/blog/wp-content/uploads/2015/01/Yellow-st-augustine-lawn.jpg",
    "http://eskipaper.com/images/grass-3.jpg"
];

const targets = [];
const num_samples_per_background = 100;

for (let b = 0; b < imagesUri.length; b++){
    doc.getElementById("img1").src = imagesUri[b]; // select background
    
    for(let i=0; i< num_samples_per_background; i++){
        svg.selectAll('.target').data([]).exit().remove(); // remove previous target
        let target = add_rand_circle(svg, bg_w, bg_h); // add a random target
        if (target.background_color === target.alphanumeric_color){ continue; }
        let id = `t_${b}_${i}.png`;
        target.id = id;
        targets.push(target);
        
        webshot(
            doc.documentElement.outerHTML,
            `targets/${id}`,
            options, (err) => { if (err !== null){ console.log(err); } }
        );
    }
}


fs.writeFile('targets/disc.txt', JSON.stringify({targets, targets_count: targets.length}), 'utf8', (err) => {
    if (err !== null){ console.log(err); }
});