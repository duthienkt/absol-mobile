import Board from "absol-acomp/js/Board";
import BoardTable from "absol-acomp/js/BoardTable";
import Core, { $, _ } from './Core';
import '../../css/mcabinetlist.css';
import QuickMenu from "absol-acomp/js/QuickMenu";
import Hanger from "absol-acomp/js/Hanger";
import { hitElement } from "absol/src/HTML5/EventEmitter";

/***
 * @extends AElement
 * @constructor
 */
function MCabinetItem() {
    this._content = null;
    this.$content = $('.am-cabinet-item-content', this);
    this.$body = $('.am-cabinet-item-body', this)
        .on('predrag', this.eventHandler.bodyPredrag)
        .on('touchstart', this.eventHandler.bodyMouseDown)
        .on('touchend', this.eventHandler.bodyMouseUp)
        .on('dragstart', this.eventHandler.bodyDragStart)
        .on('dragend', this.eventHandler.bodyDragEnd)
        .on('drag', this.eventHandler.bodyDrag);
    this.$quickmenuBtn = $('.am-cabinet-item-quick-menu-btn', this);
    this.$right = $('.am-cabinet-item-right-action-ctn', this);
    this.$drag = $('.am-cabinet-item-drag', this)
        .on('touchstart', function () {
            if (MCabinetItem.$openingItem) {
                MCabinetItem.$openingItem.resetView();
                MCabinetItem.$openingItem = null;
            }
        });
    this.$searchInput = null;
    this._quickmenu = null;
    this.commandViewState = 0;
    this._makeQuickMenu();
}

MCabinetItem.tag = 'MCabinetItem'.toLowerCase();

MCabinetItem.render = function () {
    return _({
        tag: Board.tag,
        extendEvent: ['click', 'action'],
        class: 'am-cabinet-item',
        child: [
            {
                tag: Hanger.tag,
                class: ['am-cabinet-item-body'],
                props: {
                    hangOn: 10
                },
                child: [
                    {
                        class: ['am-cabinet-item-drag', BoardTable.DRAG_ZONE_CLASS_NAME],
                        child: '<i class="material-icons drag-icon-button">drag_indicator</i>'
                    },
                    {
                        class: ['am-cabinet-item-content']
                    },
                    {
                        class: 'am-cabinet-item-quick-menu-ctn',
                        child: {
                            tag: 'button',
                            class: 'am-cabinet-item-quick-menu-btn',
                            child: '<i class="material-icons">more_horiz</i>'
                        }
                    }
                ]
            },
            {
                class: 'am-cabinet-item-right-action-ctn'
            }
        ]
    });
};


['addChild', 'removeChild', 'addChildBefore', 'addChildAfter', 'clearChild', 'findChildBefore', 'findChildAfter']
    .forEach(function (name) {
        MCabinetItem.prototype[name] = function () {
            this.$content[name].apply(this.$content, arguments);
        }
    });

MCabinetItem.prototype._makeQuickMenu = function (){
    var self = this;
    this.quickmenuHolder = QuickMenu.toggleWhenClick(this.$quickmenuBtn,
        {
            getAnchor: function () {
                return [3, 4, 13, 14];
            },
            getMenuProps: function () {
                var res = self._quickmenu && self._quickmenu.props;
                return self._quickmenu && self._quickmenu.props;
            },
            onOpen: function () {
                self.resetView();
            },
            onClose: function () {
            },
            onSelect: function (item) {
                if (self._quickmenu.onSelect) {
                    self._quickmenu.onSelect.call(this, item);
                }
            }
        });
}

MCabinetItem.prototype._makeActionBtn = function (data) {
    var btn = _({
        tag: 'button',
        class: 'am-cabinet-item-action',
        on: {
            click: function (event) {
                this.resetView();
                this.emit('action', { type: 'action', originalEvent: event, action: data }, this);
            }.bind(this)
        }
    });
    if (data.text) {
        btn.addChild(_({ text: data.text }));
    }
    else if (data.icon) {
        btn.addChild(_(data.icon));
    }

    return btn;
};

MCabinetItem.prototype.getChildren = function () {
    return this.$body.childNodes;
};

MCabinetItem.prototype.resetView = function () {
    this.$body.addStyle('left', 0 + 'px');
    this.commandViewState = 0;
    this.$quickmenuBtn.removeStyle('opacity')
        .removeStyle('pointer-events');
};

MCabinetItem.prototype.getSearchingText = function () {
    var parts = [];

    function visit(node) {
        if (node.nodeType === 3) {
            parts.push(node.data);
        }
        else if (node.nodeType === 1) {
            if (node.tagName === 'BUTTON') return;
            if (node.tagName === 'INPUT') {
                parts.push(node.value);
            }
            Array.prototype.forEach.call(node.childNodes, visit);
        }

    }

    visit(this.$content);
    parts = parts.filter(function (p) {
        return !!p;
    });
    return parts.join(' ');
};

MCabinetItem.prototype.selfRemove = function () {
    var parent = this.parentElement;
    if (!parent) return;
    if (parent.hasClass('am-cabinet-list-searching-items-ctn')) {
        parent = parent.parentElement;
    }
    parent.removeChild(this);
};

MCabinetItem.property = {};
MCabinetItem.property.quickmenu = {
    set: function (value) {
        this._quickmenu = value;
        if (value) {
            this.addClass('am-has-quick-menu');
        }
        else {
            this.removeClass('am-has-quick-menu');
        }
    },
    get: function () {
        return this._quickmenu;
    }
};

MCabinetItem.property.rightActions = {
    set: function (value) {
        value = value || [];
        this._rightActions = value;
        this.$right.clearChild()
            .addChild(value.map(function (data) {
                return this._makeActionBtn(data);
            }.bind(this)))
    },
    get: function () {
        return this._rightActions;
    }
};

MCabinetItem.property.draggable = {
    set: function (value) {
        if (this.parentElement && this.parentElement.classList.contains('as-board-table')) {
            console.warn("Don't set draggable after MCabinetItem attached!");
        }
        if (value) {
            this.addClass('as-board');
        }
        else {
            this.removeClass('as-board');
        }
    },
    get: function () {
        return this.hasClass('as-board');
    }
};

MCabinetItem.property.content = {
    set: function (value) {
        value = value || null;
        this._content = value;
        this.$content.clearChild();
        if (!value) return;
        if (value instanceof Array) {
            this.$content.addChild(value.map(function (c) {
                return _(c);
            }))
        }
        else {
            this.$content.addChild(_(value));
        }
    },
    get: function () {
        return this._content;
    }
};

/***
 * @memberOf MCabinetItem#
 * @type {{}}
 */
MCabinetItem.eventHandler = {};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyMouseUp = function (event) {
    if (this._waitClick) {
        this.emit('click', event, this);
    }
};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyMouseDown = function (event) {
    if (hitElement(this.$quickmenuBtn, event)) {
        this._waitClick = false;
    }
    else {
        this._waitClick = true;
    }

};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyPredrag = function (event) {
    if (hitElement(this.$drag, event)) {
        event.cancel();
    }
};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyDragStart = function (event) {
    QuickMenu.close(true);
    this._bodyDraging = false;
    this._rightWidth = this.$right.getBoundingClientRect().width;
    this._waitClick = false;
    if (this._rightWidth === 0) return;
    var d = event.currentPoint.sub(event.startingPoint);
    if (Math.abs(d.x) <= Math.abs(d.y)) return;

    if (this.commandViewState === 0) {
        if (d.x < 0) {
            if (MCabinetItem.$openingItem) {
                MCabinetItem.$openingItem.resetView();
            }
            MCabinetItem.$openingItem = this;
            this._bodyDraging = true;
            this._x0 = 0;
            this.commandViewState = -1;
            this.$body.addStyle('left', d.x + 'px');
        }
    }
    else if (this.commandViewState === -1) {
        if (d.x > 0) {
            this._bodyDraging = true;
            this.commandViewState = 0;
            this._x0 = -this._rightWidth;
            this.$body.addStyle('left', this._rightWidth - d.x + 'px');
        }
    }

    setTimeout(function () {
        this.addClass('as-dragging');
    }.bind(this), 5)
};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyDrag = function (event) {
    if (!this._bodyDraging) return;
    var d = event.currentPoint.sub(event.startingPoint);
    var x = this._x0 + d.x;
    this.$body.addStyle('left', x + 'px');
    if (-x > this._rightWidth) {
        this.$right.addStyle('width', -x + 'px');
    }
    this.$quickmenuBtn.addStyle('opacity', 1 - Math.max(0, Math.min(1, -x / this._rightWidth)) + '');
};

/**
 * @this MCabinetItem
 * @param event
 */
MCabinetItem.eventHandler.bodyDragEnd = function (event) {
    if (!this._bodyDraging) return;
    this._bodyDraging = false;
    this.removeClass('as-dragging');
    if (this.commandViewState === 0) {
        this.$right.addStyle('width', this._rightWidth + 'px');
        this.$body.addStyle('left', 0 + 'px');
        if (MCabinetItem.$openingItem === this)
            MCabinetItem.$openingItem = null;
        this.$quickmenuBtn.removeStyle('opacity')
            .removeStyle('pointer-events');

    }
    else {
        this.$right.addStyle('width', this._rightWidth + 'px');
        this.$body.addStyle('left', -this._rightWidth + 'px');
        this.$quickmenuBtn.addStyle('opacity', 0 + '')
            .addStyle('pointer-events', 'none');

    }


    setTimeout(function () {
        this.$right.removeStyle('width');
    }.bind(this), 110);
};

Core.install(MCabinetItem);

export default MCabinetItem;