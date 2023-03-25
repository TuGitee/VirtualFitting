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
        path: '/',
        redirect: '/virtual-fitting',
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