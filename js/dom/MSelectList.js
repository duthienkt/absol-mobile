import { measureMaxDescriptionWidth, measureMaxTextWidth } from "absol-acomp/js/SelectList";
import MSelectList from "absol-acomp/js/selectlistbox/MSelectList";

export function measureListSize(items) {
    var descWidth = measureMaxDescriptionWidth(items);
    var textWidth = measureMaxTextWidth(items);
    var width = descWidth + 20 + textWidth + 12 + 15;//padding, margin
    return {
        width: width,
        descWidth: descWidth,
        textWidth: textWidth
    };
}

var itemPool = [];

function onClickItem(event) {
    var thisSL = this.$parent;
    if (thisSL) {
        thisSL.value = this.value;
        thisSL.emit('pressitem', {
            type: 'pressitem',
            target: thisSL,
            itemElt: this,
            value: this.value,
            data: this.data
        });
    }
}

/**
 * @returns {MSelectListItem}
 */
export function makeItem() {
    return _({
        tag: 'mselectlistitem',
        on: {
            click: onClickItem
        }
    });
}

export function requireItem($parent) {
    var item;
    if (itemPool.length > 0) {
        item = itemPool.pop();
    }
    else {
        item = makeItem();
    }
    item.$parent = $parent;
    return item;
}

export function releaseItem(item) {
    item.$parent = null;
    item.attr('class', 'am-selectlist-item');
    item.selected = false;
    itemPool.push(item);
}


export default MSelectList;