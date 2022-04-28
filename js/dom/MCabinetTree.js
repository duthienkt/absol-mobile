import Core, { _, $ } from "./Core";
import MCabinetTreeNode from "./MCabinetTreeNode";
import OOP from "absol/src/HTML5/OOP";
import AElement from "absol/src/HTML5/AElement";
import prepareSearchForItem from "absol-acomp/js/list/search";


/***
 * @extends AElement
 * @constructor
 */
function MCabinetTree() {
    this.$node = $(MCabinetTreeNode.tag, this)
        .on('toggle', this.eventHandler.toggle)
        .on('click', this.eventHandler.click);
    this.$children = $('.am-cabinet-tree-children', this);
    OOP.drillProperty(this, this.$node, ['content', 'quickmenu']);

    /***
     * @type {number}
     * @name level
     * @memberOf MCabinetTree#
     */
}


MCabinetTree.tag = 'MCabinetTree'.toLowerCase();

MCabinetTree.render = function () {
    return _({
        extendEvent: ['click'],
        class: 'am-cabinet-tree',
        child: [
            {
                tag: MCabinetTreeNode.tag
            },
            {
                class: 'am-cabinet-tree-children'
            }
        ]
    });
};

MCabinetTree.prototype._updateChildClass = function () {
    if (this.$children.childNodes.length > 0) {
        this.addClass('am-has-children');
    }
    else {
        this.removeClass('am-has-children');

    }
};

MCabinetTree.prototype.addChild = function (child) {
    if (child && child.forEach) {
        child.forEach(function (c) {
            this.addChild(c);
        }.bind(this))
        return this;
    }
    this.$children.addChild(child);
    child.level = this.level + 1;
    this._updateChildClass();
};

MCabinetTree.prototype.getSearchingItem = function () {
    var text = this.$node.getSearchingText();
    var value = this;
    var items = Array.prototype.map.call(this.$children.childNodes, function (subTree) {
        return subTree.getSearchingItem();
    });

    var res = {
        text: text,
        value: value
    };

    if (items.length > 0) res.items = items;
    return prepareSearchForItem(res);
};

MCabinetTree.property = {};

MCabinetTree.property.level = {
    set: function (value) {
        this.$node.level = value;
        Array.prototype.forEach.call(this.$children.childNodes, function (treeElt) {
            treeElt.level = value + 1;
        })
    },
    get: function () {
        return this.$node.level;
    }
};

MCabinetTree.property.opened = {
    set: function (value) {
        if (value) {
            this.addClass('am-opened');
        }
        else {
            this.removeClass('am-opened');
        }
    },
    get: function () {
        return this.hasClass('am-opened');
    }
};

/***
 * @memberOf MCabinetTree#
 * @type {{}}
 */
MCabinetTree.eventHandler = {};

MCabinetTree.eventHandler.toggle = function (event) {
    this.opened = !this.opened;
};

MCabinetTree.eventHandler.click = function (event) {
    this.emit('click', event, this);
};

Core.install(MCabinetTree);
export default MCabinetTree;