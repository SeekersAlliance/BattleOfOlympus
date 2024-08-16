$(document).ready(function(){
  /* upper right corner : wallet address */
  var wallet_add = "wallet address";
  var new_wallet_add = wallet_add.substring(0,5) + "..." + wallet_add.substring(wallet_add.length - 4)
  if (location.pathname.indexOf("index") == -1){
    $("#wallet_address").html(new_wallet_add);
  }
  
});
function place_alert() {
  $("#place_bet_box").addClass("up");
  $("#place_bet_box").removeClass("noup");
}
function place_cancel() {
  $("#place_bet_box").addClass("noup");
  $("#place_bet_box").removeClass("up");
}

function goAnime() {
  const web_anime = "./anime.html";
  window.location.href = web_anime;
}
function goReceived() {
  const web_received = "./cards_received.html";
  $("#drawcards_mp4").remove();
  window.location.href = web_received;
}
function goInventory() {
  const web_inventory = "./inventory.html";
  window.location.href = web_inventory;
}

function warning_pop_alert() {
  $("#warning_pop_box").addClass("up");
  $("#warning_pop_box").removeClass("noup");
}
function warning_pop_cancel() {
  $("#warning_pop_box").addClass("noup");
  $("#warning_pop_box").removeClass("up");
}


