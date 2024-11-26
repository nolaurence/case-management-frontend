class FixedLengthQueue<T> {
  private _queue: T[];
  private _length: number;
  private _head: number = 0; // 当前队列头部索引

  constructor(length: number) {
    this._length = length;
    this._queue = new Array<T>(length);
  }

  enqueue(item: T): void {
    // 如果队列已满，则从头部开始覆盖
    if (this._queue[this._head] !== undefined) {
      this._queue[this._head] = item;
    } else {
      // 否则，正常插入元素
      this._queue[this._head] = item;
    }
    // 更新头部索引，并进行取模操作以处理数组的循环特性
    this._head = (this._head + 1) % this._length;
  }

  get queue(): T[] {
    // 返回当前队列中的元素，保持插入顺序
    return this._queue.filter(item => item !== undefined);
  }

  get length(): number {
    // 返回实际的元素数量
    return this.queue.length;
  }
}

export default FixedLengthQueue;
