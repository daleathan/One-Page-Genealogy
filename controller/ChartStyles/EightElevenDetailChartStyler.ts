///<reference path="../AbstractChartStyle.ts"/>
/**
 * Created by calvinmcm on 4/14/16.
 */

class EightElevenChartStyler extends AbstractChartStyle{

    constructor(){
        super("EightElevenChartStyler");
    }

    setBasedOnGeneration(parentBox :IBox, branchBox :IBox, generation :number) :void{
        switch(generation){
            case 0:
                branchBox.setX(0);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 1:
                branchBox.setX(parentBox.getX() + 10);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 2:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 10);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 3:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 10);
                branchBox.setType(StyleManager.SMALL);
                StyleManager.stylize(branchBox,true);
                break;
            case 4:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 10);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                break;
            case 5:
                branchBox.setX(parentBox.getX() + parentBox.getWidth() + 10);
                branchBox.setType(StyleManager.MINI);
                StyleManager.stylize(branchBox,true);
                break;
            default:
                branchBox.setCollapsed(true);
        }
    }
}