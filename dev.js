//todo
import 'absol/src/absol';
import 'absol-acomp/dev';
import MLeftNavigator from './js/dom/MLeftNavigator';
import MNavigatorMenu from './js/dom/MNavigatorMenu';
import MBottomTabbar from './js/dom/MBottomTabbar';
import MTinyProfileBlock from './js/dom/MTinyProfileBlock';
import MMatMenuButton from './js/dom/MMatMenuButton';
import MMatMenuItem from './js/dom/MMatMenuItem';
import MMatMenu from './js/dom/MMatMenu';
import MHeaderBar from './js/dom/MHeaderBar';
import BrowserDetector from 'absol/src/Detector/BrowserDetector';
import Dom from 'absol/src/HTML5/Dom';
import MConversation from './js/dom/MConversation';
import MTabApplication from './js/mobile_app/MTabApplication';
import MTabActivity from './js/mobile_app/MTabActivity';
import MActivity from './js/mobile_app/MActivity';
import MMessageInput from './js/dom/MMessageInput';

absol.coreDom.install({
    mnavigatormenu: MNavigatorMenu,
    mbottomtabbar: MBottomTabbar,
    mleftnavigator: MLeftNavigator,
    mtinyprofileblock: MTinyProfileBlock,
    mmatmenubutton: MMatMenuButton,
    mmatmenuitem: MMatMenuItem,
    mmatmenu: MMatMenu,
    mheaderbar: MHeaderBar,
    mconversation: MConversation
});

absol.coreDom.install([MMessageInput]);

Object.assign(absol, {
    MTabApplication: MTabApplication,
    MTabActivity: MTabActivity,
    MActivity: MActivity
});

if (BrowserDetector.isMobile) Dom.documentReady.then(function () {
    document.body.classList.add('am-mobile-theme');
});

