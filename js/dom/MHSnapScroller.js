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
    this.addClass('am-h-snap-scroller');
    this.on('touchstart', this.eventHandler.touchstart);
    this.on('touchend', this.eventHandler.touchend);
    this.on('scroll', this.eventHandler.scroll);
    this._scroll = {
        speed: 0,
        lastEventTime: 0,
        homeGoing: false,
        release: true,
        homeX: 0,
        x: 0
    };
}

MHSnapScroller.tag = 'MHSnapScroller'.toLowerCase();


MHSnapScroller.render = function () {
    return _({});
};

MHSnapScroller.prototype._findHomeX = function () {
    var bound = this.getBoundingClientRect();
    var centerX = (bound.left + bound.right) / 2;
    var eBounds = Array.prototype.map.call(this.childNodes, function (elt) {
        return elt.getBoundingClientRect();
    }).filter(function (bound) {
        return bound.width > 0;
    });
    var scrollLeft = this.scrollLeft;
    var nearestX = Infinity;
    var nextX = Infinity;
    var childCenterX;
    for (var i = 0; i < eBounds.length; ++i) {
        childCenterX = (eBounds[i].left + eBounds[i].right) / 2;
        if (Math.abs(childCenterX - centerX) < Math.abs(nearestX - centerX)) {
            nearestX = childCenterX;
        }

        if ((childCenterX - centerX >= 0) == (this._scroll.speed >= 0)) {
            if (Math.abs(childCenterX - centerX) < Math.abs(nextX - centerX)) {
                nextX = childCenterX;
            }
        }
    }

    if (((nearestX - centerX >= 0) != (this._scroll.speed >= 0)) && (nextX != Infinity)) {
        nearestX = nextX;
    }

    return Math.max(0, Math.min(this.scrollWidth - this.clientWidth, scrollLeft + (nearestX - centerX)));

};


MHSnapScroller.prototype.startHomeGoing = function () {
    if (this._scroll.homeGoing || !this._scroll.release) return;
    this._scroll.homeGoing = true;
    if (this._scroll.speed < 50 && this._scroll.speed >= 0) {
        this._scroll.speed = 50;
    }
    else if (this._scroll.speed > -50 && this._scroll.speed < 0) {
        this._scroll.speed = -50;
    }

    this.eventHandler.homeGoingTick();

};

MHSnapScroller.prototype.stopHomeGoing = function () {
    if (!this._scroll.homeGoing) return;
    this._scroll.homeGoing = false;
};


/***
 *
 * @type {{}|MHSnapScroller}
 */
MHSnapScroller.eventHandler = {};

MHSnapScroller.eventHandler.homeGoingTick = function (toFinish) {
    if (!this._scroll.homeGoing) return;
    if (toFinish === true) {
        this.stopHomeGoing();
        return;
    }
    var last = this._scroll.lastEventTime;
    var now = new Date().getTime();
    var dt = (now - last) / 1000;
    var dx = dt * this._scroll.speed;
    var limitDx = this._scroll.homeX - this._scroll.x;
    var needContinue = false;
    if (Math.abs(dx) >= Math.abs(limitDx) || dx * limitDx <= 0) {
        this._scroll.x = this._scroll.homeX;
    }
    else {
        this._scroll.x += dx;
        needContinue = true;
    }

    this.scrollLeft = this._scroll.x;
    if (needContinue)
        requestAnimationFrame(this.eventHandler.homeGoingTick);
    else
        requestAnimationFrame(this.eventHandler.homeGoingTick.bind(this, true));
}

MHSnapScroller.eventHandler.stopScroll = function () {
    var homeX = this._findHomeX();
    this._scroll.homeX = homeX;
    this.startHomeGoing();
};

/***
 *
 * @param {TouchEvent} event
 */
MHSnapScroller.eventHandler.touchstart = function (event) {
    this.stopHomeGoing();
    this._scroll.release = false;
};

/***
 *
 * @param {TouchEvent} event
 */
MHSnapScroller.eventHandler.touchend = function (event) {
    if (event.touches.length === 0) {
        this._scroll.release = true;
    }
};

MHSnapScroller.eventHandler.scroll = function () {
    if (this._scroll.homeGoing) return;
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
    if (this._scroll.stopTimeout > 0) {
        clearTimeout(this._scroll.stopTimeout);
    }
    this._scroll.stopTimeout = setTimeout(this.eventHandler.stopScroll, 30);
};

export default MHSnapScroller;