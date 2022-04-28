import MLeftNavigator from './MLeftNavigator';
import MNavigatorMenu from './MNavigatorMenu';
import MBottomTabbar from './MBottomTabbar';
import MTinyProfileBlock from './MTinyProfileBlock';
import MMatMenuButton from './MMatMenuButton';
import MMatMenuItem from './MMatMenuItem';
import MMatMenu from './MMatMenu';
import MHeaderBar from './MHeaderBar';
import MConversation from './MConversation';
import MMessageInput from './MMessageInput';
import MSelectListItem from './MSelectListItem';
import MSelectList from './MSelectList';
import MSelectMenu from './MSelectMenu';
import MSelectTreeMenu from "./MSelectTreeMenu";
import MSelectBox from "./MSelectBox";
import MBlinkModal from "./MBlinkModal";
import MListModal from "./MListModal";
import MTreeModal from "./MTreeModal";
import MHSnapScroller from "./MHSnapScroller";
import MChecklistModal from "./MChecklistModal";
import MChecklistItem from "./MChecklistItem";
import MMultiCheckMenu from "./MMultiCheckMenu";
import MCabinetList from "./MCabinetList";
import MCabinetItem from "./MCabinetItem";
import MCabinetTreeList from "./MCabinetTreeList";
import MCabinetTree from "./MCabinetTree";

export default function install(core) {
    core.install([
        MMessageInput, MNavigatorMenu, MBottomTabbar,
        MLeftNavigator, MTinyProfileBlock, MMatMenuButton,
        MMatMenuItem, MMatMenu, MHeaderBar,
        MConversation,
        MSelectListItem,
        MSelectList,
        MSelectMenu, MSelectTreeMenu,
        MSelectBox,
        MBlinkModal,
        MListModal,
        MTreeModal,
        MHSnapScroller,
        MChecklistItem,
        MChecklistModal,
        MMultiCheckMenu,
        MCabinetItem,
        MCabinetList,
        MCabinetTreeList,
        MCabinetTree
    ]);
}