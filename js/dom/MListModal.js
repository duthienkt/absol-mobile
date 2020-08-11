import '../../css/mlistmodal.css'

import Core from "./Core";
import Dom from "absol/src/HTML5/Dom";
import {prepareSearchForList, searchListByText} from "absol-acomp/js/list/search";
import {measureListSize, releaseItem, requireItem} from "./MSelectList";

var _ = Core._;
var $ = Core.$;
var $$ = Core.$$;

export var VALUE_HIDDEN = -1;
export var VALUE_NORMAL = 1;


function MListModal() {
    this._initDomHook();
    this._initControl();
    this._initScroller();
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
                        class: 'am-list-popup-list-scroller',
                        child: {
                            class: 'am-list-popup-content',
                            child: Array(3).fill('.am-list-popup-list-page.am-selectlist')
                        }
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


    this.$searchInput = $('searchtextinput', this)
        .on('stoptyping', this.eventHandler.searchModify);


};

MListModal.prototype._initScroller = function () {
    this._pageOffsets = [0, 0, 0, 0];
    this._pageYs = [0, 0, 0, 0];
    this.$listScroller = $('.am-list-popup-list-scroller', this);
    this.$content = $('.am-list-popup-content', this);
    this.$listPages = $$('.am-list-popup-list-page', this);
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


MListModal.prototype._requireItem = function (pageElt, n) {
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

MListModal.prototype._assignItems = function (pageElt, offset) {
    var n = Math.min(this._displayItems.length - offset, pageElt.childNodes.length);
    var itemElt, value;
    for (var i = 0; i < n; ++i) {
        itemElt = pageElt.childNodes[i];
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

};


MListModal.prototype.viewListAt = function (offset) {
    var scrollerBound = this.$listScroller.getBoundingClientRect();
    if (scrollerBound.height === 0) return;
    var fontSize = this.$listScroller.getFontSize() || 14;
    offset = Math.max(0, Math.min(offset, this._displayItems.length - 1));
    var screenSize = Dom.getScreenSize();
    var maxItem = Math.ceil(screenSize.height / (fontSize * 2.25));
    var contentBound = this.$content.getBoundingClientRect();

    this._pageOffsets[0] = Math.max(offset - maxItem, 0);
    this._pageOffsets[1] = Math.min(this._pageOffsets[0] + maxItem, this._displayItems.length);
    this._pageOffsets[2] = Math.min(this._pageOffsets[1] + maxItem, this._displayItems.length);
    this._pageOffsets[3] = Math.min(this._pageOffsets[2] + maxItem, this._displayItems.length);
    var sIdx, nItem, pageBound;
    var pageElt;
    for (var pageIndex = 0; pageIndex < 3; ++pageIndex) {
        sIdx = this._pageOffsets[pageIndex];
        nItem = this._pageOffsets[pageIndex + 1] - sIdx;
        pageElt = this.$listPages[pageIndex];

        if (pageIndex === 0) {
            this._pageYs[pageIndex] = sIdx / this._displayItems.length * contentBound.height;
        }

        this.$listPages[pageIndex].addStyle('top', this._pageYs[pageIndex] + 'px');
        this._requireItem(pageElt, nItem);
        this._assignItems(pageElt, sIdx);
        pageBound = pageElt.getBoundingClientRect();
        this._pageYs[pageIndex + 1] = this._pageYs[pageIndex] + pageBound.height;
    }
};


MListModal.prototype.viewListAtFirstSelected = function () {
    // if (this._displayValue == VALUE_HIDDEN) {
    //     return false;
    // }
    // else if (this._values.length > 0) {
    //     var value = this._values[0];
    //     var itemHolders = this._itemHolderByValue[value + ''];
    //     if (itemHolders) {
    //         var holder = itemHolders[0];
    //         this.viewListAt(holder.idx);
    //         return true;
    //     }
    //     else return false;
    // }
    // else
    //     return false;
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
    this.viewListAt(0);
};

MListModal.prototype.notifyPressOut = function () {
    this.emit('pressout', { target: this, type: 'pressout' }, this);
};

MListModal.prototype.notifyPressClose = function () {
    this.emit('pressclose', { target: this, type: 'pressclose' }, this);
};

MListModal.prototype._findFirstPageIdx = function (){

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
        this._searchCache = {};
        var estimateSize = measureListSize(this._preDisplayItems);
        if (estimateSize.descWidth > 0) {
            this.$listScroller.addStyle('--desc-width', 100 * (estimateSize.descWidth + 15) / (estimateSize.width) + '%');
        }
        else {
            this.$listScroller.removeStyle('--desc-width');
        }
        var estimateHeight = items.length * 30 * estimateSize.width / Math.min(Dom.getScreenSize().width - 80, 500);
        this.$content.addStyle('height', estimateHeight + 'px');
        this.estimateSize = estimateSize;
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
    this.viewListAt(0);
};



MListModal.eventHandler.scroll = function (){

    console.log('.')
};

Core.install(MListModal);
export default MListModal;