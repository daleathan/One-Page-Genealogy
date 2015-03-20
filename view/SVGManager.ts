///<reference path="IViewManager.ts"/>
///<reference path="IBoxRender.ts"/>
///<reference path="boxStyles/BasicSVGBox.ts"/>
///<reference path="../js/jsDeclarations.ts"/>
///<reference path="IGraphicObject.ts"/>
///<reference path="SVGGraphicObject.ts"/>
///<reference path="../util/Point.ts"/>
/**
 * Created by curtis on 3/10/15.
 */
class SVGManager implements IViewManager {

    private svgRoot;
    private linePath;
    private renders:{[s:string]:IBoxRender;};
    private boundingRect;
    private graphicObject: SVGGraphicObject;

    private height: number;
    private width: number;
    private translationX: number;
    private translationY: number;
    private lastBoxes: BoxMap;
    private elements: {};

    constructor(svgElementId:string) {
        this.graphicObject = new SVGGraphicObject();

        var svg =  document.getElementById(svgElementId);

        //this is dangerous to just kill all listeners.
        $(svg).off();
        $(window).off();

        this.svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(this.svgRoot);

        this.linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.svgRoot.appendChild(this.linePath);
        this.renders = {
            'basic': new BasicSVGBox()
        };

        var self = this;
        this.boundingRect = null;
        this.elements = {};

        this.translationX = 0;
        this.translationY = 0;

        this.boundingRect = svg.getBoundingClientRect();
        $(window).resize(function() {
            self.boundingRect = svg.getBoundingClientRect();
        });

        var getHammerPosition = function(container, pt) {
            if(!self.boundingRect) {
                self.boundingRect = container.getBoundingClientRect();
            }

            return {
                x: pt.x - self.boundingRect.left,
                y: pt.y - self.boundingRect.top
            };
        };


        var hammer = new Hammer(svg);
        var pan = hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
        var pinch = new Hammer.Pinch();
        hammer.add([pan, pinch]);

        hammer.on('panmove', function(ev) {
            ev.preventDefault();
            drag(getHammerPosition(svg, ev.center));
        });
        hammer.on('panend pancancel', function(ev) {
            endDrag(getHammerPosition(svg, ev.center), ev.velocityX, ev.velocityY);
        });
        hammer.on('panstart', function(ev) {
            startDrag(getHammerPosition(svg, ev.center))
        });
        var pt1 = null;
        var pt2 = null;
        var dx = 0;
        var dy = 0;

        function startDrag(pt) {
            pt1 = pt;


        }
        function drag(pt) {
            pt2 = pt1;
            pt1 = pt;

            var p1:Point = new Point(pt1.x, pt1.y);
            var p2:Point = new Point(pt2.x, pt2.y);

            self.graphicObject.fireTranslate(p1, p2);
        }
        function endDrag(pt, vx, vy) {
            pt2 = null;
            pt1 = null;
        }
    }
    refresh(boxes: BoxMap): IGraphicObject {
        this.clear();
        this.drawLine(boxes);
        this.drawBoxes(boxes);
        this.lastBoxes = boxes;
        return this.graphicObject;
    }
    private clear():void {
        //while(this.svgRoot.firstChild){
        //    this.svgRoot.removeChild(this.svgRoot.firstChild);
        //}
    }
    private drawBoxes(boxes: BoxMap): void {
        var self = this;
        var rootId: string = boxes.getRoot();
        var queue: string[] = [];
        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            var width: number = this.boundingRect.right - this.boundingRect.left;
            var height: number = this.boundingRect.bottom - this.boundingRect.top;

            var inBound: boolean = true;
            if(box.getX() > width - this.translationX) {
                inBound = false;
            }
            if(box.getX() + box.getWidth() < -this.translationX){
                inBound = false;
            }
            if(box.getY() > height - this.translationY) {
                inBound = false;
            }
            if(box.getY() + box.getHeight() < -this.translationY) {
                inBound = false;
            }

            if(inBound) {
                var redraw: boolean = true;
                if(this.elements.hasOwnProperty(node.getId())) {
                    var element = this.elements[node.getId()];
                    if(element.type === box.getType()) {
                        redraw = false;
                        if(box.getX() !== element.box.getX() ||
                            box.getY() !== element.box.getY()) {

                            BoxStyleFactory.getNewBoxStyle(box.getType()).move(box, element.g);
                        }
                    }
                    else {
                        delete this.elements[node.getId()];
                        this.svgRoot.removeChild(element.g)
                    }
                }
                if(redraw) {
                    var g = BoxStyleFactory.getNewBoxStyle(box.getType()).render(box);
                    this.svgRoot.appendChild(g);

                    (function (node) {
                        var hammer = new Hammer(g);
                        var pan = hammer.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
                        hammer.on('tap', function (ev) {
                            self.graphicObject.fireClick(node.getId());
                        });
                    })(node);
                    this.elements[node.getId()] = {g: g, type: box.getType(), box: box};
                }
            }
            else {
                if(this.elements.hasOwnProperty(node.getId())) {
                    var element = this.elements[node.getId()];
                    delete this.elements[node.getId()];
                    this.svgRoot.removeChild(element.g);
                }
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
    }
    private toCenterPoint(box:IBox):any {
        return {
            getX: function() {
                return box.getX() + box.getWidth()/2;
            },
            getY: function() {
                return box.getY() + box.getHeight()/2;
            }
        }
    }
    private drawLine(boxes: BoxMap): void {
        //this.svgRoot.appendChild(this.linePath);

        var d = "";

        var rootId: string = boxes.getRoot();
        var queue: string[] = [];
        queue.push(rootId);
        while(queue.length > 0) {
            var box:IBox = boxes.getId(queue.shift());
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();

            var cx = box.getX() + box.getWidth()/2;
            var cy = box.getY() + box.getHeight()/2;

            var branchIdsTmp = []
            for(var i=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                branchIdsTmp.push(branchIds[i]);
            }
            branchIds = branchIdsTmp;

            if(branchIds.length < 1) {

            }
            else if(branchIds.length == 1) {
                d += "M " + cx + " " + cy + " ";
                var first = this.toCenterPoint(boxes.getId(branchIds[0]));
                d += "L " + first.getX() + " " + first.getY() + " ";
            }
            else {
                var first = this.toCenterPoint(boxes.getId(branchIds[0]));
                var last = this.toCenterPoint(boxes.getId(branchIds[branchIds.length - 1]));
                var middleX = (first.getX() + cx)/2;

                d += "M " + cx + " " + cy + " ";
                d += "L " + middleX + " " + cy + " ";

                d += "M " + first.getX() + " "+ first.getY() +" ";
                d += "L " + (middleX) + " " + (first.getY()) + " ";

                for(var j=0; j<branchIds.length; j++) {
                    var child = this.toCenterPoint(boxes.getId(branchIds[j]));
                    d += "M " + child.getX() + " " + child.getY() + " ";
                    d += "L " + middleX + " "+child.getY()+" ";
                }

                d += "M " + middleX + " " + first.getY() + " ";
                d += "L " + middleX + " " + last.getY() + " ";
            }

            for (var i:number = 0; i < branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if (!branchBox) {
                    continue;
                }
                queue.push(branchIds[i]);
            }
        }
        this.linePath.setAttribute('stroke','black');
        this.linePath.setAttribute('d', d);
    }
    setTranslation(x:number, y:number): void {

        this.translationX = 0;
        this.translationY = y;
        this.svgRoot.setAttribute("transform", "translate("+0+", "+y+")");
        this.refresh(this.lastBoxes);
    }
    setScale(s: number): void {

    }
    setSize(width: number, height: number): void {

    }
}