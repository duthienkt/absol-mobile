import MListModal from "./MListModal";
import Core, {_, $} from './Core';
import {measureMaxDescriptionWidth, measureMaxTextWidth} from "absol-acomp/js/SelectList";
import MChecklistItem from "./MChecklistItem";
import CheckListBox from "absol-acomp/js/CheckListBox";

export function measureListSize(items) {
    var descWidth = measureMaxDescriptionWidth(items);
    var textWidth = measureMaxTextWidth(items);
    var width = descWidth + 20 + textWidth + 12 + 15 + 18;//padding, margin
    return {
        width: width,
        descWidth: descWidth,
        textWidth: textWidth
    };
}

var itemPool = [];

function onClickItem(event) {
    var thisSL = this.$parent;
    if (thisSL) {
        thisSL.eventHandler.selectItem(this, event);
    }
}

/**
 * @returns {MSelectListItem}
 */
export function makeItem() {
    return _({
        tag: MChecklistItem,
        on: {
            select: onClickItem
        }
    });
}

export function requireItem($parent) {
    var item;
    if (itemPool.length > 0) {
        item = itemPool.pop();
    } else {
        item = makeItem();
    }
    item.$parent = $parent;
    return item;
}

export function releaseItem(item) {
    item.$parent = null;
    item.attr('class', 'am-selectlist-item');
    item.selected = false;
    itemPool.push(item);
}


/***
 * @extends MListModal
 * @constructor
 */
function MChecklistModal() {
    this._initFooter();
    MListModal.call(this);
}


MChecklistModal.tag = 'MChecklistModal'.toLowerCase();

Object.assign(MChecklistModal.prototype, MListModal.prototype);
MChecklistModal.property = Object.assign({}, MListModal.property);
MChecklistModal.eventHandler = Object.assign({}, MListModal.eventHandler);


MChecklistModal.render = function () {
    return _({
        extendEvent: ['change', 'pressclose', 'pressout', 'cancel'],
        class: 'am-list-modal',
        child: [
            {
                class: ['am-list-popup-box'],
                child: [
                    {
                        class: 'am-list-popup-header',
                        child: [
                            {
                                tag: 'button',
                                class: 'am-list-popup-close-btn',
                                child: 'span.mdi.mdi-close'
                            },
                            {
                                tag: 'searchtextinput'
                            }
                        ]
                    },
                    {
                        class: 'am-list-popup-list-scroller',
                        child: {
                            class: 'am-list-popup-content',
                            child: Array(this.prototype.preLoadN).fill('.am-list-popup-list-page.am-selectlist.am-check-list')
                        }
                    },
                    {
                        class: 'as-select-list-box-footer',
                        child: [
                            {
                                tag: 'checkbox',
                                class: 'as-select-list-box-check-all',
                                props: {
                                    checked: false,
                                    text: 'Check All'
                                }
                            },
                            {
                                class: 'as-select-list-box-footer-right',
                                child: {
                                    tag: 'a',
                                    class: 'as-select-list-box-cancel-btn',
                                    child: {text: 'Cancel'}
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });
};


MChecklistModal.prototype._requireItem = function (pageElt, n) {
    var itemElt;
    while (pageElt.childNodes.length > n) {
        itemElt = pageElt.lastChild;
        itemElt.selfRemove();
        releaseItem(itemElt);
    }
    while (pageElt.childNodes.length < n) {
        itemElt = requireItem(this);
        pageElt.addChild(itemElt);
    }
};

MChecklistModal.prototype._initFooter = CheckListBox.prototype._initFooter;

MChecklistModal.property.values = {
    set: function (value) {
        MListModal.property.values.set.apply(this, arguments);
        console.log(this._values.length ,  this.items.length)
        this.$checkAll.checked = this._values.length === this.items.length;
    },
    get: CheckListBox.property.values.get
};

MChecklistModal.property.items = {
    set: function (value) {
        MListModal.property.items.set.apply(this, arguments);
        this.$checkAll.checked = this._values.length === this._items.length;
    },
    get: CheckListBox.property.items.get
};




MChecklistModal.eventHandler.selectItem = function (itemElt, event) {
    var selected = itemElt.selected;
    var data = itemElt.data;
    var value = itemElt.value;
    var idx;
    if (selected) {
        this._valueDict[value + ''] = true;
        this._values.push(value);
    } else {
        delete this._valueDict[value + ''];
        idx = this._values.indexOf(value);
        if (idx >= 0)
            this._values.splice(idx, 1);
        this.$checkAll.checked = false;
    }

    this.emit('change', {
        type: 'change',
        target: this,
        itemElt: this,
        value: value,
        data: data,
        itemData: data,
        action: selected ? "check" : "uncheck",
        originalEvent: event.originalEvent || event.originEvent || event
    });
};


MChecklistModal.eventHandler.checkAllChange = CheckListBox.eventHandler.checkAllChange;

MChecklistModal.eventHandler.clickCancelBtn = CheckListBox.eventHandler.clickCancelBtn;

Core.install(MChecklistModal);


export default MChecklistModal;