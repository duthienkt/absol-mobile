//todo
import 'absol/src/absol';
import 'absol-acomp/dev';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';
import Dom from 'absol/src/HTML5/Dom';
import MTabApplication from './js/mobile_app/MTabApplication';
import MTabActivity from './js/mobile_app/MTabActivity';
import MActivity from './js/mobile_app/MActivity';
import install from './js/dom/install';
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import AElement from "absol/src/HTML5/AElement";


install(absol.coreDom);

Object.assign(absol, {
    MTabApplication: MTabApplication,
    MTabActivity: MTabActivity,
    MActivity: MActivity
});

if (BrowserDetector.isMobile) Dom.documentReady.then(function () {
    document.body.classList.add('am-mobile-theme');
    var bodySizeHookElt = _('attachhook').on('attached', function () {
        ResizeSystem.add(this);
        this.requestUpdateSize();
    });
    bodySizeHookElt.requestUpdateSize = function () {
        var bodyBound = document.body.getBoundingClientRect();
        document.body.style.setProperty('--body-width', bodyBound.width + 'px');
        document.body.style.setProperty('--body-height', bodyBound.height + 'px');
    };
    document.body.appendChild(bodySizeHookElt)
});


