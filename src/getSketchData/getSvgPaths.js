import { map} from "lodash";
import { mainSketchFile, tokensPage, iconsGroupName, iconLayerName} from "../settings";
const sketch = require('sketch/dom');
const sketchDom = require("sketch/dom").getDocuments();
const [mainDocument] = sketchDom.filter(file => file.path.includes(mainSketchFile));
const [tokenPage] = mainDocument.pages.filter(page => page.name.includes(tokensPage));
const options = { 
    formats: 'svg',
    output: false,
    compact: true
 }

let getSvgPaths

if (tokenPage) {
    const [{ layers }] = tokenPage.layers;
    const iconGroups = layers.filter(layer => layer.name.includes(iconsGroupName));

    const iconLayers = map(iconGroups, "layers")
        .flat()
        .filter(item => item.name.includes(iconLayerName));

    getSvgPaths = iconLayers.map(({name, id, layers}) => {
        let parsedSvgCode = sketch.export(layers[0], options).toString();
        parsedSvgCode = parsedSvgCode
            .replace("<!-- Generator: Sketch 58 (84663) - https://sketch.com -->", '')
            .replace("<desc>Created with Sketch.</desc>", '')
            .replace(/"/g, "'")
            .replace(/\n/g, "")
            .replace(/\<\?xml.+\?\>/g, "")
            .replace(/svg/, "svg id='" + name.replace(/\//, "-") + "'");
        return{
            name: name.replace(/\//g, "-"),
            svgCode: sketch.export(layers[0], options),
            svgCodeSting: parsedSvgCode,
        }
    });
}

export default getSvgPaths;