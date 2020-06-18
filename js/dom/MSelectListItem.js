import '../../css/mselectlistitem.css';
import Core from './Core';
import QuickMenu from 'absol-acomp/js/QuickMenu';
import OOP from 'absol/src/HTML5/OOP';
import SelectListItem from 'absol-acomp/js/SelectListItem';
var _ = Core._;
var $ = Core.$;


function MSelectListItem() {
    this.$textCtn = $('.am-selectlist-item-text-ctn', this);
    this.$text = $('span.am-selectlist-item-text', this);
    this.$textValue = this.$text.childNodes[0];
    this.$descCtn = $('.am-selectlist-item-desc-ctn', this);
    this.$desc = $('span.am-selectlist-item-desc', this.$descCtn);
    this.$descValue = this.$desc.childNodes[0];
    this._extendClasses = [];
    this._extendStyle = {};
    this._data = "";
    this._level = 0;
    return this;
}

MSelectListItem.tag = 'MSelectListItem'.toLowerCase();
MSelectListItem.render = function () {
    return _({
        class: 'am-selectlist-item',
        child: [
            {
                class: 'am-selectlist-item-text-ctn',
                child: {
                    tag: 'span',
                    class: 'am-selectlist-item-text',
                    child: { text: '' }
                }
            },
            {
                class: 'am-selectlist-item-desc-ctn',
                child: {
                    tag: 'span',
                    class: 'am-selectlist-item-desc',
                    child: { text: '' }
                }
            }
        ]
    });
}

MSelectListItem.property = Object.assign({}, SelectListItem.property);


MSelectListItem.property.extendClasses = SelectListItem.property.extendClasses;
MSelectListItem.property.extendStyle = SelectListItem.property.extendStyle;



MSelectListItem.property.level = {
    set: function (value) {
        value = value || 0;
        this._level = value;
        this.$text.addStyle('margin-left', value * 0.9 + 'em');
    },
    get: function () {
        return this._level;
    }
};


// MSelectListItem.property.lastInGroup = {
//     set: function (value) {
//         if (value) {
//             this.addClass('as-last-in-group');
//         }
//         else {
//             this.removeClass('as-last-in-group');
//         }
//     },
//     get: function () {
//         return this.containsClass('as-last-in-group');
//     }
// };

Core.install(MSelectListItem);

export default MSelectListItem;