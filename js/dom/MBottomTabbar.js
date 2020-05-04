import '../../css/mbottomtabbar.css';
import Core from './Core';
import Dom from 'absol/src/HTML5/Dom';
var _ = Core._;
var $ = Core.$;

function MBottomTabbar() {
    this._items = [];
    this.$row = $('.am-bottom-tabbar-content-row', this);
    this.$itemDict = {};
    this.$line = $('.am-bottom-tabbar-line', this);
    this.$attachhook = _('attachhook').addTo(this);
    this.$attachhook.requestUpdateSize = this.updateSize.bind(this);
    this.$attachhook.on('error', function () {
        Dom.addToResizeSystem(this);
    });
    this.$activeItem = null;
}

MBottomTabbar.render = function () {
    return _({
        class: 'am-bottom-tabbar',
        extendEvent: 'change',
        child: [
            '.am-bottom-tabbar-line',
            {
                class: 'am-bottom-tabbar-content',
                child: '.am-bottom-tabbar-content-row'
            }]
    });
};

MBottomTabbar.prototype.updateSize = function () {
   this.updateLinePosition();
};

MBottomTabbar.prototype.notifyChange = function () {
    this.emit('change', { target: this, value: this._value }, this);
};


MBottomTabbar.prototype.updateLinePosition = function () {
    if (this.$activeItem) {
        var bound = this.getBoundingClientRect();
        var iBound = this.$activeItem.getBoundingClientRect();
        this.$line.addStyle({
            width: iBound.width + 'px',
            left: iBound.left - bound.left + 'px'
        });
    }
    else{
        this.$line.addStyle('width', '0');
    }

};

MBottomTabbar.prototype._makeItem = function (data) {
    var thisbt = this;
    var itemElt = _({
        class: 'am-bottom-tabbar-item',
        child: data.icon
    });

    itemElt.on('click', function () {
        if (thisbt._value !== data.value) {
            thisbt.value = data.value;
            thisbt.notifyChange();
        }
    });

    return itemElt;
};

MBottomTabbar.property = {};

/**
 * @type {MBottomTabbar}
 */
MBottomTabbar.property.items = {
    set: function (items) {
        items = items || [];
        this.$row.clearChild();
        this.$itemDict = {};
        this.$activeItem = null;
        for (var i = 0; i < items.length; ++i) {
            this.$itemDict[items[i].value] = this._makeItem(items[i]).addTo(this.$row);
        }
        if (items  && items.length >0){
            if (this.$itemDict[this._value]){
                this.value = this._value;
            }
            else{
                this.value = items[0].value;
            }
        }
    },
    get: function () {
        return this._items;
    }
};

/**
 * @type {MBottomTabbar}
 */
MBottomTabbar.property.value = {
    set: function (value) {
        this._value = value;
        
        if (this.$activeItem) {
            this.$activeItem.removeClass('am-active');
        }
        this.$activeItem = this.$itemDict[value];
        if (this.$activeItem) {
            this.$activeItem.addClass('am-active');
        }
        this.updateLinePosition();
    },
    get: function () {
        return this._value;
    }
}


Core.install('MBottomTabbar'.toLowerCase(), MBottomTabbar);

export default MBottomTabbar;