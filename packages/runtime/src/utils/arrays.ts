import { Nullable } from '../types'

export function withoutNulls<T>(arr: Nullable<T>[]): T[] {
  return arr.filter((value) => value != null)
}

export function arraysDiff<T>(oldArray: T[], newArray: T[]) {
  return {
    added: newArray.filter((element) => !oldArray.includes(element)),
    removed: oldArray.filter((element) => !newArray.includes(element)),
  }
}

export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
} as const

export class ArrayWithOriginalIndices<T> {
  #array: T[] = []
  #originalIndices: number[] = []
  #equalsFn: <T, U>(a: T, b: U) => boolean

  constructor(array: T[], equalsFn: (a: any, b: any) => boolean) {
    this.#array = [...array]
    this.#originalIndices = array.map((_, i) => i)
    this.#equalsFn = equalsFn
  }

  get length() {
    return this.#array.length
  }

  isRemoval(index: number, newArray: T[]) {
    if (index >= this.length) {
      return false
    }
    const item = this.#array[index]
    const indexInNewArray = newArray.findIndex((newItem) => this.#equalsFn(item, newItem))
    return indexInNewArray === -1
  }

  removeItem(index: number) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    }
    this.#array.splice(index, 1)
    this.#originalIndices.splice(index, 1)
    return operation
  }

  isNoop(index: number, newArray: T[]) {
    if (index >= this.length) {
      return false
    }
    const item = this.#array[index]
    const newItem = newArray[index]
    return this.#equalsFn(item, newItem)
  }

  originalIndexAt(index: number) {
    return this.#originalIndices[index]
  }

  noopItem(index: number) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index],
    }
  }

  isAddition(item: T, fromIdx: number) {
    return this.findIndexFrom(item, fromIdx) === -1
  }
  findIndexFrom(item: T, fromIdx: number) {
    for (let i = fromIdx; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i
      }
    }
    return -1
  }
  addItem(item: T, index: number) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    }
    this.#array.splice(index, 0, item)
    this.#originalIndices.splice(index, 0, -1)
    return operation
  }

  moveItem(item: T, toIndex: number) {
    const fromIndex = this.findIndexFrom(item, toIndex)

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    }
    const [_item] = this.#array.splice(fromIndex, 1)
    this.#array.splice(toIndex, 0, _item)

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1)
    this.#originalIndices.splice(toIndex, 0, originalIndex)

    return operation
  }

  removeItemsAfter(index: number) {
    const operation = []

    while (this.length > index) {
      operation.push(this.removeItem(index))
    }
    return operation
  }
}

export function arraysDiffSequence(oldArray: any[], newArray: any, equalsFn = (a: any, b: any): boolean => a === b) {
  const sequence = []
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn)
  for (let index = 0; index < newArray.length; index++) {
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index))
      index--
      continue
    }
    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index))
      continue
    }
    const item = newArray[index]

    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index))
      continue
    }
    sequence.push(array.moveItem(item, index))
  }

  sequence.push(...array.removeItemsAfter(newArray.length))

  return sequence
}
