import AComp from "absol-acomp/AComp";
import Dom from 'absol/src/HTML5/Dom';

var Core = new Dom();
Core.install(AComp.core);
export var _ = Core._;
export var $ = Core.$;

export default Core;