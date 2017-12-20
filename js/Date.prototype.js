//自定义函数方法
//Date.isLeapYear() --判断当前时间是否是闰年
//Date.Format() --日期格式化
//Date.DateAdd() --日期计算 
//Date.DateDiff() --比较日期差
//Date.toString() --日期转换成字符串 重载
//Date.toArray() --日期分割为数组
//Date.DatePart() --取日期部分信息
//Date.MaxDayOfDate() --取日期所在月的最大天数
//Date.WeekNumOfYear() --判断日期所在年的第几周
//StringToDate() --字符串转日期型
//IsVaildDate() --验证日期有效性
//CheckDateTime() --完整日期时间检查
//daysBetween() --日期天数差 
//js_strto_time() --字符串转时间戳
//js_date_time() --时间戳转字符串
//getCountDays() --计算所在月最大天数
//










/**
 * 判断当前时间是否是闰年
 * 
 * @return {Boolean}
 * 这里的getYear()最好改成getFullYear();
 */
Date.prototype.isLeapYear = function(){
    return(0==this.getYear()%4 && (this.getYear()%100 !==0||this.getYear()%400 == 0));
}



/**
 * 日期格式化
 * 
 * 格式：
 * YYYY/yyyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w  星期
 * dd/DD/d/D 日期
 * hh/HH/h/H 时间
 * mm/m 分钟
 * ss/SS/s/S 秒
 * 
 * @param {[type]}
 */
Date.prototype.Format = function(formatStr){
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear()%100)>9? (this.getYear()%100).toString() : '0'+(this.getYear()%100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());

    str = str.replace(/mm/, this.getMinutes() > 9? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}

/**
 * 日期格式化（格式比较全面）
 * @param  {[type]} mask [description]
 *                       d       1-31
 *                       dd      01-31
 *                       
 * @return {[type]}      [description]
 */
Date.prototype.format = function (mask)
{
    var d = this;
    var zeroize = function (value, length)
    {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++)
        {
            zeros += '0';
        }
        return zeros + value;
    };
 
    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
    {
        switch ($0)
        {
            case 'd': return d.getDate();
            case 'dd': return zeroize(d.getDate());
            case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M': return d.getMonth() + 1;
            case 'MM': return zeroize(d.getMonth() + 1);
            case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy': return String(d.getFullYear()).substr(2);
            case 'yyyy': return d.getFullYear();
            case 'h': return d.getHours() % 12 || 12;
            case 'hh': return zeroize(d.getHours() % 12 || 12);
            case 'H': return d.getHours();
            case 'HH': return zeroize(d.getHours());
            case 'm': return d.getMinutes();
            case 'mm': return zeroize(d.getMinutes());
            case 's': return d.getSeconds();
            case 'ss': return zeroize(d.getSeconds());
            case 'l': return zeroize(d.getMilliseconds(), 3);
            case 'L': var m = d.getMilliseconds();
                if (m > 99) m = Math.round(m / 10);
                return zeroize(m);
            case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z': return d.toUTCString().match(/[A-Z]+$/);
            // Return quoted strings with the surrounding quotes removed
            default: return $0.substr(1, $0.length - 2);
        }
    });
};

/**
 *日期计算
 *
 * @param {[string]}
 * @param {[int]}
 * 增加 Number 个时间
 * s: + Number 秒
 * n: + Number 分钟
 * h: + Number 小时
 * d: + Number 天
 * w: + Number 星期
 * m: + Number 月
 * q: + Number 季度
 * y: + Number 年
 */
Date.prototype.DateAdd = function(strInterval, Number){
    var dtTmp = this;
    switch(strInterval){
        case's':return new Date(Date.parse(dtTmp) + (1000 * Number));
        case'n':return new Date(Date.parse(dtTmp) + (60 * 1000 * Number));
        case'h':return new Date(Date.parse(dtTmp) + (60 * 60 * 1000 * Number));
        case'd':return new Date(Date.parse(dtTmp) + (24 * 60 * 60 * 1000 * Number));
        case'w':return new Date(Date.parse(dtTmp) + (7 * 24 * 60 * 60 * 100 * Number));
        case'q':return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(),
            dtTmp.getMinutes(), dtTmp.getSeconds());
        case'm':return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(),
            dtTmp.getMinutes(), dtTmp.getSeconds());
        case'y':return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), 
            dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}

/**
 * 计算两个时间的天数差 日期格式为YYYY-MM-dd
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
var daysBetween = function(date_start, date_end){
    var startMonth = date_start.substring(5, date_start.lastIndexOf('-'));
    var startDay = date_start.substring(date_start.lastIndexOf('-')+1, date_start.length);
    var startYear = date_start.substring(0, date_start.indexOf('-'));

    var endMonth = date_end.substring(5, date_end.lastIndexOf('-'));
    var endDay = date_end.substring(date_end.lastIndexOf('-')+1, date_end.length);
    var endYear = date_end.substring(0, date_end.indexOf('-'));    

    var cha = ((Date.parse(startMonth+'/'+startDay+'/'+startYear) - Date.parse(endMonth+'/'+endDay+'/'+endYear))/86400000);

    return Math.abs(cha);
}

/**
 *日期输出字符串，重载了系统的toString方法
 *
 * showWeek ＝ true 输出星期信息;
 * [toString description]
 * @param  {Boolean} showWeek [description]
 * @return {[type]}           [description]
 *
 * 返回 
 * 2015/8/28
 * 2015/8/28 星期五
 *
 * 原函数 Date.toString() 返回:
 * Fri Aug 28 2015 11:51:31 GMT+0800 (CST)
 */
Date.prototype.toString = function(showWeek){
    var myDate = this;
    var str = myDate.toLocaleDateString();

    if(showWeek){
        var Week = ['日','一','二','三','四','五','六'];
        str += '星期' + Week[myDate.getDay()];
    }
    return str;
}


/**
 * 日期合法性检查
 * 格式为：YYYY-MM-DD或YYYY/MM/DD
 * @param {[type]} DateStr [description]
 */
var IsValidDate = function(DateStr){
    var sDate = DateStr.replace(/(^\s+|\s+$)/g, '');//去掉两边空格; 没有trim么？
    if(sDate=='')return false;

    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''   
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式   
    var s = sDate.replace(/[\d]{4,4}[\-\/]{1}[\d]{1,2}[\-\/]{1}[\d]{1,2}/g,'');
    if(s == ''){//说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D  
        var t = new Date(sDate.replace(/\-/g,'/'));
        var ar = sDate.split(/[-\/:]/);
        if(ar[0] != t.getFullYear() || ar[1] != t.getMonth()+1 || ar[2] != t.getDate()){
            //alert('错误的日期格式，格式为YYYY-MM-DD或者YYYY-MM-DD。注意闰年');
            return false;
        }
    }else{
            //alert('错误的日期格式，格式为YYYY-MM-DD或者YYYY-MM-DD。注意闰年');
            return false;
    }
    return true;
}

/**
 * 日期时间检查
 * 格式为：YYYY-MM-DD HH:MM:SS
 * @param {[type]} str [description]
 */
function CheckDateTime(str){
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    console.log(r);//["2013-08-01 23:59:60", "2013", "08", "01", "23", "59", "60", index: 0, input: "2013-08-01 23:59:60"]
    if(r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1],r[2],r[3],r[4],r[5],r[6]);
    if(d.getFullYear() != r[1]) return false;
    if(d.getMonth() != r[2]) return false;
    if(d.getDate() != r[3]) return false;
    if(d.getHours() != r[4]) return false;
    if(d.getMinutes() != r[5]) return false;
    if(d.getSeconds() != r[6]) return false;

    return true;
}

/**
 * 把日期分割成数组
 * @return {[type]} [description]
 */
Date.prototype.toArray = function(){
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth() + 1 ;//注意 这里月份需要加一  
    myArray[2] = myDate.getDate();  
    myArray[3] = myDate.getHours();  
    myArray[4] = myDate.getMinutes();  
    myArray[5] = myDate.getSeconds();  

    return myArray;
}

/**
 * 获取日期数据信息
 *
 * @param {[type]} interval 数据类型
 * y 年 m月 d日 w星期 ww周(当前年的第几周) h时 n分 s秒
 *
 * 如果要使用该函数，需要定义
 * Date.prototype.WeekNumofYear;
 * Date.prototype.toArray
 */
Date.prototype.DatePart = function(interval){
    var myDate = this;
    var partStr = '';
    var Week = ['日','一','二','三','四','五','六'];  

    switch(interval){
        case 'y' :partStr = myDate.getFullYear(); break;
        case 'm' :partStr = myDate.getMonth()+1; break;  
        case 'd' :partStr = myDate.getDate();break;  
        case 'w' :partStr = Week[myDate.getDay()];break;  
        case 'ww':partStr = myDate.WeekNumOfYear();break;  
        case 'h' :partStr = myDate.getHours();break;  
        case 'n' :partStr = myDate.getMinutes();break;  
        case 's' :partStr = myDate.getSeconds();break;  
    }

    return partStr;
}


/**
 * 获取当前所在月的最大天数
 */
Date.prototype.MaxDayOfDate = function(){
    var myDate = this;
    var arr = myDate.toArray();
    var date1 = (new Date(arr[0],arr[1],1));
    var date2 = date1.dateAdd('m',1);

    var result = daysBetween(date1.Format('yyyy-mm-dd'), date2.Format('yyyy-mm-dd'));

    return result;

}

/**
 * 比较日期差
 * 如果使用，需要事先定义StringToDate函数
 * @param {[type]} strInterval 选择比较类型
 *                             s:相差秒
 *                             n:相差分
 *                             h:相差的小时
 *                             d:相差的天数
 *                             w:相差的星期
 *                             m:相差的月
 *                             y:相差年
 * @param {[type]} dtEnd       [日期或者有效日期格式]
 * 
 */
Date.prototype.DateDiff = function(strInterval, dtEnd){
    var dtStart = this;
    if(typeof(dtEnd) == 'string'){
        dtEnd = StringToDate(dtEnd);
    }

    switch(strInterval){
        case 's' :return parseInt((dtEnd - dtStart) / 1000);  
        case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
        case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
        case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
        case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
        case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
        case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
    }
}

/**
 * 计算一个月有多少天
 * @return {[type]} [description]
 */
function getCountDays(){
    var curDate = new Date();
    var curMonth = curDate.getMonth();
    //将日期设置成下一个月
    //setMonth在31号如果不设置第二个参数，会出现一些bug比如8月31号用setMonth加一个月后，会变成10月1日
    //详情请见 
    //http://blog.sina.com.cn/s/blog_3c62c21f0100ooex.html
    //http://blog.csdn.net/mydeman/article/details/2747636
    curDate.setMonth(curMonth + 1, 0);

    return curDate.getDate();
}

/**
 * 取得当前日期所在周时一年中的第几周
 *
 * 如果需要使用该函数，需要定义Date.prototype.toArray 函数
 */
Date.prototype.WeekNumOfYear = function(){
    var myDate = this;
    var ary = myDate.toArray();
    var year = ary[0];
    var month = ary[1] + 1;
    var day = ary[2];

    //这里采用的是VB里面的脚本方法，也可以直接用php赋值的方法解决
    document.write('<script language = VBScript>\n');
    document.write('myDate = Datue(''+month+'-'+day+'-'+year+'') \n');  
    document.write("result = DatePart('ww', myDate) \n");  
    document.write(' \n')
    return result;
}


/**
 * 字符串转成日期类型
 * @param {[type]} DateStr [description]
 * 格式
 * MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd  
 * 
 */
var StringToDate = function(DateStr){
    var converted = Date.parse(DateStr);
    var myDate = new Date(converted);
    if(isNaN(myDate)){
        var arys = DateStr.split('-');
        myDate = new Date(arys[0],arys[1],arys[2]);
    }

    return myDate;
}

/**
 * 字符串转时间戳
 * 格式： 2015-08-01 23:10:10
 * @param  {[type]} str_time [description]
 * @return {[type]}          [description]
 */
var js_strto_time = function(str_time){
    var new_str = str_time.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8 , arr[4], arr[5]));
    return strtotrim = datum.getTime() / 1000;
}


var js_date_time = function(unixtime){
    var timestr = new Date(parseInt(unixtime) * 1000);
    var datetime = timestr.toLocaleString().replace(/年|月/g, '-').replace(/日/g, " ");

    return datetime;
}






