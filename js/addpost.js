function ListenAddPost() {
    document.getElementById("add-post").addEventListener("click", function () {
        var postNoteBtn = document.getElementById("post-note-btn");
        PutPic();
        postNoteBtn.addEventListener("click", function () {
            var formData = new FormData();
            formData.append("userId", document.getElementById("log-in-user").getAttribute("user_id"));
            formData.append("title", document.getElementById("add-title").value);
            formData.append("tags", document.getElementById("add-tag").getElementsByClassName("tag"));
            formData.append("images", document.getElementById("add-pic").files[0]);

            // var data = "{\"userId\":"
            //     + document.getElementById("log-in-user").getAttribute("user_id") +
            //     ",\"title\":\""
            //     + formData.get("article-title") +
            //     "\",\"content\":\""
            //     + formData.get("article-content") +
            //     "\",\"tags\":[],\"images\";["
            //     + formData.get("image-file") +
            //     "]}"

            // var data = "userId="
            // + document.getElementById("log-in-user").getAttribute("user_id") +
            // "&title=\""
            // + formData.get("article-title") +
            // "\"&content=\""
            // + formData.get("article-content") +
            // "\"&tags=&images=["
            // + formData.get("image-file") +
            // "]";

            var xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log(typeof (this.responseText));
                    if (JSON.parse(this.responseText).msg = "成功发布") {
                        getNoteArr(document.getElementById("log-in-user").getAttribute("user_id"), 1);
                        document.getElementById("post-page").style = "display: none;";
                        document.getElementById("page-list").style = "";
                    }
                    else {
                        alert("发布失败");
                    }
                }
            });

            xhr.open("POST", "http://175.178.193.182:8080/article");
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.send(formData);

        })
        var postPage = document.getElementById("post-page");
        postPage.style = "";
        document.getElementById("page-list").style = "display: none;"
        document.getElementById("back-to-homepage").addEventListener("click", function () {
            document.getElementById("post-page").style = "display: none;";
            document.getElementById("page-list").style = "";
        })
    })
}


function PutPic() {
    var addPic = document.getElementById("add-pic");
    addPic.addEventListener("change", function () {
        var fileList = this.files;
        for (let i = 0; i < fileList.length; i++) {
            var reader = new FileReader();
            reader.readAsDataURL(fileList[i]);
            reader.onload = function () {
                document.getElementById("preview").innerHTML += '<div class="pic-preview"><img src="'
                    + this.result +
                    '" alt=""></div>'
            }
        }
    })
}

function ListenAddTag() {

}
