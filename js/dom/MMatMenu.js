import '../../css/mmatmenu.css';
import Core from './Core';
import OOP from 'absol/src/HTML5/OOP';
import './MMatMenuItem';
import MMatMenuItem from './MMatMenuItem';
var _ = Core._;
var $ = Core.$;

function MMatMenu() {

}

MMatMenu.tag = 'MMatMenu'.toLowerCase();
MMatMenu.render = function () {
    return _({
        extendEvent: ['press'],
        class: 'am-mat-menu'
    });
};


MMatMenu.prototype.notifyPress = function (args) {
    this.emit('press', Object.assign({ target: this, type: 'press' }, args || {}), this);
};


MMatMenu.property = {};

MMatMenu.property.items = {
    set: function (items) {
        items = items || [];
        this.clearChild();
        var item;
        var itemElt;
        for (var i = 0; i < items.length; ++i) {
            item = items[i];
            itemElt = _({
                tag: 'mmatmenuitem',
                props: Object.assign({}, item),
                on: {
                    press: this.eventHandler.itemPress
                }
            });
            this.addChild(itemElt);
        }
    },
    get: function () {
        return Array.map.call(this.childNodes, function (elt) {
            return {
                text: elt.text,
                items: elt.items,
                icon: elt.icon
            }
        })
    }
};

/***
 * @type {MMatMenuItem}
 */
MMatMenu.eventHandler = {};


MMatMenu.eventHandler.itemPress = function (event) {
    this.notifyPress(event);
};

Core.install(MMatMenu);

export default MMatMenu;