
import '../../css/mobileapp.css';
import Core from '../dom/Core';
import MActivity from './MActivity';

var _ = Core._;
var $ = Core.$;


function MTabActivity() {
    MActivity.call(this);
}

Object.defineProperties(MTabActivity.prototype, Object.getOwnPropertyDescriptors(MActivity.prototype));
MTabActivity.prototype.constructor = MTabActivity;

MTabActivity.prototype.tabIcon = "span.mdi.mdi-view-dashboard";

export default MTabActivity;