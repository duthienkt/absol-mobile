import BoardTable from "absol-acomp/js/BoardTable";

import Core, { $, _ } from './Core'


/***
 * @extends AElement
 * @constructor
 */
function MCabinetList() {
    this.on('dragitemstart', this.eventHandler.dragItemStart);
}

MCabinetList.tag = 'MCabinetList'.toLowerCase();

MCabinetList.render = function () {
    return _({
        tag: BoardTable.tag,
        class: 'am-cabinet-list'
    });
};

/****
 * @memberOf MCabinetList#
 * @type {{}}
 */
MCabinetList.eventHandler = {};


MCabinetList.eventHandler.dragItemStart = function () {
    var bound = this.getBoundingClientRect();
    this.addStyle('--am-cabinet-list-bound-left', bound.left + 'px');
}

MCabinetList.prototype.getChildren = function () {
    return Array.prototype.slice.call(this.childNodes);
};

MCabinetList.property = {};

MCabinetList.property.draggable = {
    set: function (value) {
        if (value) {
            this.addClass('am-draggable');
        }
        else {
            this.removeClass('am-draggable');
        }
    },
    get: function () {
        return this.hasClass('am-draggable');
    }
};

Core.install(MCabinetList);


export default MCabinetList;