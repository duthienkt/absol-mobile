import MLeftNavigator from './js/dom/MLeftNavigator';
import MNavigatorMenu from './js/dom/MNavigatorMenu';
import MBottomTabbar from './js/dom/MBottomTabbar';
import MTinyProfileBlock from './js/dom/MTinyProfileBlock';
import MMatMenuButton from './js/dom/MMatMenuButton';
import MMatMenuItem from './js/dom/MMatMenuItem';
import MMatMenu from './js/dom/MMatMenu';
import MHeaderBar from './js/dom/MHeaderBar';
import MConversation from './js/dom/MConversation';
import MMessageInput from './js/dom/MMessageInput';

export default function install(core) {
    core.install([
        MMessageInput, MNavigatorMenu, MBottomTabbar,
        MLeftNavigator, MTinyProfileBlock, MMatMenuButton,
        MMatMenuItem, MMatMenu, MHeaderBar,
        MConversation
    ]);
}