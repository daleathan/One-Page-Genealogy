///<reference path="../IBoxRender.ts"/>
///<reference path="../../util/DateFormat.ts"/>
///<reference path="../../util/StringUtils.ts"/>
/**
 * Created by renae on 7/27/15.
 */
class SmallPicDetRotBox implements IBoxRender {
    render(box:IBox, rootElement): any {
        var g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var gt:Element = document.createElementNS("http://www.w3.org/2000/svg", "g");
        if(rootElement) {
            rootElement.appendChild(g);
        }
        var rect:Element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        g.appendChild(rect);
        g.appendChild(gt);

        rect.setAttribute('width', String(this.getWidth()-4));
        rect.setAttribute('height', String(box.getHeight()-2-box.getSpace()));

        if(isNaN(box.getY())) {
            console.log(box);
        }

        g.setAttribute("transform","translate("+(box.getX()+550)+", "+box.getY()+")");
//        g.setAttribute("transform","rotate(90 10,10)");


        rect.setAttribute('rx', "10");
        rect.setAttribute('ry', "10");
        rect.setAttribute('stroke-width', '2');


        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text);

        var node: INode = box.getNode();
        if(node.hasAttr('name')) {
            var nameTextPath = document.createTextNode(box.getNode().getAttr('name'));
            text.appendChild(nameTextPath);
            text.setAttribute("x", "60");
            text.setAttribute("y", "15");
            text.setAttribute("font-size", "15px");
            text.setAttribute("style", "font-family:tahoma, sans-serif");
//            StringUtils.centerElement(text, 40, 240);
            StringUtils.fitName(text,node.getAttr('name'),40);
        }

        var text3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text3);
        var nameTextPath = document.createTextNode("");
        text3.appendChild(nameTextPath);
        text3.setAttribute("x", "60");
        text3.setAttribute("y", "30");
        text3.setAttribute("font-size", "10px");
        text3.setAttribute("style", "font-family:tahoma, sans-serif");

        StringUtils.fitDate(text3, node.getAttr('birthdate'), node.getAttr('deathdate'), 240);
//        StringUtils.centerElement(text3, 40, 240);

        var text4 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text4);
        var nameTextPath = document.createTextNode("");
        text4.appendChild(nameTextPath);
        text4.setAttribute("x", "60");
        text4.setAttribute("y", "42");
        text4.setAttribute("font-size", "10px");
        text4.setAttribute("style", "font-family:tahoma, sans-serif");
//        StringUtils.centerElement(text4, 40, 240);
        //StringUtils.fit2Places(text4, node.getAttr('birthplace'),node.getAttr('deathplace'), 40);
        StringUtils.fitPlace(text4, node.getAttr('birthplace'), 40);
        text4.textContent = 'B: '+text4.textContent;

        var text5 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        gt.appendChild(text5);
        //var nameTextPath = document.createTextNode("M: marriage place (year)");
        var nameTextPath = document.createTextNode("");
        text5.appendChild(nameTextPath);
        text5.setAttribute("x", "60");
        text5.setAttribute("y", "54");
        text5.setAttribute("font-size", "10px");
        text5.setAttribute("style", "font-family:tahoma, sans-serif");
//        StringUtils.centerElement(text5, 40, 240);
        StringUtils.fitPlace(text5, node.getAttr('deathplace'), 40);
        text5.textContent = 'D: '+text5.textContent;

        var gender = 'none';
        var grayScale = box.isGray();
        if(node.hasAttr('gender')) {
            gender = node.getAttr('gender');
        }
        if(box.getColor()!= null && !grayScale){
            rect.setAttribute('fill', box.getColor());
            rect.setAttribute('stroke','black');
        }
        else if(gender === 'Male' && !grayScale) {
            rect.setAttribute('fill','#8DEEEE');
            rect.setAttribute('stroke', '#2ee0e0');

        }
        else if(gender === 'Female' && !grayScale) {
            rect.setAttribute('fill','#FFD1DC');
            rect.setAttribute('stroke', '#ffa3b9');
        }
        else {
            rect.setAttribute('fill','#E5E5E5');
            rect.setAttribute('stroke', 'black');
        }

        var clippath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clippath.setAttribute('id', 'clip-'+node.getId());
        gt.appendChild(clippath);
        var cliprect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cliprect.setAttribute('width', '50');
        cliprect.setAttribute('height', '50');
        cliprect.setAttribute('rx', '10');
        cliprect.setAttribute('ry', '10');
        cliprect.setAttribute('x', '5');
        cliprect.setAttribute('y', '5');

        clippath.appendChild(cliprect);


        if(node.hasAttr('profilePicturePromise')) {
            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute('height','50');
            svgimg.setAttribute('width','50');
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','images/loading.svg');
            svgimg.setAttribute('x','5');
            svgimg.setAttribute('y','5');
            svgimg.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');
            gt.appendChild(svgimg);
            node.getAttr('profilePicturePromise').then(function(response) {
                if(!response) {
                    gt.removeChild(svgimg);
                    return;
                }
                var svgimg2 = document.createElementNS('http://www.w3.org/2000/svg','image');
                svgimg2.setAttribute('height','50');
                svgimg2.setAttribute('width','50');
                svgimg2.setAttribute('x','5');
                svgimg2.setAttribute('y','5');
                svgimg2.setAttribute('clip-path', 'url(#clip-'+node.getId()+')');

                function listener() {
                    gt.removeChild(svgimg);
                    svgimg2.removeEventListener('load', listener);
                }
                svgimg2.addEventListener('load', listener);
                svgimg2.setAttributeNS('http://www.w3.org/1999/xlink','href',response);
                gt.appendChild(svgimg2);


            }, function() {
                gt.removeChild(svgimg);
            });
        }


        gt.setAttribute("transform","translate(0, "+ (this.getHeight()-2)+") rotate(-90 0,0)");

        return g;
    }
    move(box:IBox, graphic: any): any {

        graphic.setAttribute("transform","translate("+(box.getX()+2)+", "+
            (box.getY()+1+Math.round(box.getSpace()/2))+")");
    }
    getType(): string {
        return "smallPicDetRotBox";
    }
    getHeight(): number {
//        return 61+2;//66;
        return 270;
    }
    getWidth(): number {
//        return 270;
        return 61+2;
    }
    requiresLoad(): boolean {
        return true;
    }
}