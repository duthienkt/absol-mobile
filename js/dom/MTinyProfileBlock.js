import '../../css/mtinyprofileblock.css';
import Core from './Core';
import Dom from 'absol/src/HTML5/Dom';
var _ = Core._;
var $ = Core.$;

function MTinyProfileBlock() {
    this._avatarScr = '';
    this.$name = $('.as-m-tiny-profile-block-name', this);
    this.$desc = $('.as-m-tiny-profile-block-desc', this);
    this.$avatar = $('.as-m-tiny-profile-block-avatar', this);
}

MTinyProfileBlock.render = function () {
    return _({
        class: 'as-m-tiny-profile-block',
        extendEvent: 'change',
        child: [
            {
                class: 'as-m-tiny-profile-block-avatar'
            },
            {
                class: 'as-m-tiny-profile-block-text-ctn',
                child: [
                    {
                        class: 'as-m-tiny-profile-block-name',
                        child: { text: 'Pham Quoc Du Thien' }
                    },
                    {
                        class: 'as-m-tiny-profile-block-desc',
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
        this._avatarScr = value;
        this.$avatar.addStyle('background-image', 'url(' + value + ')')
    },
    get: function () {
        return this._avatarScr;
    }
};



Core.install('MTinyProfileBlock'.toLowerCase(), MTinyProfileBlock);

export default MTinyProfileBlock;