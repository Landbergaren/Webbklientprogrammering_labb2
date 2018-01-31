//onload
window.onload = function () {

    //functions
    function callBack(httpReq) {
        console.log(httpReq);        
        let content = JSON.parse(httpReq);
        console.log("this is after: ", content);
        let myDiv = document.getElementById("comment-box")
        for (var i = 0; i < content.length; i++) {
            var commentBox = document.createElement("div");
            var nameBox = document.createElement("div");
            myDiv.appendChild(commentBox);               
                var likes = document.createTextNode(" Likes: " + content[i]["likes"]);
                var commenter = document.createTextNode(content[i]["commenter"]);
                var message = document.createTextNode(content[i]["message"]);
                nameBox.appendChild(commenter);
                nameBox.appendChild(likes);
                commentBox.appendChild(message);
                myDiv.appendChild(nameBox);
                myDiv.appendChild(commentBox);

                console.log(commenter);
           
            myDiv.insertAdjacentHTML('beforeend', '<br />');
        };


    };

    function httpGet(theUrl, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', theUrl, true);

        http.onreadystatechange = function () {

            if (http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
                console.log("vi kom in i IF tjohooooooo");
                console.log(http.status);
            }
        };

        http.send(null);
    };

    //Exec below
    httpGet("http://localhost:8080/shallow", callBack);
};