$(function () {

  const apiBaseUrl = "https://ftzq5hb4r6.execute-api.eu-central-1.amazonaws.com/dev";

  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3').then(FingerprintJS => FingerprintJS.load())
  let userId = null;
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      userId = result.visitorId
    });

  function refreshMessageList() {
    $.ajax({
      url: apiBaseUrl + "/messages",
      method: "GET"
    })
    .done(function (result) {
      const container = $("#messageListContainer");
      container.empty();
      result.items.forEach(message => {
        const messageDiv = $("<div></div>");
        $("<hr/>").appendTo(messageDiv);
        $("<div></div>").html("Author fingerprint: " + message.authorId).appendTo(messageDiv);
        $("<div></div>").html(message.content).appendTo(messageDiv);
        $("<div></div>").html("Sent: " + message.createdAt).appendTo(messageDiv);
        container.prepend(messageDiv);
      });
    }).fail(function (error) {
      alert("Error: " + JSON.stringify(error));
    });
  }

  function sendNewMessage() {
    let message = {
      authorId: userId,
      content: $("#newMessageContent").val()
    }
    $.ajax({
      url: apiBaseUrl + "/messages",
      method: "POST",
      data: JSON.stringify(message)
    })
    .done(function (result) {
      refreshMessageList();
    }).fail(function (error) {
      alert("Error: " + JSON.stringify(error));
    });
  }

  $("#sendMessageButton").click(function () {
    sendNewMessage();
  });

  refreshMessageList();
});
