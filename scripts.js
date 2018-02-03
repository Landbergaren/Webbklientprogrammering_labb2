//onload
window.onload = function () {
    var counter = 0;
    //functions
    function callBack(parsedGet) {

        recursion(parsedGet);

        /*
        for (let i = 0; i < parsedGet.length; i++) {
            renderElements(parsedGet[i]);

            

        }
        console.log(parsedGet);
        console.log("this is parsedGet.answers: " + parsedGet[0].answers);*/
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
        if (n === undefined) {
            console.log("and now we are undefined")
            return;
        }
        if (Array.isArray(n)) {
            for (var comment of n) {
                recursion(comment);
            }
        }
        else {
            renderElements(n);

            recursion(n.answers);
        }
    }

    /*  function recursion(n) {
    
            for(let i = 0; i < n.length; n++){
            if (n[i].answers == undefined){
                console.log("and now we are undefined")
                return;
            }
                console.log("n's length is: " + n.length)
                console.log(n[i].answers)
                renderElements(n[i]);
                alert("n just printed");           
                recursion(n[i].answers);
            }
      } */

    function renderElements(objectToPrint) {
        let myDiv = document.getElementById("comment-box")

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