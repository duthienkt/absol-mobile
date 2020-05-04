//todo
import 'absol/src/absol';
import 'absol-acomp/dev';
import MLeftNavigator from './js/dom/MLeftNavigator';
import MNavigatorMenu from './js/dom/MNavigatorMenu';
import MBottomTabbar from './js/dom/MBottomTabbar';
import MTinyProfileBlock from './js/dom/MTinyProfileBlock';
absol.coreDom.install({
    mnavigatormenu: MNavigatorMenu,
    mbottomtabbar: MBottomTabbar,
    mleftnavigator: MLeftNavigator,
    mtinyprofileblock: MTinyProfileBlock 
});