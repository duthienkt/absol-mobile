import Core, { _ } from "./Core";
import MCabinetList from "./MCabinetList";
import SearchTextInput from "absol-acomp/js/Searcher";
import { searchTreeListByText } from "absol-acomp/js/list/search";

/***
 * @extends AElement
 * @constructor
 */
function MCabinetTreeList() {
    /***
     *
     * @type {null|SearchTextInput}
     */
    this.$searchInput = null;
    this._searchCache = {};
}


MCabinetTreeList.tag = 'MCabinetTreeList'.toLowerCase();

MCabinetTreeList.render = function () {
    return _({
        class: 'am-cabinet-tree-list',
        child: []
    });
};

MCabinetTreeList.prototype.attachSearchInput = MCabinetList.prototype.attachSearchInput;

MCabinetTreeList.prototype.addInputSearch = MCabinetTreeList.prototype.attachSearchInput;
MCabinetTreeList.prototype.addSearchBox = MCabinetTreeList.prototype.attachSearchInput;


/***
 * @type {{}}
 * @memberOf MCabinetTreeList#
 */
MCabinetTreeList.eventHandler = {};

MCabinetTreeList.eventHandler.searchModify = function (event) {
    var query = this.$searchInput.value;
    query = query.trim();
    if (this.$orderingNodes) {
        this.$orderingNodes.forEach(function (nodeElt) {
            nodeElt.removeClass('am-in-search-result')
                .removeStyle('order');
        });
        if (this.$orderingNodes[0]) {
            this.$orderingNodes[0].removeClass('am-first-result');
        }
    }
    this.$orderingNodes = null;
    if (this.hasClass('am-searching') && query.length === 0) {
        this.removeClass('am-searching');
        return;
    }
    else if (!this.hasClass('am-searching') && query.length > 0) {
        this._searchCache = {};
        this.addClass('am-searching');
    }

    this._searchCache[' all '] = this._searchCache[' all '] || Array.prototype.map.call(this.childNodes, function (tree) {
        return tree.getSearchingItem();
    });

    this._searchCache[query] = this._searchCache[query] || searchTreeListByText(query, this._searchCache[' all ']);

    var orderingNodes = [];
    this._searchCache[query].forEach(function visit(item, i) {
        item.value.addClass('am-in-search-result')
            .addStyle('order', i);
        orderingNodes.push(item.value);
        if (item.items && item.items.length > 0) item.items.forEach(visit);
    });
    if (orderingNodes[0]) {
        orderingNodes[0].addClass('am-first-result');
    }
    this.$orderingNodes = orderingNodes;
};


Core.install(MCabinetTreeList);
export default MCabinetTreeList;