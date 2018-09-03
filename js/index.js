
//实现top250页面
var top250 = {
    init: function(){
      this.$element = $('#top250')
      this.isLoading = false
      this.index = 0
      this.isFinish = false
      
      this.bind()
      this.start()
    },
    bind: function(){
      var _this = this
      this.$element.scroll(function(){
        _this.start()
      })
    },
    start: function(){
      var _this = this
      this.getData(function(data){
        _this.render(data)
      })
    },
    //获取数据
    getData: function(callback){
      var _this = this
      if(_this.isLoading) return;
      _this.isLoading = true
      _this.$element.find('.loading').show()
      $.ajax({
        url: 'http://api.douban.com/v2/movie/top250',
        data: {
          start: _this.index||0
        },
        dataType: 'jsonp'
      }).done(function(ret){
        _this.index += 20
        if(_this.index >= ret.total){
          _this.isFinish = true
        }
        callback&&callback(ret)
      }).fail(function(){
        console.log('数据异常')
      }).always(function(){
        _this.isLoading = false
        _this.$element.find('.loading').hide()
      })  
    },
    render: function(data){
      var _this = this
      console.log(data)
      data.subjects.forEach(function(movie){
        var template = `<div class="item">
      <a href="#">
      <div class="cover">
      <img src="" alt="">
          </div>
      <div class="detail">
      <h2></h2>
      <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
      <div class="extra"><span class="year"></span> / <span class="type"></span></div>
      <div class="extra">导演: <span class="director"></span></div>
      <div class="extra">主演: <span class="actor"></span></div>
    </div>
    </a>
    </div>`
        var $node = $(template)
        $node.find('a').attr('href', movie.alt)
        //设置图片
        $node.find('.cover img')
        .attr('src', movie.images.medium )
        //设置标题
        $node.find('.detail h2').text(movie.title)
        //设置分数
        $node.find('.score').text(movie.rating.average )
        //设置收藏数
        $node.find('.collect').text(movie.collect_count )
        //设置年份
        $node.find('.year').text(movie.year)
        //设置类型
        $node.find('.type').text(movie.genres.join(' / '))
        //设置导演
        $node.find('.director').text(function(){
          var directorsArr = []
          movie.directors.forEach(function(item){
            directorsArr.push(item.name)
          })
          return directorsArr.join('、')
        })
        //设置主演
        $node.find('.actor').text(function(){
          var actorArr = []
          movie.casts.forEach(function(item){
            actorArr.push(item.name)
          })
          return actorArr.join('、')
        })
        _this.$element.find('.container').append($node)
      })
    },
    //下拉时加载下一部分信息
    isToBottom: function(){
        return this.$element.find('.container') <= this.$element.height() + this.$element.scrollTop() + 10
      }
  }
  
  //实现北美页面
  var usBox = {
    init: function(){
    //   console.log('usBox ok')
      this.$element = $('#beimei')
      
      this.start()
    },

    start: function(){
      var _this = this
      this.getData(function(data){
        _this.render(data)
      })
    },
    getData: function(callback){
      var _this = this
      if(_this.isLoading) return;
      _this.isLoading = true
      _this.$element.find('.loading').show()
      $.ajax({
        url: 'http://api.douban.com/v2/movie/us_box',
        dataType: 'jsonp'
      }).done(function(ret){
        callback&&callback(ret)
      }).fail(function(){
        console.log('数据异常')
      }).always(function(){
        _this.$element.find('.loading').hide()
      })  
    },
    render: function(data){
      var _this = this
      console.log(data)
      data.subjects.forEach(function(movie){
        movie = movie.subject
        var template = `<div class="item">
      <a href="#">
      <div class="cover">
      <img src="" alt="">
          </div>
      <div class="detail">
      <h2></h2>
      <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
      <div class="extra"><span class="year"></span> / <span class="type"></span></div>
      <div class="extra">导演: <span class="director"></span></div>
      <div class="extra">主演: <span class="actor"></span></div>
    </div>
    </a>
    </div>`
        var $node = $(template)
        $node.find('a').attr('href', movie.alt)
        $node.find('.cover img')
        .attr('src', movie.images.medium )
        $node.find('.detail h2').text(movie.title)
        $node.find('.score').text(movie.rating.average )
        $node.find('.collect').text(movie.collect_count )
        $node.find('.year').text(movie.year)
        $node.find('.type').text(movie.genres.join(' / '))
        $node.find('.director').text(function(){
          var directorsArr = []
          movie.directors.forEach(function(item){
            directorsArr.push(item.name)
          })
          return directorsArr.join('、')
        })
        $node.find('.actor').text(function(){
          var actorArr = []
          movie.casts.forEach(function(item){
            actorArr.push(item.name)
          })
          return actorArr.join('、')
        })
        _this.$element.find('.container').append($node)
      })
    }
  }

  //实现搜索页面
  var search = {
    init: function(){
    //   console.log('usBox ok')
      this.$element = $('#search')
      this.keyword = ''
      this.bind()
      this.start()
    },

    bind: function(){
      var _this = this
      this.$element.find('.button').click(function(){
        _this.keyword = _this.$element.find('input').val()
        _this.start()
      })
    },
    start: function(){
      var _this = this
      this.getData(function(data){
        _this.render(data)
      })
    },
    getData: function(callback){
      var _this = this
      _this.$element.find('.loading').show()
      $.ajax({
        url: 'http://api.douban.com/v2/movie/search',
        data: {
          q: _this.keyword
        },
        dataType: 'jsonp'
      }).done(function(ret){
        callback&&callback(ret)
      }).fail(function(){
        console.log('数据异常')
      }).always(function(){
        _this.$element.find('.loading').hide()
      })  
    },
    render: function(data){
      var _this = this
      console.log(data)
      data.subjects.forEach(function(movie){
        var template = `<div class="item">
      <a href="#">
      <div class="cover">
      <img src="" alt="">
          </div>
      <div class="detail">
      <h2></h2>
      <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
      <div class="extra"><span class="year"></span> / <span class="type"></span></div>
      <div class="extra">导演: <span class="director"></span></div>
      <div class="extra">主演: <span class="actor"></span></div>
    </div>
    </a>
    </div>`
        var $node = $(template)
        $node.find('a').attr('href', movie.alt)
        $node.find('.cover img')
        .attr('src', movie.images.medium )
        $node.find('.detail h2').text(movie.title)
        $node.find('.score').text(movie.rating.average )
        $node.find('.collect').text(movie.collect_count )
        $node.find('.year').text(movie.year)
        $node.find('.type').text(movie.genres.join(' / '))
        $node.find('.director').text(function(){
          var directorsArr = []
          movie.directors.forEach(function(item){
            directorsArr.push(item.name)
          })
          return directorsArr.join('、')
        })
        $node.find('.actor').text(function(){
          var actorArr = []
          movie.casts.forEach(function(item){
            actorArr.push(item.name)
          })
          return actorArr.join('、')
        })
        _this.$element.find('.search-result').append($node)
      })
    }
  }
    

//加载页面入口
  var app = {
    init: function(){
      this.$tabs = $('footer>div')
      this.$panels = $('section')
      this.bind()
      
      top250.init()
      usBox.init()
      search.init()

    },
    //实现页面按钮切换功能
    bind: function(){
      var _this = this
      this.$tabs.on('click', function(){
        $(this).addClass('active').siblings().removeClass('active')
        _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
      })
    }

  }
//加载页面
  app.init()