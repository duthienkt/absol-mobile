import '../../css/mhsnapscroller.css'
import Core from "./Core";
import AElement from "absol/src/HTML5/AElement";

var _ = Core._;
var $ = Core.$;


/***
 *  @extends AElement
 * @constructor
 */
function MHSnapScroller() {
    this.on('touchstart', this.eventHandler.touchstart);
    this.on('touchend', this.eventHandler.touchend);
    this.on('scroll', this.eventHandler.scroll);
    this._scroll = {
        speed: 0,
        lastEventTime: 0,
        homeGoing: false
    };
}

MHSnapScroller.tag = 'MHSnapScroller'.toLowerCase();


MHSnapScroller.render = function () {
    return _({
        class: 'am-h-snap-scroller'
    });
};


MHSnapScroller.prototype.startHomeGoing = function () {
    if (this._scroll.homeGoing) return;
};

MHSnapScroller.prototype.stopHomeGoing = function () {
    if (!this._scroll.homeGoing) return;
};


MHSnapScroller.eventHandler = {};

MHSnapScroller.eventHandler.touchstart = function (event) {

};


MHSnapScroller.eventHandler.touchend = function (event) {
    console.log(event.touches.length);
};

MHSnapScroller.eventHandler.scroll = function () {
    var last = this._scroll.lastEventTime;
    var now = new Date().getTime();
    if (now - last > 100) {
        this._scroll.speed = 0;
        this._scroll.lastEventTime = now;
        this._scroll.x = this.scrollLeft;
    }
    else if (now > last) {
        this._scroll.speed = (this.scrollLeft - this._scroll.x) * 1000 / (now - last);
        this._scroll.lastEventTime = now;
        this._scroll.x = this.scrollLeft;
    }
};

export default MHSnapScroller;