import '../../css/mmatmenu.css';
import Core from './Core';
import OOP from 'absol/src/HTML5/OOP';
var _ = Core._;
var $ = Core.$;

function MMatMenuItem() {
    this.$node = $('mmatmenubutton', this).on('click', this.eventHandler.clickNode);
    OOP.drillProperty(this, this.$node, ['icon', 'text']);
    /**
     * @type {import('./MMatMenu').default}
     */
    this.$matmenu = $('mmatmenu', this)
        .on('press', this.eventHandler.itemPress);
    this.$dropdown = $('.am-mat-menu-dropdown', this);
}

MMatMenuItem.render = function () {
    return _({
        extendEvent: ['press'],
        class: 'am-mat-menu-item',
        child: [
            {
                tag: 'mmatmenubutton'
            },
            {
                class: 'am-mat-menu-dropdown',
                child: {
                    tag: 'mmatmenu'
                }
            }
        ]
    });
};

MMatMenuItem.prototype.getNode = function () {
    return this.$node;
};


MMatMenuItem.prototype.openChild = function () {
    this.$node.status = 'open';
    this.addClass('am-status-open');
    var menuBound = this.$matmenu.getBoundingClientRect();
    this.$dropdown.addStyle('max-height', menuBound.height + 2 + 'px');

};

MMatMenuItem.prototype.closeChild = function () {
    this.$node.status = 'close';
    this.removeClass('am-status-open');
    this.$dropdown.removeStyle('max-height');

};


MMatMenuItem.prototype.toggleChild = function () {

    if (this.$node.status == 'open') {
        this.closeChild();
    }
    else if (this.$node.status == 'close') {
        this.openChild();
    }
};

MMatMenuItem.prototype.notifyPress = function (args) {
    this.emit('press', Object.assign({ target: this, type: 'press', item: this, menuItem: this }, args || {}), this);
};


MMatMenuItem.property = {};


MMatMenuItem.property.items = {
    set: function (items) {
        items = items || [];
        if (items.length > 0) this.$node.status = 'close';
        else this.$node.status = 'none';
        this.$matmenu.items = items;
        this.level = this.level;// update
    },
    get: function () {
        return this.$matmenu.items;
    }
};

MMatMenuItem.property.level = {
    set: function (value) {
        this.$node.level = value;
        value = this.$node.level;
        for (var i = 0; i < this.$matmenu.childNodes.length; ++i) {
            this.$matmenu.childNodes[i].level = value + 1;
        }
    },
    get: function () {
        return this.$node.level
    }
};


/**
 * @type {MMatMenuItem}
 */
MMatMenuItem.eventHandler = {};

MMatMenuItem.eventHandler.clickNode = function (event) {
    if (this.$node.status == 'none') {
        //todo
        this.notifyPress();
    }
    else {
        this.toggleChild();
    }
};

MMatMenuItem.eventHandler.itemPress = function (event) {
    this.notifyPress(event);
};

Core.install('mmatmenuitem', MMatMenuItem);

export default MMatMenuItem;