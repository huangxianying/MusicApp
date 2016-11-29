   ;(function(){

    $(document).ready(function(){
        var songList = [];
        // var song = {};
        $.ajax({
            url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data:{
                method:'baidu.ting.billboard.billList',
                type:1,
                size:50,
                offset:0
            },
            dataType:'jsonp',
            success:function(res){
                console.log(res);
                var list = res.song_list;
                // console.log(list);
                list.forEach(function(item,idx){
                    // console.log(item.title);
                    // 创建对象并添加属性
                    var song = {};
                    $.ajax({
                        url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
                        data:{
                            method:'baidu.ting.song.play',
                            songid:item.song_id
                        },
                        dataType:'jsonp',
                        success:function(res){
                            song.mp3 = res.bitrate.show_link;
                        }
                    });

                    song.title = item.title +'-'+ item.style;
                    songList.push(song);
                })
                musicPlay(songList)
                console.log(songList);
            }
        });
function musicPlay(attr){
    new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    },attr, {
        swfPath: "../../../dist/jplayer",
        supplied: "mp3",
        wmode: "window",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true
    });
}

});
})();