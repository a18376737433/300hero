import { execSync } from 'child_process'
import { resolve, join } from 'path'
import isDevelop from 'electron-is-dev'
export interface Coordinate {
  x: number
  y: number
}

export interface FindRet extends Coordinate {
  index: number
}

export interface OcrRet extends Coordinate {
  words: string
}

export interface Area {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface Size {
  width: number
  height: number
}

export const enum DmRet {
  Failed,
  Success
}

export const enum FindDir {
  LeftToRightAndTopToBottom,
  LeftToRightAndBottomToTop,
  RightToLeftAndTopToBottom,
  RightToLeftAndBottomToTop,
  CenterToOutSide,
  TopToBottomAndLeftToRight,
  TopToBottomAndRightToLeft,
  BottomToTopAndLeftToRight,
  BottomToTopAndRightToLeft
}

export const enum ErrorDisplay {
  Hidden,
  Show
}

export const enum GetWindowFlag {
  Parent,
  FirstChild,
  First,
  Last,
  Next,
  Previous,
  Owner,
  Top
}

export const enum WindowState {
  Close,
  Active,
  MinimizeAndInactive,
  MinimizeAndReleaseMemoryAndActive,
  MaximizeAndActive,
  RestoreAndInactive,
  Hide,
  Show,
  Top,
  CancelTop,
  Disable,
  CancelDisable,
  RestoreAndActive,
  ForceExit
}

export const enum KeyState {
  Up,
  Down
}

const libDir = join(__dirname, isDevelop ? '../../src/main/library' : '../../../library')

const winax = require('winax')
type DisplayType = 'normal' | 'gdi' | 'gdi2' | 'dx' | 'dx2' | 'dx3'
type MouseType = 'normal' | 'windows' | 'windows2' | 'windows3' | 'dx' | 'dx2'
type KeypadType = 'normal' | 'windows' | 'dx'

type FindPicDir = FindDir.LeftToRightAndTopToBottom | FindDir.LeftToRightAndBottomToTop | FindDir.RightToLeftAndTopToBottom | FindDir.RightToLeftAndBottomToTop
let mouseRange: number[] | undefined
const getDM = () => {
  try {
    return new winax.Object('dm.dmsoft')
  } catch (e) {
    execSync(`regsvr32 ${resolve(libDir, 'dm.dll')} /s`)
    return new winax.Object('dm.dmsoft')
  }
}
const dll = getDM()
const getPath = (): string => {
  return dll.GetPath()
}
const setPath = (path: string): DmRet => {
  return dll.SetPath(path)
}
const setErrorDisplay = (flag: ErrorDisplay): DmRet => {
  return dll.SetShowErrorMsg(flag)
}
const getCursorPos = (): Coordinate => {
  let x = new winax.Variant(-1, 'byref')
  let y = new winax.Variant(-1, 'byref')
  dll.GetCursorPos(x, y)
  return { x: Number(x), y: Number(y) }
}
const getKeyState = (keyCode: number): KeyState => {
  return dll.GetKeyState(keyCode)
}
function setMouseRange(x1?: number, y1?: number, x2?: number, y2?: number): void {
  if (arguments.length === 4) mouseRange = Array.from(arguments)
  else mouseRange = undefined
}
const moveTo = (x: number, y: number): DmRet => {
  if (mouseRange) {
    if (x < mouseRange[0]) x = mouseRange[0]
    else if (x > mouseRange[2]) x = mouseRange[2]
    if (y < mouseRange[1]) y = mouseRange[1]
    else if (y > mouseRange[3]) y = mouseRange[3]
  }
  return dll.MoveTo(x, y)
}
const leftClick = (): DmRet => {
  return dll.LeftClick()
}
const leftDoubleClick = (): DmRet => {
  return dll.LeftDoubleClick()
}
const leftDown = (): DmRet => {
  return dll.LeftDown()
}
const leftUp = (): DmRet => {
  return dll.LeftUp()
}
const rightClick = (): DmRet => {
  return dll.RightClick()
}
const rightDown = (): DmRet => {
  return dll.RightDown()
}
const rightUp = (): DmRet => {
  return dll.RightUp()
}
const wheelDown = (): DmRet => {
  return dll.WheelDown()
}
const wheelUp = (): DmRet => {
  return dll.WheelUp()
}
const keyPress = (keyCode: number): DmRet => {
  return dll.KeyPress(keyCode)
}
const keyDown = (keyCode: number): DmRet => {
  return dll.KeyDown(keyCode)
}
const keyUp = (keyCode: number): DmRet => {
  return dll.KeyUp(keyCode)
}
const findWindow = (className: string, title: string, parentHWnd?: number): number | undefined => {
  const hWnd = parentHWnd ? enumWindow(className, title, 3, parentHWnd)[0] : dll.FindWindow(className, title)
  if (hWnd) return hWnd
}
const enumWindow = (className: string, title: string, filter: number, parentHWnd = 0): number[] => {
  const wins: string = dll.EnumWindow(parentHWnd, title, className, filter)
  return wins.length > 0 ? wins.split(',').map((hWnd) => Number(hWnd)) : []
}
const getWindow = (hWnd: number, flag: GetWindowFlag): number => {
  return dll.GetWindow(hWnd, flag)
}
const getPointWindow = (x: number, y: number): number => {
  return dll.GetPointWindow(x, y)
}
const getClientSize = (hWnd: number): Size | undefined => {
  let width = new winax.Variant(-1, 'byref')
  let height = new winax.Variant(-1, 'byref')
  const ret = dll.GetClientSize(hWnd, width, height)
  if (ret) {
    return {
      width: Number(width),
      height: Number(height)
    }
  }
}
const moveWindow = (hWnd: number, x: number, y: number): DmRet => {
  return dll.MoveWindow(hWnd, x, y)
}
const setWindowSize = (hWnd: number, width: number, height: number): DmRet => {
  return dll.SetWindowSize(hWnd, width, height)
}
const setWindowState = (hWnd: number, state: WindowState): DmRet => {
  return dll.SetWindowState(hWnd, state)
}
const sendPaste = (hWnd: number): DmRet => {
  return dll.sendPaste(hWnd)
}
const sendString = (hWnd: number, content: string): DmRet => {
  return dll.SendString(hWnd, content)
}
const bindWindow = (hWnd: number, display: DisplayType, mouse: MouseType, keypad: KeypadType, mode: 0 | 2 | 4): DmRet => {
  return dll.BindWindow(hWnd, display, mouse, keypad, mode)
}
const unBindWindow = (): DmRet => {
  return dll.UnBindWindow()
}
const capture = (x1: number, y1: number, x2: number, y2: number, fileName: string) => {
  return dll.Capture(x1, y1, x2, y2, fileName)
}
const findPic = (x1: number, y1: number, x2: number, y2: number, picName: string, deltaColor: string, sim: number, dir: FindPicDir): FindRet | undefined => {
  let x = new winax.Variant(-1, 'byref')
  let y = new winax.Variant(-1, 'byref')
  const index = dll.FindPic(x1, y1, x2, y2, picName, deltaColor, sim, dir, x, y)
  if (index !== -1) {
    return {
      x: Number(x),
      y: Number(y),
      index
    }
  }
}
const findPicEx = (x1: number, y1: number, x2: number, y2: number, picName: string, deltaColor: string, sim: number, dir: FindPicDir): FindRet[] => {
  const ret = dll.FindPicEx(x1, y1, x2, y2, picName, deltaColor, sim, dir)
  if (ret.length > 0) {
    return ret.split('|').map((pic: string) => {
      const [index, x, y] = pic.split(',')
      return { index: Number(index), x: Number(x), y: Number(y) }
    })
  } else return []
}
const getColor = (x: number, y: number): string => {
  return dll.GetColor(x, y)
}
const getColorNum = (x1: number, y1: number, x2: number, y2: number, color: string, sim: number): number => {
  return dll.GetColorNum(x1, y1, x2, y2, color, sim)
}
const getAveRGB = (x1: number, y1: number, x2: number, y2: number): string => {
  return dll.GetAveRGB(x1, y1, x2, y2)
}
const findColor = (x1: number, y1: number, x2: number, y2: number, color: string, sim: number, dir: FindDir): Coordinate | undefined => {
  let x = new winax.Variant(-1, 'byref')
  let y = new winax.Variant(-1, 'byref')
  const ret = dll.FindColor(x1, y1, x2, y2, color, sim, dir, x, y)
  if (ret) {
    return {
      x: Number(x),
      y: Number(y)
    }
  }
}
const getNowDict = (): number => {
  return dll.GetNowDict()
}
const setDict = (index: number, file: string): DmRet => {
  return dll.SetDict(index, file)
}
const findStr = (x1: number, y1: number, x2: number, y2: number, str: string, colorFormat: string, sim: number): FindRet | undefined => {
  let x = new winax.Variant(-1, 'byref')
  let y = new winax.Variant(-1, 'byref')
  const index = dll.FindStr(x1, y1, x2, y2, str, colorFormat, sim, x, y)
  if (index !== -1) {
    return {
      index,
      x: Number(x),
      y: Number(y)
    }
  }
}
const ocr = (x1: number, y1: number, x2: number, y2: number, colorFormat: string, sim: number): string => {
  return dll.Ocr(x1, y1, x2, y2, colorFormat, sim)
}
const getWords = (x1: number, y1: number, x2: number, y2: number, colorFormat: string, sim: number): OcrRet | undefined => {
  const words = dll.GetWords(x1, y1, x2, y2, colorFormat, sim)
  if (words.length > 0) {
    const info = words.split('|')
    return {
      x: Number(info[0]),
      y: Number(info[1]),
      words: info[2]
    }
  }
}
const getScreenSize = (): Size => {
  return {
    width: dll.GetScreenWidth(),
    height: dll.GetScreenHeight()
  }
}
export {
  dll,
  getPath,
  setPath,
  setErrorDisplay,
  getKeyState,
  setMouseRange,
  moveTo,
  leftClick,
  leftDoubleClick,
  leftDown,
  leftUp,
  rightClick,
  rightDown,
  rightUp,
  wheelDown,
  wheelUp,
  keyPress,
  keyDown,
  keyUp,
  findWindow,
  getCursorPos,
  getClientSize,
  moveWindow,
  setWindowSize,
  setWindowState,
  sendPaste,
  sendString,
  bindWindow,
  unBindWindow,
  capture,
  findPic,
  findPicEx,
  getColor,
  getColorNum,
  getAveRGB,
  findColor,
  getNowDict,
  setDict,
  findStr,
  ocr,
  getWords,
  getScreenSize,
  getWindow,
  getPointWindow
}
