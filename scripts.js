//onload
window.onload = function () {

    //functions
    function callBack(parsedGet) {

        for (let i = 0; i < parsedGet.length; i++) {
            renderElements(parsedGet[i]);

            recursion(parsedGet[i].answers);

        }
        console.log(parsedGet);
        console.log("this is parsedGet.answers: " + parsedGet[0].answers);

    };

    function httpGet(theUrl, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', theUrl, true);

        http.onreadystatechange = function () {

            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
            }
        };
        http.send(null);
    };

    function recursion(n) {

        if (n[0].answers == undefined){
            console.log("and now we are undefined")
            return;
        }
            console.log("n's length is: " + n[0].answers.length)

            renderElements(n);
            console.log("n just printed")
           // recursion(n.answers);
        //}
    }

    function renderElements(objectToPrint) {
        let myDiv = document.getElementById("comment-box")

        //recursion(commentArray[i]);

        var commentBox = document.createElement("div");
        var nameBox = document.createElement("div");
        myDiv.appendChild(commentBox);
        var likes = document.createTextNode(" Likes: " + objectToPrint["likes"]);
        var commenter = document.createTextNode(objectToPrint["commenter"]);
        var message = document.createTextNode(objectToPrint["message"]);
        nameBox.appendChild(commenter);
        nameBox.appendChild(likes);
        commentBox.appendChild(message);
        myDiv.appendChild(nameBox);
        myDiv.appendChild(commentBox);


        myDiv.insertAdjacentHTML('beforeend', '<br />');

    }

    //Exec below
    httpGet("http://localhost:8080/shallow", callBack);
};