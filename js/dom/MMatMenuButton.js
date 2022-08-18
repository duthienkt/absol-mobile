import '../../css/mmatmenu.css';
import Core from './Core';
import MMdiRect from './MMdiRect';
var _ = Core._;
var $ = Core.$;


function MMatMenuButton() {
    this.$toggleIcon = $('.am-mat-menu-button-toggle-icon-ctn span.mdi.mdi-chevron-right', this);
    this.$icon = null;
    this.$iconCtn = $('.am-mat-menu-button-icon-ctn', this);
    this.$text = $('.am-mat-menu-button-text', this);
    this.icon = {
        tag: 'mmdirect',
        props: { iconName: "home" }
    };
    this._status = 'none';
    this._level = 0;
    this.$level = $('.am-mat-menu-button-level', this);
}

MMatMenuButton.tag = 'MMatMenuButton'.toLowerCase();
MMatMenuButton.render = function () {
    return _({
        tag: 'button',
        class: 'am-mat-menu-button',
        child: [
            {
                class: 'am-mat-menu-button-level',
            },
            {
                class: 'am-mat-menu-button-icon-ctn',
            },
            {
                tag: 'span',
                class: 'am-mat-menu-button-text',
                child: { text: 'Trang chủ' }
            },
            {
                class: 'am-mat-menu-button-toggle-icon-ctn',
                child: 'span.mdi.mdi-chevron-right'
            }
        ]
    });
};


MMatMenuButton.property = {};

/**
 * @type {MMatMenuButton}
*/
MMatMenuButton.property.level = {
    set: function (value) {
        value = Math.max(0, value || 0);
        this.$level.innerHTML = '&nbsp;'.repeat(value * 4);
        this.attr('data-level', value);
    },
    get: function () {
        return this._level;
    }
}

/**
 * @type {MMatMenuButton}
*/
MMatMenuButton.property.status = {
    set: function (value) {
        this.removeClass('am-status-open')
            .removeClass('am-status-close');
        if (value == 'open') {
            this.$toggleIcon.addClass('mdi-rotate-90');
            this.addClass('am-status-open');
        }
        else if (value == 'close') {
            this.$toggleIcon.removeClass('mdi-rotate-90');
            this.addClass('am-status-close');
        }
        else {
            value = 'none';
        }
        this._status = value;
    },
    get: function () {
        return this._status;
    }
};

/**
 * @type {MMatMenuButton}
*/
MMatMenuButton.property.icon = {
    set: function (value) {
        value = value || null;
        if (this.$icon) {
            this.$icon.remove();
        }
        if (value) {
            this.$icon = _(value).addTo(this.$iconCtn);
        }
    },
    get: function () {
        return this._icon;
    }
};

/**
 * @type {MMatMenuButton}
*/
MMatMenuButton.property.text = {
    set: function (value) {
        this.$text.firstChild.data = value;
    },
    get: function () {
        return this.$text.firstChild.data;
    }
};


Core.install(MMatMenuButton);

export default MMatMenuButton;