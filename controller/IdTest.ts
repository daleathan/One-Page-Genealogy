///<reference path="IStyler.ts"/>
///<reference path="../view/BoxStyleFactory.ts"/>
/**
 * Created by renae on 9/18/15.
 */
class IdTest implements  IStyler {
    getName() : string {
        return "IdTest";
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

                queue.push([branchIds[i], generation+1]);
            }
        }
    }
    private setBasedOnGeneration(parentBox: IBox, childBox: IBox, generation: number) {
        var bx = 0;

        if(generation > 0) {
            bx = parentBox.getX() + parentBox.getWidth() + 10;
        }
        childBox.setType('idBox');
        childBox.setX(bx);
        childBox.setHeight(BoxStyleFactory.getHeight('idBox'));
        childBox.setWidth(BoxStyleFactory.getWidth('idBox'));
    }
}