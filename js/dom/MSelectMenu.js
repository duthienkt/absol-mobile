import '../../css/mselectmenu.css';
import EventEmitter from "absol/src/HTML5/EventEmitter";
import {phraseMatch, wordsMatch} from "absol/src/String/stringMatching";
import {nonAccentVietnamese} from "absol/src/String/stringFormat";
import Dom from "absol/src/HTML5/Dom";
import Core from "./Core";
import SelectMenu from 'absol-acomp/js/SelectMenu';
import {prepareSearchForList, searchListByText} from "absol-acomp/js/list/search";
/*global absol*/
var _ = Core._;
var $ = Core.$;


function MSelectMenu() {
    var thisSM = this;
    this._isFocus = false;

    this.selectListBound = {width: 0};
    this._itemsByValue = {};

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
                                class:'am-selectmenu-popup-box-close-btn',
                                child:'span.mdi.mdi-close'
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
};

MSelectMenu.tag = 'mselectmenu';
MSelectMenu.render = function () {
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

MSelectMenu.optimizeResource = true;


MSelectMenu.EXTRA_MATCH_SCORE = 2;
MSelectMenu.UNCASE_MATCH_SCORE = 1;
MSelectMenu.UVN_MATCH_SCORE = 3;
MSelectMenu.EQUAL_MATCH_SCORE = 4;
MSelectMenu.WORD_MATCH_SCORE = 3;


MSelectMenu.prepareItem = function (item) {
    if (typeof item == 'string') item = {text: item, value: item};
    var spliter = /\s+/;

    item.__text__ = item.text.replace(/([\s\b\-()\[\]]|&#8239;|&nbsp;|&#xA0;|\s)+/g, ' ').trim();
    item.__words__ = item.__text__.split(spliter);

    item.__textNoneCase__ = item.__text__.toLowerCase();
    item.__wordsNoneCase__ = item.__textNoneCase__.split(spliter);


    item.__nvnText__ = nonAccentVietnamese(item.__text__);
    item.__nvnWords__ = item.__nvnText__.split(spliter);

    item.__nvnTextNoneCase__ = item.__nvnText__.toLowerCase();
    item.__nvnWordsNoneCase__ = item.__nvnTextNoneCase__.split(spliter);
    return item;
};


/**
 * @param {SearchItem} queryItem
 * @param {SearchItem} item
 */
MSelectMenu.calScore = function (queryItem, item) {
    var score = 0;
    if (item.__text__ == queryItem.__text__)
        score += MSelectMenu.EQUAL_MATCH_SCORE * queryItem.__text__.length;

    var extraIndex = item.__text__.indexOf(queryItem.__text__);

    if (extraIndex >= 0) {
        score += MSelectMenu.EXTRA_MATCH_SCORE * queryItem.__text__.length - extraIndex / item.__text__.length;
    }

    extraIndex = item.__textNoneCase__.indexOf(queryItem.__textNoneCase__);
    if (extraIndex >= 0) {
        score += MSelectMenu.UNCASE_MATCH_SCORE * queryItem.__text__.length - extraIndex / item.__text__.length;
    }

    extraIndex = item.__nvnTextNoneCase__.indexOf(queryItem.__nvnTextNoneCase__);
    if (extraIndex >= 0) {
        score += MSelectMenu.UNCASE_MATCH_SCORE * queryItem.__text__.length - extraIndex / item.__text__.length;
    }

    score += wordsMatch(queryItem.__nvnWordsNoneCase__, item.__nvnWordsNoneCase__) / (queryItem.__nvnWordsNoneCase__.length + 1 + item.__nvnWordsNoneCase__.length) * 2 * MSelectMenu.WORD_MATCH_SCORE;
    score += wordsMatch(queryItem._am - selectmenu - holder - item_wordsNoneCase__, item.__wordsNoneCase__) / (queryItem.__wordsNoneCase__.length + 1 + item.__wordsNoneCase__.length) * 2 * MSelectMenu.WORD_MATCH_SCORE;
    return score;
};

MSelectMenu.prototype.updateItem = function () {
    this.$holderItem.clearChild();
    if (this._itemsByValue[this.value]) {
        var elt = _({tag: 'mselectlistitem', props: {data: this._itemsByValue[this.value]}}).addTo(this.$holderItem);
        elt.$descCtn.addStyle('width', this.$selectlist._descWidth + 'px');
    }
};

MSelectMenu.prototype._dictByValue = SelectMenu.prototype._dictByValue;

MSelectMenu.prototype.getRecommendWith = function () {
    return this.selectListBound.width;
};

MSelectMenu.prototype.init = SelectMenu.prototype.init;

MSelectMenu.property = {};


MSelectMenu.property.items = {
    set: function (value) {
        this._searchCache = {};
        /**
         * verity data
         */
        if (value) {
            value.forEach(function (it) {
                if (it && it.text) {
                    it.text = it.text + '';
                }
            });
        }

        this._items = value;
        this._itemsByValue = this._dictByValue(value);

        if (!this._itemsByValue[this.value] && value.length > 0) {
            this.value = value[0].value;
        } else
            this.updateItem();

        this.selectListBound = this.$selectlist.setItemsAsync(value || []);

        this._resourceReady = true;
    },
    get: function () {
        return this._items || [];
    }
};

MSelectMenu.property.value = {
    set: function (value) {
        this.$selectlist.value = value;
        this._lastValue = value;
        this.updateItem();
    },
    get: function () {
        return this.$selectlist.value;
    }
};


MSelectMenu.property.enableSearch = {
    set: function (value) {
        this._enableSearch = !!value;
        if (value) {
            this.$popupBox.addClass('am-enable-search');
        } else {
            this.$popupBox.removeClass('am-enable-search');
        }
    },
    get: function () {
        return !!this._enableSearch;
    }
};

MSelectMenu.prototype._updatePopupPosition = function () {
    if (!this._isFocus) {
        if (this._fixPopupWidth) {
            this.$popupBox.removeStyle("width");
            this._fixPopupWidth = false;
        }
    } else {
        if (!this._fixPopupWidth) {
            var popupBound = this.$popupBox.getBoundingClientRect();
            this.$popupBox.addStyle("width", popupBound.width + 'px');
        }
        var listBound = this.$selectlist.getBoundingClientRect();
        var headerBound = this.$popupHeader.getBoundingClientRect();
        var boxChildHeight = listBound.height + headerBound.height;
        var screenSize = Dom.getScreenSize();
        if (screenSize.height - 120 > boxChildHeight) {
            this.$modal.addStyle('padding-top','calc(50vh - '+(boxChildHeight/2)+'px)')
        }
        else{
            this.$modal.addStyle('padding-top','20px')
        }
    }
};

MSelectMenu.prototype.scrollToSelectedItem = function () {
    var self = this;
    setTimeout(function () {
        if (self.$selectlist.$selectedItem) {
            var fistChildBound = self.$selectlist.childNodes[1].getBoundingClientRect();
            var lastChildBound = self.$selectlist.lastChild.getBoundingClientRect();
            var listBound = {
                top: fistChildBound.top,
                height: lastChildBound.bottom - fistChildBound.top,
                bottom: lastChildBound.bottom
            }
            var itemBound = self.$selectlist.$selectedItem.getBoundingClientRect();
            if (self.isDropdowUp) {
                var scrollBound = self.$vscroller.getBoundingClientRect();
                self.$vscroller.scrollTop = Math.max(itemBound.bottom - scrollBound.height - listBound.top, 0);

            } else {
                self.$vscroller.scrollTop = itemBound.top - listBound.top;
            }
        }
    }.bind(this), 3);
};


MSelectMenu.prototype.startListenRemovable = SelectMenu.prototype.startListenRemovable;

MSelectMenu.prototype.stopListenRemovable = SelectMenu.prototype.stopListenRemovable;

MSelectMenu.prototype._releaseResource = SelectMenu.prototype._releaseResource;

MSelectMenu.prototype._requestResource = SelectMenu.prototype._requestResource;

MSelectMenu.property.isFocus = {
    set: function (value) {
        var self = this
        value = !!value;
        if (value == this.isFocus) return;
        this._isFocus = value;
        if (value) {
            var isAttached = false;
            setTimeout(function () {
                if (isAttached) return;
                $('body').on('click', self.eventHandler.bodyClick);
                isAttached = true;
            }, 1000);
            $('body').once('click', function () {
                setTimeout(function () {
                    if (isAttached) return;
                    $('body').on('click', self.eventHandler.bodyClick);
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
        } else {
            $('body').off('click', this.eventHandler.bodyClick);
            this.$modal.remove();
            this._updatePopupPosition();
            setTimeout(function () {
                if (self.$searchTextInput.value.length != 0) {
                    self.$searchTextInput.value = '';
                    self.$selectlist.items = self.items;
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

MSelectMenu.property.disabled = SelectMenu.property.disabled;
MSelectMenu.property.hidden =  SelectMenu.property.hidden;

/**
 * @type {MSelectMenu}
 */
MSelectMenu.eventHandler = {};

MSelectMenu.eventHandler.attached = function () {
    if (this._updateInterval) return;
    this.$attachhook.updateSize = this.$attachhook.updateSize || this._updatePopupPosition.bind(this);
    Dom.addToResizeSystem(this.$attachhook);
    this.stopListenRemovable();
    this.startListenRemovable();
    if (!this._resourceReady) {
        this._requestResource();
        this._resourceReady = true;
    }
    this._updateInterval = setInterval(function () {
        if (!this.isDescendantOf(document.body)) {
            clearInterval(this._updateInterval);
            this._updateInterval = undefined;
            this.stopListenRemovable();
            this.eventHandler.removeParent();
        }
    }.bind(this), 10000);
};


MSelectMenu.eventHandler.removeParent = function (event) {
    this._releaseResource();
    this._resourceReady = false;
};

MSelectMenu.eventHandler.click = function (event) {
    this.isFocus = !this.isFocus;
};


MSelectMenu.eventHandler.bodyClick = function (event) {
    if (!EventEmitter.hitElement(this, event) && !EventEmitter.hitElement(this.$popupBox, event)) {
        setTimeout(function () {
            this.isFocus = false;
        }.bind(this), 5);
    }
};

MSelectMenu.eventHandler.clickCloseBtn = function(event){
    setTimeout(function () {
        this.isFocus = false;
    }.bind(this), 5);
}


MSelectMenu.eventHandler.selectlistPressItem = function (event) {
    this.updateItem();
    if (this._lastValue != this.value) {
        setTimeout(function () {
            this.emit('change', event, this);
        }.bind(this), 1)
        this._lastValue = this.value;
    }
};


MSelectMenu.eventHandler.searchModify = function (event) {
    var filterText = this.$searchTextInput.value.replace(/((\&nbsp)|(\s))+/g, ' ').trim();
    if (filterText.length == 0) {
        this._resourceReady = true;
        this.$selectlist.items = this.items;
        this.scrollToSelectedItem();
        this.$selectlist.removeClass('as-searching');
        this.$popupBox.removeStyle('width');
        this._fixPopupWidth = false;
    } else {
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
        this.$selectlist.items = view;
        this._resourceReady = true;
        this.$vscroller.scrollTop = 0;
    }

    this.selectListBound = this.$selectlist.getBoundingClientRect();
};

// MSelectMenu.eventHandler.listSizeChangeAsync = function () {

// };

MSelectMenu.eventHandler.listValueVisibility = function (event) {
    if (!this.isFocus) return;
    if (this._selectListScrollSession == event.session) return;

    this._selectListScrollSession = event.session;
    this.scrollToSelectedItem();
};


Core.install(MSelectMenu);

export default MSelectMenu;