import '../../css/mheaderbar.css';
import Core from './Core';
import QuickMenu from 'absol-acomp/js/QuickMenu';
var _ = Core._;
var $ = Core.$;


function MHeaderBar() {
    this._title = null;
    this._titleDesc = null;
    this._actionIcon = null;

    this._quickmenuHolder = null;
    this._quickmenu = null;
    this.$right = $('.am-header-bar-right', this);
    this.$leftBtn = null;
    this.$titleCtn = null;
    this.$title = null;
    this.$titleDesc = null;
}

MHeaderBar.render = function () {
    return _({
        extendEvent: ['action', 'command'],
        class: 'am-header-bar',
        child: [
            {
                class: 'am-header-bar-right'
            }
        ]
    });
};


MHeaderBar.prototype.notifyAction = function () {
    this.emit('action', { type: 'action', target: this }, this);
};


MHeaderBar.prototype.notifyCommand = function (commandName) {
    this.emit('command', { type: 'command', target: this, commandName: commandName }, this);
};


MHeaderBar.prototype.showTitle = function (flag) {
    if (!this.$titleCtn && flag) {
        this.$titleCtn = _({
            class: 'am-header-bar-title-ctn',
            child: [
                {
                    class: 'am-header-bar-title',
                    child: { text: 'Phạm Hùng Quốc' }
                },
                {
                    class: 'am-header-bar-title-desc'
                }
            ]
        });

        this.$title = $('.am-header-bar-title', this.$titleCtn);
        this.$titleDesc = $('.am-header-bar-title-desc', this.$titleCtn);
    }
    if (flag) {
        this.insertBefore(this.$titleCtn, this.$right);
    }
    else {
        if (this.$titleCtn) this.$titleCtn.remove();
    }
};

MHeaderBar.prototype.showActionBtn = function (flag) {
    if (!this.$leftBtn && flag) {
        this.$leftBtn = _({
            tag: 'button',
            class: 'am-header-bar-left-btn',
            child: 'span.mdi.mdi-chevron-left'
        });
    }
    if (flag) {
        this.insertBefore(this.$leftBtn, this.firstChild);
    }
    else {
        if (this.$leftBtn) this.$leftBtn.remove();
    }
};


MHeaderBar.prototype.showQuickMenu = function (flag) {
    if (!this.$quickmenuBtn && flag) {
        this.$quickmenuBtn = _({
            tag: 'button',
            class: ['am-header-bar-action', 'am-header-bar-quickmenu-btn'],
            child: {
                class: 'am-header-bar-quickmenu-btn-circle',
                child: 'span.mdi.mdi-dots-horizontal'
            },
        });
    }

    if (flag) {
        this.$right.addChild(this.$quickmenuBtn);
    }
    else {
        if (this.$quickmenuBtn) this.$quickmenuBtn.remove();
    }

};

MHeaderBar.property = {};

/**
 * @type {MHeaderBar}
 */
MHeaderBar.property.quickmenu = {
    set: function (value) {
        if (this._quickmenuHolder) {
            this._quickmenuHolder.remove();
            this._quickmenu = null;
        }
        if (value) {
            this.showQuickMenu(true);
        var button = this.$quickmenuBtn;
            var onClose = value.onClose;
            var onOpen = value.onOpen;
            value.onOpen = function () {
                button.addClass('am-status-active');
                onOpen && onOpen.apply(this, arguments);
            };
            value.onClose = function () {
                button.removeClass('am-status-active');
                onClose && onClose.apply(this, arguments);
            };
            this._quickmenuHolder = QuickMenu.toggleWhenClick(this.$quickmenuBtn, value);
        }
        else {
            this.showQuickMenu(false);
            value = null;
        }
        this._quickmenu = value;
    },
    get: function () {
        return this._quickmenu;
    }
};


/**
 * @type {MHeaderBar}
 */
MHeaderBar.property.title = {
    set: function (value) {
        if (value) {
            value = value + '';
            this.showTitle(true);
            console.log(this.$title.firstChild);

            this.$title.firstChild.data = value;
        }
        else {
            this.showTitle(false);
            value = null;
        }
        this._title = value;
    },
    get: function () {
        return this._title;
    }
};

/**
 * @type {MHeaderBar}
 */
MHeaderBar.property.titleDesc = {
    set: function (value) {
        if (value) {
            value = value + '';
            this.showTitle(true);
            this.$titleDesc.clearChild().addChild(_({ text: value }));
        }
        else {
            this.showTitle(false);
            if (this.$titleDesc) this.$titleDesc.clearChild();
            value = null;
        }
        this._titleDesc = value;
    },
    get: function () {
        return this._titleDesc;
    }
};

/**
 * @type {MHeaderBar}
 */
MHeaderBar.property.actionIcon = {
    set: function (value) {
        if (value) {
            this.showActionBtn(true);
            this.$leftBtn.clearChild()
                .addChild(_(value));
        }
        else {
            this.showActionBtn(false);
            value = null;
        }
        this._actionIcon = value;
    },
    get: function () {
        return this._actionIcon;
    }
};



Core.install('mheaderbar', MHeaderBar);

export default MHeaderBar;