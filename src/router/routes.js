export default [
    {
        name:"Home",
        path:"/home",
        component: () => import('@/pages/Home'),
    },
    {
        name:"VirtualFitting",
        path:"/virtual-fitting",
        component: () => import('@/pages/VirtualFitting'),
    },
    {
        name:"HistoryInfo",
        path:"/history-info",
        component:()=>import('@/pages/HistoryInfo')
    },
    {
        path: '/',
        redirect:'/home'
    },
    {
        path: '/*',
        component:()=>import('@/pages/Error')
    }
]