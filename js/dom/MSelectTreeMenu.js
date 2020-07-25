import '../../css/mselecttreemenu.css';
import Core from "./Core";
import MSelectMenu from "./MSelectMenu";
import MTreeModal from "./MTreeModal";

var _ = Core._;
var $ = Core.$;

function MSelectTreeMenu() {
    this._isFocus = false;
    this._itemsByValue = {};
    this.$holderItem = $('.am-selectmenu-holder-item', this);

    /***
     * @type {MTreeModal}
     */
    this.$selectlist = _('mtreemodal');

    this.$selectlist.on('pressitem', this.eventHandler.pressItem, true)
        .on('pressout', this.eventHandler.pressOut)
        .on('pressclose', this.eventHandler.pressOut);
    this.on('click', this.eventHandler.click, true);
    this.$attachhook = $('attachhook', this).on('error', this.eventHandler.attached);
}

MSelectTreeMenu.tag = 'MSelectTreeMenu'.toLowerCase();

MSelectTreeMenu.render = function () {
    return  MSelectMenu.render().addClass('am-select-tree-menu');
};

Object.assign(MSelectTreeMenu.prototype, MSelectMenu.prototype);
MSelectTreeMenu.property = Object.assign({}, MSelectMenu.property);
MSelectTreeMenu.eventHandler = Object.assign({}, MSelectMenu.eventHandler);

MSelectTreeMenu.prototype._dictByValue = function(items){
    return items.reduce(function visitor(ac, cr) {
        if (cr.items && cr.items.reduce){
            cr.items.reduce(visitor, ac);
        }
        var value = cr.value+'';
        ac[value] = cr;
        return ac;
    }, {})
};

Core.install(MSelectTreeMenu);

export default MSelectTreeMenu;