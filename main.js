$(document).ready(function(){
  /* upper right corner : wallet address */
  var wallet_add = "wallet address";
  var new_wallet_add = wallet_add.substring(0,5) + "..." + wallet_add.substring(wallet_add.length - 4)
  if (location.pathname.indexOf("index") == -1){
    $("#wallet_address").html(new_wallet_add);
  }
  /*  main.html -------------------------------------
      if have 50 cards, please execute this code :
    $("#needcard_txt").remove();
    $("#buy_btn").addClass("off");
    $("#buy_btn").removeClass("on");

      if page of inventory have cards :
    $("#inventory_btn").addClass("on");
    $("#inventory_btn").removeClass("off");

      if player can start play :
    $("#start_btn").addClass("on");
    $("#start_btn").removeClass("off");
    $("#start_btn").attr("onclick", "pop_alert()");
*/
  
});
function pop_alert() {
  $("#pop_up_box").addClass("up");
  $("#pop_up_box").removeClass("noup");
}
function pop_cancel() {
  $("#pop_up_box").addClass("noup");
  $("#pop_up_box").removeClass("up");
}

function gotest() {
  /*const webadd = "./cards_received.html";
  $("#drawcards_mp4").remove();
  window.location.href = webadd;*/
}
