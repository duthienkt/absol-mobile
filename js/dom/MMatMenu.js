import '../../css/mmatmenu.css';
import Core from './Core';
import OOP from 'absol/src/HTML5/OOP';
import './MMatMenuItem';
var _ = Core._;
var $ = Core.$;

function MMatMenu() {

}

MMatMenu.render = function () {
    return _({
        class: 'am-mat-menu'
    });
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
                props: Object.assign({}, item)
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

Core.install('mmatmenu', MMatMenu);

export default MMatMenu;