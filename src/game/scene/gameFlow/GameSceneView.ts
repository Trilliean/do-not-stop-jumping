// TypeScript file
class GameSceneView extends egret.Sprite{
    public static _gameScene:GameSceneView;
    private gameSceneContainer:egret.Sprite;
    //暂停场景
    private _gamePauseView:GamePauseView;
    private _pointer:egret.Bitmap;
    private _PointerCenter:egret.Bitmap;
    private _PointerCenterData:egret.BitmapData;
    private _PointerData:egret.BitmapData;
    private _bird:egret.Bitmap;
    private _birdData:egret.BitmapData;
    private _vcLocation:Array<egret.Point>;
    private _idOfCurLocation:number;
    private _birdWithoutShadow:egret.Bitmap;

    private _curScore:number;;


    constructor(displayContainerObject:egret.DisplayObjectContainer){
        super();
        GameSceneView._gameScene = this;
        this._curScore = 0;
        this._gamePauseView = new GamePauseView(displayContainerObject);
        this.initView(displayContainerObject);
        
    }

    public initView(displayContainerObject:egret.DisplayObjectContainer):void{
        //this.gameSceneContainer = new egret.Sprite();
        //this.addChild(this.gameSceneContainer);
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00);
        shape.graphics.drawRect(0, 0, displayContainerObject.stage.stageWidth, displayContainerObject.stage.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);

        
        
        var JumpBtn:egret.Bitmap;
        var JumpBtnData:egret.BitmapData;
        JumpBtn = ResourceUtils.createBitmapByName("JumpBtn_png");
        JumpBtnData = new egret.BitmapData(JumpBtn);
        JumpBtn.x = 320 - JumpBtnData.width / 2;
        JumpBtn.y = 820;
        JumpBtn.touchEnabled = true;
        JumpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jump, this);

        this._PointerCenter = ResourceUtils.createBitmapByName("pointerCenter_png");

        this._PointerCenterData = new egret.BitmapData(this._PointerCenter);
        this._PointerCenter.x = 320  - this._PointerCenterData.width / 2.0;
        this._PointerCenter.y = 568 - this._PointerCenterData.height / 2.0 ;
        
        this._pointer = ResourceUtils.createBitmapByName("pointer_png");
        this._PointerData = new egret.BitmapData(this._pointer);
        
        this._bird = ResourceUtils.createBitmapByName("shadow_png");
        this._birdData = new egret.BitmapData(this._bird);
        this._bird.x = 120;
        this._bird.y = 400;

        this._birdWithoutShadow = ResourceUtils.createBitmapByName("BirdWithoutShadow_png");
        this._birdWithoutShadow.x = this._bird.x;
        this._birdWithoutShadow.y = this._bird.y - 101;

        //可跳跃的4个点的坐标
        this._vcLocation = [
            new egret.Point(120, 350),
            new egret.Point(120, 627),
            new egret.Point(397, 627),
            new egret.Point(397, 350),
            
        ];
        this._idOfCurLocation = 0;

        this.addChild(this._PointerCenter);
        this.addChildAt(this._pointer, 1);
        this.addChild(this._bird);
        this.addChild(JumpBtn);
        this.addChild(this._birdWithoutShadow);

        this._pointer.addEventListener(egret.Event.ENTER_FRAME, (evt:egret.Event)=>{
            //this._pointer.rotation += 10;
            this._pointer.anchorOffsetX = this._PointerData.width / 2;
            this._pointer.anchorOffsetY = this._PointerData.height - this._PointerData.height / 20;
            this._pointer.x = this._PointerCenter.x + this._PointerCenterData.width / 2;
            this._pointer.y = this._PointerCenter.y + this._PointerCenterData.height / 2;

            this._pointer.rotation += 3;
           
        var birdPoint:egret.Point = new egret.Point(this._bird.x, this._bird.y);
        if(this.pointerCoinsideWithBird(birdPoint, this._pointer.rotation)){
            console.log("game over!")
        }
        //    if((this._bird.x == 120 && this._bird.y == 627) ||
        //             (this._bird.x == 120 && this._bird.y == 350) ||
        //             (this._bird.x == 397 && this._bird.y == 350) ||
        //             (this._bird.x == 397 && this._bird.y == 627)
        //          ){
        //              if(this._pointer.rotation == 45 || 
        //                 this._pointer.rotation == 135 || 
        //                 this._pointer.rotation == -135 || 
        //                 this._pointer.rotation == -45){
        //                     console.log("game over");
        //                 }
        //          }

        }
        ,this);
    }

    public play():void{
        //this.removeChildren();
        
    }

    //点击Jump按钮后执行：
    public jump():void{
        //保证当前位置的id不超过3（数组下标最大值）
         if(this._idOfCurLocation >= 3){
             this._idOfCurLocation -= 4;
         }
         this._curScore ++;
         //下一个跳跃的点为当前点的下一个
         egret.Tween.get(this._bird).to({x: this._vcLocation[this._idOfCurLocation + 1].x, y: this._vcLocation[this._idOfCurLocation + 1].y}, 200, egret.Ease.sineIn);
         console.log("current score:"+this._curScore);
         //改变影子和本体的距离创造出跳跃感
        //  this.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
        //  }, this._bird);
        this._idOfCurLocation += 1;
         switch(this._idOfCurLocation){
             case 1:
                this._bird.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
                    this._birdWithoutShadow.x = this._bird.x;
                    this._birdWithoutShadow.y = this._bird.y - 30 * (Math.sin((this._bird.y - 350) * Math.PI / 277)) - 101;     
                }, this._bird);
                console.log("从上到下");
                break;
             case 2:
                this._bird.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
                    this._birdWithoutShadow.x = this._bird.x;
                    this._birdWithoutShadow.y = this._bird.y - 30 * (Math.sin((this._bird.x - 120) * Math.PI / 277)) - 101;
                    
                },this._bird);
                
                console.log("从左往右");
                break;
             case 3:
                this._bird.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
                    this._birdWithoutShadow.x = this._bird.x;
                    this._birdWithoutShadow.y = this._bird.y - 30 * (Math.sin((this._bird.y - 350) * Math.PI / 277)) - 101;;
                    //console.log(this._birdWithoutShadow.y);
                }, this._bird);
                console.log("从下到上");
                break;
             default:
                this._bird.addEventListener(egret.Event.ENTER_FRAME,(evt:egret.Event)=>{
                    this._birdWithoutShadow.x = this._bird.x;
                    this._birdWithoutShadow.y = this._bird.y - 30 * (Math.sin((397 - this._bird.x) * Math.PI / 277)) - 101;
                    
                },this._bird);
                console.log("从右往左");
                break;
         }

         
         console.log(this._idOfCurLocation);
    }
    
    public gameOver():void{
        var gameOverView:GameOverView = new GameOverView(0,0);
        this.addChild(gameOverView);
    }

    private getBirdPosition(bird:egret.Sprite):egret.Point{
        var pos:egret.Point;
        pos = new egret.Point(bird.x, bird.y);
        
        return pos;
    }

    private pointerCoinsideWithBird(bird:egret.Point, rotation:number):boolean{
        if(bird.x == 120 && bird.y == 350 && rotation == -45){
            return true;
        }else if(bird.x == 120 && bird.y == 627 && rotation == -135){
            return true;
        }else if(bird.x == 397 && bird.y == 627 && rotation == 135){
            return true;
        }else if(bird.x == 397 && bird.y == 350 && rotation == 45){
            return true;
        }else{
            return false;
        }
    }
    // private getY(y:number):number{
        
    // }
}