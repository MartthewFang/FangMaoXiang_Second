function ListenSearch() {
    document.getElementById("search").addEventListener("click", function () {
        var searchBtn = document.getElementById("search-btn");
        searchBtn.addEventListener("click", function () {
            var navList = document.getElementById("search-nav");
            var navArr = navList.getElementsByTagName("li");
            if (navArr[0].classList.contains("active")) {
                //搜索文章
                var searchContent = document.getElementById("search-content");
                var data = "keyWord=" + searchContent.value;
                var xhr = new XMLHttpRequest();
                // xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var jsonObj = JSON.parse(this.responseText);
                        if (jsonObj.articles.length == 0) {
                            document.getElementById("search-article").innerHTML = '<p class="no-result">没有找到相关内容，换个词试试吧~</p>';
                        } else {
                            CreateBox("search-article", jsonObj.articles);
                        }

                    }
                });
                xhr.open("GET", "http://175.178.193.182:8080/search/byArticle");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(data);
            } else if (navArr[1].classList.contains("active")) {
                //搜索用户
                var searchContent = document.getElementById("search-content");
                var data = "keyWord=" + searchContent.value;
                var xhr = new XMLHttpRequest();
                // xhr.withCredentials = true;
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var jsonObj = JSON.parse(this.responseText);
                        if (jsonObj.users.length == 0) {
                            document.getElementById("search-user").innerHTML = '<p class="no-result">没有找到相关内容，换个词试试吧~</p>';
                        } else {
                            CreateUserBox(jsonObj.users);
                        }

                    }
                });
                xhr.open("GET", "http://175.178.193.182:8080/search/byUser");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(data);
            }
        })

        var searchPage = document.getElementById("search-page");
        searchPage.style = "";
        document.getElementById("page-list").style = "display: none;"
        document.getElementById("back-to-home").addEventListener("click", function () {
            searchPage.style = "display: none;";
            document.getElementById("page-list").style = "";
        })
    })
}

function CreateUserBox(usersArr) {
    var userList = [];
    for (let i = 0; i < usersArr.length; i++) {
        userList.push('<div class="to-user-page-o" author_id= "'
            + usersArr[i].userId +
            '"><div class="post-user"><div class="portrait"><img src="'
            + usersArr[i].avatar +
            '" alt=""></div><div class="username">'
            + usersArr[i].nickname +
            '</div></div><div class="subscribe"><span class=""></span></div></div>');
    }
    document.getElementById("search-user").innerHTML = userList.join('');
    for (let i = 0; i < usersArr.length; i++) {
        var userArr = document.getElementById("search-page").getElementsByClassName("to-user-page-o");
        judgeFollowS(userArr[i].getAttribute("author_id"), i);
    }
}


function judgeFollowS(userId, index) {
    var text = document.getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
    var followArr = text.split(",");
    for (let i = 0; i < followArr.length; i++) {
        if (followArr[i] == userId) {
            document.getElementById("search-page").getElementsByClassName("to-user-page-o")[index].innerHTML = "已关注";
            return "follow-y";
        }
    }
    document.getElementById("search-page").getElementsByClassName("to-user-page-o")[index].innerHTML = "未关注";
    return "follow-n";
}








