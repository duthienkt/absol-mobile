import '../../css/mselectbox.css';
import MSelectMenu from "./MSelectMenu";
import Core, {_, $} from "./Core";
import '../../css/mmulticheckmenu.css';
import MSelectBox from "./MSelectBox";
import {getValueOfListItem} from "absol-acomp/js/SelectListItem";


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
 * @extends AElement
 * @constructor
 */
function MMultiCheckMenu() {
    this._isFocus = false;
    this._values = [];
    this._orderly = false;

    this._itemsByValue = {};

    this.$boxItems = [];

    this.$selectlist = _({
        tag: 'mchecklistmodal',
        on: {
            change: this.eventHandler.modalChange,
            pressout: this.eventHandler.modalSubmit,
            pressclose: this.eventHandler.modalSubmit,
            cancel: this.eventHandler.modalCancel
        }
    });

    this.on('click', this.eventHandler.click);
    this.$attachhook = $('attachhook', this).on('error', this.eventHandler.attached);
    this._tempValues = [];//20p
    this.orderly = false;
    this.items = [];
    this.values = [];
}

MMultiCheckMenu.tag = 'MMultiCheckMenu'.toLowerCase();

Object.assign(MMultiCheckMenu.prototype, MSelectBox.prototype);

MMultiCheckMenu.property = Object.assign({}, MSelectBox.property);

MMultiCheckMenu.eventHandler = Object.assign({}, MSelectBox.eventHandler);

MMultiCheckMenu.render = function () {
    return _({
        tag: 'bscroller',
        class: ['absol-selectbox', 'absol-bscroller', 'am-select-box', 'am-multi-check-menu'],
        extendEvent: ['change', 'add', 'remove', 'minwidthchange'],
        attr: {
            tabindex: '1'
        },
        child: 'attachhook'
    }, true);
};

MMultiCheckMenu.property.isFocus = {
    set: function (value) {
        if (!this._isFocus && value) {
            this._tempValues = this._values.slice();
            this.$selectlist.values = this._tempValues;
        }
        MSelectBox.property.isFocus.set.call(this, value);
    },
    get: MSelectBox.property.isFocus.get
}


MMultiCheckMenu.eventHandler.modalChange = function (event) {
    var value, idx;
    switch (event.action) {
        case "check":
            value = event.value;
            idx = this._tempValues.indexOf(value);
            if (idx < 0) {
                this._tempValues.push(value);
                this._sortValuesIfNeed(this._tempValues);
            }
            break;
        case "uncheck":
            value = event.value;
            idx = this._tempValues.indexOf(value);
            if (idx >= 0) {
                this._tempValues.splice(idx, 1);
            }
            break;
        case "check_all":
            this._tempValues = this._items.map(function (item) {
                return getValueOfListItem(item);
            });
            break;
        case "uncheck_all":
            this._tempValues.splice(0, this._tempValues.length);
            break;
    }
    this.viewItemsByValues(this._tempValues);
};


MMultiCheckMenu.eventHandler.modalSubmit = function (event) {
    var curDict = this._values.reduce(function (ac, cr) {
        ac[cr + ''] = true;
        return ac;
    }, {});
    var newDict = this._tempValues.reduce(function (ac, cr) {
        ac[cr + ''] = true;
        return ac;
    }, {});

    var removedValues = this._values.filter(function (val) {
        return !newDict[val + ''];
    });

    var addedValues = this._tempValues.filter(function (val) {
        return !curDict[val + ''];
    });

    this._values = this._tempValues.slice();
    this._sortValuesIfNeed(this._values);

    this.$selectlist.remove();
    if (removedValues.length > 0) {
        removedValues.forEach(function (value) {
            var item = this._itemsByValue[value + ''];
            this.emit('remove', {type: 'remove', itemData: item, value: value}, this);
        }.bind(this));
    }
    if (addedValues.length > 0) {
        addedValues.forEach(function (value) {
            var item = this._itemsByValue[value + ''];
            this.emit('remove', {type: 'add', itemData: item, value: value}, this);
        }.bind(this));
    }

    if (removedValues.length > 0 || addedValues.length > 0) {
        this.emit('change', {type: 'change', values: this.values, target: this}, this);
    }
    this.isFocus = false;
};

MMultiCheckMenu.eventHandler.modalCancel = function (event) {
    this.viewItemsByValues(this._values);
    this.isFocus = false;
};


Core.install('MSelectBox'.toLowerCase(), MMultiCheckMenu);
Core.install(MMultiCheckMenu);

export default MMultiCheckMenu;