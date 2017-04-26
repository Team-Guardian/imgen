'use strict';

const webshot = require('webshot');
const jsdom = require('jsdom');
const d3 = require('d3');

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

// DOM
let doc = jsdom.jsdom();
let svg = d3.select(doc.body)
    .append('svg')
    .attr('width', bg_w)
    .attr('height', bg_w)

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

webshot(doc.body.innerHTML, 'targets/hello_world.png', options, (err) => { console.log(err) });