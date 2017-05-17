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
        .attr('transform', 'translate(' + cx  + ',' + cy + ')');
        
    target.append('circle')
        .attr('r', cr)
        .attr('fill', cc);
        
    target.append('text')
        .text(l)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Work Sans')
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
        return -1;
    }
    
    const scale = Math.min(bg_w, bg_h);
    const
        cr = rand(scale / 10, scale / 7),
        cx = rand(cr, bg_w - cr),
        cy = rand(cr, bg_h - cr),
        e = rand(0, 9),
        cc = colors[e],
        l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(rand(0, 25)),
        fs = Math.floor(cr * 1.6),
        tc = colors[rand(0, 9, e)];
        
    add_circle(svg, cr, cx, cy, cc, l, fs, tc);
    
    return {
        shape: 'circle',
        background_color: cc,
        alphanumeric: l,
        alphanumeric_color: tc,
        iw: bg_w, ih: bg_h,
        x: cx - cr,
        y: cy - cr,
        w: 2 * cr, h: 2 * cr
    };
};


const multiplex = function(i, n){
    return Promise.all(
        Array(n).fill(0).map((e, k)=> gen(`${i}_${k}`))
    );
};


const gen = function(i) {
    return new Promise((resolve,reject) => {
        doc.getElementById("img1").src = imagesUri[Math.floor(Math.random() * imagesUri.length)]; // select background    
        svg.selectAll('.target').data([]).exit().remove(); // remove previous target
        let target = add_rand_circle(svg, bg_w, bg_h); // add a random target
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
const num_of_samples_per_iter = 10;
const num_iter = 200;

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