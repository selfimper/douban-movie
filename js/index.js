//实现top250页面
var Top250 = {
  init: function() {
    //   console.log('top250 ok')
    this.$container = $("#top250");
    this.$content = this.$container.find(".container");
    this.index = 0;
    this.isFinish = false;
    this.isLoading = false;

    this.bind();
    this.start();
  },
  //下拉至底部时加载下一部分信息
  bind: function() {
    var _this = this;
    this.$container.scroll(function() {
      if (!_this.isFinish && Helper.isToEnd(_this.$container, _this.$content)) {
        _this.start();
      }
    });
  },
  start: function() {
    var _this = this;
    this.getData(function(data) {
      _this.render(data);
    });
  },
  //获取数据
  getData: function(callback) {
    var _this = this;
    if (_this.isLoading) return;
    _this.isLoading = true;
    _this.$container.find(".loading").show();
    $.ajax({
      url: "https://api.douban.com/v2/movie/top250",
      data: {
        start: _this.index || 0
      },
      dataType: "jsonp"
    })
      .done(function(ret) {
        _this.index += 20;
        if (_this.index >= ret.total) {
          _this.isFinish = true;
        }
        callback && callback(ret);
      })
      .fail(function() {
        console.log("数据异常");
      })
      .always(function() {
        _this.isLoading = false;
        _this.$container.find(".loading").hide();
      });
  },
  render: function(data) {
    var _this = this;
    console.log(data);
    data.subjects.forEach(function(movie) {
      _this.$content.append(Helper.createNode(movie));
    });
  }
};

//实现北美排行榜页面
var UsPage = {
  init: function() {
    //   console.log('usBox ok')
    this.$container = $("#beimei");
    this.$content = this.$container.find(".container");

    this.start();
  },
  start: function() {
    var _this = this;
    this.getData(function(data) {
      _this.render(data);
    });
  },
  getData: function(callback) {
    var _this = this;
    _this.$container.find(".loading").show();
    $.ajax({
      url: "https://api.douban.com/v2/movie/us_box",
      dataType: "jsonp"
    })
      .done(function(ret) {
        callback && callback(ret);
      })
      .fail(function() {
        console.log("数据异常");
      })
      .always(function() {
        _this.$container.find(".loading").hide();
      });
  },
  render: function(data) {
    var _this = this;
    console.log(data);
    data.subjects.forEach(function(item) {
      _this.$content.append(Helper.createNode(item.subject));
    });
  }
};

//实现搜索页面
var SearchPage = {
  init: function() {
    //   console.log('search ok')
    this.$container = $("#search");
    this.$input = this.$container.find("input");
    this.$btn = this.$container.find(".button");
    this.$content = this.$container.find(".search-result");

    this.bind();
  },
  bind: function() {
    var _this = this;
    this.$btn.click(function() {
      _this.getData(_this.$input.val(), function(data) {
        console.log(data);
        _this.render(data);
      });
    });
  },
  getData: function(keyword, callback) {
    var _this = this;
    _this.$container.find(".loading").show();
    $.ajax({
      url: "https://api.douban.com/v2/movie/search",
      data: {
        q: keyword
      },
      dataType: "jsonp"
    })
      .done(function(ret) {
        callback && callback(ret);
      })
      .fail(function() {
        console.log("数据异常");
      })
      .always(function() {
        _this.$container.find(".loading").hide();
      });
  },
  render: function(data) {
    var _this = this;
    console.log(data);
    this.$content.empty(); //清除上次搜索结果
    data.subjects.forEach(function(item) {
      _this.$content.append(Helper.createNode(item));
    });
  }
};

//定义变量让top250,usPage,searchPage可调用
var Helper = {
  //判断是否滚动到底部
  isToEnd: function($viewport, $content) {
    return $viewport.height() + $viewport.scrollTop() + 10 > $content.height();
  },
  //实现信息复用，top250,usPage,searchPage
  createNode: function(movie) {
    var template = `<div class="item">
    <a href="">
    <div class="cover">
    <img src="" alt="">
        </div>
    <div class="detail">
    <h2></h2>
    <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
    <div class="extra"><span class="year"></span><span class="country"></span> / <span class="type"></span></div>
    <div class="extra">导演： <span class="director"></span></div>
    <div class="extra">主演： <span class="actor"></span></div>
    </div>
    </a>
    </div>`;
    var $node = $(template);
    $node.find("a").attr("href", movie.alt);
    //设置图片
    $node.find(".cover img").attr("src", movie.images.medium);
    //设置标题
    $node.find(".detail h2").text(movie.title);
    //设置分数
    $node.find(".score").text(movie.rating.average);
    //设置年份
    $node.find(".year").text(movie.year);
    //设置收藏数
    $node.find(".collect").text(movie.collect_count);
    //设置类型
    $node.find(".type").text(movie.genres.join("/"));
    //设置导演
    $node.find(".director").text(function() {
      var directorsArr = [];
      movie.directors.forEach(function(item) {
        directorsArr.push(item.name);
      });
      return directorsArr.join("、");
    });
    //设置主演
    $node.find(".actor").text(function() {
      var actorArr = [];
      movie.casts.forEach(function(item) {
        actorArr.push(item.name);
      });
      return actorArr.join("、");
    });
    return $node;
  }
};

//加载页面入口
var App = {
  init: function() {
    this.bind();

    Top250.init();
    UsPage.init();
    SearchPage.init();
  },
  //设置页面按钮切换功能
  bind: function() {
    $("footer>div").click(function() {
      $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $currentPage = $("main>section")
        .hide()
        .eq($(this).index())
        .fadeIn();
    });
    //阻止事件，返回时停留在原有页面
    window.ontouchmove = function(e) {
      e.preventDefault();
    };
    $("section").each(function() {
      this.ontouchmove = function(e) {
        e.stopPropagation();
      };
    });
  }
};
//加载页面
App.init();
