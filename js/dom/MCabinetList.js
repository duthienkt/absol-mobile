import BoardTable from "absol-acomp/js/BoardTable";

import Core, { $, _ } from './Core'
import prepareSearchForItem, { searchListByText } from "absol-acomp/js/list/search";
import MCabinetItem from "./MCabinetItem";


/***
 * @extends BoardTable
 * @constructor
 */
function MCabinetList() {
    this.on('dragitemstart', this.eventHandler.dragItemStart);
    /***
     * @type {boolean}
     * @name searching
     * @memberOf MCabinetList#
     */
}

MCabinetList.tag = 'MCabinetList'.toLowerCase();

MCabinetList.render = function () {
    return _({
        tag: BoardTable.tag,
        extendEvent: ['searchstart', 'searchend'],
        class: 'am-cabinet-list'
    });
};

/****
 * @memberOf MCabinetList#
 * @type {{}}
 */
MCabinetList.eventHandler = {};


MCabinetList.eventHandler.dragItemStart = function () {
    var bound = this.getBoundingClientRect();
    this.addStyle('--am-cabinet-list-bound-left', bound.left + 'px');
}

MCabinetList.prototype.getChildren = function () {
    if (this.searching) return this.$items;
    return Array.prototype.slice.call(this.childNodes);
};


MCabinetList.prototype.clearChild = function () {
    if (this.searching) {
        this.$items = [];
        this._cache = {};
        this._searchingItems = [];
        this.eventHandler.searchModify(null);
        return this;
    }
    else {
        while (this.firstChild) {
            this.firstChild.remove();
        }
        this._childHolders = [];
        return this;
    }
};

MCabinetList.prototype.removeChild = function (elt) {
    var idx;
    if (this.searching) {
        idx = this.$items.indexOf(elt);
        if (idx < 0) return this;
        this.$items.splice(idx, 1);
        this._searchingItems.splice(idx, 1);
        this._cache = {};
        elt.remove();
        this.eventHandler.searchModify(null);
    }
    else {
        BoardTable.prototype.removeChild.call(this, elt);
    }

    return this;
};


MCabinetList.prototype.addChild = function (elt) {
    if (elt instanceof Array) {
        elt.forEach(function (it) {
            this.addChild(it);
        }.bind(this))
        return this;
    }

    if (this.searching) {
        this.$items.push(elt);
        this._searchingItems.push(prepareSearchForItem({
            text: elt.getSearchingText(),
            value: elt
        }));
        this.eventHandler.searchModify(null);
    }
    else {
        BoardTable.prototype.addChild.call(this, elt);
    }
};


MCabinetList.prototype.addChildBefore = function (elt, bf) {
    elt.selfRemove();
    var idx;
    if (this.searching) {
        if (!bf) {
            this.$items.push(elt);
            this._searchingItems.push(prepareSearchForItem({
                text: elt.getSearchingText(),
                value: elt
            }));
        }
        else {
            idx = this.$items.indexOf(bf);
            if (idx >= 0) {
                this.$items.splice(idx, 0, elt);
                this._searchingItems.splice(idx, 0, prepareSearchForItem({
                    text: elt.getSearchingText(),
                    value: elt
                }));
            }
            else {
                throw new Error("Failed to execute 'addChildAfter' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
            }
        }
        this.eventHandler.searchModify(null);
    }
    else {
        BoardTable.prototype.addChildBefore.call(this, elt, bf);
    }
};

MCabinetList.prototype.addChildAfter = function (elt, at) {
    elt.selfRemove();
    var idx;
    if (this.searching) {
        if (!at) {
            this.$items.unshift(elt);
            this._searchingItems.unshift(prepareSearchForItem({
                text: elt.getSearchingText(),
                value: elt
            }));
        }
        else {
            idx = this.$items.indexOf( at);
            if (idx >= 0) {
                this.$items.splice(idx + 1, 0, elt);
                this._searchingItems.splice(idx + 1, 0, prepareSearchForItem({
                    text: elt.getSearchingText(),
                    value: elt
                }));
            }
            else {
                throw new Error("Failed to execute 'addChildAfter' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
            }
        }
        this.eventHandler.searchModify(null);
    }
    else {
        BoardTable.prototype.addChildBefore.call(this, elt, at);
    }
};

MCabinetList.prototype.findChildBefore = function (elt) {
    if (this.searching) {
        return this.$items[this.$items.indexOf(elt) - 1] || null;
    }
    else {
        return BoardTable.prototype.findChildBefore.call(this, elt);
    }
};

MCabinetList.prototype.findChildAfter = function (elt) {
    if (this.searching) {
        return this.$items[this.$items.indexOf(elt) + 1] || null;
    }
    else {
        return BoardTable.prototype.findChildBefore.call(this, elt);
    }
};


MCabinetList.property = {};

MCabinetList.property.draggable = {
    set: function (value) {
        if (value) {
            this.addClass('am-draggable');
        }
        else {
            this.removeClass('am-draggable');
        }
    },
    get: function () {
        return this.hasClass('am-draggable');
    }
};

/***
 * @this MCabinetList
 * @param searchInputElt
 */
MCabinetList.prototype.attachSearchInput = function (searchInputElt) {
    if (this.$searchInput) {
        this.$searchInput.off('stoptyping', this.eventHandler.searchModify);
    }
    this.$searchInput = searchInputElt;
    if (this.$searchInput) {
        if (this.$searchInput.$list) {
            this.$searchInput.off('stoptyping', this.$searchInput.$list.eventHandler.searchModify);
        }
        this.$searchInput.$list = this;
        this.$searchInput.on('stoptyping', this.eventHandler.searchModify);
    }
};

/***
 * @this MCabinetList
 * @param event
 */
MCabinetList.eventHandler.searchModify = function (event) {
    if (MCabinetItem.$openingItem) {
        MCabinetItem.$openingItem.resetView();
        MCabinetItem.$openingItem = null;
    }
    var query = this.$searchInput.value;
    query = query.trim();
    if (query.length === 0 && this.hasClass('am-searching')) {
        this.$searchingItemsCtn.remove();

        //pure add
        this._childHolders = [];
        this.$items.forEach(function (e) {
            this.appendChild(e);
            if (e.draggable) {
                this._childHolders.push({ elt: e });
            }
        }.bind(this));

        this.removeClass('am-searching');
        this.emit('searchend', { type: 'searchend', target: this }, this);
    }
    else if (!this.hasClass('am-searching') && query.length > 0) {
        this.$searchingItemsCtn = this.$searchingItemsCtn || _('.am-cabinet-list-searching-items-ctn');
        this.cache = {};
        this._searchingItems = Array.prototype.map.call(this.childNodes, function (elt) {
            return prepareSearchForItem({
                text: elt.getSearchingText(),
                value: elt
            });
        });
        this.$items = Array.prototype.slice.call(this.childNodes);
        this.addClass('am-searching');
        //dom clear
        this.innerHTML = '';
        this._childHolders = [];
        this.appendChild(this.$searchingItemsCtn);

        this.emit('searchstart', { type: 'searchstart', target: this }, this);
    }
    if (query.length === 0) return;
    var resultItems = this.cache[query] || searchListByText(query, this._searchingItems);
    var resultEltList = resultItems.map(function (it) {
        return it.value;
    });

    this.$searchingItemsCtn.clearChild().addChild(resultEltList);
};


MCabinetList.prototype.addInputSearch = MCabinetList.prototype.attachSearchInput;
MCabinetList.prototype.addSearchBox = MCabinetList.prototype.attachSearchInput;


MCabinetList.property.searching = {
    get: function () {
        return this.hasClass('am-searching');
    }
};


Core.install(MCabinetList);


export default MCabinetList;