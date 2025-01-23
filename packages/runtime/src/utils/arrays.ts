import type { Nullable } from '@/types';

export function filterNonNullable<T>(arr: ReadonlyArray<Nullable<T>>): T[] {
  return arr.filter((value): value is T => value != null);
}

export function calculateArrayDifference<T>(
  originalArray: ReadonlyArray<T>,
  updatedArray: ReadonlyArray<T>
): { added: T[]; removed: T[] } {
  return {
    added: updatedArray.filter((element) => !originalArray.includes(element)),
    removed: originalArray.filter((element) => !updatedArray.includes(element)),
  };
}

export const ArrayDiffOperationType = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
} as const;

export class IndexedArrayTracker<T> {
  #trackedArray: T[];
  #originalItemIndices: number[];
  #compareFn: (a: T, b: T) => boolean;

  constructor(array: ReadonlyArray<T>, compareFn: (a: T, b: T) => boolean) {
    this.#trackedArray = [...array];
    this.#originalItemIndices = array.map((_, i) => i);
    this.#compareFn = compareFn;
  }

  get length() {
    return this.#trackedArray.length;
  }

  isRemovedFromArray(currentIndex: number, updatedArray: ReadonlyArray<T>): boolean {
    if (currentIndex >= this.length) return false;
    const compareFn = this.#compareFn;
    const trackedArray = this.#trackedArray;
    return !updatedArray.some((updatedItem) => compareFn(trackedArray[currentIndex], updatedItem));
  }

  isUnchangedItem(currentIndex: number, updatedArray: ReadonlyArray<T>): boolean {
    if (currentIndex >= this.length) return false;
    return this.#compareFn(this.#trackedArray[currentIndex], updatedArray[currentIndex]);
  }

  removeItem(currentIndex: number) {
    const [item] = this.#trackedArray.splice(currentIndex, 1);
    const [originalIndex] = this.#originalItemIndices.splice(currentIndex, 1);
    return { op: ArrayDiffOperationType.REMOVE, index: currentIndex, item, originalIndex };
  }

  addItem(currentItem: T, currentIndex: number) {
    this.#trackedArray.splice(currentIndex, 0, currentItem);
    this.#originalItemIndices.splice(currentIndex, 0, -1);
    return { op: ArrayDiffOperationType.ADD, index: currentIndex, item: currentItem };
  }

  moveItem(currentItem: T, targetIndex: number) {
    const sourceIndex = this.#trackedArray.findIndex((item) => this.#compareFn(item, currentItem));
    if (sourceIndex === -1) throw new Error('Item not found');
    const [movedItem] = this.#trackedArray.splice(sourceIndex, 1);
    const [originalIndex] = this.#originalItemIndices.splice(sourceIndex, 1);

    this.#trackedArray.splice(targetIndex, 0, movedItem);
    this.#originalItemIndices.splice(targetIndex, 0, originalIndex);

    return {
      op: ArrayDiffOperationType.MOVE,
      sourceIndex,
      targetIndex,
      item: movedItem,
      originalIndex,
    };
  }

  removeRemainingItems(fromIndex: number) {
    const operations = [];
    while (this.length > fromIndex) {
      operations.push(this.removeItem(fromIndex));
    }
    return operations;
  }

  findItemIndex(item: T, fromIndex: number): number {
    const length = this.length;
    const compareFn = this.#compareFn;
    const trackedArray = this.#trackedArray;

    if (fromIndex < 0 || fromIndex >= length) {
      return -1;
    }
    for (let i = fromIndex; i < length; i++) {
      if (compareFn(item, trackedArray[i])) {
        return i;
      }
    }
    return -1;
  }

  noopItem(index: number) {
    return {
      op: ArrayDiffOperationType.NOOP,
      index,
      item: this.#trackedArray[index],
      originalIndex: this.#originalItemIndices[index],
    };
  }
}

export function generateArrayTransformationSequence<T>(
  originalArray: ReadonlyArray<T>,
  updatedArray: ReadonlyArray<T>,
  compareFn: (a: T, b: T) => boolean = (a, b) => a === b
) {
  const transformationSteps = [];
  const tracker = new IndexedArrayTracker(originalArray, compareFn);

  for (let currentIndex = 0; currentIndex < updatedArray.length; currentIndex++) {
    const currentItem = updatedArray[currentIndex];

    if (tracker.isRemovedFromArray(currentIndex, updatedArray)) {
      transformationSteps.push(tracker.removeItem(currentIndex));
      currentIndex--;
      continue;
    }

    if (tracker.isUnchangedItem(currentIndex, updatedArray)) {
      transformationSteps.push(tracker.noopItem(currentIndex));
      continue;
    }

    if (tracker.findItemIndex(currentItem, currentIndex) === -1) {
      transformationSteps.push(tracker.addItem(currentItem, currentIndex));
      continue;
    }

    transformationSteps.push(tracker.moveItem(currentItem, currentIndex));
  }

  transformationSteps.push(...tracker.removeRemainingItems(updatedArray.length));
  return transformationSteps;
}
