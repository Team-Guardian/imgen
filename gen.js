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
const add_text = function(target, text, font_size, color, size){
    target.append('text')
        .text(text).attr('x', size / 2).attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Work Sans')
        .attr('font-size', font_size)
        .attr('fill', color);
}
const shift = function(svg, x, y) {
    const target = svg.append('g')
        .attr('class', 'target')
        .attr('transform', 'translate(' + x  + ',' + y + ')');
    return target;
}
const add_circle = function(target, size, color){
    target.append('circle')
        .attr('cx', size / 2)
        .attr('cy', size / 2)
        .attr('r', size / 2)
        .attr('fill', color);
    return 'circle';
};
const add_rect = function(target, size, color){
    target.append('rect')
        .attr('width', size)
        .attr('height', size)
        .attr('fill', color);
    return 'rect';
}
const shape_fn = [add_circle, add_rect];
const colors = ['white', 'black', 'gray', 'red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
const rand = (l, r, e) => {
    for(let i = 0; i< 100; i++) {
        let n = Math.floor(Math.random() * (r - l + 1) + l);
        if (n !== e) { return n; }
    }
    return l;
}
const rand_param = function(bg_w, bg_h, colors){
    const bg_min_dim = Math.min(bg_w, bg_h);
    const size = rand(bg_min_dim / 5, bg_min_dim / 4);
    const c = rand(0, 9);
    return {
        size,
        x: rand(0, bg_w - size),
        y: rand(0, bg_h - size),
        shape_color: colors[c],
        text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.charAt(rand(0, 35)),
        text_size: Math.floor(size * 0.8),
        text_color: colors[rand(0, 9, c)]
    };
}
const add_random_target = function(svg, bg_w, bg_h, colors, shape_fn){
    let p = rand_param(bg_w, bg_h, colors);
    let target = shift(svg, p.x, p.y);
    let shape = shape_fn[Math.floor(Math.random() * shape_fn.length)](target, p.size, p.shape_color);
    add_text(target, p.text, p.text_size, p.text_color, p.size);
    p.shape = shape;
    return p;
}


const multiplex = function(i, n){
    return Promise.all(
        Array(n).fill(0).map((e, k)=> gen(`${i}_${k}`))
    );
};


const gen = function(i) {
    return new Promise((resolve,reject) => {
        doc.getElementById("img1").src = imagesUri[Math.floor(Math.random() * imagesUri.length)]; // select background    
        svg.selectAll('.target').data([]).exit().remove(); // remove previous target
        let target = add_random_target(svg, bg_w, bg_h, colors, shape_fn); // add a random target
        let id = `t_${i}.png`;
        target.id = id;
        targets.push(target);
        
        webshot(
            doc.documentElement.outerHTML,
            `targets/${id}`,
            options, (err) => { 
                if (err !== null){
                    reject(`shit hit the fan ${err}`);
                }else{
                    resolve();
                }
            }
        );
    });
}



//uri of images to use for the bg make sure it's high rez
const imagesUri = [
    "https://www.lawnstarter.com/blog/wp-content/uploads/2015/01/Yellow-st-augustine-lawn.jpg"
];

const targets = [];
const num_of_samples_per_iter = 4;
const num_iter = 3;

let promise = Promise.resolve(); 
for( let i = 0; i < num_iter; i++){
    promise = promise.then((result) =>{
        return multiplex(i, num_of_samples_per_iter);
    });
}

promise.then((result)=>{
    fs.writeFile('targets/disc.txt', JSON.stringify({targets, targets_count: targets.length}), 'utf8', (err) => {
        if (err !== null){ console.log(err); }
    }); 
});