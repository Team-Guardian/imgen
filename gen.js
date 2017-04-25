'use strict';

const webshot = require('webshot');
const jsdom = require('jsdom');
const d3 = require('d3');

const
    width = 800,
    hight = 400;

const options = {
    shotSize: {
        width: width,
        height: hight
    },
    siteType: 'html'
}

let doc = jsdom.jsdom();
let svg = d3.select(doc.body)
    .append('svg')
    .attr('width', width)
    .attr('height', hight)
    
svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', hight / 2)
    .attr('r', 40)
    .attr('fill', '#8F8F8F');

webshot(doc.body.innerHTML, 'targets/hello_world.png', options, (err) => {});