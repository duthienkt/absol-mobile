import '../../css/mobileapp.css';
import GrandContext from 'absol/src/AppPattern/GrandContext';
import Core from '../dom/Core';

var _ = Core._;
var $ = Core.$;


function MTabApplication(props) {
    GrandContext.call(this);
    this.setContext("APP", this);
    this.tabActivities = [];
    this.currentActivity = null;
    Object.assign(this, props);

}

Object.defineProperties(MTabApplication.prototype, Object.getOwnPropertyDescriptors(GrandContext.prototype));

MTabApplication.prototype.createView = function () {
    var app = this;
    this.$activity = this.tabActivities.map(function (act) {
        return act.getView();
    });
    this.activityTabIcons = this.tabActivities.map(function (act) {
        return act.tabIcon;
    });

    this.$view = _({
        class: 'am-application',
        child: [
            {
                tag: 'mbottomtabbar',
                class: 'am-application-tabbar',
                props: {
                    items: this.activityTabIcons.map(function (icon, i) {
                        return {
                            icon: icon,
                            value: i,
                            counter: app.tabActivities.counter
                        }
                    })
                },
                on: {
                    change: this.ev_tabChange.bind(this)
                }
            },
            {
                tag: 'frameview',
                class: 'am-application-frameview',
                child: this.$activity
            }
        ]
    });

    this.$frameview = $('.am-application-frameview ', this.$view);
    this.$tabbar = $('.am-application-tabbar', this.$view);
};

MTabApplication.prototype.getView = function () {
    if (this.$view) return this.$view;
    this.$view = this.createView() || this.$view;
    if (!this.$view) throw new Error("this.$view must be not null!")
    return this.$view;
};



MTabApplication.prototype.showTabbar = function (flag) {
    var current = this.$view.containsClass('am-show-tabbar');
    if (current == flag) return;
    if (flag) {
        this.$view.addClass('am-show-tabbar');
    }
    else {
        this.$view.removeClass('am-show-tabbar');
    }
    absol.Dom.updateResizeSystem();
};



MTabApplication.prototype.start = function () {
    var app = this;
    this.tabActivities.forEach(function(act){
        act.attach(app);
    });
    this.getView().addTo(document.body);
    GrandContext.prototype.start.apply(this, arguments);
    this.startActivity("start", this.initActivity || this.tabActivities[0]);
};

MTabApplication.prototype.startActivity = function (session, act, args) {
    act.stop();//stop before call new 
    act.caller = this;
    act.arguments = args;
    act.result = null;
    act.session = session;
    act.attach(this);
    this.viewActivity(act);
    act.start();
};


MTabApplication.prototype.activityReturn = function (session, act, result) {
    if (this.onActivityReturn) {
        this.onActivityReturn(session, act, result);
    }
    var tabIndex = this.tabActivities.indexOf(act);
    if (tabIndex < 0)
        act.getView().selfRemove();
};

MTabApplication.prototype.viewActivity = function (act) {
    var activityView = act.getView();
    var tabIndex = this.tabActivities.indexOf(act);
    if (tabIndex >= 0) {
        this.showTabbar(true);
        activityView.requestActive();
        if (tabIndex != this.$tabbar.value) this.$tabbar.value = tabIndex;
    }
    else {
        this.showTabbar(false);
        if (activityView.isDescendantOf(this.$frameview)) {
            activityView.requestActive();
        }
        else {
            this.$frameview.addChild(activityView);
            activityView.requestActive();
        }
    }
};

MTabApplication.prototype.updateActivityCounter = function(act){
    var tabIndex = this.tabActivities.indexOf(act);
    if (tabIndex >= 0) {
        this.$tabbar.items[tabIndex].counter = act.counter;
    }
};

MTabApplication.prototype.activeTabActivityByIndex = function (index) {
    var act = this.tabActivities[index];
    if (this.currentActivity == act) return;
    if (this.currentActivity) {
        this.currentActivity.pause();
    }
    this.viewActivity(act);
    act.arguments = null;
    act.result = null;
    act.session = null;
    act.caller = this;
    this.currentActivity = act;
    act.start();//may be resume
};

MTabApplication.prototype.ev_tabChange = function () {
    this.activeTabActivityByIndex(this.$tabbar.value);
};

export default MTabApplication;