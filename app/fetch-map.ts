/// <reference path="declarations.d.ts"/>
import parseSvgPath from "svg-path-parser";
// import fetch from "fetch";
import "fetch";
declare var fetch; // sadly there's no .d.ts file for fetch

interface Rectangle {
  x: number,
  y: number,
  width: number,
  height: number,
  element: SVGRectElement
}
interface Powerline {
  start: {x: number, y: number},
  //end: {x: number, y: number},
  element: SVGPathElement
}


export function fetchMap(url: string) {

  const svgPromise = fetchSvg(url);

  const dataPromise = svgPromise.then((svg: SVGSVGElement) => {

    // start parsing the svg-path data
    const powerlines = getPowerlines(svg);
    const sockets = getRectanglesInLayer(svg, "sockets");
    const generators = getRectanglesInLayer(svg, "generators");

    return {
      powerlines: powerlines,
      sockets: sockets,
      svgElement: svg,
    };

  });

  return dataPromise;
}

function fetchSvg(url: string): Promise<SVGSVGElement> {
  const svgXhrPromise = new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // Following line is just to be on the safe side;
    // not needed if your server delivers SVG with correct MIME type
    xhr.overrideMimeType("image/svg+xml");
    xhr.send("");
    xhr.onload = (e) => {
      if (xhr.status === 200) {
        // console.log(xhr.responseText);
        console.log("SVG request successful", xhr);
        resolve(xhr);
      } else {
        console.error(xhr.statusText, xhr);
        reject(xhr);
      }
    };
  });

  const svgPromise: Promise<SVGSVGElement> = svgXhrPromise
    .then(xhr => xhr.responseXML.documentElement);

  return svgPromise;
}

function getPowerlines(svg: SVGSVGElement): Powerline[] {
    const powerlinesLayer = svg.querySelector("#powerlines");
    const powerlineElements = powerlinesLayer.getElementsByTagName("path");
    const powerlines: Powerline[] = [];
    for (const el of powerlineElements) {
      const pathString = el.getAttribute("d");
      const pathList = parseSvgPath(pathString);
      const toAbs = makeConverterToAbsoluteCoords(svg, el);
      const start = toAbs(pathList[0].x, pathList[0].y)

      //const end; // TODO need to deal with relative coords

      powerlines.push({
        start,
        // end,
        element: el,
    });
    }
    return powerlines;
}

/**
 * adapted from <http://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group>
 * Yields a function that converts from coordinates relative to the element to
 * those relative to the svg’s root.
 */
function makeConverterToAbsoluteCoords(svgRoot, element) {
  return function(x,y) {
    let offset = svgRoot.getBoundingClientRect();
    let matrix = element.getScreenCTM();
    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  };
}

function getRectanglesInLayer(svg: SVGSVGElement, layerId: string): Rectangle[] {
  const layer = svg.querySelector("#" + layerId);
  const rectangleElements = layer.getElementsByTagName("rect");
  const rectangleData:Rectangle[] = [];
  for (const el of rectangleElements) {
    const getAttr = (attr:string) => {
      const attrAsStr = valueOr(el.getAttribute(attr), "");
      return valueOr(Number.parseInt(attrAsStr), 0); //parse to number
    };
    const width = getAttr("width");
    const height = getAttr("height");
    const relX = getAttr("x");
    const relY = getAttr("y");
    const toAbs = makeConverterToAbsoluteCoords(svg, el);
    const absCoords = toAbs(relX, relY)
    rectangleData.push({
      x: absCoords.x,
      y: absCoords.y,
      width,
      height,
      element: el,
    });
  }
  //console.log(hasType(rectangleData));
  return rectangleData;
}

function valueOr<T>(value: T | undefined | null, deflt: T): T {
  return value? value : deflt;
}

function hasType(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}