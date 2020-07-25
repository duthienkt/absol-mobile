import MListModal from "./MListModal";
import Dom from "absol/src/HTML5/Dom";
import treeListToList from "absol-acomp/js/list/treeListToList";
import Core from "./Core";
import {searchTreeListByText} from "absol-acomp/js/list/search";

/***
 * @extends MListModal
 * @constructor
 */
function MTreeModal() {
    this._initDomHook();
    this._initControl();
    this._initProperty();
}


MTreeModal.tag = 'MTreeModal'.toLowerCase();

MTreeModal.render = function () {
    return MListModal.render().addClass('am-tree-modal');
};


Object.assign(MTreeModal.prototype, MListModal.prototype);

MTreeModal.prototype._listToDisplay = function (items) {
    return treeListToList(items);
};

MTreeModal.prototype.searchItemByText = function (text) {
    text = text.trim();
    if (text.length == 0) return this._items;
    if (this._searchCache[text]) return this._searchCache[text];
    this._searchCache[text] = searchTreeListByText(text, this._items);
    return this._searchCache[text];
};

MTreeModal.property = Object.assign({}, MListModal.property);


MTreeModal.eventHandler = Object.assign({}, MListModal.eventHandler);

Core.install(MTreeModal);

export default MTreeModal;