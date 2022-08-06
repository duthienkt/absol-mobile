import '../../css/mmessageinput.css';
import Core from './Core';
import {openFileDialog} from 'absol-acomp/js/utils';
import MMessageTool from "./MMessageTool";


var _ = Core._;
var $ = Core.$;

/***
 * @extends MessageInput
 * @constructor
 */
function MMessageInput() {
    this.autoSend = true;
    this.$left = _('.am-message-input-left').addTo(this);
    this.$moreBtn = _({
        tag: 'button',
        class: ['as-message-input-plugin-btn', 'am-message-input-plugin-more'],
        child: 'span.mdi.mdi-plus'
    }).addTo(this.$left)
        .on('click', this.eventHandler.clickMore);

    this.$cameraBtn = _({
        tag: 'button',
        class: ['as-message-input-plugin-btn', 'am-message-input-plugin-camera'],
        child: 'span.mdi.mdi-camera-outline'
    }).on('click', this.eventHandler.clickCameraBtn);
    this.$right = $('.as-message-input-right', this);
    this.$right.addChildBefore(this.$cameraBtn, this.$fileBtn);

}

MMessageInput.tag = 'mmessageinput';
MMessageInput.render = function (data) {
    return _('messageinput.am-message-input', true);
};

/***
 *
 * @type {{}|MMessageInput}
 */
MMessageInput.eventHandler = {};

MMessageInput.eventHandler.clickCameraBtn = function (event) {
    var thisMi = this;
    openFileDialog('camera').then(function (files) {
        if (files.length > 0) {
            this.notifyAddFiles(files).then(function (files){
                this.handleAddingFileByType(files);
            }.bind(this));
        }
    }.bind(this));
};


MMessageInput.eventHandler.clickMore = function () {
    MMessageTool.open().then(function (result) {
        if (result.type ==='file' || result.type =='image'){
            this.notifyAddFiles(result.files).then(function (files){
                this.handleAddingFileByType(files);
            }.bind(this));
        }
    }.bind(this), function () {
    })
};

Core.install(MMessageInput);
export default MMessageInput;