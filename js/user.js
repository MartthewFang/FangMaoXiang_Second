

//为每个用户盒子添加点击事件监视
function ListenUser() {
    var userArr = document.getElementsByClassName("to-user-page-o");
    for (let i = 0; i < userArr.length; i++) {
        userArr[i].addEventListener("click", function () {
            var userId = this.getAttribute("author_id");
            document.getElementById("user-page-o").setAttribute("user_id", userId);
            var postNav = document.getElementById("user-post-nav-o");
            var navArr = postNav.getElementsByTagName("li");
            for (let i = 1; i < navArr.length; i++) {
                navArr[i].setAttribute("haveload", 0);
            }
            var userPageO = document.getElementById("user-page-o");
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
                        var userId = document.getElementById("user-page-o").getAttribute("user_id");
                        userPageO.getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                        userPageO.getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                        userPageO.getElementsByClassName("follow")[0].innerHTML = jsonObj.user.follows.length;
                        userPageO.getElementsByClassName("follow")[0].setAttribute("userFollowArr_id", jsonObj.user.follows.toString());
                        userPageO.getElementsByClassName("fans")[0].innerHTML = jsonObj.user.fans.length;
                        userPageO.getElementsByClassName("fans")[0].setAttribute("userFansArr_id", jsonObj.user.fans.toString());
                        getBeFavored(userId, 0);
                        getBeCollected(userId, 0);
                        // userPageO.getElementsByClassName("favorite-collection")[0].innerHTML = jsonObj.user.likedArticles.length + jsonObj.user.staredArticles.length;
                        getNoteArr(userId, 0);
                        var postNav = document.getElementById("user-post-nav-o");
                        var navArr = postNav.getElementsByTagName("li");
                        navArr[1].addEventListener("click", function () {
                            if (this.getAttribute("haveload") == 0) {
                                var userId = document.getElementById("user-page-o").getAttribute("user_id");
                                getStarArr(userId, 1, 0);
                                this.setAttribute("haveload", 1);
                            }
                        });
                        navArr[2].addEventListener("click", function () {
                            if (this.getAttribute("haveload") == 0) {
                                var userId = document.getElementById("user-page-o").getAttribute("user_id");
                                getLikeArr(userId, 1, 0);
                                this.setAttribute("haveload", 1);
                            }
                        })
                        ListenImfoListO();
                    }
                }
            });
            userPageO.style = "z-index:999;";
            document.getElementById("article-page").style = "display: none;";
            document.getElementById("page-list").style = "display: none;";
            document.getElementById("follows-list").style = "display: none;";
            document.getElementById("fans-list").style = "display: none;";
            document.getElementById("back-previous").addEventListener("click", function () {
                userPageO.style = "display: none;";
                document.getElementById("page-list").style = "";

                var navList = document.getElementById("user-post-nav-o");
                var navArr = navList.getElementsByTagName("li");
                for (let i = 1; i < navArr.length; i++) {
                    navArr[i].classList.remove("active");
                }
                navArr[0].classList.add("active");

                var tabList = document.getElementById("user-tab-list-o");
                var tabArr = tabList.getElementsByClassName("tab-container");
                for (let i = 1; i < tabArr.length; i++) {
                    tabArr[i].classList.remove("appear");
                }
                tabArr[0].classList.add("appear");
            })
        })
    }
}

function CreateNoteBox(tabId, articleArr) {
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
                '"><div class="portrait"></div><div class="username"></div></div><div class="favorite"><span class="'
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
                '"><div class="portrait"></div><div class="username"></div></div><div class="favorite"><span class="'
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
function AddUserBox() {
    var userBoxArr = document.getElementsByClassName("to-user-page-o");
    for (let i = 0; i < userBoxArr.length; i++) {
        var userId = userBoxArr[i].getAttribute("author_id");
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
                    userBoxArr[i].getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                    userBoxArr[i].getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                }
            }
        });
    }
}


function ListenImfoList() {
    var imfoList = document.getElementsByClassName("imfo-list")[0].children;
    imfoList[0].addEventListener("click", function () {
        CreateFollowsPage(1);
    });
    imfoList[1].addEventListener("click", function () {
        CreateFansPage(1);
    });
    // imfoList[2].addEventListener("click", CreateFavorCollectPage(1));

}

function ListenImfoListO() {
    var imfoListO = document.getElementsByClassName("imfo-list-o")[0].children;
    imfoListO[0].addEventListener("click", function () {
        CreateFollowsPage(0);
    });
    imfoListO[1].addEventListener("click", function () {
        CreateFansPage(0);
    });
    // imfoListO[2].addEventListener("click", CreateFavorCollectPage(0));

}

function CreateFollowsPage(userYN) {
    if (userYN == 1) {
        var text = document.getElementById("log-in-user").getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
    } else if (userYN == 0) {
        var text = document.getElementById("user-page-o").getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
    }
    var userFollowArr = text.split(",");
    for (let i = 0; i < userFollowArr.length; i++) {
        var userId = userFollowArr[i];
        var data = "";
        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        xhr.open("GET", "http://175.178.193.182:8080/user/fullInfo?userId=" + userId);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // console.log(this.responseText);
                var index = document.getElementById("follows-page").getElementsByClassName("to-user-page-o").length;
                var jsonObj = JSON.parse(this.responseText);
                document.getElementById("follows-list").innerHTML += ' <div class="to-user-page-o" author_id= "'
                    + jsonObj.user.userId +
                    '"><div class="post-user"><div class="portrait"><img src="'
                    + jsonObj.user.avatar +
                    '" alt=""></div><div class="username">'
                    + jsonObj.user.nickname +
                    '</div></div><div class="subscribe"><span class=""></span></div></div> '
                judgeFollow("follows-page", jsonObj.user.userId, index);
                ListenUser();
            }

        });

    }
    document.getElementById("page-list").style = "display: none;";
    document.getElementById("follows-page").style = "";
    document.getElementById("back-to-userpage1").addEventListener("click", function () {
        document.getElementById("follows-page").style = "display: none;";
        document.getElementById("page-list").style = "";
    })
}

function CreateFansPage(userYN) {
    if (userYN == 1) {
        var text = document.getElementById("log-in-user").getElementsByClassName("fans")[0].getAttribute("userFansArr_id");
    } else if (userYN == 0) {
        var text = document.getElementById("user-page-o").getElementsByClassName("fans")[0].getAttribute("userFansArr_id");
    }
    var userFansArr = text.split(",");
    for (let i = 0; i < userFansArr.length; i++) {
        var userId = userFansArr[i];
        var data = "";
        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        xhr.open("GET", "http://175.178.193.182:8080/user/fullInfo?userId=" + userId);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var index = document.getElementById("fans-page").getElementsByClassName("to-user-page-o").length;
                // console.log(this.responseText);
                var jsonObj = JSON.parse(this.responseText);
                document.getElementById("fans-list").innerHTML += '<div class="to-user-page-o" author_id= "'
                    + jsonObj.user.userId +
                    '"><div class="post-user"><div class="portrait"><img src="'
                    + jsonObj.user.avatar +
                    '" alt=""></div><div class="username">'
                    + jsonObj.user.nickname +
                    '</div></div><div class="subscribe"><span class=""></span></div></div>'
                judgeFollow("fans-page", jsonObj.user.userId, index);
                ListenUser();
            }
        });

    }
    
    document.getElementById("page-list").style = "display: none;";
    document.getElementById("fans-page").style = "";
    document.getElementById("back-to-userpage2").addEventListener("click", function () {
        document.getElementById("fans-page").style = "display: none;";
        document.getElementById("page-list").style = "";
    })
}




