function send(event){
    if (event instanceof KeyboardEvent && event.key != "Enter"){
        return;
    }
    var val = document.getElementById("chatArea").value;
    if (val == null || val == ""){
        return;
    }
    var me  = document.createElement("div");
    // me.innerHTML = val + "：我";
    // me.style.color = "blue";
    me.innerHTML = `
    <div class="right">
        <p>` + val + `</p>
        <div class="r"></div>
        <img src="./me.jpg" alt="">
    </div>
    `
    document.getElementsByClassName("content")[0].appendChild(me);
    //此处发ajax

    var ajax = new XMLHttpRequest();
    ajax.open("GET","http://127.0.0.1:12306/chat?text=" + val);
    ajax.send();
    ajax.onreadystatechange = function(){
        if (ajax.readyState == 4 && ajax.status == 200){
            console.log(ajax.responseText)
            var temp = document.createElement("div");
            temp.innerHTML = `
            <div class="left">
                <img src="./robot.jpg" alt="">
                <div class="l"></div>
                <p>`+ JSON.parse(ajax.responseText).text + `</p>
            </div>
`
            // temp.innerHTML = "机器人：" + JSON.parse(ajax.responseText).text;
            document.getElementsByClassName("content")[0].appendChild(temp);
            document.getElementById("chatArea").value = "";
        }
    }
}
