function trampoline (f) {
    while (f && f instanceof Function) {
        f = f();
    }

    return f;
}

//example
function sum2(x, y) {
    if(y > 0){
        return sum2.bind(null, x + 1, y - 1)
    }else{
        return x
        }
}

trampoline(sum(1, 100000));