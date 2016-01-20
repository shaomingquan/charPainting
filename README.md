# charPainting

简单地字符画生成lib

## 用法

new cp(config).go();

config为配置,url为图片地址,slength为分割粒度,stage为渲染舞台,char为填充字符

    {
        url:"./example.png" ,
        slength : 1 ,
        stage :document.getElementById("stage") ,
        char:"囧"
    }
    
## 基本思路

使用游离的img和canvas标签读取像素数据,再根据分割粒度读取每个区域的颜色均值
    
## 问题

- 使用example2.jpg的时候运行较慢
- 注意不要使用跨域图片,canvas无法解析跨域的图片