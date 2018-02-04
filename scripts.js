//onload
window.onload = function () {
    //functions
    function callBack(parsedGet) {
        console.log("this is parsedGet")
        console.log(parsedGet);
        recursion(parsedGet, "");

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

    //min tidigare recursion
    function recursion(n, level) {
        if (n === undefined) {
            console.log("and now we are undefined")
            return;
        }
        if (Array.isArray(n)) {
            for (var comment of n) {
                let commentBox = renderSingleElement("div", level)
                recursion(comment, level);
            }
        }
        else {
            renderAllComments(n, level);
            recursion(n.answers, level + "----------");
        }
    }

    // function recursion(level, node) {
    //     if (Array.isArray(node)) {
    //         for (const child of node) {
    //             recursion(level, child);
    //         }
    //     }
    //     else {
    //         console.log(level, node.message);
    //         for (const child of node.naswers) {
    //             recursion('-' + level, child);
    //         }            
    //     }
    // }


    // function visitAll(level, node) {
    //     if (Array.isArray(node)) {
    //       for (const child of node)          // A loop
    //         visitAll(level, child);          // where we make recursive calls
    //     } else {
    //       console.log(`${level} ${node.message}`);
    //       for (const child of node.answers)  // A loop
    //         visitAll('-' + level, child);    // where we make recursive calls
    //     }
    //   }

    function renderAllComments(objectToPrint, level) {
        let myDiv = document.getElementById("comment-box")

        //Create
        let outerBox = document.createElement("div");
        let commentBox = document.createElement("div");
        let nameBox = document.createElement("div");
        let contentBox = document.createElement("p");
        nameBox.classList.add("comment-box");
        myDiv.appendChild(commentBox);
        let likes = document.createTextNode(objectToPrint["likes"]);
        let likesElement = document.createElement("div");
        let commenter = document.createTextNode(objectToPrint["commenter"]);
        let message = document.createTextNode(objectToPrint["message"]);
        let likeButton = document.createElement("button");
        let likeButtonTxt = document.createTextNode("Like");
        let hideButton = document.createElement("button");
        let hideButtonTxt = document.createTextNode("Hide");

        //Append
        likesElement.appendChild(likes)
        likeButton.appendChild(likeButtonTxt);
        outerBox.appendChild(hideButton);
        hideButton.setAttribute("onclick", `hide("${objectToPrint.id}")`)
        hideButton.appendChild(hideButtonTxt);
        nameBox.appendChild(commenter);
        nameBox.appendChild(likesElement);

        likesElement.appendChild(likeButton);
        commentBox.appendChild(nameBox);
        contentBox.appendChild(message);
        commentBox.appendChild(contentBox);
        commentBox.setAttribute("id", `${objectToPrint.id}`);
        outerBox.appendChild(commentBox);
        myDiv.appendChild(outerBox);

        myDiv.insertAdjacentHTML('beforeend', '<br />');

    }

    function renderSingleElement(elementType, message) {
        let innerDiv = document.getElementById("comment-box")
        let newElement = document.createElement(elementType)
        let newTextNode = document.createTextNode(`${message}`);
        innerDiv.appendChild(newTextNode);
        return innerDiv;
    }

    //Exec below
    httpGet("http://localhost:8080/deep", callBack);

};

function hide(id) {
    let currentAttr = document.getElementById(id).getAttribute("style");
    let commentElement = document.getElementById(id.toString())
    console.log(currentAttr);
    if (currentAttr !== "display: none;") {
        commentElement.style.display = "none";
        document.querySelector(`"#${id} button"`).setAttribute("")
    }
    else {
        commentElement.style.display = "inline-block";
    }
}

