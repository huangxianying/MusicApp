﻿;(function($){


	//show song type
	$('.show-type-btn').on('touchstart',function(){
		 if ($(this).siblings('.type-group').hasClass('show-type')){
		 	$(this).siblings('.type-group').removeClass('show-type');
		 }else{
			$(this).siblings('.type-group').addClass('show-type');
		 };
	});

	$('.type-group-item').on('touchstart',function(){

		//清空原来歌曲列表 避免重复
		$('#playlist').html('');

		//必须先清空原来的这在播放的src 属性值再由后面来生成链接；
		$('#player').children('audio').attr({src:''});

		//清空原来的播放进度时间
		// $('.progress').children('.timer').html('');
		$('.timer').html('');
		$('.progress .pace').css('width', 0);
		//获取'data-type' 属性值
		var type = $(this).attr('data-type');

		// 调用函数把点击当前的'data-type'值 传入参数
		musicplay(type);

		$(this).parent('.type-group').removeClass('show-type');
		return;
	})


	function musicplay(num,key){
	// Settings
	var playlist = [];
        // var song = {};
        $.ajax({
            url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data:{
                method:'baidu.ting.billboard.billList',
                type:num,
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
                            //console.log(res);
                            song.mp3 = res.bitrate.show_link;
                        }
                    });
                    //音乐信息
                    song.title = item.title;
                    song.cover = item.pic_big;
                    song.artist = item.artist_name;
                    song.album = item.title + '.mp3';

                    playlist.push(song);
                });
                // Load playlist;
				myplayer(playlist);
            }
        });
	}

	//初始化默认 播放歌曲
   musicplay(2);

   //点击收索按钮，执行搜索加载和播放歌曲；
   $('.input-group-btn').on('touchstart',$('.btn-serach'),function(){

   		//声明变量储存歌曲信息
   		var songInfo = [];

   		//获取搜索关键词
   		var key = $('#song-input').val();

   		//ajax请求加载到的歌曲内容

   		$.ajax({
   			url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
   			data:{
   				method:'baidu.ting.search.catalogSug',
   				query:key
   			},
   			dataType:'jsonp',
   			success:function(res){
   				var songList = res.song;

   				//遍历数组对象
   				$.each(songList,function(idx,item){
   					var song = {};
   					$.ajax({
   						url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
   						data:{
   							method:'baidu.ting.song.play',
   							songid:item.songid
   						},
   						dataType:'jsonp',
   						success:function(res){

                            song.mp3 = res.bitrate.show_link;
                            song.cover = res.songinfo.pic_big;
                            songInfo.push(song);
                        }
                    });
   					song.title = item.songname;
                    song.artist = item.artistname;
                    song.album = song.title + '.mp3';

   					songInfo.push(song);
   				});
   				//清空原来歌曲列表 避免重复
   				$('#playlist').html('');

				//必须先清空原来的这在播放的src 属性值再由后面来生成链接；
				$('#player').children('audio').attr({src:''});

				//清空原来的播放进度时间
				// $('.progress').children('.timer').html('');
				$('.timer').html('');
				$('.progress .pace').css('width', 0);

				//搜索完歌曲自动清空输入框
				$('#song-input').val('');
				//调用函数播放歌曲
				myplayer(songInfo);

   			}

   		})
   });


   //封装函数；
function myplayer(playlist){
	var repeat = localStorage.repeat || 0,
		shuffle = localStorage.shuffle || 'false',
		continous = true,
		autoplay = true
	for (var i=0; i<playlist.length; i++){
		var item = playlist[i];
		$('#playlist').append('<li>'+item.artist+' - '+item.title+'</li>');
	}

	var time = new Date(),
		currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
		trigger = false,
		audio, timeout, isPlaying, playCounts;

	var play = function(){
		audio.play();
		$('.playback').addClass('playing');
		timeout = setInterval(updateProgress, 500);
		isPlaying = true;
	}

	var pause = function(){
		audio.pause();
		$('.playback').removeClass('playing');
		clearInterval(updateProgress);
		isPlaying = false;
	}

	// Update progress
	var setProgress = function(value){
		var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
			ratio = value / audio.duration * 100;

		$('.timer').html(parseInt(value/60)+':'+currentSec);
		$('.progress .pace').css('width', ratio + '%');
		$('.progress .slider a').css('left', ratio + '%');
	}

	var updateProgress = function(){
		setProgress(audio.currentTime);
	}

	// Progress slider
	$('.progress .slider').slider({step: 0.1, slide: function(event, ui){
		$(this).addClass('enable');
		setProgress(audio.duration * ui.value / 100);
		clearInterval(timeout);
	}, stop: function(event, ui){
		audio.currentTime = audio.duration * ui.value / 100;
		$(this).removeClass('enable');
		timeout = setInterval(updateProgress, 500);
	}});

	// Volume slider
	var setVolume = function(value){
		audio.volume = localStorage.volume = value;
		$('.volume .pace').css('width', value * 100 + '%');
		$('.volume .slider a').css('left', value * 100 + '%');
	}

	var volume = localStorage.volume || 0.5;
	$('.volume .slider').slider({max: 1, min: 0, step: 0.01, value: volume, slide: function(event, ui){
		setVolume(ui.value);
		$(this).addClass('enable');
		$('.mute').removeClass('enable');
	}, stop: function(){
		$(this).removeClass('enable');
	}}).children('.pace').css('width', volume * 100 + '%');

	$('.mute').click(function(){
		if ($(this).hasClass('enable')){
			setVolume($(this).data('volume'));
			$(this).removeClass('enable');
		} else {
			$(this).data('volume', audio.volume).addClass('enable');
			setVolume(0);
		}
	});

	// Switch track
	var switchTrack = function(i){
		if (i < 0){
			track = currentTrack = playlist.length - 1;
		} else if (i >= playlist.length){
			track = currentTrack = 0;
		} else {
			track = i;
		}

		$('audio').remove();
		loadMusic(track);
		if (isPlaying == true) play();
	}

	// Shuffle
	var shufflePlay = function(){
		var time = new Date(),
			lastTrack = currentTrack;
		currentTrack = time.getTime() % playlist.length;
		if (lastTrack == currentTrack) ++currentTrack;
		switchTrack(currentTrack);
	}

	// Fire when track ended
	var ended = function(){
		pause();
		audio.currentTime = 0;
		playCounts++;
		if (continous == true) isPlaying = true;
		if (repeat == 1){
			play();
		} else {
			if (shuffle === 'true'){
				shufflePlay();
			} else {
				if (repeat == 2){
					switchTrack(++currentTrack);
				} else {
					if (currentTrack < playlist.length) switchTrack(++currentTrack);
				}
			}
		}
	}

	var beforeLoad = function(){
		var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
		$('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
	}

	// Fire when track loaded completely
	var afterLoad = function(){
		if (autoplay == true) play();
	}

	// Load track
	var loadMusic = function(i){
		var item = playlist[i],
			newaudio = $('<audio>').html('<source src="'+item.mp3+'"><source src="'+item.ogg+'">').appendTo('#player');

		$('.cover').html('<img src="'+item.cover+'" alt="'+item.album+'">');
		$('.tag').html('<strong>'+item.title+'</strong><span class="artist">'+item.artist+'</span><span class="album">'+item.album+'</span>');
		$('#playlist li').removeClass('playing').eq(i).addClass('playing');
		audio = newaudio[0];
		audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
		audio.addEventListener('progress', beforeLoad, false);
		audio.addEventListener('durationchange', beforeLoad, false);
		audio.addEventListener('canplay', afterLoad, false);
		audio.addEventListener('ended', ended, false);
	}

	loadMusic(currentTrack);
	$('.playback').on('click', function(){
		if ($(this).hasClass('playing')){
			pause();
		} else {
			play();
		}
	});
	$('.rewind').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(--currentTrack);
		}
	});
	$('.fastforward').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(++currentTrack);
		}
	});
	$('#playlist li').each(function(i){
		var _i = i;
		$(this).on('click', function(){
			switchTrack(_i);
		});
	});

	if (shuffle === 'true') $('.shuffle').addClass('enable');
	if (repeat == 1){
		$('.repeat').addClass('once');
	} else if (repeat == 2){
		$('.repeat').addClass('all');
	}

	$('.repeat').on('click', function(){
		if ($(this).hasClass('once')){
			repeat = localStorage.repeat = 2;
			$(this).removeClass('once').addClass('all');
		} else if ($(this).hasClass('all')){
			repeat = localStorage.repeat = 0;
			$(this).removeClass('all');
		} else {
			repeat = localStorage.repeat = 1;
			$(this).addClass('once');
		}
	});

	$('.shuffle').on('click', function(){
		if ($(this).hasClass('enable')){
			shuffle = localStorage.shuffle = 'false';
			$(this).removeClass('enable');
		} else {
			shuffle = localStorage.shuffle = 'true';
			$(this).addClass('enable');
		}
	});
}

})(jQuery);