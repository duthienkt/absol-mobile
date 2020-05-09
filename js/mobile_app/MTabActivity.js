
import '../../css/mobileapp.css';
import Core from '../dom/Core';
import MActivity from './MActivity';

var _ = Core._;
var $ = Core.$;


function MTabActivity() {
    MActivity.call(this);
    this.counter = '';
}

Object.defineProperties(MTabActivity.prototype, Object.getOwnPropertyDescriptors(MActivity.prototype));
MTabActivity.prototype.constructor = MTabActivity;

MTabActivity.prototype.tabIcon = "span.mdi.mdi-view-dashboard";

MTabActivity.prototype.setCounter = function(value){
    this.counter = value;
    /**
     * @type {import('./MTabApplication').default}
     */
    var app = this.getContext("APP");
    if (app){
        app.updateActivityCounter(this);
    }
};

MTabActivity.prototype.getCounter = function (value) {
    return this.counter;
};

export default MTabActivity;