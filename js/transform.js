//实现tab切换的函数
function changeTab(navlistId, tagName, tablistId, tab) {
    //获取navlist
    var navList = document.getElementById(navlistId);
    //获取navlist中tagName
    var navArr = navList.getElementsByTagName(tagName);

    //获取tablist
    var tabList = document.getElementById(tablistId);
    //获取tablist中的tab
    var tabArr = tabList.getElementsByClassName(tab);

    for (let i = 0; i < navArr.length; i++) {
        navArr[i].addEventListener("click", function () {
            //先将所有nav删去active类名
            for (let i = 0; i < navArr.length; i++) {
                navArr[i].classList.remove("active");
            }
            //再根据事件响应添加active类名
            this.classList.add("active");
            //将所有tab删除appear类名
            for (let i = 0; i < tabArr.length; i++) {
                tabArr[i].classList.remove("appear");
            }
            //根据nav布局tab
            for (let i = 0; i < navArr.length; i++) {
                if (navArr[i].classList.contains("active")) {
                    tabArr[i].classList.add("appear");
                }
            }
        });
    }
}