import '../../css/mcircleavatar.css';
import Core from './Core';
var _ = Core._;
var $ = Core.$;


function MCircleAvatar() {
    this._status = 'none';
    this._src = null;
    this.$img = $('.am-circle-avatar-img', this);
}

MCircleAvatar.tag = 'mcircleavatar';
MCircleAvatar.render = function () {
    return _({
        class: ['am-circle-avatar', 'am-status-none'],
        child: ['.am-circle-avatar-img', '.am-circle-avatar-dot']
    });
};


MCircleAvatar.property = {};

/**
 * @type {MCircleAvatar}
 */
MCircleAvatar.property.src = {
    set: function (value) {
        if (value) {
            this.$img.addStyle('background-image', 'url(' + value + ')');
        }
        else {
            value = null;
            this.$img.removeStyle('background-image');
        }
        this._src = value;
    },
    get: function () {
        return this._src;
    }
};

/**
 * @type {MCircleAvatar}
 */
MCircleAvatar.property.status = {
    set: function (value) {
        value = value||'none';
        
        this.removeClass('am-status-'+ this._status);
        this._status = value;
        this.addClass('am-status-'+ this._status);
    },
    get: function () {
        return this._status;
    }
};


Core.install(MCircleAvatar);

export default MCircleAvatar;