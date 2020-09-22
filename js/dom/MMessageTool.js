import Core from "./Core";
import '../../css/mmessagetool.css'
import Dom from "absol/src/HTML5/Dom";

var _ = Core._;
var $ = Core.$;

var supportContactPicker = ('contacts' in navigator && 'ContactsManager' in window);

function MMessageTool() {
    this.$contactPicker = $('.am-message-tool-contact-picker', this);
    if (supportContactPicker) {

    }
    else {
        this.$contactPicker.addStyle('display', 'none');
    }
}

MMessageTool.tag = 'MMessageTool'.toLowerCase();


function makePlugin(data) {
    return {
        class: ['am-message-tool-plugin'].concat(data.class ? [data.class] : []),
        child: [
            {
                class: 'am-message-tool-plugin-icon-ctn',
                child: data.icon
            },
            {
                class: 'am-message-tool-plugin-content',
                child: [
                    {
                        class: 'am-message-tool-plugin-name',
                        child: { text: data.name }
                    }, {
                        class: 'am-message-tool-plugin-desc',
                        child: { text: data.desc }
                    }
                ]

            }
        ]
    }
}

MMessageTool.render = function () {

    return _({
        class: 'am-message-tool',
        child: [
            {
                class: 'am-message-tool-box',
                child: [
                    {
                        class: 'am-message-tool-header',
                        child: [
                            {
                                class: 'am-message-tool-header-close-btn-ctn',
                                child: {
                                    tag: 'button',
                                    class: 'am-message-tool-header-close-btn',
                                    child: 'span.mdi.mdi-close'
                                }
                            }, {
                                class: 'am-message-tool-title',
                                child: { text: this.prototype.titleText }
                            }
                        ]

                    },
                    {
                        class: 'am-message-tool-body',
                        child: [
                            makePlugin({ name: "Ảnh", desc: "Chia sẻ ảnh", icon: 'span.mdi.mdi-file-image-outline' }),
                            makePlugin({
                                name: "Video",
                                desc: "Chia sẻ video",
                                icon: 'span.mdi.mdi-file-video-outline'
                            }),
                            makePlugin({ name: "Tệp", desc: "Chia sẻ tệp", icon: 'span.mdi.mdi-file-outline' }),
                            makePlugin({
                                class: 'am-message-tool-contact-picker',
                                name: "Liên hệ",
                                desc: "Chia sẻ liên hệ từ danh bạ",
                                icon: 'span.mdi.mdi-account-box-outline'
                            })
                        ]

                    }
                ]
            },

        ]
    });
};

MMessageTool.prototype.titleText = "Nội dung và công cụ";


Core.install(MMessageTool);


MMessageTool.$share = _('mmessagetool');

MMessageTool.show = function () {
    MMessageTool.$share.addTo(document.body);
};


/**
 *
 */
MMessageTool.close = function (token) {

};

Dom.documentReady.then(function () {
    MMessageTool.show();
})
export default MMessageTool;
