import '../../css/mmdirect.css';
import Core from './Core';
var _ = Core._;
var $ = Core.$;


function MMdiRect() {
    this.$icon = $('.am-mdi-rect-icon', this);
    this._iconName = undefined;
}

MMdiRect.tag = 'MMdiRect'.toLowerCase();
MMdiRect.render = function () {
    return _({
        class: 'am-mdi-rect',
        child: 'span.mdi.am-mdi-rect-icon'
    });
};


MMdiRect.property = {};

/**
 * @type {MMdiRect}
 */
MMdiRect.property.iconName = {
    set: function (value) {
        value = value || null;
        if (this._iconName)
            this.$icon.removeClass('mdi-' + this._iconName);
        this._iconName = value;
        if (this._iconName)
            this.$icon.addClass('mdi-' + this._iconName);
    },
    get: function () {
        return this._iconName;
    }
};


MMdiRect.attribute = {};

MMdiRect.attribute.iconName = {
    set: function (value) {
        this.iconName = value;
    },
    get: function () {
        return this.iconName;
    },
    remove: function () {
        this.iconName = undefined;
    }
};

Core.install(MMdiRect);

export default MMdiRect;