///<reference path="../AbstractStyler.ts"/>
///<reference path="../../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 6/4/15.
 * Last updated 2/24/16.
 */

class EightElevenSpacer extends  AbstractStyler {

    private initialized:boolean = true;

    constructor(){
        super("EightElevenSpacer");
    }

    applyStyle(boxes: BoxMap): void {
        var rootId: string = boxes.getRoot();
        var root = boxes.getId(rootId);

        this.setBasedOnGeneration(null, root, 0);

        var queue = [];
        queue.push([rootId,0]);

        while(queue.length > 0) {
            var data = queue.shift();
            var box:IBox = boxes.getId(data[0]);
            var generation: number= data[1];
            var node:INode = box.getNode();
            var branchIds = node.getBranchIds();
            for(var i:number=0; i<branchIds.length; i++) {
                var branchBox:IBox = boxes.getId(branchIds[i]);
                if(!branchBox) {
                    continue;
                }

                this.setBasedOnGeneration(box, branchBox, generation+1);
                queue.push([branchIds[i], generation + 1]);
                //box.setCollapsed(false);

                if(this.initialized && generation === 5){
                    box.setCollapsed(true);
                }
            }
        }
        this.initialized = false;
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {

        if(generation == 0) {
            var bx = 0;
            childBox.setType('smallPictureDetailBox');//was midSmPictureDetailBox shift all down to revert
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallPictureDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallPictureDetailBox'));
        }
        else if(generation == 1) {
            bx = parentBox.getX() + parentBox.getWidth()/2-100;
            childBox.setType('smallDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
        }
        else if(generation == 2) {
            bx = parentBox.getX() + parentBox.getWidth()/3;///2;
            childBox.setType('smallDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallDetailBox'));
        }
        else if(generation == 3) {
            bx = parentBox.getX() + parentBox.getWidth()/3+20;///2 + 10;
            childBox.setType('xsDetailBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('xsDetailBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('xsDetailBox'));
        }
        else if(generation == 4) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 20;
            childBox.setType('smallestNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallestNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallestNameBox'));
        }
        else if(generation == 5) {
            bx = parentBox.getX() + parentBox.getWidth()/2 + 20;
            childBox.setType('smallestNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallestNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallestNameBox'));
            //childBox.setSpace(5);
        }
        else {
            var bx = parentBox.getX() + parentBox.getWidth() + 10;
            if(generation <= 5) {
                bx = parentBox.getX() + parentBox.getWidth()/2 + 10;
            }
            childBox.setType('smallestNameBox');
            childBox.setX(bx);
            childBox.setHeight(BoxStyleFactory.getHeight('smallestNameBox'));
            childBox.setWidth(BoxStyleFactory.getWidth('smallestNameBox'));
            childBox.setSpace(4);
        }
    }
}