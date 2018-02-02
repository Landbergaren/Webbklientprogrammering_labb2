//onload
window.onload = function () {

    //functions
    function callBack(parsedGet) {
        renderElements(parsedGet[0]);
        //recursion(parsedGet.answers);
        console.log("this is parsedGet.answers: " + parsedGet[0].answers);
        console.log("this is parsedGet" + parsedGet);
    };

    function httpGet(theUrl, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', theUrl, true);

        http.onreadystatechange = function () {

            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
                console.log("vi kom in i IF tjohooooooo");
                console.log(http.status);
            }
        };
        http.send(null);
    };

    function recursion (n) {
        if (n <= 1){
            return 1;
        };
        return n * recursion(n-1);
    }

    function renderElements (objectToPrint) {
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

                console.log("this is commenter: " + objectToPrint);
           
            myDiv.insertAdjacentHTML('beforeend', '<br />');
        
    }

    //Exec below
    httpGet("http://localhost:8080/shallow", callBack);
};