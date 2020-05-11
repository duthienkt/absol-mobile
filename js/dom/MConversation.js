import '../../css/mconversation.css';
import Core from './Core';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import OOP from 'absol/src/HTML5/OOP';
var _ = Core._;
var $ = Core.$;

function MConversation() {
    this._name = '';
    this._shortContent = '';
    this._time = '';
    this._avatarSrc = null;
    this.$name = $('.am-conversation-name', this);
    this.$shortContent = $('.am-conversation-short-content', this);
    this.$time = $('span.am-conversation-time', this);
    this.$counter = $('.am-conversation-counter', this);
    this.$avatar = $('.am-conversation-avatar', this);
    OOP.drillProperty(this, this.$counter, 'counter', 'innerHTML');
    OOP.drillProperty(this, this.$avatar, 'avatarSrc', 'src');
    OOP.drillProperty(this, this.$avatar, 'onlineStatus', 'status');
}

MConversation.render = function () {
    return _({
        class: 'am-conversation',
        child: [
            {
                class:'am-conversation-avatar-ctn',
                child: 'mcircleavatar.am-conversation-avatar'
            },
            {
                class: 'am-conversation-body',
                child: [
                    '.am-conversation-name',
                    '.am-conversation-short-content',
                ]

            },
            {
                class: 'am-conversation-time-ctn',
                child: 'span.am-conversation-time'
            },
            {
                class: 'am-conversation-counter'
            },
            '.am-conversation-bottom-line'
        ]
    });
};


MConversation.property = {};

/**
 * @type {MConversation}
 */
MConversation.property.name = {
    set: function (value) {
        value = value || '';
        this.$name.clearChild();
        if (value) {
            this.$name.addChild(_({ text: value }))
        }
        this._name = value;
    },
    get: function () {
        return this._name;
    }
};


/**
 * @type {MConversation}
 */
MConversation.property.time = {
    set: function (value) {
        value = value || '';
        this.$time.clearChild().addChild(_({ text: value }))
        this._time = value;
    },
    get: function () {
        return this._time;
    }
};

/**
 * @type {MConversation}
 */
MConversation.property.shortContent = {
    set: function (value) {
        if (typeof value == 'object') {
            this.$shortContent.clearChild().addChild(_(value));
        }
        else {
            this.$shortContent.innerHTML = value + '';
        }
        this._shortContent = value;
    },
    get: function () {
        return this._shortContent;
    }
};

/**
 * @type {MConversation}
 */
MConversation.property.unread = {
    set: function (value) {
        if (value) {
            this.addClass('am-status-unread');
        }
        else {
            this.removeClass('am-status-unread');

        }
    },
    get: function () {
        return this.containsClass('am-status-unread')
    }
};


Core.install('MConversation'.toLowerCase(), MConversation);


export default MConversation;