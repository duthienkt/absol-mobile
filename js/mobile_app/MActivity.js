import '../../css/mobileapp.css';
import GrandContext from 'absol/src/AppPattern/GrandContext';
import Core from '../dom/Core';

var _ = Core._;
var $ = Core.$;


function MActivity() {
    GrandContext.call(this);
    this.caller = null;
    this.arguments = null;
    this.result = null;
}

Object.defineProperties(MActivity.prototype, Object.getOwnPropertyDescriptors(GrandContext.prototype));
MActivity.prototype.constructor = MActivity;

MActivity.prototype.createView = function () {
    this.$view = _({
        class: 'am-activity'
    });
};

MActivity.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = this.createView() || this.$view;
    if (!this.$view) throw new Error("this.$view must be not null!")
    return this.$view;
};

MActivity.prototype.viewToApp = function () {
    /**
     * @type {import('./MTabApplication').default}
     */
    var app = this.getContext("APP");
    app.viewActivity(this);
};


MActivity.prototype.finish = function () {
    if (!this.session) {
        throw new Error("Activity is not started!");
    }
    this.stop();
    if (this.onFinished) this.onFinished();
    if (this.caller) {
        this.caller.activityReturn(this.session, this, this.result);
        this.caller= null;
        this.result = null;
        this.arguments = null;
        this.session = null;
    }
};


/**
 * @param {MActivity} activity
 * @param {*} bundle
 */
MActivity.prototype.startActivity = function (session, activity, args) {
    activity.stop();//stop before call new 
    this.pause();
    activity.caller = this;
    activity.arguments = args;
    activity.result = null;
    activity.session = session;
    activity.attach(this);
    activity.viewToApp();
    activity.start();
};

MActivity.prototype.activityReturn = function (session, act, result) {
    if (this.onActivityReturn) {
        this.onActivityReturn(session, act, result);
    }
    this.caller.viewToApp();
    this.caller.resume();
};

export default MActivity;