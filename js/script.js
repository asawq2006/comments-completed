(function(window, document, undefined) {
    // XHR request finished code
    var REQUEST_DONE = 4;

    // HTTP OK status code
    var STATUS_OK = 200;

    // interval to refresh comments at
    var COMMENTS_REFRESH_INTERVAL = 2000;

    var commentForm = document.getElementsByTagName('form')[0];
    var commentList = document.getElementById('comment-list');

    var commentTemplate = document.getElementById('comment-template');
    var renderComment = Handlebars.compile(commentTemplate.innerHTML);

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var nameInput = commentForm.querySelector('input[type="text"]');
        var messageTextarea = commentForm.querySelector('textarea');

        var name = nameInput.value;
        var message = messageTextarea.value;

        // ensure both name and comment exist
        if (!name || !message) {
            return;
        }

        // add comment via AJAX
        var request = new XMLHttpRequest();
        request.addEventListener('load', function(event) {
            if (request.status === STATUS_OK) {
                addCommentToList(name, message);
                nameInput.value = '';
                messageTextarea.value = '';
            }
        });

        request.open('POST', 'http://localhost:3200/comments', true);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify({
          name: name,
          message: message
        }));
    });

    var lastResponse = null;

    (function refreshComments() {
        // get comments via AJAX
        var request = new XMLHttpRequest();
        request.addEventListener('load', function(event) {
            if (request.status === STATUS_OK) {
                var comments = JSON.parse(request.responseText);
                lastResponse = request.responseText;

                commentList.innerHTML = '';
                comments.forEach(function(comment) {
                    addCommentToList(comment.name, comment.message);
                });
            }
        });

        request.open('GET', commentForm.getAttribute('action'), true);
        request.send();

        setTimeout(refreshComments, COMMENTS_REFRESH_INTERVAL);
    })();

    /* Adds a comment to the list of comments.
     *
     * Arguments:
     * name -- who posted the comment
     * message -- the message of the comment
     */
    function addCommentToList(name, message) {
        var commentHTML = renderComment({ name: name, message: message });
        commentList.innerHTML += commentHTML;
    }
})(this, this.document);
