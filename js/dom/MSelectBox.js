import '../../css/mselectbox.css';
import MSelectMenu from "./MSelectMenu";
import Core from "./Core";
import MListModal, {VALUE_HIDDEN} from "./MListModal";

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
        thisSB.emit('change', {type: 'change', values: thisSB.values, target: thisSB}, thisSB);
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
    } else {
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
    this._isFocus = false;
    this._values = [];
    this._orderly = false;

    this._itemsByValue = {};

    this.$boxItems = [];

    this.$selectlist = _('mlistmodal');
    this.$selectlist.displayValue = VALUE_HIDDEN;

    this.$selectlist.on('pressitem', this.eventHandler.pressItem, true)
        .on('pressout', this.eventHandler.pressOut)
        .on('pressclose', this.eventHandler.pressOut);
    this.on('click', this.eventHandler.click);
    this.$attachhook = $('attachhook', this).on('error', this.eventHandler.attached);
    this._values = [];
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


MSelectBox.prototype.getRecommendWith = function () {
    return this.$selectlist.estimateSize.textWidth + 60;
};

MSelectBox.prototype._dictByValue = MSelectMenu.prototype._dictByValue;


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


MSelectBox.prototype._requireBoxItems = function (n) {
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

MSelectBox.prototype._sortValuesIfNeed = function (values) {
    if (this._orderly) {
        var thisMB = this;
        values.sort(function (a, b) {
            var aItem = thisMB._itemsByValue[a];
            var bItem = thisMB._itemsByValue[b];
            if (!aItem) return 1;
            if (!bItem) return -1;
            return aItem.__index__ - bItem.__index__;
        });
    }
};


MSelectBox.prototype._assignBoxItems = function (values) {
    var n = values.length;
    var item;
    var value;
    for (var i = 0; i < n; ++i) {
        value = values[i];
        item = this._itemsByValue[value];
        this.$boxItems[i].data = item || {text: 'error'};
    }
};


MSelectBox.prototype._updateValues = function () {
    this.viewItemsByValues(this._values);
};

MSelectBox.prototype.viewItemsByValues = function (values) {
    this._requireBoxItems(values.length);
    this._assignBoxItems(values);
}


MSelectBox.prototype.querySelectedItems = function () {
    return Array.prototype.map.call(this.$holderItem.childNodes, function (e) {
        return e.data;
    });
};


MSelectBox.property.isFocus = MSelectMenu.property.isFocus;


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
        this.$selectlist.items = items;
        this.addStyle('--item-min-width', this.$selectlist.estimateSize.textWidth + 60 + 'px');
        this._sortValuesIfNeed(this._values);
        this._updateValues();
    },
    get: function () {
        return this._items;
    }
};

MSelectBox.property.values = {
    set: function (values) {
        values = values || [];
        values = (values instanceof Array) ? values : [values];
        values = values.slice();
        this._values = values;
        this.$selectlist.values = values;
        this._sortValuesIfNeed(this._values);
        this._updateValues();
    },
    get: function () {
        return this._values || [];
    }
};

MSelectBox.property.orderly = {
    set: function (value) {
        this._orderly = !!value;
        this._sortValuesIfNeed(this._values);
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

MSelectBox.eventHandler.pressOut = MSelectMenu.eventHandler.pressOut;
MSelectBox.eventHandler.attached = MSelectMenu.eventHandler.attached;


MSelectBox.eventHandler.click = function (event) {
    if (event.target == this) {
        this.isFocus = !this.isFocus;
    }
};


MSelectBox.eventHandler.pressItem = function (event) {
    this.values.push(event.value);
    this._sortValuesIfNeed(this._values);
    this._updateValues();
    this.$selectlist.values = this.values;
    this.emit('add', {type: 'add', itemData: event.itemElt.data, value: event.value, values: this.values}, this);
    this.emit('change', {type: 'change', values: this.values, target: this}, this);
    this.isFocus = false;
};

Core.install('MSelectBox'.toLowerCase(), MSelectBox);

export default MSelectBox;