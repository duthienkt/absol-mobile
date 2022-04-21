import '../../css/mbottomtabbar.css';
import Core from './Core';
import Dom from 'absol/src/HTML5/Dom';
import { randomIdent } from "absol/src/String/stringGenerate";

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
    this.$subActiveItem = null;
}


MBottomTabbar.tag = 'MBottomTabbar'.toLowerCase();
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

MBottomTabbar.prototype.getItemEltByValue = function (value) {
    return this.$itemDict[value];
};

MBottomTabbar.prototype.modifyItem = function (itemValue, propertyName, newValue) {
    if (this.$itemDict[itemValue])
        this.$itemDict[itemValue].data[propertyName] = newValue;
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
    else {
        this.$line.addStyle('width', '0');
    }

};

MBottomTabbar.prototype._makeSubItem = function (data, parentElt) {
    var self = this;
    var itemElt = _({
        class: 'am-bottom-tabbar-item',
        child: [
            data.icon,
            '.am-bottom-tabbar-item-counter'
        ],
        props: {
            parentItemElt: parentElt
        }
    });
    this.$itemDict[data.value] = itemElt;
    var counterElt = $('.am-bottom-tabbar-item-counter', itemElt);
    var counter = data.counter;
    if (!data.__bindCounter__) {
        Object.defineProperties(data, {
            __dataBinding__: {
                value: true,
                writable: false
            },
            counter: {
                set: function (value) {
                    if (value >= 0) {
                        if (value > 9) {
                            counterElt.innerHTML = '9+';
                        }
                        else if (value > 0) {
                            counterElt.innerHTML = value;
                        }
                        else {
                            counterElt.innerHTML = '';
                        }
                    }
                    else {
                        if (value)
                            counterElt.innerHTML = value + "";
                        else
                            counterElt.innerHTML = '';
                    }
                    if (parentElt.$subItems && parentElt.data) {
                        parentElt.data.counter = parentElt.data.items.reduce(function (ac, cr) {
                            return ac + (cr.counter || 0);
                        }, 0);
                    }
                    this._counter = value;
                },
                get: function () {
                    return this._counter;
                }
            }
        });
    }
    data.counter = counter;
    itemElt.data = data;
    function onPress () {
        if (self._value !== data.value) {
            parentElt.lastSubValue = data.value;
            self.value = data.value;
            self.notifyChange();
        }
    }
    itemElt.on('touchstart', onPress, true);
    itemElt.on('pointerdown', onPress, true);
    return itemElt;
};

MBottomTabbar.prototype._makeItem = function (data) {
    var self = this;
    var itemElt = _({
        class: 'am-bottom-tabbar-item',
        child: [
            data.icon,
            '.am-bottom-tabbar-item-counter'
        ]
    });
    if (!('value' in data)) data.value = randomIdent();
    this.$itemDict[data.value] = itemElt;
    var subItemCtn;
    var counterElt = $('.am-bottom-tabbar-item-counter', itemElt);
    var counter = data.counter;
    if (data.items && data.items.length > 0) {
        itemElt.lastSubValue = data.items[0].value;
        itemElt.$subItems = data.items.map(function (sItem) {
            return this._makeSubItem(sItem, itemElt);
        }.bind(this));
        counter = data.items.reduce(function (ac, cr) {
            return ac + (cr.counter || 0);
        }, 0);
        subItemCtn = _({
            class: 'am-bottom-tabbar-sub-item-ctn',
            child: {
                class: 'am-bottom-tabbar-sub-item-box',
                child: itemElt.$subItems
            }
        });
        itemElt.attr('tabindex', 1);
        itemElt.on('focus', function () {
            subItemCtn.addClass('am-prepare-appear')
                .addTo(document.body);

            setTimeout(function () {
                subItemCtn.removeClass('am-prepare-appear')
                    .addClass('am-appear');
            }, 3);
        })
            .on('blur', function () {
                subItemCtn.removeClass('am-appear')
                    .addClass('am-prepare-disappear')
                setTimeout(function () {
                    subItemCtn.removeClass('am-prepare-disappear')
                        .remove()
                }, 205);
            })
    }
    else {

    }
    if (!data.__bindCounter__) {
        Object.defineProperties(data, {
            __dataBinding__: {
                value: true,
                writable: false
            },
            counter: {
                set: function (value) {
                    if (value >= 0) {
                        if (value > 9) {
                            counterElt.innerHTML = '9+';
                        }
                        else if (value > 0) {
                            counterElt.innerHTML = value;
                        }
                        else {
                            counterElt.innerHTML = '';
                        }
                    }
                    else {
                        if (value)
                            counterElt.innerHTML = value + "";
                        else
                            counterElt.innerHTML = '';
                    }
                    this._counter = value;
                },
                get: function () {
                    return this._counter;
                }
            }
        });
    }

    data.counter = counter;
    itemElt.data = data;
    itemElt.on('click', function () {
        if (data.items && data.items.length > 0) {
            if (self.$itemDict[self._value] && self.$itemDict[self._value].parentItemElt !== itemElt) {
                self.value = itemElt.lastSubValue;
                self.notifyChange();
            }
        }
        else if (self._value !== data.value) {
            self.value = data.value;
            self.notifyChange();
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
        this._items = items;
        this.$row.clearChild();
        this.$itemDict = {};
        this.$activeItem = null;
        this.$itemDict = {};
        for (var i = 0; i < items.length; ++i) {
            this._makeItem(items[i]).addTo(this.$row);
        }
        if (items && items.length > 0) {
            if (this.$itemDict[this._value]) {
                this.value = this._value;
            }
            else {
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
            this.$activeItem = null;
        }


        if (this.$subActiveItem) {
            this.$subActiveItem.removeClass('am-active');
            this.$subActiveItem = null;
        }

        this.$activeItem = this.$itemDict[value];
        if (this.$activeItem && this.$activeItem.parentItemElt) {
            this.$subActiveItem = this.$activeItem;
            this.$activeItem = this.$activeItem.parentItemElt;
        }

        if (this.$activeItem) {
            this.$activeItem.addClass('am-active');
        }
        if (this.$subActiveItem) {
            this.$subActiveItem.addClass('am-active');
        }
        this.updateLinePosition();
    },
    get: function () {
        return this._value;
    }
}


Core.install(MBottomTabbar);

export default MBottomTabbar;