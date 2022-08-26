export interface Account {
  name?: string
  password?: string
  counts: number
  dieQuit?: boolean
  randomRole?: boolean
  current_count?: number
  expire?: number
}

export interface QsOptions {
  isRandom: boolean
  counts: number
  interval: number
  clickLike: string
  insertEye: string
  dieQuit: boolean
  dieQuitCount: number
  reconnect: boolean
  stateDefend: boolean
  hpOrMP: string
  lower: number
  equip: number[]
  zb_index: number
  sq_index: number
  lt_index: number
  jd_index: number
  role: RoleItem[]
}
interface RoleItem {
  equip: number | string[]
  hou: string[]
  name: string
  skill: string
}
export interface Config {
  mode: string
  path: string
  accounts: Account[]
  qs: QsOptions
  jobTime?: any
  shutdown?: any
}
export default <Config>{
  accounts: [
    {
      counts: 50,
      dieQuit: true
    }
  ],
  mode: 'zc',
  path: '',
  qs: {
    role: [
      { equip: [1, 'f'], hou: ['鸡刀'], name: '康娜', skill: 'r' },
      { equip: [], hou: [], name: '塞巴斯蒂安' },
      { equip: [], hou: [], name: '黑羽快斗', skill: 'r', isSpring: true },
      { equip: [], hou: [], name: '八神疾风', skill: 'r', isSpring: true }
    ],

    //随机英雄
    isRandom: false,
    //游戏局数
    counts: 50,
    //检测间隔/s
    interval: 1,
    //插眼&点赞
    clickLike: 'R',
    insertEye: 'R',
    //死亡退出&死亡计数
    dieQuit: true,
    dieQuitCount: 1,
    //掉线重连
    reconnect: false,
    //血量&蓝量保护&使用的装备
    stateDefend: true,
    hpOrMP: 'MP',
    lower: 60,
    equip: [1, 2],
    //猴戏装备位置
    zb_index: 2,
    sq_index: 1,
    jd_index: 2,
    lt_index: 3
  }
}
