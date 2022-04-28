import Core, { _, $ } from "./Core";
import '../../css/mcabinetlist.css';
import '../../css/mcabinettreelist.css';
import MCabinetItem from "./MCabinetItem";
import noop from "absol/src/Code/noop";

/***
 * @extends AElement
 * @constructor
 */
function MCabinetTreeNode() {
    this._level = 0;
    this.$content = $('.am-cabinet-tree-node-content', this);
    this.$body = $('.am-cabinet-tree-node-body', this);
    this.$toggleCtn = $('.am-cabinet-tree-node-toggle-ctn', this);
    this.addEventListener('click', this.eventHandler.click);
    this.$quickmenuBtn = $('.am-cabinet-item-quick-menu-btn', this);
    this._makeQuickMenu();
    /***
     * @type {number}
     * @name level
     * @memberOf MCabinetTreeNode#
     */
}


MCabinetTreeNode.tag = 'MCabinetTreeNode'.toLowerCase();

MCabinetTreeNode.render = function () {
    return _({
        extendEvent: ['click', 'toggle'],
        class: 'am-cabinet-tree-node',
        child: [
            {
                class: 'am-cabinet-tree-node-body',
                child: [
                    {
                        class: 'am-cabinet-tree-node-toggle-ctn',
                        child: [
                            'span.mdi.mdi-chevron-right'
                        ]
                    },
                    {
                        class: 'am-cabinet-tree-node-content'
                    },
                    {
                        class: 'am-cabinet-tree-node-quick-menu-ctn',
                        child: {
                            tag: 'button',
                            class: 'am-cabinet-item-quick-menu-btn',
                            child: '<i class="material-icons">more_horiz</i>'
                        }
                    },

                ]

            }
        ]
    });
};

MCabinetTreeNode.prototype._makeQuickMenu = MCabinetItem.prototype._makeQuickMenu;
MCabinetTreeNode.prototype.getSearchingText = MCabinetItem.prototype.getSearchingText;
MCabinetTreeNode.prototype.resetView = noop;

MCabinetTreeNode.property = {};


MCabinetTreeNode.property.content = MCabinetItem.property.content;
MCabinetTreeNode.property.quickmenu = MCabinetItem.property.quickmenu;
MCabinetTreeNode.property.level = {
    set: function (value) {
        this._level = value;
        this.$body.addStyle('--level-padding', value * 1.5 + 'em')
    },
    get: function () {
        return this._level;
    }
};


/***
 * @memberOf MCabinetTreeNode#
 * @type {{}}
 */
MCabinetTreeNode.eventHandler = {};

/***
 * @this MCabinetTreeNode
 * @param event
 */
MCabinetTreeNode.eventHandler.click = function (event) {
    var c = event.target;
    while (c) {
        if (c === this) break;
        if (c === this.$toggleCtn) {
            this.emit('toggle', { type: 'toggle', target: this, originalEvent: event }, this);
            this.opened = !this.opened;
            return;
        }
        if (c.tagName === 'INPUT') return;
        if (c.tagName === 'BUTTON') return;
        if (typeof c.checked === "boolean") return;
        if (typeof c.value !== 'undefined') return;
        if (c.isInput) return;
        c = c.parentElement;
    }
    this.emit('click', { type: 'click', target: this, originalEvent: event }, this);
};

Core.install(MCabinetTreeNode);
export default MCabinetTreeNode;