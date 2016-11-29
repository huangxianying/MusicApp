   ;(function(){

    $(document).ready(function(){
        var songList = [];
        var song = {};
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
                var list = res.song_list
                list.forEach(function(item,idx){
                    song.title = item.title +'-'+ item.style
                for(var i=0;i<song.length;i++){
                    songList.push(song[i])
                     console.log(songList);      
                }
                })


            }
        })



    new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, [

        {
            title:"歌曲一",
            mp3:"http://zhejiang.mycodes.net/MP3/7631.mp3",
            oga:"http://zhejiang.mycodes.net/MP3/7631.mp3"
        },
        {
            title:"歌曲二",
            mp3:"http://zhejiang.mycodes.net/MP3/7463.mp3",
            oga:"http://zhejiang.mycodes.net/MP3/7463.mp3"
        },
        {
            title:"歌曲三",
            mp3:"http://zhejiang.mycodes.net/MP3/7399.mp3",
            oga:"http://zhejiang.mycodes.net/MP3/7399.mp3"
        }
    ], {
        swfPath: "../../dist/jplayer",
        supplied: "oga, mp3",
        wmode: "window",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true
    });
});
})();