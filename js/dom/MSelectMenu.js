import '../../css/mselectmenu.css';
import Core from "./Core";
import SelectMenu from 'absol-acomp/js/SelectMenu';
import MListModal from "./MListModal";

var _ = Core._;
var $ = Core.$;


function MSelectMenu() {
    this._isFocus = false;
    this._itemsByValue = {};
    this.$holderItem = $('.am-selectmenu-holder-item', this);

    /***
     * @type {MListModal}
     */
    this.$selectlist = _('mlistmodal');

    this.$selectlist.on('pressitem', this.eventHandler.pressItem, true)
        .on('pressout', this.eventHandler.pressOut)
        .on('pressclose', this.eventHandler.pressOut);
    this.on('click', this.eventHandler.click, true);

    this.$attachhook = $('attachhook', this).on('error', this.eventHandler.attached);
}

MSelectMenu.tag = 'mselectmenu';
MSelectMenu.render = function () {
    return _({
        class: ['absol-selectmenu', 'am-selectmenu'],
        extendEvent: ['change', 'minwidthchange'],
        attr: {
            tabindex: '1'
        },
        child: [
            '.am-selectmenu-holder-item',
            {
                tag: 'button',
                class: 'absol-selectmenu-btn',
                child: ['dropdown-ico']
            },
            'attachhook',
        ]
    });
};


MSelectMenu.prototype.updateItem = function () {
    this.$holderItem.clearChild();
    if (this._itemsByValue[this.value]) {
        var elt = _({
            tag: 'mselectlistitem',
            props: {
                data: this._itemsByValue[this.value]
            }
        }).addTo(this.$holderItem);
        // elt.$descCtn.addStyle('width', this.$selectlist._descWidth + 'px');
    }
};

MSelectMenu.prototype.notifyChange = function (data) {
    this.emit('change', Object.assign({}, data, { type: 'chage', target: this }), this);
};

MSelectMenu.prototype._dictByValue = SelectMenu.prototype._dictByValue;

MSelectMenu.prototype.getRecommendWith = function () {
    return this.$selectlist.estimateSize.width + 36;
};

MSelectMenu.prototype.init = SelectMenu.prototype.init;

MSelectMenu.property = {};


MSelectMenu.property.items = {
    set: function (value) {
        /**
         * verity data
         */
        if (value) {
            value.forEach(function (it) {
                if (it && it.text) {
                    it.text = it.text + '';
                }
            });
        }

        this._items = value;
        this._itemsByValue = this._dictByValue(value);

        if (!this._itemsByValue[this.value] && value.length > 0) {
            this.value = value[0].value;
        }
        else
            this.updateItem();
        this.$selectlist.items = value
    },
    get: function () {
        return this._items || [];
    }
};

MSelectMenu.property.value = {
    set: function (value) {
        this._value = value;

        this.$selectlist.values = [value];
        this.updateItem();
    },
    get: function () {
        return this._value;
    }
};


MSelectMenu.property.enableSearch = {
    set: function (value) {
        this.$selectlist.enableSearch = !!value;
    },
    get: function () {
        return this.$selectlist.enableSearch;
    }
};


MSelectMenu.property.isFocus = {
    set: function (value) {
        var thisSM = this;
        value = !!value;
        if (value === this._isFocus) return;
        this._isFocus = value;
        if (value) {
            this.$selectlist.afterAttached().then(function () {
                thisSM.$selectlist.viewListAtFirstSelected();
            });
            thisSM.$selectlist.viewListAt(0);
            this.$selectlist.addTo(document.body);
        }
        else {
            this.$selectlist.selfRemove();
            setTimeout(function () {
                thisSM.$selectlist.resetSearchState();
            }, 100);
        }
    },
    get: function () {
        return this._isFocus;
    }
};

MSelectMenu.property.disabled = SelectMenu.property.disabled;
MSelectMenu.property.hidden = SelectMenu.property.hidden;

/**
 * @type {MSelectMenu}
 */
MSelectMenu.eventHandler = {};

MSelectMenu.eventHandler.attached = function () {
    if (this.style.width === 'auto') {
        this.addStyle('width', this.getRecommendWith() / 14 + 'em');
    }
};

MSelectMenu.eventHandler.click = function (event) {
    this.isFocus = !this.isFocus;
};


MSelectMenu.eventHandler.pressOut = function (event) {
    this.isFocus = false;
};


MSelectMenu.eventHandler.pressItem = function (event) {
    var newValue = event.value;
    if (newValue !== this._value) {
        var lastValue = this._value;
        this._value = newValue;
        this.$selectlist.values = [newValue];
        this.updateItem();
        var changeEvent = Object.assign({}, event, { lastValue: lastValue });
        setTimeout(function () {
            this.notifyChange(changeEvent);
        }.bind(this), 1);
    }
    setTimeout(function () {
        this.isFocus = false;
    }.bind(this), 100);
};


Core.install(MSelectMenu);

export default MSelectMenu;