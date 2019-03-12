//file:上传文件节点ID,
//img:需要添加图片的节点ID,
//imgName:保存图片名的<input>节点ID,
//imgBase64:保存图片Base64的<input>节点ID
function imgMain(file,img,imgName,imgBase64) {
    var file_Id,c,ctx;
    function init(file) {
        file_Id = $('#'+file+'')//$("#file");
        c = document.createElement("canvas");
        ctx = c.getContext("2d");
    }
    function getImgUrl () {
        var fileUrl = "", imgDataUrl = "", reader = new FileReader(), imgss = new Image(), imgW = 0, imgH = 0, expW = 0, expH = 0, imgMax = 800;
        imgW = 0;
        imgH = 0;
        expW = 0;
        expH = 0;
        //web.img_Id[0].src="";

        //转换图片为base64格式
        fileUrl = file_Id[0].files[0];

        reader.readAsDataURL(fileUrl);

        reader.onload = function (result) {
            var url = this.result;
            //img_Id[0].src=url;
            imgss.src = url;
            imgss.onload = function () {
                imgW = imgss.width;
                imgH = imgss.height;

                //改变图片尺寸，这个根据自己的实际需求来写算法
                if (imgW > imgMax && imgW >= imgH) {
                    expW = imgMax;
                    expH = parseInt((imgMax * imgH) / imgW);
                } else if (imgH > imgMax && imgH > imgW) {
                    expH = imgMax;
                    expW = parseInt((imgMax * imgW) / imgH);
                } else {
                    expW = imgW;
                    expH = imgH;
                }

                c.width = expW;
                c.height = expH;

                ctx.drawImage(imgss, 0, 0, expW, expH);

                //imgDataUrl=c.toDataURL(); //默认输出PNG格式
                imgDataUrl = c.toDataURL("image/jpeg", 0.8); //设置输出jpg格式，第二个参数为图片质量
                var html = '<img src="'+imgDataUrl+'">';
                   $('#'+img+'').empty();
                   $('#'+img+'').append(html);
                   $('#'+imgName+'').val(fileUrl.name);
                   $('#'+imgBase64+'').val(imgDataUrl);
            }
        }
    }
    init(file);
    getImgUrl();
}