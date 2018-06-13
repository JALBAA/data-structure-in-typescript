import {LoopCallback, BinaryTree} from '../binaryTree/BinaryTree'
import {TreeNode} from '../binaryTree/TreeNode'

export enum AVLBalance {
    BALANCED = 0,
    LEFT_HEAVY = 1,
    RIGHT_HEIAVY = -1,
}
export type Compare<T> = (v1: T | null, v2: T | null) => number
export class AVLNode<T> extends TreeNode<T> {
    leftChild: AVLNode<T> | null = null
    rightChild: AVLNode<T> | null = null
    parent: AVLNode<T> | null = null
    hidden: number = 0
    factor: AVLBalance = AVLBalance.BALANCED
}
export class AVLTree<T> extends BinaryTree<T> {
    root: AVLNode<T> | null = null
    balance: Boolean = true
    constructor (root: AVLNode<T>, compare?: Compare<T>) {
        super(root)
        if (root) {
            this.root = root
        }
        if (compare) {
            this.compare = compare
        }
    }
    private compare: Compare<T> = (v1: T | null, v2: T | null) => {
        if (v1 == null || v2 == null) throw new Error('无效的比较')
        if (typeof v1 == 'number' && typeof v2 == 'number') {
            if (v1 < v2) {
                return -1
            } else if (v1 > v2) {
                return 1
            } else {
                return 0
            }
        } else {
            throw new Error('不支持的比较类型，需要用户自定义compare函数')
        }
    }
    private rotate_left (node: AVLNode<T>) {
        if (node.leftChild && node.leftChild.factor == AVLBalance.LEFT_HEAVY) {
            const left = node.leftChild
            // ll
            /*
        1.
                    parent
                node
            left     
        ll      lr
        
        2.
                    parent
                node
            lr
            
            left
        ll
            
        3.
            left    parent
        ll      node
            lr
        
        4.
                parent
            left
        ll      node
            lr
            */
            node.leftChild = node.leftChild.rightChild
            if (node.leftChild && node.leftChild.rightChild)
                node.leftChild.rightChild.parent = node.leftChild
            left.rightChild = node
            if (!node.parent) {
                this.root = left
            }
            node.parent = left
        } else if (node.leftChild && node.leftChild.rightChild) {
            // lr
            const grandChild = node.leftChild.rightChild
        }
    }
    insert (_node: AVLNode<T> | T, parent?: AVLNode<T>) {
        let node
        if (_node instanceof AVLNode) {
            node = _node
        } else {
            node = new AVLNode(_node)
        }
        if (!this.root) {
            this.root = node
        } else {
            if (!parent) {
                parent = this.root as AVLNode<T>
            }
            const cmpval = this.compare(node.data, parent.data)
            if (cmpval < 0) {
                // move to left
                if (parent.leftChild) {
                    node.factor = AVLBalance.LEFT_HEAVY
                    this.insert(node, parent.leftChild)
                } else {
                    // console.log('222',node, parent)
                    parent.insertLeft(node)
                    node.parent = parent
                    this.balance = false
                }
            } else if (cmpval > 0) {
                // move to right
                if (parent.rightChild) {
                    this.insert(node, parent.rightChild)
                } else {
                    node.parent = parent
                    parent.insertRight(node)
                }
            } else {
                // Handle finding a copy of the data
            }
        }
        // banlance
        if (!this.balance && parent) {
            switch (parent.factor) {
                case AVLBalance.LEFT_HEAVY:
                    this.rotate_left(parent)
                    this.balance = true
                break
                case AVLBalance.BALANCED:
                    parent.factor = AVLBalance.LEFT_HEAVY
                break
                case AVLBalance.RIGHT_HEIAVY:
                    parent.factor = AVLBalance.RIGHT_HEIAVY
                    this.balance = true
                break
            }
        }
    }
}

let root = new AVLNode(50)
let tree = new AVLTree(root)

tree.insert(25)

tree.insert(15)

tree.insert(12)

// console.log(tree)

tree.forEachPreOrder((data, idx) => {
    console.log(data, idx)
})