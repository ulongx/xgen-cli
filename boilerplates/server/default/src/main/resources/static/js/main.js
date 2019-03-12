/**
 * Created by margie on 16/8/18.
 */

function sideBar() {
    $('#sidebar_menu').find('.sidebar_title').each(function () {
        var $this = $(this),
            $parent = $this.parent(),
            $hasOpen = $parent.hasClass('open'),
            $ol = $parent.find('ol');
        if ($hasOpen) {
            $ol.height($ol.find('li').length * 36 - 2);
            $parent.addClass('open').find($this).find('span').eq(2).removeClass().addClass('icon-caret-down');
        }
    }).click(function () {
        var $this = $(this),
            $parent = $this.parent(),
            $hasChild = $parent.is(':has(ol)'),
            $hasOpen = $this.hasClass('open'),
            $ol = $parent.find('ol'),
            $height = 0;
        if ($hasChild && !$hasOpen) {
            $parent.addClass('open').find($this).find('span').eq(2).removeClass().addClass('icon-caret-down');
            $height = $ol.find('li').length * 36;
            $ol.animate({
                'height': $height - 2
            });
            $parent.siblings().find('ol').animate({
                'height': 0
            }, function () {
                $parent.siblings().removeClass('open');
            });
        }
    });
}

/**
 * 计算start和end的时间差，返回秒
 * @param currentTimeStart 开始时间
 * @param currentTimeEnd   结束时间
 * @param returnType 1:取得算出天数后剩余的秒数 2:取得算出小时数后剩余的秒数 3:取得算出分后剩余的秒数
 */
function calcTimeDiffer(currentTimeStart,currentTimeEnd,returnType){
    var date1 = new Date(currentTimeStart);
    var date2 = new Date(currentTimeEnd);

    var s1 = date1.getTime(),s2 = date2.getTime();
    var total = (s2 - s1)/1000;

    var day = parseInt(total / (24*60*60));//计算整数天数
    var reNumber = 0;
    switch (returnType){
        case 1:
            var afterDay = total - day*24*60*60;
            reNumber = afterDay;
            break;
        case 2:
            var afterDay = total - day*24*60*60;
            var hour = parseInt(afterDay/(60*60));//计算整数小时数
            var afterHour = total - day*24*60*60 - hour*60*60;
            reNumber = afterHour;
            break;
        case 3:
            var afterHour = total - day*24*60*60 - hour*60*60;
            var min = parseInt(afterHour/60);//计算整数分
            var afterMin = total - day*24*60*60 - hour*60*60 - min*60;
            reNumber = afterMin;
            break;
        default :
            reNumber = total - day*24*60*60;
            break;
    }

    return reNumber;
}

function convertTime2Str(second,isFullFormat){
    var  hours = "";

    if(isFullFormat){
        hours = " H";
    }
    var d = second/3600;
    return d.toFixed(2)+hours;
}
function convertTime2StrHM(second,isFullFormat){
    var hours = " H",minters = " M",seconds = " S";
    if(isFullFormat){
        hours = " Hour(s)";
        minters = " Min(s)";
        seconds = " Sec(s)";
    }
    if (second<60) {
        return second+seconds;
    } else if (second<3600) {
        return Math.floor(second/60)+minters;
    } else {
        var s = Math.floor(second/3600)+hours;
        second = second%3600;
        if (second>60) {
            s += " " + Math.floor(second/60)+minters;
        }
        return s;
    }
}

$(function () {
    $.fn.closePopCompose = function () {
        $(this).click(function () {
            $(this).parents('.pop-compose').hide();
        });
    };

    $.fn.extend({
        inputPlaceholder: function () {
            $(this).each(function () {
                var $this = $(this);
                if ($this.val() != '') {
                    $this.css('background-color', '#fff');
                } else {
                    $this.css('background-color', 'transparent');
                }
            }).on('keyup blur', function () {
                var $this = $(this);
                if ($this.val() != '') {
                    $this.css('background-color', '#fff');
                } else {
                    $this.css('background-color', 'transparent');
                }
            });
        },
        scrollBoxHeight: function () {
            var $maxHeight = $(window).height() - 273, $this = $(this), $h = $this.height();
            if ($h > $maxHeight) {
                $this.css({'max-height': $maxHeight, 'overflow': 'hidden'}).mCustomScrollbar({
                    theme: "minimal-dark"
                });
            }
        },
        checkBoxCss: function () {
            $(this).each(function () {
                var $this = $(this), $checked = $this.find('input').prop("checked");
                if ($checked) {
                    $this.find('.icon-check-empty').removeClass().addClass('icon-check');
                } else {
                    $this.find('.icon-check').removeClass().addClass('icon-check-empty');
                }
            }).click(function () {
                var $this = $(this), $checked = $this.find('input').prop("checked");
                if ($checked) {
                    $this.find('.icon-check-empty').removeClass().addClass('icon-check');
                } else {
                    $this.find('.icon-check').removeClass().addClass('icon-check-empty');
                }
            });
        }
    });

});