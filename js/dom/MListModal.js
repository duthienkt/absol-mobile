import '../../css/mlistmodal.css'

import Core from "./Core";
import Dom from "absol/src/HTML5/Dom";
import {measureMaxDescriptionWidth, measureMaxTextWidth} from "absol-acomp/js/SelectList";
import {prepareSearchForList, searchListByText} from "absol-acomp/js/list/search";
import {measureListSize, releaseItem, requireItem} from "./MSelectList";

var _ = Core._;
var $ = Core.$;

export var VALUE_HIDDEN = -1;
export var VALUE_NORMAL = 1;


function MListModal() {
    this._initDomHook();
    this._initControl();
    this._initProperty();
}


MListModal.tag = "MListModal".toLowerCase();
MListModal.render = function () {
    return _({
        extendEvent: ['pressitem', 'pressclose', 'pressout'],
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
                        class: 'am-list-popup-paging',
                        child: [
                            {
                                tag: 'button',
                                class: 'am-list-popup-start-page-btn',
                                child: 'span.mdi.mdi-chevron-double-left'
                            },
                            {
                                tag: 'button',
                                class: 'am-list-popup-prev-page-btn',
                                child: 'span.mdi.mdi-chevron-left'
                            },
                            {
                                class: 'am-list-popup-paging-content',
                                child: [
                                    {
                                        tag: 'input',
                                        class: 'am-list-popup-paging-offset',
                                        attr: {
                                            type: 'number',
                                            min: '0',
                                            step: "1",
                                            readonly: 'true'
                                        }
                                    },
                                    {
                                        tag: 'span',
                                        child: {
                                            text: '/1000'
                                        }
                                    }
                                ]
                            },
                            {
                                tag: 'button',
                                class: 'am-list-popup-next-page-btn',
                                child: 'span.mdi.mdi-chevron-right'
                            },
                            {
                                tag: 'button',
                                class: 'am-list-popup-end-page-btn',
                                child: 'span.mdi.mdi-chevron-double-right'
                            }
                        ]
                    },
                    {
                        class: 'am-list-popup-list-scroller',
                        child: '.am-selectlist'
                    }
                ]
            }
        ]
    });
};


MListModal.prototype._initDomHook = function () {
    this.estimateSize = { width: 0 };
    this.$attachhook = _('attachhook').addTo(this);
    this.$attachhook._isAttached = false;
    this.$attachhook.requestUpdateSize = this.updateSize.bind(this);
    this.$attachhook.on('error', function () {
        Dom.addToResizeSystem(this);
        this.requestUpdateSize();
        this._isAttached = true;
    });
};

MListModal.prototype._initControl = function () {
    this._currentOffset = 0;
    this._startItemIdx = 0;

    this.$closeBtn = $('.am-list-popup-close-btn', this)
        .on('click', this.notifyPressClose.bind(this));

    this.on('click', this.eventHandler.click);

    this.$box = $('.am-list-popup-box', this);
    this.$header = $('.am-list-popup-header', this);
    this.$paging = $('.am-list-popup-paging', this);
    this.$nextPageBtn = $('.am-list-popup-next-page-btn', this)
        .on('click', this.nextPage.bind(this));
    this.$prevPageBtn = $('.am-list-popup-prev-page-btn', this)
        .on('click', this.prevPage.bind(this));
    this.$startPageBtn = $('.am-list-popup-start-page-btn', this)
        .on('click', this.toStartPage.bind(this));
    this.$endPageBtn = $('.am-list-popup-end-page-btn', this)
        .on('click', this.toEndPage.bind(this));
    this.$searchInput = $('searchtextinput', this)
        .on('stoptyping', this.eventHandler.searchModify);

    this.$itemsLength = $('.am-list-popup-paging-content span', this);
    this.$offsetInput = $('.am-list-popup-paging-content input', this);

    this.$listScroller = $('.am-list-popup-list-scroller', this);
    this.$list = $('.am-selectlist', this);
};

MListModal.prototype._initProperty = function () {
    this.$items = [];
    this.$itemByValue = {};

    this._items = [];
    this._itemHolderByValue = {};
    this._values = [];
    this._valueDict = {};
    this._preDisplayItems = [];
    this._displayItems = [];
    this._searchCache = {};
    this._displayValue = VALUE_NORMAL;
    this.displayValue = VALUE_NORMAL;
    this.items = [];
};


MListModal.prototype.afterAttached = function () {
    if (!this.isDescendantOf(document.body))
        this.$attachhook._isAttached = false;
    if (!this.$attachhook._isAttached) {
        var ah = this.$attachhook;
        return new Promise(function (rs) {
            ah.once('error', rs);
        });
    }
};

MListModal.prototype.updateSize = function () {
    var bound = this.getBoundingClientRect();
    var boxBound = this.$box.getBoundingClientRect();
    var listScrollerBound = this.$listScroller.getBoundingClientRect();
    this.$listScroller.addStyle('max-height', 'calc(' + (bound.height - listScrollerBound.top + boxBound.top) + 'px - var(--modal-margin-bottom) - var(--modal-margin-top))');
    boxBound = this.$box.getBoundingClientRect();
    setTimeout(this._updateCurrentOffset.bind(this), 4);

};


MListModal.prototype._requireItem = function (n) {
    var itemElt;
    while (this.$items.length > n) {
        itemElt = this.$items.pop();
        itemElt.selfRemove();
        releaseItem(itemElt);
    }
    while (this.$items.length < n) {
        itemElt = requireItem(this);
        this.$items.push(itemElt);
        this.$list.addChild(itemElt);
    }
};


MListModal.prototype._listToDisplay = function (items) {
    return items;
};

/***
 *
 * @param {Array<{value:String|Number}>} items
 * @return {Array<{value:String|Number}>}
 */
MListModal.prototype._filterValue = function (items) {
    if (this._displayValue === VALUE_NORMAL) return items;
    var dict = this._valueDict;
    return items.filter(function (item) {
        return !dict[item.value + ''];
    });
};

MListModal.prototype._assignItems = function (offset) {
    this.$itemByValue = {};
    var n = Math.min(this._displayItems.length - offset, this.$items.length);
    var itemElt, value;
    for (var i = 0; i < n; ++i) {
        itemElt = this.$items[i];
        itemElt.data = this._displayItems[offset + i];
        value = itemElt.value + '';
        this.$itemByValue[value] = this.$itemByValue[value] || [];
        this.$itemByValue[value].push(itemElt);
    }
};

MListModal.prototype._updateSelectedItem = function () {
    var itemElt, value;
    for (var i = 0; i < this.$items.length; ++i) {
        itemElt = this.$items[i];
        value = itemElt.value + '';
        if (this._valueDict[value]) {
            itemElt.addClass('selected');
        }
        else {
            itemElt.removeClass('selected');
        }
    }
};

MListModal.prototype._findNextOffset = function () {
    var scrollerBound = this.$listScroller.getBoundingClientRect();
    var bottom = scrollerBound.bottom;
    var itemBound;
    for (var i = 0; i < this.$items.length; ++i) {
        itemBound = this.$items[i].getBoundingClientRect();
        if (itemBound.bottom > bottom) {
            return this._startItemIdx + i;
        }
    }
    return this._displayItems.length;
};

MListModal.prototype._findCurrentOffset = function () {
    var scrollerBound = this.$listScroller.getBoundingClientRect();
    var top = scrollerBound.top;
    var itemBound;
    for (var i = 0; i < this.$items.length; ++i) {
        itemBound = this.$items[i].getBoundingClientRect();
        if (itemBound.top + 5 >= top) {
            return this._startItemIdx + i;
        }
    }
    return 0;
};

MListModal.prototype._findPrevOffset = function () {
    var scrollerBound = this.$listScroller.getBoundingClientRect();
    var top = scrollerBound.top - scrollerBound.height;
    var itemBound;
    for (var i = 0; i < this.$items.length; ++i) {
        itemBound = this.$items[i].getBoundingClientRect();
        if (itemBound.top + 2 >= top) {
            return this._startItemIdx + i;
        }
    }
    return 0;
};


MListModal.prototype._updateCurrentOffset = function () {
    var offset = this._findCurrentOffset();
    this.$offsetInput.value = offset + 1 + '';
};


MListModal.prototype.viewListAt = function (offset) {
    var fontSize = this.$list.getFontSize() || 14;
    offset = Math.max(0, Math.min(offset, this._displayItems.length - 1));
    var screenSize = Dom.getScreenSize();
    var maxItem = Math.ceil(screenSize.height / (fontSize * 2.25));
    this._currentOffset = offset;
    setTimeout(this._updateCurrentOffset.bind(this), 4);
    var items = this._displayItems;
    this._startItemIdx = Math.max(0, Math.min(offset - maxItem, this._displayItems.length - 2 * maxItem));
    var n = Math.min(items.length, maxItem * 3, this._displayItems.length - this._startItemIdx);
    this._requireItem(n);
    this._assignItems(this._startItemIdx);
    this._updateSelectedItem();
    if (n > 0) {
        var startBound = this.$items[0].getBoundingClientRect();
        var currentBound = this.$items[this._currentOffset - this._startItemIdx].getBoundingClientRect();
        this.$listScroller.scrollTop = currentBound.top - startBound.top + 1;
    }
};


MListModal.prototype.viewListAtFirstSelected = function () {
    if (this._displayValue == VALUE_HIDDEN) {
        return false;
    }
    else if (this._values.length > 0) {
        var value = this._values[0];
        var itemHolders = this._itemHolderByValue[value + ''];
        if (itemHolders) {
            var holder = itemHolders[0];
            this.viewListAt(holder.idx);
            return true;
        }
        else return false;
    }
    else
        return false;
};


MListModal.prototype.nextPage = function () {
    var nextOffset = this._findNextOffset();
    if (nextOffset >= this._displayItems.length) return;
    this.viewListAt(nextOffset);
};


MListModal.prototype.prevPage = function () {
    var prevOffset = this._findPrevOffset();
    if (prevOffset >= this._displayItems.length) return;
    this.viewListAt(prevOffset);
};


MListModal.prototype.toStartPage = function () {
    this.viewListAt(0);
};


MListModal.prototype.toEndPage = function () {
    this.viewListAt(this._displayItems.length);
};


MListModal.prototype.searchItemByText = function (text) {
    text = text.trim();
    if (text.length == 0) return this._items;
    if (this._searchCache[text]) return this._searchCache[text];
    this._searchCache[text] = searchListByText(text, this._items);
    return this._searchCache[text];
};

MListModal.prototype.resetSearchState = function () {
    this.$searchInput.value = '';
    this._preDisplayItems = this._listToDisplay(this._items);
    this._displayItems = this._filterValue(this._preDisplayItems);
    this.$itemsLength.firstChild.data = '/' + this._displayItems.length;
    this.viewListAt(0);
};

MListModal.prototype.notifyPressOut = function () {
    this.emit('pressout', { target: this, type: 'pressout' }, this);
};

MListModal.prototype.notifyPressClose = function () {
    this.emit('pressclose', { target: this, type: 'pressclose' }, this);
};


MListModal.property = {};

/***
 *
 * @type {MListModal}
 */
MListModal.property.items = {
    get: function () {
        return this._items;
    },
    set: function (items) {
        var items = items || [];
        this._items = items;
        this._preDisplayItems = this._listToDisplay(this._items);
        this._displayItems = this._filterValue(this._preDisplayItems);
        this._itemHolderByValue = items.reduce(function (ac, cr, idx) {
            var value = typeof cr === "string" ? cr : cr.value + '';
            ac[value] = ac[value] || [];
            ac[value].push({
                idx: idx,
                item: cr
            });
            return ac;
        }, {});
        this.$itemsLength.firstChild.data = '/' + this._displayItems.length;
        this._searchCache = {};
        var estimateSize = measureListSize(this._preDisplayItems);
        if (estimateSize.descWidth > 0) {
            this.$list.addStyle('--text-width', 100 * (estimateSize.textWidth + 15) / (estimateSize.width) + '%');
        }
        else {
            this.$list.removeStyle('--text-width');
        }
        this.estimateSize = estimateSize;
        this.$itemsLength.firstChild.data = '/' + this._displayItems.length;
        prepareSearchForList(items);
        this.viewListAt(0);
    }
};

MListModal.property.values = {
    set: function (values) {
        values = values || [];
        this._values = values;
        this._valueDict = values.reduce(function (ac, cr) {
            ac[cr + ''] = true;
            return ac;
        }, {});
        this._displayItems = this._filterValue(this._preDisplayItems);
        this.viewListAt(this._currentOffset);
        this._updateSelectedItem();
    },
    get: function () {
        return this._values;
    }
};

MListModal.property.displayValue = {
    set: function (value) {
        this._displayValue = value;
        this._displayItems = this._filterValue(this._preDisplayItems);
    },
    get: function () {
        return this._displayValue;
    }
}

MListModal.property.enableSearch = {
    set: function (value) {
        if (value) this.$box.addClass('am-enable-search');
    },
    get: function () {
        return this.$box.removeClass('am-enable-search');
    }
};


/***
 *
 * @type {MListModal}
 */
MListModal.eventHandler = {};

/***
 *
 * @param {MouseEvent} event
 */
MListModal.eventHandler.click = function (event) {
    if (event.target === this)
        this.notifyPressOut();
};

MListModal.eventHandler.searchModify = function () {
    var text = this.$searchInput.value;
    var searchedItems = this.searchItemByText(text);
    this._preDisplayItems = this._listToDisplay(searchedItems);
    this._displayItems = this._filterValue(this._preDisplayItems);
    this.$itemsLength.firstChild.data = '/' + this._displayItems.length;
    this.viewListAt(0);
};


Core.install(MListModal);
export default MListModal;