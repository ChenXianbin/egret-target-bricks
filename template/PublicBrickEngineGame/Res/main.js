//Base
// BK.Script.loadlib('GameRes://script/demo/basics/base_demo.js');

//导演类
// BK.Script.loadlib('GameRes://script/demo/basics/director_demo.js');

//脚本工具
// BK.Script.loadlib('GameRes://script/demo/basics/script_demo.js');

//定时器
//BK.Script.loadlib('GameRes://script/demo/basics/ticker_demo.js');


//获取相册
// BK.Script.loadlib('GameRes://script/demo/basics/imageSelector_demo.js');

//文件
//  BK.Script.loadlib('GameRes://script/demo/file/file_demo.js');

//音频
// BK.Script.loadlib('GameRes://script/demo/media/audio_demo.js');

//手机QQ相关
// BK.Script.loadlib('GameRes://script/demo/mqq/mqq_demo.js');
// BK.Script.loadlib('GameRes://script/demo/mqq/sso_demo.js');

//网络相关
//帧同步
// BK.Script.loadlib('GameRes://script/demo/net/frameSync_demo.js');
//BK.Script.loadlib('GameRes://script/demo/net/room_demo.js');

//http
// BK.Script.loadlib('GameRes://script/demo/net/http_demo.js');

//socket
// BK.Script.loadlib('GameRes://script/demo/net/socket_demo.js');

//物理引擎
// BK.Script.loadlib('GameRes://script/demo/physics/physics_demo.js');

//Node
// BK.Script.loadlib('GameRes://script/demo/render/node_demo.js');

//网格贴图
// BK.Script.loadlib('GameRes://script/demo/render/mesh_demo.js');

//帧动画
// BK.Script.loadlib('GameRes://script/demo/render/animatedSprite_demo.js');

//精灵
// BK.Script.loadlib('GameRes://script/demo/render/sprite_demo.js');

//精灵性能
//BK.Script.loadlib('GameRes://script/demo/render/performancee_demo.js');

//骨骼动画
// BK.Script.loadlib('GameRes://script/demo/spine/skeletonAnimation_demo.js');

//骨骼动画异步
//BK.Script.loadlib('GameRes://script/demo/spine/skeletonAnimation_asyc.js');

//骨骼动画控制
// BK.Script.loadlib('GameRes://script/demo/spine/editSkeletonAnimation_demo.js')

//时间
// BK.Script.loadlib('GameRes://script/demo/time/time_demo.js');

//按钮事件
//BK.Script.loadlib("GameRes://script/demo/ui/button_demo.js");

//拖拽
//BK.Script.loadlib("GameRes://script/demo/ui/touch_event_demo.js");

//文字
// BK.Script.loadlib("GameRes://script/demo/ui/text_demo.js");

//遥控杆例子
// BK.Script.loadlib("GameRes://script/demo/ui/touch_controller_demo.js");

//多屏幕适配
// BK.Script.loadlib("GameRes://script/demo/ui/multi_resolution_demo.js");

//横竖屏
//BK.Script.loadlib("GameRes://script/demo/ui/device_orientation_demo.js");

//图集以及九宫格图
// BK.Script.loadlib("GameRes://script/demo/render/spriteSheetCache_demo.js");

//帧动画
//BK.Script.loadlib('GameRes://script/demo/render/animatedSprite_demo.js');

//TLV
//BK.Script.loadlib("GameRes://script/demo/net/websocket_demo.js");

//蒙版S
//BK.Script.loadlib("GameRes://script/demo/render/clip_node_demo.js");

//裁剪
//BK.Script.loadlib("GameRes://script/demo/render/clip_rect_node_demo.js");

//多人音视频
//无ui版本
// BK.Script.loadlib("GameRes://script/demo/basics/multi_audio_video_demo.js")
//带ui版本
// BK.Script.loadlib("GameRes://script/demo/basics/multi_audio_video_demo_ui.js")

//输入框
// BK.Script.loadlib("GameRes://script/demo/ui/editor_demo.js");

var __extends = function (t, e) {
    function r() {
        this.constructor = t;
    }
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    r.prototype = e.prototype, t.prototype = new r();
};

var window = this;
this.navigator = { userAgent: "BK" };
// Egret
(function () {
    BK.Script.loadlib('GameRes://script/core/ui/text.js');
    BK.Script.loadlib('GameRes://script/core/render/canvas.js');
    // debugger;
    var manifestURL = "GameRes://manifest.json";
    if (!BK.FileUtil.isFileExist(manifestURL)) {
        BK.Script.log(0, 0, "Load egret manifest error.");
        return;
    }

    var manifest = JSON.parse(BK.FileUtil.readFile(manifestURL).readAsString());

    if (manifest.initial && manifest.initial instanceof Array) {
        for (var i = 0, l = manifest.initial.length; i < l; ++i) {
            var jsLib = manifest.initial[i];
            BK.Script.loadlib(jsLib);
        }
    }
    //
    BK.Script.loadlib('GameRes://egret.bricks.js');

    if (manifest.game && manifest.game instanceof Array) {
        for (var i = 0, l = manifest.game.length; i < l; ++i) {
            var jsLib = manifest.game[i];
            BK.Script.loadlib(jsLib);
        }

        debugger;
        egret.runEgret(
            {
                frameRate: 30,
                contentWidth: 640,
                contentHeight: 1136,
                entryClassName: "Main",
                scaleMode: "showAll",
                orientation: "auto"
            }
        );
    }
})();

