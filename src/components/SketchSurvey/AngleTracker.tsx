export interface Point {
  x: number;
  y: number;
}

export interface AngleExtremes { 
  min: number | null; 
  max: number | null;
  width: number | null;
};

export class AngleTracker {
  private angles: number[] = [];

  addPoint(point: Point, center: Point) {
    const angle = this.calculateAndNormalizeAngle(point, center);
    const index = this.binarySearchInsert(this.angles, angle);
    this.angles.splice(index, 0, angle);
  }

  removePoint(point: Point, center: Point) {
    const angle = this.calculateAndNormalizeAngle(point, center);
    const index = this.angles.indexOf(angle);
    if (index !== -1) this.angles.splice(index, 1);
  }

  getExtremes(): AngleExtremes {
    if (this.angles.length < 2) return { min: null, max: null, width: null };

    let maxGap = 0;
    let maxGapIndex = 0;

    for (let i = 0; i < this.angles.length; i++) {
      const current = this.angles[i];
      const next = this.angles[(i + 1) % this.angles.length];
      const gap = (next - current + 2 * Math.PI) % (2 * Math.PI);

      if (gap > maxGap) {
        maxGap = gap;
        maxGapIndex = i;
      }
    }

    const minAngle = this.angles[maxGapIndex];
    const maxAngle = this.angles[(maxGapIndex + 1) % this.angles.length];

    return { min: minAngle, max: maxAngle, width: 2 * Math.PI - maxGap };
  }

  private calculateAndNormalizeAngle(point: Point, center: Point): number {
    const angle = Math.atan2(point.y - center.y, point.x - center.x);
    return angle < 0 ? angle + 2 * Math.PI : angle; // Normalize to [0, 2π)
  }

  private binarySearchInsert(array: number[], value: number): number {
    let low = 0,
      high = array.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (array[mid] < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }
}