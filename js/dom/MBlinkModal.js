import '../../css/mblinkmodal.css';
import Core from "./Core";
import Dom from "absol/src/HTML5/Dom";

var _ = Core._;
var $ = Core.$;

/***
 * extends {AElement}
 * @constructor
 */
function MBlinkModal() {
    this.$attachhook = _('attachhook');
    this.$attachhook.requestUpdateSize = this.updateSize.bind(this);
    this.$attachhook.addTo(this)
        .on('error', function () {
            Dom.addToResizeSystem(this);
            this.requestUpdateSize();
        });
    this._show = false;
    this.show = false;
}


MBlinkModal.tag = 'MBlinkModal'.toLowerCase();
MBlinkModal.render = function () {
    return _({
        class: 'am-blink-modal'
    });
};

MBlinkModal.prototype.clearChild = function () {
    var child = Array.prototype.slice(this.childNodes);
};

MBlinkModal.prototype.updateSize = function () {
    this.removeClass('am-animation');
    var bound = this.getBoundingClientRect();
    this.addStyle('--hide-top', -(bound.height + 2) + 'px');
    this.addClass('am-animation');
}

MBlinkModal.property = {};

MBlinkModal.property.show = {
    set: function (value) {
        this._show = !!value;
        if (this._show) {
            this.addClass('am-show');
        }
        else {
            this.removeClass('am-show');
        }
    },
    get: function () {
        return this._show;
    }
};


MBlinkModal.newInstance = function (instanceData) {
    instanceData = instanceData || {};
    instanceData.duration = instanceData.duration || 2000;
    var modal = _(Object.assign({
        tag: 'mblinkmodal',
    }, instanceData || {}));

    var state = 0;//not attach

    function waitToRemove() {
        setTimeout(function () {
            if (state !== 3) return;
            state = 4;
            modal.selfRemove();
        }, 300);
    }

    function waitToShow() {
        setTimeout(function () {
            if (state !== 1) return;
            state = 2;
            modal.show = true;
            waitToClose(instanceData.duration);
        }, 1);
    }

    function waitToClose(mil) {
        if (state === 2) {
            setTimeout(function () {
                if (state !== 2) return;
                state = 3;
                modal.show = false;
                waitToRemove();
            }, mil);
        }
    }

    modal.addTo(document.body);
    modal.$attachhook.once('attached', function () {
        state = 1;//attached
        waitToShow();
    });

    return {
        modal: modal,
        close: waitToClose.bind(null, 100)
    };
};

Core.install(MBlinkModal);


export default MBlinkModal;
