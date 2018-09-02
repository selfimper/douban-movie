$('footer>div').click(function(){
    var index = $(this).index();
    $('section').hide().eq(index).fadeIn();
    $(this).addClass('active').siblings().removeClass('active');
})

//获取数据
var index = 0
var isLoading = false
$('.loading').show()
start()
function start(){
    if(isLoading) return
    isLoading = true
    $.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
        start: index,
        count: 20
    },
    dataType: 'jsonp'
}).done(function(ret){
    console.log(ret)
    setData(ret)
    index += 20
}).fail(function(){
    console.log('error')
}).always(function(){
    isLoading = false
    $('.loading').hide()
})
}

//当滚动到底部时做出的反应
$('main').scroll(function(){
    if($('section').eq(0).height() -10 <= $('main').scrollTop() + $('main').height()){
        start()
    }
})


//设置数据内容
function setData(data){
    data.subjects.forEach(function(movie){
        var tpl = `<div class="item">
        <a href="#">
            <div class="cover">
                <img src="http://img7.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg" alt="">
            </div>
            <div class="detail">
                <h2>霸王别姬</h2>
                <div class="extra"><span class="score">9.3分</span> / <span class="collect">1000收藏</span></div>
                <div class="extra"><span class="year">1994</span> / <span class="type">剧情、爱情</span></div>
                <div class="extra">导演: <span class="director">张艺谋</span></div>
                <div class="extra">主演：<span class="actor">张艺谋、张艺谋、张艺谋</span></div>
            </div>
        </a>
    </div>`
    var $node = $(tpl)
//设置图片
    $node.find('.cover img').attr('src',movie.images.medium)
//设置标题
    $node.find('.detail h2').text(movie.title)
//设置分数
    $node.find('.score').text(movie.rating.average)
//设置收藏数
    $node.find('.collect').text(movie.collect_count)
//设置年份
    $node.find('.year').text(movie.year)
//设置类型
    $node.find('.type').text(movie.genres.join(' / '))
//设置导演
    $node.find('.director').text(function(){
        var directorArr = []
        movie.directors.forEach(function(item){
            directorArr.push(item.name)
        })
        return directorArr.join('、')
    })
//设置演员
    $node.find('.actor').text(function(){
        var actorArr = []
        movie.casts.forEach(function(item){
            actorArr.push(item.name)
        })
        return actorArr.join('、')
    })

    $('section').eq(0).append($node)
    })
}