import { foo } from 'test-import';
//import SVG from "wout/svg.js";
import "fetch";


console.log('hello typescript', foo);

fetch('demo.svg')
.then(response => {
})


var blueprintSVG = document.getElementById('blueprint')
window.blueprintSVG4dbg = blueprintSVG;

/*
window.SVG4dbg = SVG;
var svgParent = document.getElementById('background');
var draw = SVG(svgParent);
window.draw4dbg = draw;
var rect = draw.rect(100, 100).attr({ fill: '#f06' });

var draw2 = SVG(blueprintSVG);
window.draw2fordbg = draw2;
*/


/*

declare var Raphael: any; //imported in index.html


//TODO take a look at the lightweight svg.js



importing svg data

* https://github.com/wout/svg.js#import--export-svg
* https://github.com/wout/raphael-svg-import (deprecated for svg.js)


parsing path data

* https://github.com/hughsk/svg-path-parser
* https://www.npmjs.com/package/parse-svg
* https://github.com/canvg/canvg





console.log(Raphael);

// Creates canvas 320 × 200 at 10, 50
// var paper = Raphael(10, 50, 320, 200);
//
// // Creates circle at x = 50, y = 40, with radius 10
// var circle = paper.circle(50, 40, 10);
// // Sets the fill attribute of the circle to red (#f00)
// circle.attr("fill", "#f00");
//
// // Sets the stroke attribute of the circle to white
// circle.attr("stroke", "#fff");
//
 */
