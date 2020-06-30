/*
 * @FilePath: /undefined/Users/liuming/Desktop/异步加载静态资源与数组对象的判断/index.js
 * @Author: liuming
 * @Date: 2020-06-27 17:15:59
 * @Last Modified By: liuming
 * @LastEditTime: 2020-06-27 19:29:33
 */ 
class Base{
    // 封装基类Base含有一个isEmpty方法
    isEmpty(params) {
        let type = Object.prototype.toString.call(params)
        if (type === '[object Array]') { // 数组
            console.log(`该数组为${params.length?params.length+'项数据':'空数组'}`);
        } else if (type === '[object Object]') {
            console.log(`该对象为${Object.keys(params).length?Object.keys(params).length+'项数据':'空对象'}`);
        } else {
            console.log('参数类型不是数组或对象');
        }
    }
    async init(arr) {
        let img = null;
        try {
            for (let i = 0; i < arr.length; i++) {
                switch(arr[i].split(".").pop()){
                    case "css":
                        await this.loadCss(arr[i])
                        break;
                    case "js":
                        await this.loadJs(arr[i])
                        break;
                    case "png":
                    case "jpg":
                    case "jpeg":
                        img = await this.loadImg(arr[i])
                    default:
                       throw new Error('类型不支持')
                   }
            }
            return img
        } catch (error) {
            return error
        }
    }
    // 加载js文件
    loadJs(path) {
        return new Promise((res, rej) => {
            let elt = document.createElement("script");
            elt.type = "text/javascript";
            elt.src = path;
            // 添加到html上
            const head = document.getElementsByTagName("head")[0];
            head.appendChild(elt);
            // 判断是否成功加载
            if (this.isLoad(path)) {
                res(elt)
            }else{
                rej('js文件未加载成功')
            }
        })
    }
    // 加载css文件
    loadCss(path) {
        return new Promise((res, rej) => {
            let elt = document.createElement("link");
            elt.rel = "stylesheet";
            elt.href = path;
            // 添加到html上
            const head = document.getElementsByTagName("head")[0];
            head.appendChild(elt);
            // 判断是否成功加载
            if (this.isLoad(path)) {
                res(elt)
            }else{
                rej('css文件未加载成功')
            }
        })
    }
    // 加载img图片
    loadImg(path) {
        return new Promise(function (resolve, reject) {
            const image = new Image();
            // 当图片正确加载会调用onload，进而执行resolve()
            image.onload  = function() {
                resolve(image)
            };
            image.onerror = reject;
            image.src = path;
          });
    }
    // 判断js/css是否成功加载
    isLoad(path) { // path ./a.css
        let isLoad = false;
        const tags = {"js":"script", "css":"link"};
        let tagname = tags[path.split(".").pop()]; // link
        if(tagname != undefined){
            let elts = document.getElementsByTagName(tagname);
            for(let i in elts){
                if((elts[i].href && elts[i].href.toString().includes(path)!="-1") || 
                    (elts[i].src && elts[i].src.toString().includes(path)!="-1")){
                    isLoad = true;
                }
            }
        }
        return isLoad;
    }
}

class Util extends Base{
    
}

var util = new Util();
util.isEmpty([])
util.isEmpty({})
util.isEmpty([{a:1}, {b:2}])
util.isEmpty({c:1, d:2})
util.init(['./a.css', './b.js', './2662596497B24270E935962742766B36.jpg']).then((res) => {
    document.body.appendChild(res)
});
