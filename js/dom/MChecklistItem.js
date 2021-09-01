import Core, {_, $} from "./Core";
import MSelectListItem from "./MSelectListItem";
import CheckboxButton from "absol-acomp/js/CheckboxButton";
import '../../css/mchecklist.css';
import CheckListItem from "absol-acomp/js/CheckListItem";

/****
 * @extends MSelectListItem
 * @constructor
 */
function MChecklistItem() {
    this.$checkbox = $('.am-selectlist-item-check-ctn > '+CheckboxButton.tag, this)
        .on('change', this.eventHandler.checkboxChange);
    MSelectListItem.call(this);
    this.on('click', this.eventHandler.clickText);
}


MChecklistItem.tag = 'MChecklistItem'.toLowerCase();
MChecklistItem.property = Object.assign({}, MSelectListItem.property);

MChecklistItem.render = function () {
    return _({
        extendEvent:['change', 'select'],
        class: 'am-selectlist-item',
        child: [
            {
                class: 'am-selectlist-item-check-ctn',
                child: {
                    tag: CheckboxButton.tag
                }
            },
            {
                class: 'am-selectlist-item-text-ctn',
                child: {
                    tag: 'span',
                    class: 'am-selectlist-item-text',
                    child: {text: ''}
                }
            },
            {
                class: 'am-selectlist-item-desc-ctn',
                child: {
                    tag: 'span',
                    class: 'am-selectlist-item-desc',
                    child: {text: ''}
                }
            }
        ]
    });
};


MChecklistItem.eventHandler = {};

MChecklistItem.eventHandler.clickText = CheckListItem.eventHandler.clickText

MChecklistItem.eventHandler.checkboxChange =  CheckListItem.eventHandler.checkboxChange;

MChecklistItem.property.selected = CheckListItem.property.selected;

Core.install(MChecklistItem);

export default MChecklistItem;