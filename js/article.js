function ListenArticle() {
    var articleArr = document.getElementsByClassName("post-pic");
    for (let i = 0; i < articleArr.length; i++) {
        articleArr[i].addEventListener("click", function () {
            var articleId = this.getAttribute("articleid");
            document.getElementById("article-page").setAttribute("article_id", articleId);

            var data = "";
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.open("GET", "http://175.178.193.182:8080/article/byId?articleId=" + articleId);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    CreateArticleBox(jsonObj.article);
                }
            })
            var articlePage = document.getElementById("article-page");
            articlePage.style = "";
            document.getElementById("page-list").style = "display: none;"
            document.getElementById("back-former").addEventListener("click", function () {
                articlePage.style = "display: none;";
                document.getElementById("page-list").style = "";
            })
        })
    }
}

function CreateArticleBox(article) {
    var articlePage = document.getElementById("article-page");
    if (article.articleId !== articlePage.getAttribute("article_id")) {
        articlePage.setAttribute("author_id", article.authorId);
        articlePage.setAttribute("article_id", article.articleId);

        var followyn = document.getElementById("follow-yn");
        followyn.classList.add(judgeFollowA(article.authorId));
        ListenFollow();

        var picSlider = document.getElementById("pic-slider");
        picSlider.style.width = article.images.length * 100 + "%";
        var picArr = [];
        for (let i = 0; i < article.images.length; i++) {
            picArr.push('<li><img src="'
                + article.images[i] +
                '" alt=""></li>');
        }
        picSlider.innerHTML = picArr.join('');

        var dots = document.getElementById("dots");
        var dotArr = [];
        for (let i = 0; i < article.images.length; i++) {
            if (i == 0) {
                dotArr.push('<div class="dot active"></div>');
            } else {
                dotArr.push('<div class="dot"></div>');
            }
        }
        dots.innerHTML = dotArr.join('');

        articlePage.getElementsByClassName("article-title")[0].innerHTML = article.title;
        articlePage.getElementsByClassName("article-content")[0].innerHTML = article.content;

        var tagsList = articlePage.getElementsByClassName("tags-list")[0];
        var tagsArr = [];
        for (let i = 0; i < article.tags.length; i++) {
            tagsArr.push('<span>#'
                + article.tags[i] +
                '</span>');
        }
        tagsList.innerHTML = tagsArr.join('');

        articlePage.getElementsByClassName("date")[0].innerHTML = article.postDate.slice(0, 9);

        articlePage.getElementsByClassName("number")[0].innerHTML = "共" + article.reviews + "条评论";

        var userArr = document.getElementsByClassName("to-user-page-o");
        for (let i = 0; i < userArr.length; i++) {
            if (article.authorId == userArr[i].getAttribute("author_id")) {
                articlePage.getElementsByClassName("article-header")[0].getElementsByClassName("to-user-page-o")[0].setAttribute("author_id", article.authorId)
                articlePage.getElementsByClassName("article-header")[0].getElementsByClassName("username")[0].innerHTML = userArr[i].getElementsByClassName("username")[0].innerHTML;
                articlePage.getElementsByClassName("article-header")[0].getElementsByClassName("portrait")[0].innerHTML = userArr[i].getElementsByClassName("portrait")[0].innerHTML;
                break
            }
        };
        var logInUser = document.getElementById("log-in-user");
        AddReview(article.articleId, 0);
        articlePage.getElementsByClassName("review-top")[0].getElementsByClassName("portrait")[0].innerHTML = logInUser.getElementsByClassName("portrait")[0].innerHTML;
        document.getElementById("article-like").innerHTML = '<span>' + article.likes + '</span>';
        document.getElementById("article-like").classList = judgeLike(article.articleId);
        document.getElementById("article-star").innerHTML = '<span>' + article.stars + '</span>';
        document.getElementById("article-star").classList = judgeStar(article.articleId);
        document.getElementById("article-review").innerHTML = '<span>' + article.reviews + '</span>';
        ListenLike();
        ListenStar();
    }
}



function judgeFollowA(userId) {
    var text = document.getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
    var followArr = text.split(",");
    for (let i = 0; i < followArr.length; i++) {
        if (followArr[i] == userId) {
            document.getElementById("follow-yn").innerHTML = "已关注";
            return "follow-y";
        }
    }
    document.getElementById("follow-yn").innerHTML = "关注";
    return "follow-n";
}

function judgeLike(articleId) {
    var text = document.getElementById("fovourite-tab").getAttribute("userLikeArr_id");
    var likeArticleArr = text.split(",");
    for (let i = 0; i < likeArticleArr.length; i++) {
        if (likeArticleArr[i] == articleId) {
            return "favor-y";
        }
    }
    return "favor";
}

function judgeStar(articleId) {
    var text = document.getElementById("collection-tab").getAttribute("userCollectionArr_id");
    var likeArticleArr = text.split(",");
    for (let i = 0; i < likeArticleArr.length; i++) {
        if (likeArticleArr[i] == articleId) {
            return "star-y";
        }
    }
    return "";
}


function AddReview(articleId, pages) {
    document.getElementsByClassName("review-list")[0].innerHTML = '<p class="number"></p><div class="review-top"><div class="portrait"></div><input type="text" placeholder="爱评论的人运气都不差~"></div>'
    var data = "";
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.open("GET", "http://175.178.193.182:8080/review/byArticle?articleId=" + articleId + "&pages=" + pages);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var jsonObj = JSON.parse(this.responseText);
            for (let i = 0; i < jsonObj.reviews.length; i++) {
                if (jsonObj.reviews[i].parentReviewId == null && jsonObj.reviews[i].reviewList.length == 0) {
                    document.getElementsByClassName("review-list")[0].innerHTML += '<div class="review-box" review_id="'
                        + jsonObj.reviews[i].reviewId +
                        '"><div class="review" author_id="'
                        + jsonObj.reviews[i].authorId +
                        '"><div class="portrait"></div><div class="review-word"><div class="username"></div><div class="review-content">'
                        + jsonObj.reviews[i].content +
                        '</div></div><div class="favorite"><span class="favor">'
                        + jsonObj.reviews[i].likes +
                        '</span></div></div></div>';
                }
                else if (jsonObj.reviews[i].reviewList.length != 0) {
                    var replyArr = [];
                    for (let j = 0; j < jsonObj.reviews[i].reviewList.length; j++) {
                        replyArr.push('<div class="reply" review_id="'
                            + jsonObj.reviews[i].reviewList[j].reviewId +
                            '" author_id="'
                            + jsonObj.reviews[i].reviewList[j].authorId +
                            '"><div class="portrait"></div><div class="review-word"><div class="username"></div><div class="review-content">'
                            + jsonObj.reviews[i].reviewList[j].content +
                            '</div></div><div class="favorite"><span class="favor">'
                            + jsonObj.reviews[i].reviewList[j].likes +
                            '</span></div></div>');

                        document.getElementsByClassName("review-list")[0].innerHTML += '<div class="review-box" review_id="'
                            + jsonObj.reviews[i].reviewId +
                            '"><div class="review" author_id="'
                            + jsonObj.reviews[i].authorId +
                            '"><div class="portrait"></div><div class="review-word"><div class="username"></div><div class="review-content">'
                            + jsonObj.reviews[i].content +
                            '</div></div><div class="favorite"><span class="favor">'
                            + jsonObj.reviews[i].likes +
                            '</span></div></div>'
                            + replyArr.join('') +
                            '</div>';
                    }
                }

            }
            ReviewAddPN();
            ReplyAddPN();
        }
    })
}
function ReplyAddPN() {
    var replyArr = document.getElementsByClassName("reply");
    for (let i = 0; i < replyArr.length; i++) {
        var userId = replyArr[i].getAttribute("author_id");
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
                var replyArr = document.getElementsByClassName("reply");
                for (let i = 0; i < replyArr.length; i++) {
                    if (jsonObj.user.userId == replyArr[i].getAttribute("author_id")) {
                        replyArr[i].getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                        replyArr[i].getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                    }
                }
            }
        });
    }
}
function ReviewAddPN() {
    var reviewArr = document.getElementsByClassName("review");
    for (let i = 0; i < reviewArr.length; i++) {
        var userId = reviewArr[i].getAttribute("author_id");
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

                var reviewArr = document.getElementsByClassName("review");
                for (let j = 0; j < reviewArr.length; j++) {
                    if (reviewArr[j].getAttribute("author_id") == jsonObj.user.userId) {
                        reviewArr[j].getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                        reviewArr[j].getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                    }
                }
            }
        });
    }
}

function ListenReviewer() {
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
                        userPageO.getElementsByClassName("portrait")[0].innerHTML = '<img src="' + jsonObj.user.avatar + '" alt="">';
                        userPageO.getElementsByClassName("username")[0].innerHTML = jsonObj.user.nickname;
                        userPageO.getElementsByClassName("follow")[0].innerHTML = jsonObj.user.follows.length;
                        userPageO.getElementsByClassName("fans")[0].innerHTML = jsonObj.user.fans.length;
                        userPageO.getElementsByClassName("favorite-collection")[0].innerHTML = jsonObj.user.likedArticles.length + jsonObj.user.staredArticles.length;
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
                    }
                }
            });
            userPageO.style = "";
            document.getElementById("article-page").style = "display: none;";
            document.getElementById("page-list").style = "display: none;";
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
//点击关注或取消关注
function ListenFollow() {
    document.getElementById("follow-yn").addEventListener("click", function () {
        var followyn = document.getElementById("follow-yn");
        if (followyn.classList.contains("follow-n")) {
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"followerId\":"
                + document.getElementById("article-page").getAttribute("author_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "关注成功") {
                        var text = document.getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
                        text += "," + document.getElementById("article-page").getAttribute("author_id");
                        document.getElementsByClassName("follow")[0].setAttribute("userFollowArr_id", text);
                        var followyn = document.getElementById("follow-yn");
                        followyn.innerHTML = "已关注";
                        followyn.classList.remove("follow-n");
                        followyn.classList.add("follow-y");
                        var userImfo = document.getElementById("log-in-user");
                        userImfo.getElementsByClassName("follow")[0].innerHTML++;
                    } else if (jsonObj.msg == "你已经关注过了") {
                        console.log("出大问题");
                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/user/follow");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        else if (followyn.classList.contains("follow-y")) {
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"followerId\":"
                + document.getElementById("article-page").getAttribute("author_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "取消关注成功") {
                        var text = document.getElementsByClassName("follow")[0].getAttribute("userFollowArr_id");
                        var followArr = text.split(",");
                        var newArr = [];
                        for (let i = 0; i < followArr.length; i++) {
                            if (followArr[i] !== document.getElementById("article-page").getAttribute("author_id")) {
                                newArr.push(followArr[i]);
                            }
                        }
                        document.getElementsByClassName("follow")[0].setAttribute("userFollowArr_id", newArr.toString());

                        var followyn = document.getElementById("follow-yn");
                        followyn.innerHTML = "关注";
                        followyn.classList.remove("follow-y");
                        followyn.classList.add("follow-n");

                        var userImfo = document.getElementById("log-in-user");
                        userImfo.getElementsByClassName("follow")[0].innerHTML--;
                    } else if (jsonObj.msg == "你还没有关注过呢") {
                        console.log("出大问题");

                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/user/cancelFollow");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
    })
}


//点赞或取消点赞
function ListenLike() {
    document.getElementById("article-like").addEventListener("click", function () {
        var articleLike = document.getElementById("article-like");
        if (articleLike.classList.contains("favor")) {
            //点赞
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"articleId\":"
                + document.getElementById("article-page").getAttribute("article_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "成功") {
                        var text = document.getElementById("fovourite-tab").getAttribute("userLikeArr_id");
                        text += "," + document.getElementById("article-page").getAttribute("article_id");
                        document.getElementById("fovourite-tab").setAttribute("userLikeArr_id", text);
                        var articleLike = document.getElementById("article-like");
                        articleLike.classList.remove("favor");
                        articleLike.classList.add("favor-y");
                        articleLike.getElementsByTagName("span")[0].innerHTML++;
                    } else if (jsonObj.msg == "你已经喜欢过了") {
                        console.log("出大问题");
                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/article/like");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        else if (articleLike.classList.contains("favor-y")) {
            //取消点赞
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"articleId\":"
                + document.getElementById("article-page").getAttribute("article_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "成功") {
                        var text = document.getElementById("fovourite-tab").getAttribute("userLikeArr_id");
                        var LikeArr = text.split(",");
                        var newArr = [];
                        for (let i = 0; i < LikeArr.length; i++) {
                            if (LikeArr[i] !== document.getElementById("article-page").getAttribute("article_id")) {
                                newArr.push(LikeArr[i]);
                            }
                        }
                        document.getElementById("fovourite-tab").setAttribute("userLikeArr_id", newArr.toString());

                        var articleLike = document.getElementById("article-like");
                        articleLike.classList.remove("favor-y");
                        articleLike.classList.add("favor");
                        articleLike.getElementsByTagName("span")[0].innerHTML--;

                    } else if (jsonObj.msg == "你还没有喜欢这篇文章") {
                        console.log("出大问题");

                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/article/unlike");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        document.getElementById("user-post-nav").getElementsByTagName("li")[2].setAttribute("haveload", 0);
    })
}


//收藏或取消收藏
function ListenStar() {
    document.getElementById("article-star").addEventListener("click", function () {
        var articleStar = document.getElementById("article-star");
        if (!articleStar.classList.contains("star-y")) {
            //点赞
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"articleId\":"
                + document.getElementById("article-page").getAttribute("article_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "成功") {
                        var text = document.getElementById("collection-tab").getAttribute("userCollectionArr_id");
                        text += "," + document.getElementById("article-page").getAttribute("article_id");
                        document.getElementById("collection-tab").setAttribute("userCollectionArr_id", text);
                        var articleStar = document.getElementById("article-star");
                        articleStar.classList.add("star-y");
                        articleStar.getElementsByTagName("span")[0].innerHTML++;
                    } else if (jsonObj.msg == "你已经收藏过了") {
                        console.log("出大问题");
                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/article/star");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        else {
            //取消点赞
            var data = "{\"userId\":"
                + document.getElementById("log-in-user").getAttribute("user_id") +
                ",\"articleId\":"
                + document.getElementById("article-page").getAttribute("article_id") +
                "}"
            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var jsonObj = JSON.parse(this.responseText);
                    if (jsonObj.msg == "成功") {
                        var text = document.getElementById("collection-tab").getAttribute("userCollectionArr_id");
                        var StarArr = text.split(",");
                        var newArr = [];
                        for (let i = 0; i < StarArr.length; i++) {
                            if (StarArr[i] !== document.getElementById("article-page").getAttribute("article_id")) {
                                newArr.push(StarArr[i]);
                            }
                        }
                        document.getElementById("collection-tab").setAttribute("userCollectionArr_id", newArr.toString());

                        var articleStar = document.getElementById("article-star");
                        articleStar.classList.remove("star-y");
                        articleStar.getElementsByTagName("span")[0].innerHTML--;

                    } else if (jsonObj.msg == "你还没有收藏这篇文章") {
                        console.log("出大问题");

                    }
                }
            });
            xhr.open("POST", "http://175.178.193.182:8080/article/unlike");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
    })
    document.getElementById("user-post-nav").getElementsByTagName("li")[1].setAttribute("haveload", 0);
}