var _ = absol._;
var $ = absol.$;
var Fragment = absol.Fragment;
var Context = absol.Context;
var MTabApplication = absol.MTabApplication;
var MTabActivity = absol.MTabActivity;
var MActivity = absol.MActivity;


var R = {
    APP: "APP",
    CONVERSATION_SEARCH_ACT: 'CONVERSATION_SEARCH_ACT'
};

var database = {
    loadedSync: Promise.resolve(true)
};

function DemoApp() {
    MTabApplication.call(this);
    this.tabActivities = [new DashboardAct(), new CardAct(), new ChatAct(), new NotificationAct(), new MenuAct()];
    this.initActivity = new LoadingAct();
};
/**
 * Kế thừa từ Fragment, dễ quản lý trạng thái, có contextManager
 */
Object.defineProperties(DemoApp.prototype, Object.getOwnPropertyDescriptors(MTabApplication.prototype));
DemoApp.prototype.constructor = DemoApp;

DemoApp.prototype.onActivityReturn = function (session, act, result) {
    if (session == 'start') {// đâu là session
        this.activeTabActivityByIndex(0);// start một cái tab
    }
    else {
        // có thể vài tab đặc biệt khác, nhưng vì các tab tất cả đều không được return, 
        //nên chỉ có activity loading có trả vể
    }
}

function LoadingAct() {
    MActivity.call(this);
    this._loading = 0;
}

Object.defineProperties(LoadingAct.prototype, Object.getOwnPropertyDescriptors(MActivity.prototype));
LoadingAct.prototype.constructor = LoadingAct;

LoadingAct.prototype.createView = function () {
    //hàm này sẽ chỉ được gọi duy nhất 1 lần để tạo view, view phải được gán vào this.$view
    this.$view = _({
        tag: 'tabframe',
        class: 'loading-act',
        child: [
            {
                class: 'loading-act-logo-ctn',
                child: {
                    tag: 'img',
                    class: 'loading-act-logo',
                    props: {
                        src: 'https://lab.daithangminh.vn/home_co/logo-card-15-11.png'
                    }
                }
            },
            {
                class: 'loading-act-progress-bar-ctn',
                child: {
                    tag: 'progressbar',
                    props: {
                        animated: true
                    }
                }
            }
        ]
    });

    this.$progressBar = $('progressbar', this.$view);
};

LoadingAct.prototype.onResume = function () {
    var thisAct = this;
    this.loadInt = setInterval(function () {
        if (thisAct._loading >= 100) {
            clearInterval(thisAct.loadInt);
            thisAct.finish();
        }
        thisAct._loading += Math.random() * 30;
        thisAct._loading = Math.min(thisAct._loading, 100);
        thisAct.$progressBar.value = thisAct._loading / 100;
    }, 400);
};

function CardAct() {
    MTabActivity.call(this);
}

Object.defineProperties(CardAct.prototype, Object.getOwnPropertyDescriptors(MTabActivity.prototype));
CardAct.prototype.constructor = CardAct;

CardAct.prototype.tabIcon = 'span.mdi.mdi-credit-card-outline';


CardAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',//dùng tabframe hay frame đều được
        child: {
            tag: 'h1',
            child: { text: "Card" }
        }
    });
};




function DashboardAct() {
    MTabActivity.call(this);
}

Object.defineProperties(DashboardAct.prototype, Object.getOwnPropertyDescriptors(MTabActivity.prototype));
DashboardAct.prototype.constructor = DashboardAct;

DashboardAct.prototype.tabIcon = 'span.mdi.mdi-view-dashboard';


DashboardAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',//dùng tabframe hay frame đều được
        child: [
            {
                tag: 'mheaderbar',
                props: {
                    title: "Dashboard",
                    quickmenu: {
                        getMenuProps: function () {
                            return {
                                items: [
                                    { text: 'Xóa', icon: 'span.mdi.mdi-delete' },
                                    { text: 'Di chuyển', icon: 'span..mdi.mdi-file-move-outline' },
                                    { text: 'Lưu trữ', icon: 'span.mdi.mdi-content-save-outline' }

                                ]
                            }
                        },
                        onSelect: function (item) {
                            console.log(item);
                        }
                    }
                }
            }
        ]
    });
};

function ChatAct() {
    MTabActivity.call(this);
    this.searchAct = new ConversationSearchAct();// dùng chung một activty cho nhiều lần
}


Object.defineProperties(ChatAct.prototype, Object.getOwnPropertyDescriptors(MTabActivity.prototype));
ChatAct.prototype.constructor = ChatAct;

ChatAct.prototype.tabIcon = 'span.mdi.mdi-wechat';


ChatAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',//dùng tabframe hay frame đều được
        child: [{
            tag: 'mheaderbar',
            props: {
                actionIcon: 'span.mdi.mdi-magnify',//icon bên trái
                title: "Chat",//tiêu đề
                commands: [
                    {
                        icon: 'span.mdi.mdi-message-plus-outline'
                    }
                ],
                quickmenu: {
                    getMenuProps: function(){
                        return {
                            items:[
                                {
                                    icon:'span.mdi.mdi-account-multiple-plus-outline',
                                    text: "Tạo nhóm",
                                    cmd:'make_group'
                                },
                                {
                                    icon:'span.mdi.mdi-check',
                                    text: "Đánh dấu tất cả đã đọc",
                                    cmd:'make_all_read'
                                }, 
                                "===========",

                                {
                                    icon: 'span.mdi.mdi-history',
                                    text: "Lịch sử trò chuyện",
                                    cmd: 'history'
                                },
                                {
                                    icon: 'span.mdi.mdi-email-newsletter',
                                    text: "Xem tin nhắn mới",
                                    cmd: 'history'
                                },
                                {
                                    icon: 'span.mdi.mdi-email-open-multiple-outline',
                                    text: "Tất cả tin nhắn",
                                    cmd: 'history'
                                }
                            ]
                        };
                    },
                    
                    onSelect:this.ev_quickmenuSelect.bind(this)
                }
            },
            on: {
                action: this.startSearchActivity.bind(this)
            }
        },
        {
            class: 'activity-body'
        }
        ]
    });
    this.$body = $('.activity-body', this.$view);
};

ChatAct.prototype.onCreated = function () {
    //chờ đến khi toàn bộ database load xong thì
    database.loadedSync.then(this.loadAllConversation.bind(this))
};


ChatAct.prototype.loadAllConversation = function () {
    this.$body.clearChild();
    // load all message
    var conversationElt;
    var unreadCount = 0;
    for (var i = 0; i < 30; ++i) {
        var unread = Math.random() < 0.3;
        if (unread) unreadCount++;
        conversationElt = _({
            tag: 'mconversation',
            props: {
                name: "Đây là tên",
                shortContent: absol.string.randomParagraph(300),
                time: '2 ngày',
                counter: unread ? 'N' : '',
                unread: unread,
                avatarSrc: i%4 == 0?'https://avatars2.githubusercontent.com/u/9133017?s=460&v=4': null,
                onlineStatus: ['none', 'online', 'offline'][i%3]
            }
        });
        this.$body.addChild(conversationElt);
    }
    this.setCounter(unreadCount);
};


ChatAct.prototype.startSearchActivity = function () {
    this.startActivity('search', this.searchAct, null);
};


ChatAct.prototype.ev_quickmenuSelect = function(item){

};

function ConversationSearchAct() {
    MActivity.call(this);// ativity này không có trên tabbar, chỉ là activity bình thường 
}

Object.defineProperties(ConversationSearchAct.prototype, Object.getOwnPropertyDescriptors(MActivity.prototype));
ConversationSearchAct.prototype.constructor = ConversationSearchAct;

ConversationSearchAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',//dùng tabframe hay frame đều được
        child: [{
            tag: 'mheaderbar',
            props: {
                actionIcon: 'span.mdi.mdi-arrow-left',
                title: 'Tìm kiếm trò chuyện'
            },
            on: {
                action: this.finish.bind(this)
            }
        },
        {
            class: 'activity-body'
        }
        ]
    });
    this.$body = $('.tab-body', this.$view);
};


function NotificationAct() {
    MTabActivity.call(this);
}

Object.defineProperties(NotificationAct.prototype, Object.getOwnPropertyDescriptors(MTabActivity.prototype));
NotificationAct.prototype.constructor = NotificationAct;

NotificationAct.prototype.tabIcon = 'span.mdi.mdi-bell-outline';


NotificationAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',//dùng tabframe hay frame đều được
        child: {
            tag: 'h1',
            child: { text: "NotificationAct" }
        }
    });
};


function MenuAct() {
    MTabActivity.call(this);
}

Object.defineProperties(MenuAct.prototype, Object.getOwnPropertyDescriptors(MTabActivity.prototype));
MenuAct.prototype.constructor = MenuAct;

MenuAct.prototype.tabIcon = 'span.mdi.mdi-menu';


MenuAct.prototype.createView = function () {
    this.$view = _({
        tag: 'tabframe',
        class: 'menu-tab',
        child: [
            {
                tag: 'mtinyprofileblock'
            },
            {
                style: {
                    'margin-top': '10px'
                },
                child: [
                    {
                        tag: 'mmatmenu',
                        props: {
                            items: [
                                {
                                    text: 'Trang chủ',
                                    icon: {
                                        tag: 'mmdirect',
                                        style: {
                                            backgroundColor: 'rgb(76, 210, 99)'
                                        },
                                        props: {
                                            iconName: 'home'
                                        }
                                    }
                                },
                                {
                                    text: 'Danh mục',
                                    icon: {
                                        tag: 'mmdirect',
                                        style: {
                                            backgroundColor: 'rgb(62, 153, 194)'
                                        },
                                        props: {
                                            iconName: 'view-list'
                                        }
                                    },
                                    items: [
                                        { text: 'Kiểu dữ liệu', icon: 'span.mdi.mdi-alpha-t-box-outline' },
                                        { text: 'Bảng', icon: 'span.mdi.mdi-file-table-outline' },
                                        { text: 'Trạng thái', icon: 'span.mdi.mdi-check' },
                                        { text: 'Nhóm đối tượng', icon: 'span.mdi.mdi-google-circles-communities' },
                                        { text: 'Đối tượng', icon: 'span.mdi.mdi-cube-outline' },
                                        { text: 'Chat', icon: 'span.mdi.mdi-chat-outline' },
                                        { text: 'Quốc gia', icon: 'span.mdi.mdi-earth' },
                                        { text: 'Công ty', icon: 'span.mdi.mdi-warehouse' },
                                        { text: 'Liên hệ', icon: 'span.mdi.mdi-contact-mail' },
                                        { text: 'Loại', icon: 'span.mdi.mdi-grain' },
                                    ]
                                },
                                {
                                    text: 'Báo cáo',
                                    icon: {
                                        tag: 'mmdirect',
                                        style: {
                                            backgroundColor: 'rgb(252, 74, 7)'
                                        },
                                        props: {
                                            iconName: 'playlist-check'
                                        }
                                    },
                                    items: [
                                        { text: 'Báo cáo của tôi', icon: 'span.mdi.mdi-note-text' },
                                        { text: 'Báo cáo công khai', icon: 'span.mdi.mdi-note-text-outline' },
                                    ]
                                },
                                {
                                    text: 'Hệ thống',
                                    icon: {
                                        tag: 'mmdirect',
                                        style: {
                                            backgroundColor: 'rgb(136, 136, 136)'
                                        },
                                        props: {
                                            iconName: 'settings-outline'
                                        }
                                    },
                                    items: [
                                        { text: 'Người dùng', icon: 'span.mdi.mdi-account-outline' },
                                        { text: 'Hồ sơ cá nhân', icon: 'span.mdi.mdi-file-account' },
                                        { text: 'Đăng xuất', icon: 'span.mdi.mdi-logout' },
                                    ]
                                }
                            ]
                        },
                        on: {
                            press: this.ev_pressMenuItem
                        }
                    }
                ]
            }
        ]
    })
};

MenuAct.prototype.ev_pressMenuItem = function (event) {
    console.log(event.menuItem.text);//có thể lấy 1 số thuộc tính khác
};




// window.APP = new DemoApp();

// APP.getView().addTo(document.body);
// APP.start();



//   //        quickmenu: {
//         //            getMenuProps: function () {
//         //                return {
//         //                    items: [
//         //                        { text: 'Xóa', icon: 'span.mdi.mdi-delete' },
//         //                        { text: 'Di chuyển', icon: 'span..mdi.mdi-file-move-outline' },
//         //                        { text: 'Lưu trữ', icon: 'span.mdi.mdi-content-save-outline' }

//         //                    ]
//         //                }
//         //            },
//         //            onSelect: function (item) {
//         //                console.log(item);
//         //            }
//         //        }


// // var frameview = _('frameview.am-app-body').addTo(document.body);
// // var tabbar = _({
// //     tag: 'mbottomtabbar',
// //     props: {
// //         items: [
// //             {
// //                 icon: 'span.mdi.mdi-view-dashboard',
// //                 value: 0
// //             },
// //             {
// //                 icon: 'span.mdi.mdi-credit-card-outline',
// //                 value: 1
// //             },
// //             {
// //                 icon: 'span.mdi.mdi-wechat',
// //                 value: 2,
// //                 counter: 17

// //             },
// //             {
// //                 icon: 'span.mdi.mdi-bell-outline',
// //                 value: 3,
// //                 counter: 7
// //             },
// //             {
// //                 icon: 'span.mdi.mdi-menu',
// //                 value: 4
// //             }
// //         ]
// //     }
// // }).addTo(document.body);
// // frameview.addStyle('height', 'calc(100% - ' + (tabbar.getBoundingClientRect().height) + 'px)');
// // var dashboardTab = _({
// //     tag: 'tabframe',
// //     child: [
// //         '<h1>Dashboard</h1>'
// //     ]
// // }).addTo(frameview);
// // var cardTab = _({
// //     tag: 'tabframe',
// //     child: [
// //         '<h1>Card</h1>'
// //     ]
// // }).addTo(frameview);
// // var messageTab = _({
// //     tag: 'tabframe',
// //     child: [
// //         {
// //             tag: 'mheaderbar',
// //             props: {

// //             }
// //         }
// //     ]
// // }).addTo(frameview);

// // var notificationTab = _({
// //     tag: 'tabframe',
// //     child: [
// //         '<h1>Notification</h1>'
// //     ]
// // }).addTo(frameview);
// // var menuTab = _({
// //     tag: 'tabframe',
// //     class: 'menu-tab',
// //     child: [
// //         {
// //             tag: 'mtinyprofileblock'
// //         },
// //         {
// //             style: {
// //                 'margin-top': '10px'
// //             },
// //             child: [
// //                 {
// //                     tag: 'mmatmenu',
// //                     props: {
// //                         items: [
// //                             {
// //                                 text: 'Trang chủ',
// //                                 icon: {
// //                                     tag: 'mmdirect',
// //                                     style: {
// //                                         backgroundColor: 'rgb(76, 210, 99)'
// //                                     },
// //                                     props: {
// //                                         iconName: 'home'
// //                                     }
// //                                 }
// //                             },
// //                             {
// //                                 text: 'Danh mục',
// //                                 icon: {
// //                                     tag: 'mmdirect',
// //                                     style: {
// //                                         backgroundColor: 'rgb(62, 153, 194)'
// //                                     },
// //                                     props: {
// //                                         iconName: 'view-list'
// //                                     }
// //                                 },
// //                                 items: [
// //                                     { text: 'Kiểu dữ liệu', icon: 'span.mdi.mdi-alpha-t-box-outline' },
// //                                     { text: 'Bảng', icon: 'span.mdi.mdi-file-table-outline' },
// //                                     { text: 'Trạng thái', icon: 'span.mdi.mdi-check' },
// //                                     { text: 'Nhóm đối tượng', icon: 'span.mdi.mdi-google-circles-communities' },
// //                                     { text: 'Đối tượng', icon: 'span.mdi.mdi-cube-outline' },
// //                                     { text: 'Chat', icon: 'span.mdi.mdi-chat-outline' },
// //                                     { text: 'Quốc gia', icon: 'span.mdi.mdi-earth' },
// //                                     { text: 'Công ty', icon: 'span.mdi.mdi-warehouse' },
// //                                     { text: 'Liên hệ', icon: 'span.mdi.mdi-contact-mail' },
// //                                     { text: 'Loại', icon: 'span.mdi.mdi-grain' },
// //                                 ]
// //                             },
// //                             {
// //                                 text: 'Báo cáo',
// //                                 icon: {
// //                                     tag: 'mmdirect',
// //                                     style: {
// //                                         backgroundColor: 'rgb(252, 74, 7)'
// //                                     },
// //                                     props: {
// //                                         iconName: 'playlist-check'
// //                                     }
// //                                 },
// //                                 items: [
// //                                     { text: 'Báo cáo của tôi', icon: 'span.mdi.mdi-note-text' },
// //                                     { text: 'Báo cáo công khai', icon: 'span.mdi.mdi-note-text-outline' },
// //                                 ]
// //                             },
// //                             {
// //                                 text: 'Hệ thống',
// //                                 icon: {
// //                                     tag: 'mmdirect',
// //                                     style: {
// //                                         backgroundColor: 'rgb(136, 136, 136)'
// //                                     },
// //                                     props: {
// //                                         iconName: 'settings-outline'
// //                                     }
// //                                 },
// //                                 items: [
// //                                     { text: 'Người dùng', icon: 'span.mdi.mdi-account-outline' },
// //                                     { text: 'Hồ sơ cá nhân', icon: 'span.mdi.mdi-file-account' },
// //                                     { text: 'Đăng xuất', icon: 'span.mdi.mdi-logout' },
// //                                 ]
// //                             }
// //                         ]
// //                     }
// //                 }
// //             ]
// //         }
// //     ]
// // }).addTo(frameview);

// // var tabs = [dashboardTab, cardTab, messageTab, notificationTab, menuTab];
// // tabbar.value = 2;
// // messageTab.requestActive();
// // tabbar.on('change', function () {
// //     tabs[this.value].requestActive();
// // });
// // absol.Dom.updateResizeSystem();


var app = new DemoApp();
app.start();