class PriorityQueue {
  #compare = (a, b) => a - b;
  #heap = new Array(64);
  #size = 0;

  constructor(comparator) {
    if (comparator) {
      this.#compare = comparator;
    }
  }

  insert(value) {
    const heap = this.#heap;
    const size = ++this.#size;

    if (size === heap.length) heap.length *= 2;

    heap[size] = value;
    this.percolateUp();
  }

  percolateUp() {
    const heap = this.#heap;
    const size = this.#size;
    const compare = this.#compare;

    let pos = size;
    const current = heap[pos];

    while (pos > 1) {
      const parent = heap[Math.floor(pos / 2)];
      if (compare(parent, current) <= 0) break;
      heap[pos] = parent;
      pos = Math.floor(pos / 2);
    }

    heap[pos] = current;
  }

  shift() {
    const heap = this.#heap;
    const root = heap[1];
    if (!root) return undefined;
    const size = --this.#size;

    heap[1] = heap[size + 1];
    heap[size + 1] = undefined;
    this.perlocateDown();
    return root;
  }

  perlocateDown() {
    const heap = this.#heap;
    const compare = this.#compare;
    const size = this.#size;

    let pos = 1;
    const current = heap[pos];

    while (pos * 2 <= size) {
      let childIndex = pos * 2 + 1;
      if (childIndex > size || compare(heap[pos * 2], heap[childIndex]) < 0)
        childIndex = pos * 2;
      const child = heap[childIndex];
      if (compare(current, child) <= 0) break;
      heap[pos] = child;
      pos = childIndex;
    }

    heap[pos] = current;
  }

  toString() {
    return this.#heap;
  }

  isEmpty() {
    return this.#size === 0;
  }
}

const pq = new PriorityQueue((a, b) => b - a);

pq.insert(5);
pq.insert(2);
pq.insert(10);
pq.insert(14);
pq.insert(7);
pq.insert(3);
pq.insert(1);
pq.insert(2);

while (!pq.isEmpty()) {
  console.log(pq.shift());
}
