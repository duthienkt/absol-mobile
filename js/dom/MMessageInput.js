import '../../css/mmessageinput.css';
import Core from './Core';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import MessageInput from 'absol-acomp/js/MessageInput';
import { openFileDialog } from 'absol-acomp/js/utils';
import EventEmitter from 'absol/src/HTML5/EventEmitter';
var _ = Core._;
var $ = Core.$;


function MMessageInput() {
    this._latBound = { width: 0, height: 0 };
    this._state = null;
    this._mode = 'new';
    this.$preInput = $('preinput', this)
        .attr('type', 'url')
        .on('change', this.eventHandler.preInputChange)
        .on('keydown', this.eventHandler.preInputKeyDown);
    this.$cameraBtn = $('.am-message-input-plugin-camera', this)
        .on('click', this.eventHandler.clickCameraBtn);
    this.$fileBtn = $('.am-message-input-plugin-file', this)
        .on('click', this.eventHandler.clickFileBtn);
    this.$imageBtn = $('.am-message-input-plugin-image', this)
        .on('click', this.eventHandler.clickImageBtn);
    this.$sendBtn = $('.am-message-input-plugin-send', this)
        .on('click', this.eventHandler.clickSendBtn);
    this.$cancelBtn = $('.am-message-input-plugin-cancel', this)
        .on('click', this.eventHandler.clickCancelBtn);

    this.$emojiBtn = $('.am-message-input-plugin-emoji', this)
        .on('click', this.eventHandler.clickEmojiBtn);

    this.$attachhook = _('attachhook').addTo(this).on('error', this.notifySizeChange.bind(this));

    this.files = [];
    this.images = [];
    this._editingText = null;
}

MMessageInput.tag = 'mmessageinput';
MMessageInput.render = function (data) {
    data = data || {};
    data.iconAssetRoot = data.iconAssetRoot || MMessageInput.iconAssetRoot || MessageInput.iconAssetRoot;
    return _({
        class: 'am-message-input',
        extendEvent: ['sendtext', 'sendimage', 'sendfile', 'cancel', 'change', 'sizechange', 'send'],
        child: [
            {
                class: 'am-message-input-right',
                child: [
                    {
                        tag: 'button',
                        class: ['am-message-input-plugin-btn', 'am-message-input-plugin-file'],
                        child: 'span.mdi.mdi-attachment.mdi-rotate-90'
                    },
                    {
                        tag: 'button',
                        class: ['am-message-input-plugin-btn', 'am-message-input-plugin-image'],
                        child: 'span.mdi.mdi-file-image-outline'
                    },
                    {
                        tag: 'button',
                        class: ['am-message-input-plugin-btn', 'am-message-input-plugin-camera'],
                        child: 'span.mdi.mdi-camera'
                    },
                    {
                        tag: 'button',
                        class: ['am-message-input-plugin-btn', 'am-message-input-plugin-send'],
                        child: 'span.mdi.mdi-send'
                    },
                    {
                        tag: 'button',
                        class: ['am-message-input-plugin-btn', 'am-message-input-plugin-cancel'],
                        child: 'span.mdi.mdi-close'
                    }
                ]
            },
            {
                class: 'am-message-input-left',
                child: {
                    tag: 'button',
                    class: ['am-message-input-plugin-btn', 'am-message-input-plugin-emoji'],
                    child: 'span.mdi.mdi-emoticon-happy-outline'
                }
            },
            {
                class: 'am-message-input-pre-ctn',
                child: 'preinput.am-message-input-pre.absol-bscroller'
            }
        ]
    });
};

MMessageInput.$emojiPickerCtn = null;
MMessageInput.$emojiPicker = null;

MMessageInput.prepare = function () {
    if (MMessageInput.$emojiPickerCtn) return;
    MMessageInput.$emojiPickerCtn = _('.am-message-input-emoji-picker-ctn');
    MMessageInput.$emojiPicker = _('emojipicker').addTo(MMessageInput.$emojiPickerCtn);
};



MMessageInput.prototype._activeState = function (mode) {
    if (this._state == mode) return;
    if (this._state)
        this.removeClass('am-state-' + this._state);
    this._state = mode;
    if (this._state)
        this.addClass('am-state-' + this._state);
};



MMessageInput.prototype.notifySizeChange = function () {
    var bound = this.getBoundingClientRect();
    if (this._latBound.width != bound.width || this._latBound.height != bound.height) {
        this._latBound.width = bound.width;
        this._latBound.height = bound.height;
        this.emit('sizechange', { name: 'sizechange', bound: bound, target: this }, this);
    }
};



MMessageInput.prototype.toggleEmoji = function () {
    if (this.containsClass('am-message-input-show-emoji'))
        this.closeEmoji();
    else
        this.showEmoji();
};


MMessageInput.prototype.showEmoji = function () {
    if (this.containsClass('am-message-input-show-emoji')) return;
    MMessageInput.prepare();
    this.addChild(MMessageInput.$emojiPickerCtn);
    MMessageInput.$emojiPicker.on('pick', this.eventHandler.pickEmoji);
    var value = this.$preInput.value;
    this._lastInputSelectPosion = this.$preInput.getSelectPosition() || { start: value.length, end: value.length };
    this.addClass('am-message-input-show-emoji');
    var thisMi = this;
    setTimeout(function () {
        $(document.body).on('mousedown', thisMi.eventHandler.mousedownOutEmoji);
    }, 100);
    this.$preInput.focus();
};


MMessageInput.prototype.closeEmoji = function () {
    if (!this.containsClass('am-message-input-show-emoji')) return;
    this.removeClass('am-message-input-show-emoji');
    MMessageInput.$emojiPicker.off('pick', this.eventHandler.pickEmoji);

    MMessageInput.$emojiPickerCtn.remove();
    $(document.body).off('mousedown', this.eventHandler.mousedownOutEmoji);
};


MMessageInput.prototype.notifySendText = function () {
    var eventData = {
        target: this,
        value: this.$preInput.value,
        type: 'sendtext',
        prevented: false,
        preventDefault: function () {
            this.prevented = true;
        }
    };
    this.emit('sendtext', eventData, this);
    this.notifySend();
    if (!eventData.prevented)
        this.$preInput.value = '';
};

MMessageInput.prototype.notifySendImages = function () {
    var eventData = {
        target: this,
        value: this.images,
        type: 'sendimage',
        prevented: false,
        preventDefault: function () {
            this.prevented = true;
        }
    };
    this.emit('sendimage', eventData, this);
    this.notifySend();
    if (!eventData.prevented)
        this.images = [];
};

MMessageInput.prototype.notifySendFiles = function () {
    var eventData = {
        target: this,
        value: this.files,
        type: 'sendfile',
        prevented: false,
        preventDefault: function () {
            this.prevented = true;
        }
    };
    this.emit('sendfile', eventData, this);
    this.notifySend();
    if (!eventData.prevented)
        this.files = [];
};

MMessageInput.prototype.notifyChange = function (text) {
    this.emit('change', { name: 'change', target: this, text: text || this.$preInput.value }, this);
};

MMessageInput.property = {};

/**
 * @type {MMessageInput}
 */
MMessageInput.property.text = {
    set: function (value) {
        value = value || '';
        this.eventHandler.preInputChange({ value: value });
        this.$preInput.value = value;
        if (this._state == 'edit') {
            this.removeClass('am-edited');
            this._editingText = value;
        }
    },
    get: function () {
        return this.$preInput.value;
    }
};



/**
 * @type {MMessageInput}
 */
MMessageInput.property.mode = {
    set: function (value) {
        if (value == 'edit') {
            this.addClass('am-mode-edit');
            this._editingText = this.text;
            this.removeClass('am-edited');
        }
        else {
            value = 'new';
            this.removeClass('am-mode-edit');
        }
        this._mode = value;
    },
    get: function () {
        return this._mode;
    }
};


/**
 * @type {MMessageInput}
 */
MMessageInput.eventHandler = {};

MMessageInput.eventHandler.preInputChange = function (event) {
    var value = event.value;
    if (value.length > 0) {
        if (this._mode == 'edit') {
            if (this._editingText == value)
                this.removeClass('am-edited');
            else
                this.addClass('am-edited');
        }
        this._activeState('text');
    }
    else {
        if (this._mode == 'edit') {
            this.removeClass('am-edited');
        }
        this._activeState(null);
    }
    this.notifySizeChange();
    if (event)
        this.notifyChange(value);
};


MMessageInput.eventHandler.preInputKeyDown = function (event) {
    this.closeEmoji();
    //still accept enter 
    // if (!event.shiftKey && event.key == 'Enter') {
    //     this.notifySend();
    //     event.preventDefault();
    // }
    // else if (event.key == "Escape" && this._mode == 'edit') {
    //     this.notifyCancel();
    //     event.preventDefault();
    // }
    // setTimeout(this.notifySizeChange.bind(this), 1);
};


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
                thisMi.images = imageFiles;
                thisMi.notifySendImages();
            }
            if (otherFiles.length > 0) {
                thisMi.files = otherFiles;
                thisMi.notifySendFiles();
            }
        }
    });
};

MMessageInput.eventHandler.clickSendBtn = function (event) {
    this.notifySendText();
};


MMessageInput.prototype.notifySend = function () {
    this.emit('send', {
        name: 'send', target: this, clearAllContent: this.clearAllContent.bind(this)
    }, this);
};

MMessageInput.prototype.notifyCancel = function () {
    this.emit('cancel', {
        name: 'cancel', target: this, clearAllContent: this.clearAllContent.bind(this)
    }, this);
};

MMessageInput.prototype.clearAllContent = function () {
    this.text = '';
    this.files = [];
    this.images = [];
};

MMessageInput.eventHandler.clickFileBtn = function (event) {
    var thisMi = this;
    openFileDialog({ multiple: true }).then(function (files) {
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
                thisMi.images = imageFiles;
                thisMi.notifySendImages();
            }
            if (otherFiles.length > 0) {
                thisMi.files = otherFiles;
                thisMi.notifySendFiles();
            }
        }
    });
};

MMessageInput.eventHandler.clickImageBtn = function (event) {
    var thisMi = this;
    openFileDialog({ multiple: true, accept: 'image/*' }).then(function (files) {
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
                thisMi.images = imageFiles;
                thisMi.notifySendImages();
            }
            if (otherFiles.length > 0) {
                thisMi.files = otherFiles;
                thisMi.notifySendFiles();
            }
        }
    });
};



MMessageInput.eventHandler.clickEmojiBtn = function () {
    this.toggleEmoji();
};

MMessageInput.eventHandler.clickCancelBtn = function () {
    this.notifyCancel();
};




MMessageInput.eventHandler.mousedownOutEmoji = function (event) {
    var thisMi = this;
    if (EventEmitter.hitElement(this.$preInput, event)) {
        setTimeout(function () {
            thisMi._lastInputSelectPosion = thisMi.$preInput.getSelectPosition() || { start: value.length, end: value.length };
        }, 1);
    }
    if (EventEmitter.hitElement(MMessageInput.$emojiPicker, event) || EventEmitter.hitElement(this.$emojiBtn, event) || EventEmitter.hitElement(this.$preInput, event)) return;
    this.closeEmoji();
};

MMessageInput.eventHandler.pickEmoji = function (event) {
    var text = this.$preInput.value;
    var newText = text.substr(0, this._lastInputSelectPosion.start) + event.key + text.substr(this._lastInputSelectPosion.end);
    var selected = this._lastInputSelectPosion;
    var newOffset = selected.start + event.key.length;
    this._lastInputSelectPosion = { start: newOffset, end: newOffset };
    this.$preInput.applyData(newText, newOffset);
    this.$preInput.commitChange(newText, newOffset);
    this.notifySizeChange();
    this.$preInput.focus();//older firefox version will be lost focus
};




Core.install(MMessageInput);
export default MMessageInput;