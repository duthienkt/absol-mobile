import '../../css/mselectbox.css';
import MSelectMenu from "./MSelectMenu";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import Core from "./Core";
import MSelectList from "./MSelectList";
import {prepareSearchForList, searchListByText} from "absol-acomp/js/list/search";

/*global absol*/
var _ = Core._;
var $ = Core.$;


var boxItemPool = [];

function closeBoxItem(event) {
    var thisSB = this.$parent;
    if (!thisSB) return;
    var itemValue = this.value

    var index = thisSB.values.indexOf(itemValue);
    if (index >= 0) {
        thisSB.values = thisSB.values.slice(0, index).concat(thisSB.values.slice(index + 1));
        thisSB.emit('remove', {
            type: 'remove',
            values: thisSB.values,
            target: thisSB,
            itemElt: this,
            value: this.value,
            itemData: this.data
        }, thisSB);
        thisSB.emit('change', { type: 'change', values: thisSB.values, target: thisSB }, thisSB);
    }
}

/**
 * @returns {MSelectListItem}
 */
export function makeItem() {
    return _({
        tag: 'selectboxitem',
        on: {
            close: closeBoxItem
        }
    });
}

export function requireBoxItem($parent) {
    var item;
    if (boxItemPool.length > 0) {
        item = boxItemPool.pop();
    }
    else {
        item = makeItem();
    }
    item.$parent = $parent;
    return item;
}

export function releaseBoxItem(item) {
    item.$parent = null;
    boxItemPool.push(item);
}

/***
 * @extends Element
 * @constructor
 */
function MSelectBox() {
    var thisSM = this;
    this._isFocus = false;
    this.selectListBound = { width: 0 };
    this._values = [];
    this._orderly = false;

    this._remainItems = [];
    this._itemsByValue = {};
    this.$boxItems = [];
    this.$modal = _({
        class: ['am-selectmenu-modal', 'am-select-box-modal'],
        child: [
            {
                class: 'am-selectmenu-popup-box',
                child: [
                    {
                        class: 'am-selectmenu-popup-box-header',
                        child: [
                            {
                                tag: 'button',
                                class: 'am-selectmenu-popup-box-close-btn',
                                child: 'span.mdi.mdi-close'
                            },
                            {
                                tag: 'searchtextinput'
                            }
                        ]
                    },
                    {
                        tag: 'bscroller',
                        class: 'am-selectmenu-scroller',
                        child: 'mselectlist.am-selectmeu-list'
                    }
                ]
            }

        ]
    });
    this.$popupBox = $('.am-selectmenu-popup-box', this.$modal);
    this.$popupHeader = $('.am-selectmenu-popup-box-header', this.$modal);
    this.$closeBtn = $('.am-selectmenu-popup-box-close-btn', this.$modal)
        .on('click', this.eventHandler.clickCloseBtn);
    /**
     * @type {import('absol-acomp/js/BScroller').default}
     */
    this.$searchTextInput = $('searchtextinput', this.$modal);
    this.$vscroller = $('bscroller.am-selectmenu-scroller', this.$modal);
    /***
     *
     * @type {MSelectList}
     */
    this.$selectlist = $('mselectlist.am-selectmeu-list', this.$modal)
        .on('valuevisibilityasync', this.eventHandler.listValueVisibility)
        .on('finishasync', this._hideSelectedItems.bind(this))
        .on('sizechangeasync', this._hideSelectedItems.bind(this));


    this.on('click', this.eventHandler.click, true);
    // this.on('blur', this.eventHandler.blur);

    this.$searchTextInput.on('stoptyping', this.eventHandler.searchModify);
    this._searchCache = {};
    this.$selectlist.on('pressitem', this.eventHandler.selectlistPressItem, true);
    this.$selectlist.on('pressitem', function () {
        thisSM.isFocus = false;
    }, true);
    this._fixPopupWidth = false;
    this._lastValue = "NOTHING_VALUE";
    this._resourceReady = true;

    this.orderly = false;
    this.items = [];
    this.values = [];
}

MSelectBox.tag = 'MSelectBox'.toLowerCase();
MSelectBox.render = function () {
    return _({
        tag: 'bscroller',
        class: ['absol-selectbox', 'absol-bscroller', 'am-select-box'],
        extendEvent: ['change', 'add', 'remove', 'minwidthchange'],
        attr: {
            tabindex: '1'
        },
        child: 'attachhook'
    }, true);
};

MSelectBox.optimizeResource = true;


MSelectBox.prototype.updateItem = function () {
    // this.clearChild();
    //todo
};

MSelectBox.prototype.getRecommendWith = function () {
    return this.selectListBound.width + 16;
};

MSelectBox.prototype._dictByValue = MSelectMenu.prototype._dictByValue;


MSelectBox.prototype._updatePopupPosition = MSelectMenu.prototype._updatePopupPosition;

MSelectBox.property = {};
MSelectBox.property.disabled = MSelectMenu.property.disabled;
MSelectBox.property.hidden = MSelectMenu.property.hidden;
MSelectBox.property.enableSearch = MSelectMenu.property.enableSearch;


MSelectBox.prototype.init = function (props) {
    props = props || [];
    Object.keys(props).forEach(function (key) {
        if (props[key] === undefined) delete props[key];
    });
    this.super(props);
};


MSelectBox.prototype._requireBoxItems = function () {
    var n = this._values.length;
    var boxItemElt;
    while (this.$boxItems.length < n) {
        boxItemElt = requireBoxItem(this);
        this.$boxItems.push(boxItemElt);
        this.addChild(boxItemElt);
    }
    while (this.$boxItems.length > n) {
        boxItemElt = this.$boxItems.pop();
        boxItemElt.selfRemove();
        releaseBoxItem(boxItemElt);
    }
};

MSelectBox.prototype._sortValuesIfNeed = function () {
    if (this._orderly) {
        var thisMB = this;
        this.values.sort(function (a, b) {
            var aItem = thisMB._itemsByValue[a];
            var bItem = thisMB._itemsByValue[b];
            if (!aItem) return 1;
            if (!bItem) return -1;
            return aItem.__index__ - bItem.__index__;
        });
    }
};


MSelectBox.prototype._assignBoxItems = function () {
    var n = this._values.length;
    var item;
    var value;
    for (var i = 0; i < n; ++i) {
        value = this._values[i];
        item = this._itemsByValue[value];
        this.$boxItems[i].data = item || { text: 'error' };
    }
};


MSelectBox.prototype._hideSelectedItems = function () {
    var n = this._values.length;
    var itemElt;
    var value;
    for (var i = 0; i < n; ++i) {
        value = this._values[i];
        itemElt = this.$selectlist.getItemElementByValue(value);
        if (itemElt)
            itemElt.addClass('selected');
    }
};

MSelectBox.prototype._showSelectedItems = function () {
    var n = this._values.length;
    var itemElt;
    var value;
    for (var i = 0; i < n; ++i) {
        value = this._values[i];
        itemElt = this.$selectlist.getItemElementByValue(value);
        if (itemElt)
            itemElt.removeClass('selected');
    }
};

MSelectBox.prototype._updateValues = function () {
    this._requireBoxItems();
    this._assignBoxItems();
    this._hideSelectedItems();
};


MSelectBox.prototype.scrollToSelectedItem = function () {
    //nothing to do;
};


MSelectBox.prototype.querySelectedItems = function () {
    return Array.prototype.map.call(this.$holderItem.childNodes, function (e) {
        return e.data;
    });
};


MSelectBox.property.isFocus = {
    set: function (value) {
        var self = this
        value = !!value;
        if (value == this.isFocus) return;
        this._isFocus = value;
        if (value) {
            var isAttached = false;
            setTimeout(function () {
                if (isAttached) return;
                $('body').on('mousedown', self.eventHandler.bodyClick);
                isAttached = true;
            }, 1000);
            $('body').once('click', function () {
                setTimeout(function () {
                    if (isAttached) return;
                    $('body').on('mousedown', self.eventHandler.bodyClick);
                    isAttached = true;
                }, 10);
            });
            if (this.enableSearch) {
                setTimeout(function () {
                    self.$searchTextInput.focus();
                }, 50);
            }
            this.$modal.addTo(document.body)
                .addStyle('visibility', 'hidden');
            this._updatePopupPosition();
            this.scrollToSelectedItem();
            this.$modal.removeStyle('visibility');
        }
        else {
            $('body').off('mousedown', this.eventHandler.bodyClick);
            this.$modal.remove();
            this._updatePopupPosition();
            setTimeout(function () {
                if (self.$searchTextInput.value.length != 0) {
                    self.$searchTextInput.value = '';
                    self.$selectlist.setItemsAsync(self._items);
                    //todo: update selected in list
                    self._resourceReady = true;
                    self.$selectlist.removeClass('am-searching');
                }
            }, 100)
        }
    },
    get: function () {
        return !!this._isFocus;
    }
};


/***
 *
 * @type {MSelectBox}
 */
MSelectBox.property.items = {
    set: function (items) {
        items = items || [];
        items.forEach(function (item, i) {
            item.__index__ = i;
        })
        this._items = items;
        this._itemsByValue = this._dictByValue(items);
        this._searchCache = {};
        this._sortValuesIfNeed();
        this._hideSelectedItems();
        this._updateValues();
        this.selectListBound = this.$selectlist.setItemsAsync(items);
    },
    get: function () {
        return this._items;
    }
};

MSelectBox.property.values = {
    set: function (values) {
        var thisSB = this;
        this._showSelectedItems();
        values = values || [];
        values = (values instanceof Array) ? values : [values];
        this._values = values;
        this._searchCache = {};
        this._hideSelectedItems();
        this._sortValuesIfNeed();
        this._updateValues();
    },
    get: function () {
        return this._values || [];
    }
};

MSelectBox.property.orderly = {
    set: function (value) {
        this._orderly = !!value;
        this._sortValuesIfNeed();
        this._updateValues();
    },
    get: function () {
        return !!this._orderly;
    }

}

/***
 *
 * @type {MSelectBox}
 */
MSelectBox.eventHandler = {};

MSelectBox.eventHandler.clickCloseBtn = MSelectMenu.eventHandler.clickCloseBtn;

MSelectBox.eventHandler.click = function (event) {
    if (event.target == this) {
        this.isFocus = !this.isFocus;
    }
};


MSelectBox.eventHandler.bodyClick = function (event) {
    if (!EventEmitter.hitElement(this, event) && !EventEmitter.hitElement(this.$popupBox, event)) {
        setTimeout(function () {
            this.isFocus = false;
        }.bind(this), 5);
    }
};


MSelectBox.eventHandler.selectlistPressItem = function (event) {
    this.values.push(event.value);
    this._sortValuesIfNeed();
    this._updateValues();
    this.$selectlist.value = "NOTHING_SELECTED";
    event.itemElt.addClass('selected');
    this.isFocus = false;
    this.emit('add', { type: 'add', itemData: event.itemElt.data, value: event.value, values: this.values }, this);
    this.emit('change', { type: 'change', values: self.values, target: self }, self);
};

MSelectBox.eventHandler.searchModify = function (event) {
    var self = this;
    var filterText = this.$searchTextInput.value.replace(/((\&nbsp)|(\s))+/g, ' ').trim();
    if (filterText.length == 0) {
        //todo
        this.$selectlist.removeClass('as-searching');
        this.$popupBox.removeStyle('width');
        this._fixPopupWidth = false;
        this.$selectlist.setItemsAsync(this._items);
        this.$selectlist.value = "NOTHING BE SELECTED";
        this._hideSelectedItems();
    }
    else {
        if (!this._fixPopupWidth) {
            this._fixPopupWidth = true;
            this.$popupBox.addStyle('width', this.$popupBox.getBoundingClientRect().width + 'px');
            this.$selectlist.addClass('as-searching');
        }
        var view = [];
        if (!this._searchCache[filterText]) {
            if (this._items.length > 0 && !this._items[0].__nvnText__) {
                prepareSearchForList(this._items);
            }

            view = searchListByText(filterText, this._items);
            this._searchCache[filterText] = view;
        }
        else {
            view = this._searchCache[filterText];
        }
        this.$selectlist.setItemsAsync(view);
        this.$selectlist.value = "NOTHING BE SELECTED";
        this._hideSelectedItems();
    }
    this.$vscroller.scrollTop = 0;
};


Core.install('MSelectBox'.toLowerCase(), MSelectBox);

export default MSelectBox;