/**
 * Created by shaomingquan on 16/1/19.
 */
(function(W){

    var cp = function(config){
        //字符画渲染地址
        this.stage = config.stage;
        //图片地址
        this.url = config.url;
        //填充字符
        this.char = config.char;
        //分割粒度(单位px)
        this.slength = config.slength;
    }

    cp.prototype.go = function(){

        //下载图片,drawImage为异步回调
        this.getImgDownload(this.url ,this.drawImage);
    }

    cp.prototype.getImgDownload = function(url ,callback){
        var img = document.createElement("img");
        var _this = this;
        img.onload = function(){
            //切割边角
            _this.width = this.width - this.width % _this.slength;
            _this.height = this.height - this.height % _this.slength;
            _this.img = img;
            //开始绘图
            callback.call(_this);
        };
        img.src = url;
    }

    cp.prototype.getCanvasContext = function(){
        var c = document.createElement("canvas");
        c.height = this.height , c.width = this.width;
        var ctx = c.getContext("2d");
        return ctx;
    }

    cp.prototype.drawImage = function(){
        //将图片渲染至canvas
        var ctx = this.getCanvasContext();
        ctx.drawImage(this.img, 0, 0);
        //处理canvas像素信息
        this.dealPixelData(ctx.getImageData(0,0,this.width,this.height).data);
    }
    
    cp.prototype.dealPixelData = function(data){
        //得到一个span
        function getASpanWithContent(content){
            var result = document.createElement("span");
            result.innerHTML = content;
            return result;
        }
        //得到一个<br>换行
        function getABr(){
            return document.createElement("br");
        }
        //得到color的rgba代码
        function getColor(data){
            return "rgba("+ data.r +","+ data.g +","+ data.b +","+ data.a +")";
        }

        //得到格式化后的颜色数据
        var fData = this.formatData(data)
            ,slength = this.slength
            ,nWidth = this.width / slength
            ,currentSpan = null
            ,currentBr = null
            ,char = this.char
            ,stage = this.stage;

        //渲染到stage
        fData.forEach(function(item ,index){
            currentSpan = getASpanWithContent(char);
            currentSpan.style.color = getColor(item);
            stage.appendChild(currentSpan);
            if((index + 1) % nWidth == 0){
                currentBr = getABr();
                stage.appendChild(currentBr);
            }
        })
    }

    cp.prototype.formatData = function(data){

        var slength = this.slength;
        var nWidth = (this.width / slength);
        var nHeight = (this.height / slength);

        var arrlength = nWidth * nHeight;
        var currentPx = null;
        var arr = [];
        var i = 0,j = 0;

        //各个方块左顶点坐标
        for( ; j < nHeight ; j ++){
            for( ; i < nWidth ; i ++){
                //console.log(j * slength * nWidth + i * slength)
                arr.push(getSquareAve(j * slength * slength * nWidth + i * slength));
            }
            i = 0;
        }

        //得到方块区域颜色均值(算法有些慢)
        function getSquareAve(index){
            var i = 0;
            var j = 0;
            var currentPx = null;
            var resultBuffer = {
                r : 0 ,
                g : 0 ,
                b : 0 ,
                a : 0
            }
            var result = {
                r : 0 ,
                g : 0 ,
                b : 0 ,
                a : 0
            }
            for( ; i < slength ; i ++){

                for( ; j < slength ; j ++){
                    currentPx = getThePx( index + i * slength * nWidth + j );
                    resultBuffer.r += currentPx.r;
                    resultBuffer.g += currentPx.g;
                    resultBuffer.b += currentPx.b;
                    resultBuffer.a += currentPx.a;
                }

                for(attr in resultBuffer){
                    resultBuffer[attr] = parseInt(resultBuffer[attr] / slength);
                }

                for(attr in result){
                    result[attr] += resultBuffer[attr];
                }

                for(attr in resultBuffer){
                    resultBuffer[attr] = 0;
                }

                j = 0;

            }
            for(attr in result){
                result[attr] = parseInt(result[attr] / slength);
            }
            return result;

        }

        //得到第index个像素的颜色信息
        function getThePx(index){
            return {
                r : data[index * 4 + 0] || 0 ,
                g : data[index * 4 + 1] || 0 ,
                b : data[index * 4 + 2] || 0 ,
                a : data[index * 4 + 3] || 0
            }
        }

        return arr;
    }

    //抛出
    W.cp = cp;

})(window)
