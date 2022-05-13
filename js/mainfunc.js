
//实现账号登录
function LogInFunction() {
    //登录
    var loginBtn = document.getElementById("login-btn");
    loginBtn.addEventListener("click", function () {
        var logForm = document.getElementById("login-form");
        var formData = new FormData(logForm);
        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // console.log(this.responseText);
                var logInMsg = JSON.parse(this.responseText)
                if (logInMsg.msg == "你已经登录了" || logInMsg.msg == "成功登录") {
                    document.getElementById("log-in-user").setAttribute("user_id", logInMsg.userId);
                    getLikeArr(logInMsg.userId, 0, 0);
                    getStarArr(logInMsg.userId, 0, 0);
                    LoadPage();
                    //跳转页面
                    document.getElementById("login-page").style = "display: none;";
                    document.getElementById("page-list").style = "";
                }
                else if (logInMsg.msg == "账号或密码错误") {
                    alert("账号或密码错误");
                }
            }
        });
        xhr.open("POST", "http://175.178.193.182:8080/login");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("username=" + formData.get("username") + "&password=" + formData.get("password"));
    })
}

//退出登录
function LogOutFunction() {
    document.getElementById("to-log-page").addEventListener("click", function () {
        var userImfo = document.getElementById("log-in-user");
        var userId = userImfo.getAttribute("user_id");
        var data = "userId=" + userId;
        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var logInMsg = JSON.parse(this.responseText)
                if (logInMsg.msg == "登出成功") {
                    window.location.reload();
                }
                else if (logInMsg.msg == "你还未登录") {
                    alert("登录信息错误");
                }
            }
        });
        xhr.open("POST", "http://175.178.193.182:8080/logout/");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    })
}

function LoadPage() {
    var pagenavList = document.getElementById("page-nav");
    var pagenavArr = pagenavList.getElementsByTagName("li");
    GetHomePage();
    GetUserPage();
    pagenavArr[1].addEventListener("click", function () {
        GetNewsPage();
    })

}










//获取首页
function GetHomePage() {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.open("GET", "http://175.178.193.182:8080/article/getHomePage");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            var jsonObj = JSON.parse(this.responseText);
            ListenSearch();
            ListenAddPost();
            LoadHomeTab(jsonObj.pages);
        }
    });
}
//加载首页文章
function LoadHomeTab(pageObj) {
    //先提前加载“推荐”页
    CreateBox("recommend-tab", pageObj.推荐);

    var navList = document.getElementById("home-nav");
    var navArr = navList.getElementsByTagName("li");
    navArr[0].addEventListener("click", function () {
        CreateBox("recommend-tab", pageObj.推荐);
    });
    navArr[1].addEventListener("click", function () {
        CreateBox("travel-tab", pageObj.旅行);
    });
    navArr[2].addEventListener("click", function () {
        CreateBox("food-tab", pageObj.美食);
    });
    navArr[3].addEventListener("click", function () {
        CreateBox("fashion-tab", pageObj.时尚);
    });
    navArr[4].addEventListener("click", function () {
        CreateBox("makeup-tab", pageObj.彩妆);
    });
    navArr[5].addEventListener("click", function () {
        CreateBox("efficient-tab", pageObj.高效);
    });
    navArr[6].addEventListener("click", function () {
        CreateBox("skincare-tab", pageObj.护肤);
    });
}
function CreateBox(tabId, articleArr) {
    var leftArr = [];
    var rightArr = [];
    for (let i = 0; i < articleArr.length; i++) {
        if (i % 2 == 0) {
            leftArr.push('<div class="box"><div class="box-content"><div class="post-pic" articleId="'
                + articleArr[i].articleId +
                '"><img src="'
                + articleArr[i].images[0] +
                '" alt=""></div><div class="post-content"><div class="post-title"><h2>'
                + articleArr[i].title +
                '</h2></div><div class="post-user"><div class="to-user-page-o clearfix" author_id= "'
                + articleArr[i].authorId +
                '"><div class="portrait"><img src="'
                + articleArr[i].avatar +
                '" alt=""></div><div class="username">'
                + articleArr[i].authorName +
                '</div></div><div class="favorite"><span class="'
                + judgeLike(articleArr[i].articleId) +
                '">'
                + articleArr[i].likes +
                '</span></div></div></div></div></div>');
        }
        else {
            rightArr.push('<div class="box"><div class="box-content"><div class="post-pic" articleId="'
                + articleArr[i].articleId +
                '"><img src="'
                + articleArr[i].images[0] +
                '" alt=""></div><div class="post-content"><div class="post-title"><h2>'
                + articleArr[i].title +
                '</h2></div><div class="post-user"><div class="to-user-page-o clearfix" author_id= "'
                + articleArr[i].authorId +
                '"><div class="portrait"><img src="'
                + articleArr[i].avatar +
                '" alt=""></div><div class="username">'
                + articleArr[i].authorName +
                '</div></div><div class="favorite"><span class="'
                + judgeLike(articleArr[i].articleId) +
                '">'
                + articleArr[i].likes +
                '</span></div></div></div></div></div>');
        }
    }
    var tabContainer = document.getElementById(tabId);
    tabContainer.firstElementChild.innerHTML = leftArr.join('');
    tabContainer.lastElementChild.innerHTML = rightArr.join('');
    AddUserBox();
    ListenArticle();
    ListenUser();
}










//获取个人中心
function GetUserPage() {
    var userImfo = document.getElementById("log-in-user");
    var userId = userImfo.getAttribute("user_id");

    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.open("GET", "http://175.178.193.182:8080/user/fullInfo?userId=" + userId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            var jsonObj = JSON.parse(this.responseText);
            if (jsonObj.msg == "查询成功") {
                var userImfo = document.getElementById("log-in-user");
                var userId = userImfo.getAttribute("user_id");
                userImfo.getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                userImfo.getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                userImfo.getElementsByClassName("follow")[0].innerHTML = jsonObj.user.follows.length;
                userImfo.getElementsByClassName("follow")[0].setAttribute("userFollowArr_id", jsonObj.user.follows.toString());
                userImfo.getElementsByClassName("fans")[0].innerHTML = jsonObj.user.fans.length;
                userImfo.getElementsByClassName("fans")[0].setAttribute("userFansArr_id", jsonObj.user.fans.toString());
                getBeFavored(userId, 1);
                getBeCollected(userId, 1);
                var text1 = userImfo.getElementsByClassName("favorite-collection")[0].getAttribute("collect-user");
                var text2 = userImfo.getElementsByClassName("favorite-collection")[0].getAttribute("favor-user");
                if (text1 != null && text2 != null) {
                    var collectArr = text1.split(",");
                    var favorArr = text2.split(",");
                    userImfo.getElementsByClassName("favorite-collection")[0].innerHTML = collectArr.length + favorArr.length;
                }

                // userImfo.getElementsByClassName("favorite-collection")[0].innerHTML = jsonObj.user.likedArticles.length + jsonObj.user.staredArticles.length;
                getNoteArr(userId, 1);
                var postNav = document.getElementById("user-post-nav");
                var navArr = postNav.getElementsByTagName("li");
                navArr[1].setAttribute("haveload", 0);
                navArr[1].addEventListener("click", function () {
                    if (this.getAttribute("haveload") == 0) {
                        getStarArr(userId, 1, 1);
                        this.setAttribute("haveload", 1);
                    }
                });
                navArr[2].setAttribute("haveload", 0);
                navArr[2].addEventListener("click", function () {
                    if (this.getAttribute("haveload") == 0) {
                        getLikeArr(userId, 1, 1);
                        this.setAttribute("haveload", 1);
                    }
                })
                ListenImfoList();
            }
        }
    });
}
//获取用户喜欢的文章并选择是否加载
function getLikeArr(userId, loadYN, userYN) {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var rspText = JSON.parse(this.responseText);
            if (loadYN == 0) {
                var likeArticleArr = [];
                for (let i = 0; i < rspText.likedArticles.length; i++) {
                    likeArticleArr[i] = rspText.likedArticles[i].articleId;
                }
                document.getElementById("fovourite-tab").setAttribute("userLikeArr_id", likeArticleArr.toString());
            }
            else if (loadYN == 1) {
                if (userYN == 1) {
                    CreateBox("fovourite-tab", rspText.likedArticles);
                }
                else if (userYN == 0) {
                    CreateBox("fovourite-tab-o", rspText.likedArticles);
                }
            }

        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/article/getLike?userId=" + userId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}
//获取用户收藏的文章并选择是否加载
function getStarArr(userId, loadYN, userYN) {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var rspText = JSON.parse(this.responseText);
            if (loadYN == 0) {
                var starArticleArr = [];
                for (let i = 0; i < rspText.staredArticles.length; i++) {
                    starArticleArr[i] = rspText.staredArticles[i].articleId;
                }
                document.getElementById("collection-tab").setAttribute("userCollectionArr_id", starArticleArr.toString());
            }
            else if (loadYN == 1) {
                if (userYN == 1) {
                    CreateBox("collection-tab", rspText.staredArticles);
                }
                else if (userYN == 0) {
                    CreateBox("collection-tab-o", rspText.staredArticles);
                }
            }
        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/article/getStar?userId=" + userId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}
//获取作者的文章并加载
function getNoteArr(authorId, userYN) {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var rspText = JSON.parse(this.responseText);
            if (userYN == 1) {
                CreateNoteBox("note-tab", rspText.articles);
            } else if (userYN == 0) {
                CreateNoteBox("note-tab-o", rspText.articles);
            }

        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/article/byAuthor?authorId=" + authorId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}


function getBeFavored(userId, userYN) {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var rspText = JSON.parse(this.responseText);
            if (userYN == 1) {
                var favorArr = [];
                for (let i = 0; i < rspText.like.length; i++) {
                    favorArr.push(rspText.like.userId + "(" + rspText.like.articleId + ")");
                }
                document.getElementsByClassName("imfo-list")[0].getElementsByClassName("favorite-collection")[0].setAttribute("favor-user", favorArr.join(','));
            } else if (userYN == 0) {
                var favorArr = [];
                for (let i = 0; i < rspText.like.length; i++) {
                    favorArr.push(rspText.like.userId + "(" + rspText.like.articleId + ")");
                }
                document.getElementsByClassName("imfo-list-o")[0].getElementsByClassName("favorite-collection")[0].setAttribute("favor-user", favorArr.join(','));
            }
        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/notice/article/like?userId=" + userId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function getBeCollected(userId, userYN) {
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var rspText = JSON.parse(this.responseText);
            if (userYN == 1) {
                var collectArr = [];
                for (let i = 0; i < rspText.star.length; i++) {
                    collectArr.push(rspText.star.userId + "(" + rspText.star.articleId + ")");
                }
                document.getElementsByClassName("imfo-list")[0].getElementsByClassName("favorite-collection")[0].setAttribute("collect-user", collectArr.join(','));
            } else if (userYN == 0) {
                var collectArr = [];
                for (let i = 0; i < rspText.star.length; i++) {
                    collectArr.push(rspText.star.userId + "(" + rspText.star.articleId + ")");
                }
                document.getElementsByClassName("imfo-list-o")[0].getElementsByClassName("favorite-collection")[0].setAttribute("collect-user", collectArr.join(','));
            }
        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/notice/article/star?userId=" + userId);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}








function GetNewsPage() {
    var userId = document.getElementById("log-in-user").getAttribute("user_id");
    var data = "userId=" + userId;
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            var newsArr = JSON.parse(this.responseText);
            var newsList = [];
            for (let i = 0; i < newsArr.length; i++) {
                newsList.push('<div class="news-item"><div class="news-user" '
                    + newsArr[i].userId +
                    '><div class="portrait"><img src="'
                    + newsArr[i].avatar +
                    '" alt=""></div><div class="username">'
                    + newsArr[i].nickname +
                    '<div class="signature"></div></div></div><span class="chevron-thin-right"></span></div>');
            }
            document.getElementById("news-list").innerHTML = newsList.join('');
        }
    });
    xhr.open("GET", "http://175.178.193.182:8080/chat/getList");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}





