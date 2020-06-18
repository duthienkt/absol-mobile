//todo
import 'absol/src/absol';
import 'absol-acomp/dev';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';
import Dom from 'absol/src/HTML5/Dom';
import MTabApplication from './js/mobile_app/MTabApplication';
import MTabActivity from './js/mobile_app/MTabActivity';
import MActivity from './js/mobile_app/MActivity';
import install from './js/dom/install';


install(absol.coreDom);

Object.assign(absol, {
    MTabApplication: MTabApplication,
    MTabActivity: MTabActivity,
    MActivity: MActivity
});

if (BrowserDetector.isMobile) Dom.documentReady.then(function () {
    document.body.classList.add('am-mobile-theme');
});

