/**
 * 尾部递归优化函数
 * @param {*} func 
 */
function tco (func) {
    var value;
    var active;
    var accumulated = [];

    return function accumulator () {
        accumulated.push(arguments);
        if(!active){
            active = true
            while(accumulated.length){
                value = f.apply(this, accumulated.shift)
            }
            active = false
            return value;
        }
    } 
}


//example
const sum = tco((x,y) => {
    if(y > 0){
        return sum(x+1, y-1);
    }else{
        return x;
    }
});