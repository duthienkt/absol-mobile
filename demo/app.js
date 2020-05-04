var _ = absol._;
var $ = absol.$;
var frameview = _('frameview.app-body').addTo(document.body);
var tabbar = _({
    tag: 'mbottomtabbar',
    props: {
        items: [
            {
                icon: 'span.mdi.mdi-view-dashboard',
                value: 0
            },
            {
                icon: 'span.mdi.mdi-credit-card-outline',
                value: 1
            },
            {
                icon: 'span.mdi.mdi-wechat',
                value: 2
            },
            {
                icon: 'span.mdi.mdi-bell-outline',
                value: 3
            },
            {
                icon: 'span.mdi.mdi-menu',
                value: 4
            }
        ]
    }
}).addTo(document.body);
frameview.addStyle('height', 'calc(100% - ' + (tabbar.getBoundingClientRect().height) + 'px)');
var dashboardTab = _({
    tag: 'tabframe',
    child: [
        '<h1>Dashboard</h1>'
    ]
}).addTo(frameview);
var cardTab = _({
    tag: 'tabframe',
    child: [
        '<h1>Card</h1>'
    ]
}).addTo(frameview);
var messageTab = _({
    tag: 'tabframe',
    child: [
        '<h1>Message</h1>'
    ]
}).addTo(frameview);

var notificationTab = _({
    tag: 'tabframe',
    child: [
        '<h1>Notification</h1>'
    ]
}).addTo(frameview);
var menuTab = _({
    tag: 'tabframe',
    class: 'menu-tab',
    child: [
        {
            tag:'mtinyprofileblock'
        }
    ]
}).addTo(frameview);

var tabs = [dashboardTab, cardTab, messageTab, notificationTab, menuTab];
tabbar.value = 4;
menuTab.requestActive();
tabbar.on('change', function () {
    tabs[this.value].requestActive();
});
absol.Dom.updateResizeSystem();
