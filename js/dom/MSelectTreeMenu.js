import '../../css/mselecttreemenu.css';
import EventEmitter from "absol/src/HTML5/EventEmitter";
import {phraseMatch, wordsMatch} from "absol/src/String/stringMatching";
import {nonAccentVietnamese} from "absol/src/String/stringFormat";
import Dom from "absol/src/HTML5/Dom";
import Core from "./Core";
import OOP from "absol/src/HTML5/OOP";
import MSelectMenu from "./MSelectMenu";
import {prepareSearchForList} from "absol-acomp/js/list/search";
import treeListToList from "absol-acomp/js/list/treeListToList";
import  SelectTreeMenu from "absol-acomp/js/SelectTreeMenu";
/*global absol*/
var _ = Core._;
var $ = Core.$;


function MSelectTreeMenu() {
    var thisSM = this;
    this._isFocus = false;
    this.selectListBound = { width: 0 };
    this.__searchcache__ = {};
    this.$holderItem = $('.am-selectmenu-holder-item', this);
    this.$modal = _({
        class: 'am-selectmenu-modal',
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
    this.$selectlist = $('mselectlist.am-selectmeu-list', this.$modal)
        .on('valuevisibilityasync', this.eventHandler.listValueVisibility);
    //     .on('sizechangeasync', this.eventHandler.listSizeChangeAsync)


    // this._itemsByValue = {};
    this.$searchTextInput.on('stoptyping', this.eventHandler.searchModify);
    this._searchCache = {};
    this.$selectlist.on('pressitem', this.eventHandler.selectlistPressItem, true);
    this.$selectlist.on('pressitem', function () {
        thisSM.isFocus = false;
    }, true);
    this._fixPopupWidth = false;
    this._lastValue = "NOTHING_VALUE";
    this._resourceReady = true;


    this.on('click', this.eventHandler.click, true);
    // this.on('blur', this.eventHandler.blur);

    // this.selectListBound = { height: 0, width: 0 };
    this.$removableTrackElts = [];
    this.$attachhook = $('attachhook', this)
        .on('error', this.eventHandler.attached);

    this._selectListScrollSession = null;
}

MSelectTreeMenu.tag = 'MSelectTreeMenu'.toLowerCase();

MSelectTreeMenu.render = function () {
    return _({
        class: ['absol-selectmenu', 'am-selectmenu'],
        extendEvent: ['change', 'minwidthchange'],
        attr: {
            tabindex: '1'
        },
        child: [
            '.am-selectmenu-holder-item',
            {
                tag: 'button',
                class: 'absol-selectmenu-btn',
                child: ['dropdown-ico']
            },
            'attachhook',
        ]
    });
};


MSelectTreeMenu.prototype._updatePopupPosition = MSelectMenu.prototype._updatePopupPosition;
MSelectTreeMenu.prototype.updateItem = MSelectMenu.prototype.updateItem;

MSelectTreeMenu.prototype.init = MSelectMenu.prototype.init;
MSelectTreeMenu.prototype.updateDropdownPostion = MSelectMenu.prototype.updateDropdownPostion;
MSelectTreeMenu.prototype.scrollToSelectedItem = MSelectMenu.prototype.scrollToSelectedItem;
MSelectTreeMenu.prototype._dictByValue = MSelectMenu.prototype._dictByValue;
MSelectTreeMenu.prototype.startListenRemovable = MSelectMenu.prototype.startListenRemovable;
MSelectTreeMenu.prototype.stopListenRemovable = MSelectMenu.prototype.stopListenRemovable;
MSelectTreeMenu.prototype.getRecommendWith = MSelectMenu.prototype.getRecommendWith;
MSelectTreeMenu.prototype._releaseResource = MSelectMenu.prototype._releaseResource;
MSelectTreeMenu.prototype._requestResource = function () {
    this.$selectlist.items = this.__searchcache__['__EMPTY_QUERY__'] || {};
};

MSelectTreeMenu.eventHandler = {};

MSelectTreeMenu.eventHandler.click = MSelectMenu.eventHandler.click;
MSelectTreeMenu.eventHandler.bodyClick = MSelectMenu.eventHandler.bodyClick;
MSelectTreeMenu.eventHandler.selectlistPressItem = MSelectMenu.eventHandler.selectlistPressItem;
MSelectTreeMenu.eventHandler.removeParent = MSelectMenu.eventHandler.removeParent;
MSelectTreeMenu.eventHandler.clickCloseBtn = MSelectMenu.eventHandler.clickCloseBtn;


MSelectTreeMenu.eventHandler.listValueVisibility = MSelectMenu.eventHandler.listValueVisibility;


MSelectTreeMenu.property = {};
MSelectTreeMenu.property.disabled = MSelectMenu.property.disabled;
MSelectTreeMenu.property.hidden = MSelectMenu.property.hidden;
MSelectTreeMenu.property.value = MSelectMenu.property.value;
MSelectTreeMenu.property.enableSearch = MSelectMenu.property.enableSearch;


MSelectTreeMenu.eventHandler.attached = MSelectMenu.eventHandler.attached;
MSelectTreeMenu.eventHandler.removeParent = MSelectMenu.eventHandler.removeParent;


MSelectTreeMenu.eventHandler.searchModify = function (event) {
    var value = this.$searchTextInput.value;
    this.search(value);

}

MSelectTreeMenu.prototype.notifyChange = function (eventData) {
    setTimeout(function () {
        this.emit('change', Object.assign({}, eventData), this)
    }.bind(this), 1)
}


MSelectTreeMenu.property.items = {
    set: function (value) {
        value = value || [];
        this._items = value;
        prepareSearchForList(this._items);
        this.__searchcache__ = {};
        this.__searchcache__['__EMPTY_QUERY__'] = treeListToList(value);

        this.selectListBound = this.$selectlist.setItemsAsync(this.__searchcache__['__EMPTY_QUERY__']);
        this._resourceReady = true;
        this._itemsByValue = this._dictByValue(this.__searchcache__['__EMPTY_QUERY__']);
        if (this._itemsByValue[this.value] === undefined) {
            this.value = this.__searchcache__['__EMPTY_QUERY__'][0].value;
        }
        this.updateItem();

    },
    get: function () {
        return this._items;
    }
};


MSelectTreeMenu.property.isFocus = {
    set: function (value) {
        var self = this;
        value = !!value;
        if (value == this.isFocus) return;
        this._isFocus = value;
        if (value) {
            var isAttached = false;
            setTimeout(function () {
                if (isAttached) return;
                $('body').on('click', this.eventHandler.bodyClick);
                isAttached = true;
            }.bind(this), 1000);
            $('body').once('click', function () {
                setTimeout(function () {
                    if (isAttached) return;
                    $('body').on('click', this.eventHandler.bodyClick);
                    isAttached = true;
                }.bind(this), 10);
            }.bind(this));

            if (this.enableSearch) {
                setTimeout(function () {
                    this.$searchTextInput.focus();
                }.bind(this), 50);
            }
            this.$modal.addTo(document.body)
                .addStyle('visibility', 'hidden');
            this._updatePopupPosition();
            this.scrollToSelectedItem();
            this.$modal.removeStyle('visibility');
        }
        else {
            $('body').off('click', this.eventHandler.bodyClick);
            this.$modal.remove();
            this._updatePopupPosition();
            setTimeout(function () {
                if (self.$searchTextInput.value != 0) {
                    self.$searchTextInput.value = '';
                    // different with SelectMenu
                    self.$selectlist.items = self.__searchcache__['__EMPTY_QUERY__'];
                    this._resourceReady = true;
                }
            }, 100)
            this.updateItem();
        }
    },
    get: function () {
        return !!this._isFocus;
    }
};


MSelectTreeMenu.prototype.search = function (query) {
    if (query.length == 0) {
        this.$selectlist.items = this.__searchcache__['__EMPTY_QUERY__'];
        this._resourceReady = true;
        this.updateItem();
        this.scrollToSelectedItem();
        this.$selectlist.removeClass('as-searching');

    }
    else {
        this.$selectlist.addClass('as-searching');

        var searchResult = this.__searchcache__[query] || SelectTreeMenu.queryTree(query, this.items);
        this.__searchcache__[query] = searchResult;
        this.$selectlist.items = searchResult;
        this.updateItem();
        this.$vscroller.scrollTop = 0;
    }
};


Core.install(MSelectTreeMenu);

export default MSelectTreeMenu;