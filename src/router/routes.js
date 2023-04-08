export default [
    {
        name: "VirtualFitting",
        path: "/virtual-fitting",
        component: () => import('@/pages/VirtualFitting'),
        meta: {
            isShow: true,
            icon: 'el-icon-view',
            title: '虚拟试衣'
        }
    },
    {
        name: "VideoFitting",
        path: "/video-fitting",
        component: () => import('@/pages/VideoFitting'),
        meta: {
            isShow: true,
            icon: 'el-icon-video-play',
            title: '视频虚拟试衣'
        }
    },
    {
        name: "HistoryInfo",
        path: "/history-info",
        component: () => import('@/pages/HistoryInfo'),
        meta: {
            isShow: true,
            icon: 'el-icon-folder',
            title: '历史记录'
        }
    },
    {
        name: "MaybeLike",
        path: "/maybe-like",
        component: () => import('@/pages/MaybeLike'),
        meta: {
            isShow: true,
            icon: 'el-icon-star-off',
            title: '猜你喜欢'
        }
    },
    {
        name: "Start",
        path: "/start",
        component: () => import('@/pages/Start'),
        meta: {
            isShow: false,
            title: '首页'
        }
    },
    {
        path: '/',
        redirect: '/start',
        meta: {
            isShow: false
        }
    },
    {
        path: '/*',
        component: () => import('@/pages/Error'),
        meta: {
            isShow: false
        }
    }
]