import '../../css/mnavigatormenu.css';
import Core from './Core';
var _ = Core._;
var $ = Core.$;

function MNavigatorMenu() {
    this.$header = $('.as-m-navigator-menu-body', this);
    this.$body = $('.as-m-navigator-menu-body', this);
    var data = [
        {
            items: [
                {
                    text: 'Trang chủ',
                    icon: 'span.mdi.mdi-home'
                }
            ]
        },
        {
            gname: 'Danh mục',
            items: [
                { text: 'Kiểu dữ liệu', icon: 'span.mdi.mdi-alpha-t-box-outline' },
                { text: 'Bảng', icon: 'span.mdi.mdi-file-table-outline' },
                { text: 'Trạng thái', icon: 'span.mdi.mdi-check' },
                { text: 'Nhóm đối tượng', icon: 'span.mdi.mdi-google-circles-communities' },
                { text: 'Đối tượng', icon: 'span.mdi.mdi-cube-outline' },
                { text: 'Chat', icon: 'span.mdi.mdi-chat-outline' },
                { text: 'Quốc gia', icon: 'span.mdi.mdi-earth' },
                { text: 'Công ty', icon: 'span.mdi.mdi-warehouse' },
                { text: 'Liên hệ', icon: 'span.mdi.mdi-contact-mail' },
                { text: 'Loại', icon: 'span.mdi.mdi-grain' },
            ]
        },
        {
            gname: 'Báo cáo',
            items: [
                { text: 'Báo cáo của tôi', icon: 'span.mdi.mdi-note-text' },
                { text: 'Báo cáo công khai', icon: 'span.mdi.mdi-note-text-outline' },
            ]
        },
        {
            gname: 'Hệ thống',
            items: [
                { text: 'Người dùng', icon: 'span.mdi.mdi-account-outline' },
                { text: 'Hồ sơ cá nhân', icon: 'span.mdi.mdi-file-account' },
                { text: 'Đăng xuất', icon: 'span.mdi.mdi-logout' },
            ]
        }
    ];

    var thismn = this;
    data.forEach(function (gr) {
        thismn.$body.addChild(thismn._makeGroup(gr.gname, gr.items));
    });
}


MNavigatorMenu.render = function () {
    return _({
        tag: 'mleftnavigator',
        class: 'as-m-navigator-menu',
        child: [
            {
                class: 'as-m-navigator-menu-header',
                child: [
                    {
                        class: 'as-m-navigator-menu-avatar-ctn',
                        child: '.as-m-navigator-menu-avatar'
                    },
                    {
                        class: 'as-m-navigator-menu-full-name',
                        child: { text: 'Phạm Quốc Du Thiên' }
                    },
                    {
                        class: 'as-m-navigator-menu-email',
                        child: { text: 'blueskythien2010@live.com' }
                    }
                ]
            },
            {
                class: 'as-m-navigator-menu-body',
                child: [
                ]

            }
        ]
    }, true);
};
/**
 *
                    {
                        class: 'as-m-navigator-menu-group',
                        child: [

                            {
                                class: 'as-m-navigator-menu-item',
                                child: [
                                    {
                                        class: 'as-m-navigator-menu-item-icon-ctn',
                                        child: 'span.mdi.mdi-home'
                                    },
                                    {
                                        tag: 'span',
                                        class: 'as-m-navigator-menu-item-text',
                                        child: { text: 'Trang chủ' }
                                    }
                                ]

                            }
                        ]
                    },
                    {
                        class: 'as-m-navigator-menu-group',
                        child: [
                            {
                                class: 'as-m-navigator-menu-group-name',
                                child: { text: 'Danh mục' }
                            },
                            {
                                class: 'as-m-navigator-menu-item',
                                child: [
                                    {
                                        class: 'as-m-navigator-menu-item-icon-ctn',
                                        child: 'span.mdi.mdi-alpha-t-box-outline'
                                    },
                                    {
                                        tag: 'span',
                                        class: 'as-m-navigator-menu-item-text',
                                        child: { text: 'Kiểu dữ liệu' }
                                    }
                                ]

                            }
                        ]
                    }
 */

MNavigatorMenu.prototype._makeItem = function (icon, text) {
    return _({
        class: 'as-m-navigator-menu-item',
        child: [
            {
                class: 'as-m-navigator-menu-item-icon-ctn',
                child: icon ? icon : []
            },
            {
                tag: 'span',
                class: 'as-m-navigator-menu-item-text',
                child: { text: text }
            }
        ]
    });
};

MNavigatorMenu.prototype._makeGroup = function (groupName, items) {
    var aobj = {
        class: 'as-m-navigator-menu-group',
        child: []
    };//absol object
    if (groupName) {
        aobj.child.push({
            class: 'as-m-navigator-menu-group-name',
            child: { text: groupName + '' }
        })
    };
    var thismn = this;
    aobj.child = aobj.child.concat(items.map(function (item) {
        return thismn._makeItem(item.icon, item.text);
    }));

    return _(aobj);
};

MNavigatorMenu.property = {};


/**
 * @type {MNavigatorMenu}
 */
MNavigatorMenu.property.headerBackgroundSrc = {
    set: function () {

    },
    get: function () {

    }
};

/**
 * @type {MNavigatorMenu}
 */
MNavigatorMenu.property.avatarSrc = {
    set: function () {

    },
    get: function () {

    }
}


Core.install('mnavigatormenu', MNavigatorMenu);

export default MNavigatorMenu;