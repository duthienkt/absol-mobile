import '../../css/mmessageinput.css';
import Core from './Core';
import MessageInput from 'absol-acomp/js/MessageInput';
import {openFileDialog} from 'absol-acomp/js/utils';

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
    }).addTo(this.$left);
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
            var imageFiles = [];
            var otherFiles = [];
            var file;
            for (var i = 0; i < files.length; ++i) {
                file = files[i];
                if (!!file.type && file.type.match && file.type.match(/^image\//)) {
                    imageFiles.push(file);
                }
                else {
                    otherFiles.push(file);
                }
            }
            if (imageFiles.length > 0) {
                thisMi.addImageFiles(imageFiles);
                thisMi.images = imageFiles;
            }
            if (otherFiles.length > 0) {
                thisMi.addFiles(otherFiles);
            }
            thisMi.notifyChange();
        }
    });
};

Core.install(MMessageInput);
export default MMessageInput;