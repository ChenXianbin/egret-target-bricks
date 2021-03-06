namespace egret {
    export type Size = { width: number, height: number };
    export type Vec3 = { x: number, y: number, z: number };
    export type Color = { r: number, g: number, b: number, a: number };

    export class BKDisplayObject extends egret.DisplayObject {
        /**
         * @internal
         */
        public _transformDirty: boolean = true;
        /**
         * @internal
         */
        public _colorDirty: number = 0;
        /**
         * @internal
         */
        public readonly _color: Color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        /**
         * @internal
         */
        public _bkNode: BK.Node;

        public constructor(bkNode: BK.Node | null = null) {
            super();

            this._bkNode = bkNode || new BK.Node();
        }

        protected _replaceNode(node: BK.Node): void {
            this._transformDirty = true;

            node.vertexColor = this._bkNode.vertexColor;
            node.hidden = this._bkNode.hidden;
            (node as any).blendMode = (this._bkNode as any).blendMode;
            node.zOrder = this._bkNode.zOrder;

            if (this._bkNode.parent) {
                this._bkNode.parent.addChild(node, this.parent.getChildIndex(this));
                this._bkNode.parent.removeChild(this._bkNode);
            }

            this._bkNode = node;
        }

        protected _updateSelfColor(): void {
            this._bkNode.vertexColor = this._color;
        }

        protected _updateBKNodeMatrix(): void {
            const matrix = this.$getMatrix();
            const bkMatrix = (this._bkNode.transform as any).matrix;
            let tx = matrix.tx;
            let ty = matrix.ty;
            const pivotX = this.$anchorOffsetX;
            const pivotY = this.$anchorOffsetY;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }

            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
        }
        /**
         * @internal
         */
        public _updateColor(): void {
            const parent = <any>this.$parent as BKDisplayObject;
            if (parent) {
                if (this._colorDirty === 2 || parent._colorDirty !== 0) {
                    this._colorDirty = 1;
                    this._color.a = parent._color.a * this.$alpha;
                    this._updateSelfColor();
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
            else {
                if (this._colorDirty === 2) {
                    this._colorDirty = 1;
                    this._color.a = this.$alpha;
                    this._updateSelfColor();
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
        }
        /**
         * @override
         */
        $setVisible(value: boolean): void {
            super.$setVisible(value);

            // MD
            this._bkNode.hidden = !value;
        }
        /**
         * @override
         */
        $setAlpha(value: number): void {
            super.$setAlpha(value);

            // MD
            this._colorDirty = 2; // self and child.
        }
        /**
         * @override
         */
        public set blendMode(value: string) {
            let self = this;
            let mode = sys.blendModeToNumber(value);
            self.$blendMode = mode;

            // if (egret.nativeRender) {
            //     self.$nativeDisplayObject.setBlendMode(mode);
            // }
            // else {
            (self as any).updateRenderMode(); // MD
            let p = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            let maskedObject = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
            // }

            // MD
            switch (value) {
                case egret.BlendMode.NORMAL:
                    (this._bkNode as any).blendMode = 1;
                    break;

                case egret.BlendMode.ADD:
                    (this._bkNode as any).blendMode = 0;
                    break;

                case egret.BlendMode.ERASE:
                    break;

                default:
                    break;
            }
        }
        /**
         * @override
         */
        public set mask(value: DisplayObject | Rectangle) {
            let self = this;
            if (value === self) {
                return;
            }

            if (!(this instanceof BKBitmap)) {
                console.log("QQ 玩一玩不支持该种类型的影片剪辑被遮罩，只有 Bitmap 类型可以被遮罩，或不使用遮罩。");
                return;
            }

            if (value) {
                if (value instanceof BKBitmap) { // 只支持 bitmap 遮罩，其他全不支持
                    if (value == self.$mask) {
                        return;
                    }
                    if (value.$maskedObject) {
                        value.$maskedObject.mask = null;
                    }
                    value.$maskedObject = self;
                    (value as any)._updateBKNodeMatrix();
                    self.$mask = value;

                    const clipNode = new BK.ClipNode(value._bkNode as BK.Sprite);
                    clipNode.zOrder = this._bkNode.zOrder;
                    clipNode.alphaThreshold = 0.5;
                    clipNode.inverted = false;
                    if (this._bkNode.parent) {
                        this._bkNode.parent.addChild(clipNode, this.parent.getChildIndex(this));
                        this._bkNode.parent.removeChild(this._bkNode);
                    }

                    clipNode.addChild(this._bkNode as any);

                    // if (!egret.nativeRender) {
                    //     value.updateRenderMode();
                    // }
                    // if (self.$maskRect) {
                    //     if (egret.nativeRender) {
                    //         self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                    //     }
                    //     self.$maskRect = null;
                    // }
                    // if (egret.nativeRender) {
                    //     self.$nativeDisplayObject.setMask(value.$nativeDisplayObject.id);
                    // }
                }
                else {
                    // if (!self.$maskRect) {
                    //     self.$maskRect = new egret.Rectangle();
                    // }
                    // self.$maskRect.copyFrom(value);
                    // if (egret.nativeRender) {
                    //     self.$nativeDisplayObject.setMaskRect(value.x, value.y, value.width, value.height);
                    // }
                    // if (self.$mask) {
                    //     self.$mask.$maskedObject = null;
                    //     if (!egret.nativeRender) {
                    //         self.$mask.updateRenderMode();
                    //     }
                    // }
                    // if (self.mask) {
                    //     if (egret.nativeRender) {
                    //         self.$nativeDisplayObject.setMask(-1);
                    //     }
                    //     self.$mask = null;
                    // }
                    console.log("QQ 玩一玩不支持该种类型的遮罩，请使用 Bitmap 遮罩，或不使用遮罩。");
                }
            }
            else {
                if (self.$mask) {
                    // self.$mask.$maskedObject = null;
                    // if (!egret.nativeRender) {
                    //     self.$mask.updateRenderMode();
                    // }
                }
                if (self.mask) {
                    // if (egret.nativeRender) {
                    //     self.$nativeDisplayObject.setMask(-1);
                    // }

                    // MD
                    const clipNode = this._bkNode.parent;
                    if (clipNode && clipNode.parent) {
                        this._bkNode.zOrder = clipNode.zOrder;
                        clipNode.parent.addChild(this._bkNode, this.parent.getChildIndex(this));
                        clipNode.parent.removeChild(clipNode);
                    }
                    else {
                        // Never.
                    }

                    self.$mask = null;
                }
                if (self.$maskRect) {
                    // if (egret.nativeRender) {
                    //     self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                    // }
                    self.$maskRect = null;
                }
            }

            // if (!egret.nativeRender) {
            (self as any).updateRenderMode();
            // }
        }
        /**
         * @override
         */
        $setX(value: number): boolean {
            let self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;

            // MD
            this._transformDirty = true;

            return true;
        }

        /**
         * @override
         */
        $setY(value: number): boolean {
            let self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;

            // MD
            this._transformDirty = true;

            return true;
        }

        /**
         * @override
         */
        $setScaleX(value: number) {
            super.$setScaleX(value);

            // MD
            this._transformDirty = true;
        }

        /**
         * @override
         */
        $setScaleY(value: number) {
            super.$setScaleY(value);

            // MD
            this._transformDirty = true;
        }

        /**
         * @override
         */
        $setRotation(value: number) {
            super.$setRotation(value);

            // MD
            this._transformDirty = true;
        }

        /**
         * @override
         */
        $setSkewX(value: number) {
            super.$setSkewX(value);

            // MD
            this._transformDirty = true;
        }

        /**
         * @override
         */
        $setSkewY(value: number) {
            super.$setSkewY(value);

            // MD
            this._transformDirty = true;
        }

        /**
         * @override
         */
        $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): void {
            super.$setMatrix(matrix, needUpdateProperties);

            // MD
            this._transformDirty = true;
        }


        /**
         * @override
         */
        public get scrollRect(): Rectangle {
            return this.$scrollRect;
        }

        /**
         * @override
         */
        public set scrollRect(value: Rectangle) {
            this.setScrollRect(value);
        }

        private scrollRectNode: BK.Node = null;

        setScrollRect(value: Rectangle): void {
            if (value) {
                super['$setScrollRect'].call(this, value);
                let rect = this.$scrollRect;
                if (this.scrollRectNode) {
                    let clipRectNode: BK.ClipRectNode = this._bkNode as any;
                    clipRectNode.clipRegion = { x: 0, y: this.height + 1, width: rect.width, height: -rect.height - 1 };
                    this.scrollRectNode.position = { x: rect.x, y: rect.y };
                    this._transformDirty = true;
                } else {
                    let parent = this._bkNode.parent;
                    this.scrollRectNode = this._bkNode;
                    //bk.error
                    //sprite9节点不支持removefromparent
                    // this._bkNode.removeFromParent();
                    if (this._bkNode.parent) {
                        this._bkNode.parent.removeChild(this._bkNode);
                    }
                    let clipRectNode = new BK.ClipRectNode(0, this.height + 1, rect.width, -rect.height - 1);
                    if (parent) {
                        parent.addChild(clipRectNode);
                    }
                    clipRectNode.addChild(this.scrollRectNode);
                    this._bkNode = clipRectNode;
                    this.scrollRectNode.position = { x: rect.x, y: rect.y };
                    this._transformDirty = true;
                }
            } else {
                if (this.scrollRectNode) {
                    let scrollRectNode = this.scrollRectNode;
                    let parent = this._bkNode.parent;
                    //bk.error
                    //sprite9节点不支持removefromparent
                    // scrollRectNode.removeFromParent();
                    // this._bkNode.removeFromParent();
                    if (scrollRectNode.parent) {
                        scrollRectNode.parent.removeChild(scrollRectNode);
                    }
                    if (parent) {
                        parent.removeChild(this._bkNode);
                    }
                    scrollRectNode.position = { x: this._bkNode.position.x, y: this._bkNode.position.y };
                    parent.addChild(scrollRectNode);
                    this._bkNode = scrollRectNode;
                    this.scrollRectNode = null;
                    this._transformDirty = true;
                }
            }
        }






        /**
         * @override
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let self = this;
            if (!self.$visible) { // MD
                return null;
            }
            let m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
                return null;
            }
            let bounds = self.$getContentBounds();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。
                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return self;
            }
            return null;
        }
        /**
         * @override
         */
        $getRenderNode(): sys.RenderNode {
            let self = this;
            // let node = self.$renderNode;
            let node = self._bkNode as any; // MD
            if (!node) {
                return null;
            }

            self._updateColor(); // MD

            if (self.$renderDirty) {
                // node.cleanBeforeRender(); // MD
                self.$updateRenderNode();
                self.$renderDirty = false;
                // node = self.$renderNode;
                node = self._bkNode as any; // MD
            }

            // MD
            if (self._transformDirty) {
                self._transformDirty = false;
                this._updateBKNodeMatrix();
            }

            return node;
        }
        /**
         * @override
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index < 0) {
                BKPlayer.instance._displayList.push(this);
            }
        }
        /**
         * @override
         */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index >= 0) {
                BKPlayer.instance._displayList.splice(index, 1);
            }
        }

        public invalidUpdate(): void {
            this.$getRenderNode();
        }
    }

    if (window['renderMode'] != 'webgl') {
        egret.DisplayObject = egret.BKDisplayObject;
    }
}
