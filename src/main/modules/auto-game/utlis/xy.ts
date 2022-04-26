type XyItem = {
  xy: [number, number]
  desc: string
  delay?: number
}
type Xy = {
  [name: string]: XyItem
}
const xy: Xy = {
  //登陆界面
  zh: {
    xy: [1065, 359],
    desc: '登陆 账号'
  },
  mm: {
    xy: [1065, 418],
    desc: '登陆 密码'
  },
  jryx: {
    xy: [1138, 535],
    desc: '登陆 进入游戏'
  },
  //大厅界面
  gxgg_gb: {
    xy: [1070, 132],
    desc: '大厅 关闭更新公告'
  },
  play: {
    xy: [645, 37],
    desc: '大厅 play'
  },
  zc: {
    xy: [168, 197],
    desc: '大厅 zc'
  },
  zc_dryx: {
    xy: [902, 721],
    desc: '大厅 战场单人游戏',
    delay: 5000
  },
  del: {
    xy: [189, 296],
    desc: '大厅 斗恶龙'
  },
  del_dryx: {
    xy: [726, 723],
    desc: '大厅 斗恶龙单人游戏',
    delay: 5000
  },
  xlc: {
    xy: [143, 442],
    desc: '大厅 英雄训练场'
  },
  xlc_dryx: {
    xy: [644, 722],
    desc: '大厅 英雄训练场单人游戏',
    delay: 5000
  },
  xzjs_srk: {
    xy: [80, 130],
    desc: '大厅 选择角色界面输入框'
  },
  xzdyg: {
    xy: [119, 181],
    desc: '大厅 选择第一个角色'
  },
  cj: {
    xy: [645, 762],
    desc: '大厅 选择角色界 出击'
  },
  //zc里边
  zddj: {
    xy: [636, 363],
    desc: '主动道具选择自己的坐标'
  },
  qbzb: {
    xy: [906, 167],
    desc: '背包 全部装备'
  },
  equip1: {
    xy: [658, 256],
    desc: '装备1'
  },
  equip2: {
    xy: [731, 256],
    desc: '装备2'
  },
  equip3: {
    xy: [658, 330],
    desc: '装备3'
  },
  equip4: {
    xy: [730, 330],
    desc: '装备4'
  },
  equip5: {
    xy: [658, 404],
    desc: '装备5'
  },
  equip6: {
    xy: [730, 404],
    desc: '装备6'
  },
  bb: {
    xy: [339, 746],
    desc: '打开&关闭背包'
  },
  xdt_zsj: {
    xy: [1039, 560],
    desc: '小地图 左上角'
  },
  ymsz: {
    xy: [401, 314],
    desc: '设置 页面设置'
  },
  ckms: {
    xy: [563, 276],
    desc: '设置-页面设置 窗口模式'
  },
  fbl: {
    xy: [762, 270],
    desc: '设置-页面设置 分辨率'
  },
  fbl_xz: {
    xy: [765, 293],
    desc: '设置-页面设置 分辨率选择1280*800'
  },
  yy: {
    xy: [937, 612],
    desc: '设置-页面设置 应用'
  },
  qs_red: {
    xy: [59, 570],
    desc: 'zc 红方 泉水点击方向 '
  },
  qs_blue: {
    xy: [1005, 30],
    desc: 'zc 蓝方 泉水点击方向 '
  },
  dz: {
    xy: [624, 261],
    desc: '点赞'
  }
}
export default xy
