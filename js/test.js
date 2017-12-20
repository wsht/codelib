
// 对象的继承
function inherit(p){
    if(p == null ) throw TypeError(); 

    if(Object.create){
        return Object.create(p);    
    }

    var t = typeof p;
    if(t !== "object" && t !== "function"){
        throw TypeError();
    }
    function f(){};
    f.prototype = p;

    return new f();
}


// 存取器属性定义 示例

var p = {
    // x, y是普通的可读写的数据属性
    x:1.0,
    y:1.0,

    // r 是可读写的属性，它有getter 和 setter
    // 函数体后不要忘记带上逗号
    get r(){ return Math.sqrt(this.x * this.x + this.y * this.y);},
    set r(newvalue){
        var oldvalue = Math.sqrt(this.x * this.x + this.y * this.y);
        var ratio = newvalue / oldvalue;
        this.x *= ratio;
        this.y *= ratio;
    },
    // theta 是只读存取器, 它只有getter方法
    get theta(){return Math.atan2(this.y, this.x);}
};

//和数据属性一样。存取器属性是可以继承的，因此可以讲上述代码中的对象p 当作一个"点"的原型，可以给新对象定义它的x和y属性，但r和theta属性是继承来的

var q  = inherit(p);
q.x = 1;
q.y = 1;
console.log(q.r);
console.log(q.theta);

// #3 这个对象产生严格自增的序列号
var serialnum = {
    // 这个数据属性包含下一个序列号
    // $符号暗示这个属性是一个私有属性
    $n:0,

    // 返回当前值，然后自增
    get next(){ return this.$n++;},

    // 给n设置新的值，但只有当它比当前值大的时候才设置成功
    set next(n){
        if(n >= this.$n)
            this.$n = n;
        else
            throw "序列号的值不能比当前值小";
    }
};

// 返回 Object {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor({x:1}, "x");

// 查询 serialnum 对象的 next 属性
// 返回 Object {get: next(), set: next(n), enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(serialnum, "next");

// 对于继承属性和不存在的属性 返回 undefined
Object.getOwnPropertyDescriptor({}, "x");  //undefined , 没有这个属性
Object.getOwnPropertyDescriptor({},"toString"); //undefined, 继承属性


var o = {};

// 添加一个不可枚举的属性x 并赋值为1 
Object.defineProperty(o, "x", {value:1, writable:true, enumerable:false, configurable:true});

// 属性是存在的 但不可枚举
o.x //=>1;
Object.keys(o); //[];

// 将x 设置为只读
Object.defineProperty(o, "x", {writable:false});

o.x = 2;  // 操作失败但不报错，在严格模式下抛出类型错误异常;
o.x       //=>1

// 属性依然是可配置的，可以用下面的方式进行修改
Object.defineProperty(o, "x", {value:2});

o.x //=>2

// 现将x 从数据属性修改为存储器属性
Object.defineProperty(o, "x", {get:function(){return 0 ;}});

o.x //=> 0;

/**
 * 修改或创建对象的多个属性 -- Object.defineProperties();
 */


var p = Object.defineProperties({}, {
    x:{value:1, writable:true,enumerable:true,configurable:true},
    y:{value:2},
    z:{
        get:function(){return this.x + this.y;},
        enumerable:true,
        configurable:true
    }
});


// 函数


// 计算阶乘的递归函数
function factorial(x){
    if(x <= 1) return 1;
    return x*factorial(x-1);
}
// 函数表达式可以包含名称，这在递归的时候很有用
var f = function fact(x){
    if(x <= 1)
        return 1;
    else
        return x*fact(x-1);
}

// 函数表达式定义后立即调用
var tensquared = (function(x){return x*x;}(10)); //100


// 嵌套函数
function hypotenuse(a, b){
    function square(x){return x*x;};
    return Math.sqrt(square(a) + square(b));
}


// 使用this判断当前是否为严格模式
var strict = (function(){return !this;}());


// 关键字this没有作用域的限制，嵌套函数不会从调用他的函数中继承this
// 如果嵌套函数作为方法调用，其this的值指向调用他的对象。
// 如果嵌套函数作为函数调用，其this的值不是全局对象（非严格模式下）就是undefined（严格模式下）
// 如果想访问这个外部函数的this值，需要将this的值保存在一个变量里，这个变量和内部函数都在同一个作用域内

var o = {
    m:function(){
        var self = this;
        console.log(this === o);//true this就是这个对象o
        f();

        function f(){
            console.log(this); //全局属性 在浏览器窗口下 是window
            console.log(this === o); // false this的值时全局对象或者undefined
            console.log(self === o); // true self指外部函数的this值
        }
    }
}

// 定义一个扩展函数，用来讲第二个以及后续参数至第一个参数
// 这里我们处理了IE bug：在多数IE版本中
// 如果o的属性拥有一个不可枚举的同名属性，则for/in循环
// 不会枚举对象的可枚举属性，也就是说，将不会正确的处理诸如toString的属性
// 除非我们显示检测他

var extend = (function(){//将这个函数的返回值赋值给extend
    // 在修复他之前，首先检查是否存在bug
    for(var p in {toString:null}){
        // 如果代码执行到这，那么for/in循环会正确的工作并返回
        // 一个简单版本的extend()函数
        return function extend(o){
            for(var i=1; i < arguments.length; i++){
                var source = arguments[i];
                for(var prop in source) o[prop] = source[prop];
            }
            return o;
        };
    }

    // 如果代码执行到这里，说明for/in循环不会枚举测试对象的toString属性
    // 因此返回另一个版本的extend()函数
    // 这个函数显示测试Object.prototype中的不可枚举属性
    return function patched_extend(o){
        for(var i = i; i < arguments.length; i++){
            var source = arguments[i];
            // 赋值所有的可枚举属性
            for(var prop in source) o[prop] = source[prop];

            // 现在检查特殊属性
            for(var j = 0; j < protoprops.length; j++){
                prop = protoprops[j];
                if(source.hasOwnproperty(prop)) o[prop] = source[prop];
            }
        }
        return o;
    };
    // 这个列表列出了需要检查的特殊属性
    var protoprops = ["toString","valueOf","constructor","hasOwnproperty","isPrototypeOf","propertyIsEnumerable","toLocaleString"];
}())


// 闭包

var scope = "global scope"; //全局变量
function checkscope(){
    var scope = "local scope";
    function f(){return scope;}
    return f();
}
checkscope(); //=>local scope
    
var scope = "global scope"; //全局变量
function checkscope(){
    var scope = "local scope";
    function f(){return scope;}
    return f;
}
checkscope()() //=>local scope;

// 可作为计数器
// 这个函数返回另外一个函数，这是一个嵌套函数。我们将他赋值给变量uniqueInteger，
// 嵌套函数是可以访问作用域内的变量的，而且可以访问外部函数中的counter变量。
// 当外部函数返回之后，其他任何代码都无法访问counter变量，只有内部的函数才能访问到它
var uniqueInteger = (function(){
    var counter = 0; //函数的私有状态；
    return function(){return counter++;};
}());

// 像counter一样的私有变量不是只能用在一个单独的闭包内，
// 在同一个外部函数内定义的多个嵌套函数也可以访问到它
// 这多个嵌套函数都共享一个作用域链
function counter(){
    var n = 0;
    return{
        count:function(){return n++;},
        reset:function(){n = 0;}
    };
}

var c = counter(), d = counter(); //创建两个计数器
c.count(); //=>0
d.count(); //=>0:它们互不干扰
c.reset(); //=>reset() 和 count()方法共享状态
c.count(); //0 : 因为我们重置了c
d.count(); //1 : 而没有重置d

// 用闭包代替属性实现私有状态
function counter(n){//函数参数是一个私有变量
    return{
        // 属性getter方法返回并给私有计数器var递增1
        get count(){return n++;},

        // 属性setter不允许n递减
        set count(m){
            if(m >= n) 
                n =m;
            else
                throw Error('count can only be set to a larger value');
        }
    }
}

var c = counter(1000);
c.count();               //=> 1000
c.count();               //=> 1001
c.count = 2000;
c.count;                //=>2000;
c.count = 2000;         //=>Error!

/**
 * 下面这个例子使用闭包技术来共享的私有状态的通用做法.
 * 它定义了addPrivateProperty()函数，这个函数定义了一个私有变量
 * 以及两个嵌套的函数用来获取和设置这个私有变量的值。
 * 它将这些嵌套函数添加为所指定对象的方法 
 */

// 利用闭包实现的私有属性存取器方法
// 这个函数给对象o添加了属性存取器方法
// 方法名称为get<name>和set<name>.如果提供了一个判定函数，
// setter方法就会用它来检测参数的合法性，然后再存储它
// 如果判定函数返回false，setter方法抛出一个异常
// 
// 这个函数有一个非同寻常之处，就是getter和setter函数所操作的属性值并没有存储在对象o中
// 相反，这个值仅仅是保存在函数中的局部变量中
// 也就是说，对于两个存取器的方法来说这个变量是私有的。
// 没有办法绕过绕过存取器方法来设置或者修改这个值

function addPrivateProperty(o, name, predicate){
    var value; //这是一个属性值

    // getter方法简单的将其返回
    o['get' + name] = function(){return value;};

    // setter方法首先检查值是否合法，若不合法就抛出异常
    // 否则就将其存储起来
    o['set' + name] = function(v){
        if(predicate && !predicate(v))
            throw Error('set' + name + ": invalid value " + v);
        else
            value = v;
    };
}

// 下面代码展示了addPrivateProperty()方法

var o = {}; //设置一个空对象

// 增加属性存取器方法getName() 和 setName()
// 确保只允许字符串值
addPrivateProperty(o, "Name", function(x){return typeof x == "string"; });

o.setName("china");  //设置属性值
console.log(o.getName()); //得到属性值
o.setName(0);  //试图设置一个错误类型的值


// 可选形参

function getPropertyNames(o, /*optional*/ a){
    a = a || [];
    for(var property in o)
        a.push(property);
    return a;
}

// arguments 特性
(function(x){
    console.log(x);
    arguments[0] = null;
    console.log(x);
    x = 1;
    console.log(arguments[0]);
}(10));


// arguments 的callee属性
// 实现匿名函数的递归调用
(function(x){
    if(x <= 1)
        return 1;
    else
        return x * arguments.callee(x-1);
}(10))

// 函数call以及apply方法
// 
// 用于调用当前函数functionObj，并可以同时使用指定对象thisObj作为本次执行时functionObject函数内部的this指针引用

name = 'hantong';
age = 18;

function test(){
    console.log(this);
    console.log(this.name);
    console.log(this.age);
};

test();

var obj = {name:'lisi',age:25};
test.call(obj);


// 高阶函数
// 接收一个或者多个函数作为参数，并返回一个新函数
function not(f){
    return function(){
        var result = f.apply(this,arguments);
        return !result;
    }
}

var even = function(x){
    return x % 2 === 0;
};

var odd = not(even);

// 所返回的函数的参数应当是一个实参数组，并对每个数组元素执行函数f()
// 并返回所有计算结果组成的数组
// 可以对比一下这个函数和上文提到的map函数

var map = Array.prototype.map 
    ? function(a,f){return a.map(f);}
    :function(a,f){
        var result = [];
        for(var i=0,len = a.length; i < len; i++){
            if(i in a) result[i] = f.call(null,a[i],i,a);
        }
        return result;
    };

function mapper(f){
    return function(a){
        return map(a,f);
    }
}

var increment = function(x){return x + 1;};
var incrementer = mapper(increment);
incrementer([1,2,3]);

// 这里是一个更常见的例子，它接收两个函数f()和g(),并返回一个新的函数f(g());

// 返回一个新的可以计算f(g(...))的函数
// 返回的函数h()将它所有的实参传入g()，然后将g()返回值传入f();
// 调用f()和g()时的this值和调用h()的this值是同一个this

function compose(f,g){
    return function(){
        // 需要给f()传入一个参数，所以使用f()的call方法
        // 需要给g()传入很多参数，所以使用g()的apply方法
        console.log(this);
        return f.call(this,g.apply(this,arguments));
    };
}

var square = function(x){return x * x;};
var sum = function(x,y){return x + y};;
var squareofsum = compose(square, sum);
squareofsum(2,3);



// 类和原型
// 
// 一个简单的javascript类 
function range(from, to){
    // 使用inherit()函数来创建对象，这个对象继承自在下面定义的原型对象
    // 原型对象作为函数的一个属性存储，并定义所有“范围对象”所共享的方法（行为）
    var r = inherit(range.methods);

    // 存储新的“范围对象”的起始位置和结束位置
    // 这两个属性是不可继承的，每个对象都拥有唯一的属性
    r.from = from;
    r.to = to;

    // 返回这个新创建的属性
    return r;
}

// 原型对象定义方法，这些方法为每个“范围对象”所继承
range.methods = {
    // 如果x在范围内，则返回true，否则返回false
    // 这个方法可以比较数字范围，也可以比较字符串和日期范围
    include:function(x){
        return this.from <= x && x <= this.to;
    },

    // 对于范围的的每个整数都调用一次f
    // 这个方法只可用做数字范围
    foreach:function(f){
        for(var x = Math.ceil(this.from);x <= this.to ; x++)
            f(x);
    },

    // 返回表示这个范围的字符串
    toString:function(){return "(" + this.from + "..." + this.to + ")";}
};

// 这里是使用范围对象的一些例子；
var r = range(1,3);
r.include(2);
r.foreach(console.log);
console.log(r);


// 使用构造函数定义"范围类"

// 这是一个构造函数，用以初始化新创建的“范围对象”
// 注意这里并没有返回对象，仅仅是初始化

function Range(from, to){
    this.from = from;
    this.to = to;
}

// 所有的范围对象都继承字这个对象
// 注意，属性的名字必须是prototype
Range.prototype = {
    include:function(x){
        return this.from <= x && x<= this.to;
    }
}

var r = new Range(1,3);
r.include(2);




