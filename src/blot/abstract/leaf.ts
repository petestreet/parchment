import Blot, { Position } from './blot';
import ParentBlot from './parent';
import * as Registry from '../../registry';


abstract class LeafBlot extends Blot {
  static blotName = 'leaf';
  static scope = Registry.Scope.LEAF & Registry.Scope.BLOT;

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  findNode(index: number): [Node, number] {
    return [this.domNode, index];
  }

  findOffset(node: Node): number {
    return node === this.domNode ? 0 : -1;
  }

  findPath(index: number, inclusive: boolean = false): Position[] {
    return [{
      blot: this,
      offset: Math.min(index, this.getLength())
    }];
  }

  format(name: string, value: any): void {
    if (!value) return;
    if (Registry.match(name, Registry.Scope.BLOT)) {
      this.wrap(name, value);
    } else if (Registry.match(name, Registry.Scope.ATTRIBUTE)) {
      let blot = <ParentBlot>this.wrap('inline', true);
      blot.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let blot = this.isolate(index, length);
    blot.format(name, value);
  }

  getFormat(): Object {
    return {}
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref);
  }
}

export default LeafBlot;
