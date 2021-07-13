import Core from "./Core";
import '../../css/mmessagetool.css'
import Dom from "absol/src/HTML5/Dom";
import {openFileDialog} from "absol-acomp/js/utils";
import AElement from "absol/src/HTML5/AElement";
import {randomIdent} from "absol/src/String/stringGenerate";

var _ = Core._;
var $ = Core.$;

var supportContactPicker = ('contacts' in navigator && 'ContactsManager' in window) && false;//disable until done


/***
 * @extends AElement
 * @constructor
 */
function MMessageTool() {
    this.$contactPicker = $('.am-message-tool-contact-picker', this);
    if (!supportContactPicker) {
        this.$contactPicker.remove();
        // this.$contactPicker.addStyle('display', 'none');
    }

    this.$image = $('.am-message-tool-image', this)
        .on('click', this.openImages.bind(this));
    this.$video = $('.am-message-tool-video', this)
        .on('click', this.openVideos.bind(this));
    this.$file = $('.am-message-tool-file', this)
        .on('click', this.openFiles.bind(this));

    this.$closeBtn = $('.am-message-tool-header-close-btn', this)
        .on('click', this.notifyClose.bind(this));
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
        extendEvent: ['pressclose', 'resolve'],
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
                            makePlugin({
                                class: 'am-message-tool-image',
                                name: "Ảnh",
                                desc: "Chia sẻ ảnh",
                                icon: 'span.mdi.mdi-file-image-outline'
                            }),
                            makePlugin({
                                class: 'am-message-tool-video',
                                name: "Video",
                                desc: "Chia sẻ video",
                                icon: 'span.mdi.mdi-file-video-outline'
                            }),
                            makePlugin({
                                class: 'am-message-tool-file',
                                name: "Tệp", desc: "Chia sẻ tệp",
                                icon: 'span.mdi.mdi-file-outline'
                            }),
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



MMessageTool.prototype.openImages = function () {
    var thisMT = this;
    return openFileDialog({ multiple: true, accept: "image/*" }).then(function (files) {
        if (files && files.length > 0) {
            thisMT.notifyResolve({ type: 'image', files: files });
        }
        else {
            thisMT.notifyClose();
        }
    });
};


MMessageTool.prototype.openVideos = function () {
    var thisMT = this;
    openFileDialog({ multiple: true, accept: "video/*" }).then(function (files) {
        console.log('resolve', files);
        if (files && files.length > 0) {
            thisMT.notifyResolve({ type: 'video', files: files });
        }
        else {
            thisMT.notifyClose();
        }
    });
};


MMessageTool.prototype.openFiles = function () {
    var thisMT = this;
    return openFileDialog({ multiple: true }).then(function (files) {
        if (files && files.length > 0) {
            thisMT.notifyResolve({ type: 'file', files: files });
        }
        else {
            thisMT.notifyClose();

        }
    });
};

MMessageTool.prototype.notifyClose = function () {
    this.emit('pressclose', { type: 'pressclose', target: this }, this);
};

MMessageTool.prototype.notifyResolve = function (value) {
    this.emit('resolve', { type: 'resolve', target: this , value: value}, this);
};


Core.install(MMessageTool);


MMessageTool.$share = _('mmessagetool');
MMessageTool.resolveCB = null;
MMessageTool.rejectCB = null;
MMessageTool.currentSession = null;
MMessageTool._closeTimeout = -1;

MMessageTool.open = function () {
    if (MMessageTool._closeTimeout >= 0) {
        clearTimeout(MMessageTool._closeTimeout);
        MMessageTool._closeTimeout = -1;
    }
    if (typeof MMessageTool.resolveCB == "function") {
        MMessageTool.rejectCB();
        MMessageTool.resolveCB = null;
        MMessageTool.rejectCB = null;
    }

    // MMessageTool.$share
    MMessageTool.$share.addStyle('visibility', 'hidden')
    MMessageTool.$share.addClass('am-hiding');
    setTimeout(function () {
        MMessageTool.$share.removeStyle('visibility')

        MMessageTool.$share.removeClass('am-hiding');
    }, 1)
    MMessageTool.$share.addTo(document.body);
    var ss = randomIdent(20);
    return new Promise(function (rs, rj) {
        MMessageTool.currentSession = ss;
        MMessageTool.resolveCB = rs;
        MMessageTool.rejectCB = rj;

        function finish() {
            MMessageTool.$share.off('pressclose', pressClose);
            MMessageTool.$share.off('resolve', resolve);

            if (MMessageTool.currentSession !== ss) return;
            MMessageTool.resolveCB = null;
            MMessageTool.resolveCB = null;
            MMessageTool.rejectCB = null;
            MMessageTool.$share.addClass('am-hiding');
            MMessageTool._closeTimeout = setTimeout(function () {
                MMessageTool.$share.remove();
            }, 250);
            if (arguments.length === 0) {
                rj();
            }
            else {
                rs(arguments[0]);
            }
        }

        function pressClose() {
            finish();
        }

        function resolve(event){
            finish(event.value)
        }

        MMessageTool.$share.on('pressclose', pressClose);
        MMessageTool.$share.on('resolve', resolve);


    });

};

export default MMessageTool;

