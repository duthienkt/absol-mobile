import '../../css/mtinyprofileblock.css';
import Core from './Core';
var _ = Core._;
var $ = Core.$;

function MTinyProfileBlock() {
    this._avatarSrc = '';
    this.$name = $('.am-tiny-profile-block-name', this);
    this.$desc = $('.am-tiny-profile-block-desc', this);
    this.$avatar = $('.am-tiny-profile-block-avatar', this);
}

MTinyProfileBlock.render = function () {
    return _({
        class: 'am-tiny-profile-block',
        extendEvent: 'change',
        child: [
            {
                class: 'am-tiny-profile-block-avatar'
            },
            {
                class: 'am-tiny-profile-block-text-ctn',
                child: [
                    {
                        class: 'am-tiny-profile-block-name',
                        child: { text: 'Pham Quoc Du Thien' }
                    },
                    {
                        class: 'am-tiny-profile-block-desc',
                        child: { text: 'View your profile' }
                    }
                ]
            }

        ]
    });
};

MTinyProfileBlock.property = {};

/**
 * @type {MTinyProfileBlock}
 */
MTinyProfileBlock.property.desc = {
    set: function (value) {
        this.$desc.firstChild.data = value + '';
    },
    get: function () {
        return this.$desc.firstChild.data;
    }
};

/**
 * @type {MTinyProfileBlock}
 */
MTinyProfileBlock.property.name = {
    set: function (value) {
        this.$name.firstChild.data = value + '';
    },
    get: function () {
        return this.$name.firstChild.data;
    }
};


/**
 * @type {MTinyProfileBlock}
 */
MTinyProfileBlock.property.avatarSrc = {
    set: function (value) {
        value = value +'';
        this._avatarSrc = value;
        this.$avatar.addStyle('background-image', 'url(' + value + ')')
    },
    get: function () {
        return this._avatarSrc;
    }
};



Core.install('MTinyProfileBlock'.toLowerCase(), MTinyProfileBlock);

export default MTinyProfileBlock;