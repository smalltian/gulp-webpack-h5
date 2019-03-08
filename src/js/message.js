/* * @Author: zhujuntian  * @Date: 2018-10-22 14:51:32 */

//解决 es6新的api支持 浏览器兼容 同webpack才有效
// require("babel-polyfill");

/**
 * ts实例
 */
class Timer {

    constructor(){
        this.name = "zhujuntian";
    }

    /**
     * 获取当前时间
     */
    getTime(){
        let today = new Date();
        console.log("当前日期："+today);
        return today;
    }
}

function test(){
    // alert(1111);
    return new Promise((resolve,reject)=>{
        alert(1111);
        resolve("2222111");
    });
}

let a =1;

new Vue({
    el:"#app",
    data(){
        return{
            msg:"gulp构建项目",
            date:''
        }
    },
    mounted(){
        let m = 'es6';
        let timer = new Timer();
        this.date = timer.getTime();
    },
    methods:{
        add(){
            console.log("add");
        }
    }
})

test();